"use server";

import { requireSession } from "@/server/auth/session";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import type { Plan } from "@prisma/client";

const PLAN_CREDITS: Record<Plan, number> = {
  FREE: 10,
  CREATOR: 100,
  PRO: 200,
};

export async function upgradePlan(newPlan: Plan) {
  const session = await requireSession();

  if (newPlan === "FREE") {
    return { error: "Não é possível fazer downgrade para Free por aqui" };
  }

  // TODO: Integrar com Stripe Checkout Session
  // Por enquanto, atualiza diretamente no banco (placeholder)

  const now = new Date();
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

  await db.$transaction(async (tx) => {
    // Atualizar plano do usuário
    await tx.user.update({
      where: { id: session.user.id },
      data: { plan: newPlan },
    });

    // Criar ou atualizar subscription
    await tx.subscription.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        plan: newPlan,
        status: "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
      update: {
        plan: newPlan,
        status: "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
      },
    });

    // Atualizar créditos para o novo plano
    await tx.credit.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        balance: PLAN_CREDITS[newPlan],
        resetAt: periodEnd,
      },
      update: {
        balance: PLAN_CREDITS[newPlan],
        resetAt: periodEnd,
      },
    });
  });

  revalidatePath("/admin");
  revalidatePath("/admin/billing");

  return { success: true, plan: newPlan };
}

export async function cancelSubscription() {
  const session = await requireSession();

  const subscription = await db.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription) {
    return { error: "Nenhuma assinatura ativa encontrada" };
  }

  // TODO: Cancelar no Stripe via stripe.subscriptions.update({ cancel_at_period_end: true })

  await db.subscription.update({
    where: { userId: session.user.id },
    data: { cancelAtPeriodEnd: true },
  });

  revalidatePath("/admin/billing");

  return { success: true };
}

export async function getUserCredits() {
  const session = await requireSession();

  const credit = await db.credit.findUnique({
    where: { userId: session.user.id },
  });

  return credit ?? { balance: 0, totalUsed: 0, resetAt: new Date() };
}
