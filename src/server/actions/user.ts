"use server";

import { requireSession, requireAdmin } from "@/server/auth/session";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const session = await requireSession();
  const name = formData.get("name") as string | null;

  if (!name || name.trim().length === 0) {
    return { error: "Nome é obrigatório" };
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { name: name.trim() },
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function toggleUserBan(userId: string) {
  await requireAdmin();

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true, banned: true },
  });

  if (!user) {
    return { error: "Usuário não encontrado" };
  }

  // Não permitir banir admins
  if (user.role === "ADMIN") {
    return { error: "Não é possível banir um administrador" };
  }

  await db.user.update({
    where: { id: userId },
    data: { banned: !user.banned },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

const PLAN_CREDITS: Record<string, number> = {
  FREE: 10,
  CREATOR: 100,
  PRO: 200,
};

export async function changeUserPlan(userId: string, plan: "FREE" | "CREATOR" | "PRO") {
  await requireAdmin();

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    return { error: "Usuário não encontrado" };
  }

  const newCredits = PLAN_CREDITS[plan] ?? 10;

  await db.user.update({
    where: { id: userId },
    data: { plan },
  });

  await db.credit.upsert({
    where: { userId },
    update: { balance: newCredits },
    create: {
      userId,
      balance: newCredits,
      resetAt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
    },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  const session = await requireAdmin();

  // Não permitir auto-exclusão
  if (userId === session.user.id) {
    return { error: "Não é possível excluir sua própria conta" };
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    return { error: "Usuário não encontrado" };
  }

  if (user.role === "ADMIN") {
    return { error: "Não é possível excluir um administrador" };
  }

  // Cascade delete remove accounts, sessions, credits, generations
  await db.user.delete({
    where: { id: userId },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteOwnAccount() {
  const session = await requireSession();

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role === "ADMIN") {
    return { error: "Admins não podem deletar a própria conta aqui" };
  }

  await db.user.delete({ where: { id: session.user.id } });
  redirect("/");
}

export async function getUserBalance() {
  const session = await requireSession();

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      plan: true,
      credits: {
        select: {
          balance: true
        }
      }
    }
  });

  return {
    balance: user?.credits?.balance ?? 0,
    plan: user?.plan ?? "FREE"
  };
}
