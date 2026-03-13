"use server";

import { db } from "@/server/db";
import { requireSession } from "@/server/auth/session";

const REFERRAL_BONUS = 10;
const MAX_REFERRALS = 50;

export async function applyReferralCode(referralCode: string) {
  const session = await requireSession();

  // Não pode usar o próprio código
  const currentUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { referralCode: true },
  });

  if (currentUser?.referralCode === referralCode) {
    return { error: "Você não pode usar seu próprio código de indicação" };
  }

  // Verificar se já usou um código antes
  const existingReferral = await db.referral.findUnique({
    where: { referredId: session.user.id },
  });

  if (existingReferral) {
    return { error: "Você já utilizou um código de indicação" };
  }

  // Buscar o dono do código
  const referrer = await db.user.findUnique({
    where: { referralCode },
    select: { id: true },
  });

  if (!referrer) {
    return { error: "Código de indicação inválido" };
  }

  // Verificar limite de referrals do referrer
  const referralCount = await db.referral.count({
    where: { referrerId: referrer.id },
  });

  if (referralCount >= MAX_REFERRALS) {
    return { error: "Este código atingiu o limite máximo de indicações" };
  }

  // Criar referral + dar créditos para ambos em transação
  await db.$transaction(async (tx) => {
    await tx.referral.create({
      data: {
        referrerId: referrer.id,
        referredId: session.user.id,
        creditAwarded: true,
      },
    });

    // Créditos para quem indicou
    await tx.credit.upsert({
      where: { userId: referrer.id },
      create: {
        userId: referrer.id,
        balance: REFERRAL_BONUS,
        resetAt: getNextMonthDate(),
      },
      update: {
        balance: { increment: REFERRAL_BONUS },
      },
    });

    // Créditos para quem foi indicado
    await tx.credit.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        balance: REFERRAL_BONUS,
        resetAt: getNextMonthDate(),
      },
      update: {
        balance: { increment: REFERRAL_BONUS },
      },
    });
  });

  return { success: true, creditsEarned: REFERRAL_BONUS };
}

export async function getReferralStats() {
  const session = await requireSession();

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { referralCode: true },
  });

  const totalReferrals = await db.referral.count({
    where: { referrerId: session.user.id },
  });

  const totalCreditsEarned = totalReferrals * REFERRAL_BONUS;

  return {
    referralCode: user?.referralCode ?? "",
    totalReferrals,
    totalCreditsEarned,
    maxReferrals: MAX_REFERRALS,
    referralLink: `${process.env.NEXTAUTH_URL ?? "https://fotopro.ai"}/cadastro?ref=${user?.referralCode}`,
  };
}

function getNextMonthDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}
