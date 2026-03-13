"use server";

import { requireSession } from "@/server/auth/session";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { applyWatermark } from "@/lib/image";
import { sendLowCreditsEmail } from "@/lib/email";
import path from "path";
import fs from "fs";

const PLAN_LIMITS = {
  FREE: { maxQuality: "HD" as const },
  CREATOR: { maxQuality: "HD" as const },
  PRO: { maxQuality: "UHD" as const },
};

export async function generateImage(formData: FormData) {
  const session = await requireSession();
  const prompt = formData.get("prompt") as string;
  const style = formData.get("style") as string | null;

  if (!prompt || prompt.trim().length === 0) {
    return { error: "Prompt é obrigatório" };
  }

  // Verificar créditos
  const credit = await db.credit.findUnique({
    where: { userId: session.user.id },
  });

  if (!credit || credit.balance <= 0) {
    return { error: "Créditos insuficientes. Faça upgrade do seu plano." };
  }

  // Determinar qualidade baseada no plano
  const userPlan = session.user.plan as keyof typeof PLAN_LIMITS;
  const planConfig = PLAN_LIMITS[userPlan] ?? PLAN_LIMITS.FREE;

  // Criar generation + decrementar crédito em transação atômica
  const generation = await db.$transaction(async (tx) => {
    const updatedCredit = await tx.credit.update({
      where: { userId: session.user.id },
      data: {
        balance: { decrement: 1 },
        totalUsed: { increment: 1 },
      },
    });

    if (updatedCredit.balance <= 3 && session.user.email) {
      // Background email send
      sendLowCreditsEmail(session.user.email, updatedCredit.balance);
    }

    return tx.generation.create({
      data: {
        userId: session.user.id,
        prompt: prompt.trim(),
        style: style ?? undefined,
        status: "PENDING",
        quality: planConfig.maxQuality,
      },
    });
  });

  // TODO: Disparar geração via API de IA (fila ou background job)
  // Por enquanto, simula o resultado
  let finalImageUrl = "/generated/elden_ring_real.png";

  if (userPlan === "FREE") {
    try {
      // In a real scenario, we'd have the newly generated image path
      // Here we simulate by taking the placeholder and saving it as a watermarked version
      const publicDir = path.join(process.cwd(), "public");
      const generatedDir = path.join(publicDir, "generated");
      const sourcePath = path.join(publicDir, "generated", "elden_ring_real.png");
      const watermarkPath = path.join(generatedDir, `watermarked_${generation.id}.png`);

      if (fs.existsSync(sourcePath)) {
        await applyWatermark(sourcePath, watermarkPath);
        finalImageUrl = `/generated/watermarked_${generation.id}.png`;
      }
    } catch (err) {
      console.error("Watermark failed:", err);
      // Fallback to original if watermark fails
    }
  }

  await db.generation.update({
    where: { id: generation.id },
    data: {
      status: "COMPLETED",
      imageUrl: finalImageUrl,
    },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/explore");

  return { success: true, generationId: generation.id };
}

export async function deleteGeneration(generationId: string) {
  const session = await requireSession();

  const generation = await db.generation.findUnique({
    where: { id: generationId },
    select: { userId: true },
  });

  if (!generation) {
    return { error: "Geração não encontrada" };
  }

  // Usuários normais só podem deletar suas próprias gerações
  if (generation.userId !== session.user.id && session.user.role !== "ADMIN") {
    return { error: "Sem permissão" };
  }

  await db.generation.delete({
    where: { id: generationId },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/explore");

  return { success: true };
}
