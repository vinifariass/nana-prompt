"use server";

import { requireSession } from "@/server/auth/session";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import type { Plan } from "@prisma/client";

const PLAN_CREDITS: Record<Plan, number> = {
  FREE: 10,
  CREATOR: 100,
  PRO: 200,
};

export async function upgradePlan(newPlan: "CREATOR" | "PRO", billingPeriod: "mensal" | "anual" = "mensal") {
  const session = await requireSession();

  const PRICE_IDS: Record<string, Record<string, string>> = {
    CREATOR: {
      mensal: process.env.STRIPE_PRICE_CREATOR_MENSAL ?? "",
      anual: process.env.STRIPE_PRICE_CREATOR_ANUAL ?? "",
    },
    PRO: {
      mensal: process.env.STRIPE_PRICE_PRO_MENSAL ?? "",
      anual: process.env.STRIPE_PRICE_PRO_ANUAL ?? "",
    },
  };

  const priceId = PRICE_IDS[newPlan]?.[billingPeriod];
  if (!priceId) return { error: "Plano ou período inválido" };

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return { error: "Stripe não configurado" };

  const stripe = new Stripe(stripeKey);
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { userId: session.user.id, plan: newPlan },
    customer_email: session.user.email ?? undefined,
    success_url: `${baseUrl}/checkout/success?plan=${newPlan}`,
    cancel_url: `${baseUrl}/dashboard/billing`,
    allow_promotion_codes: true,
  });

  if (!checkoutSession.url) return { error: "Erro ao criar sessão de pagamento" };
  redirect(checkoutSession.url);
}

export async function cancelSubscription() {
  const session = await requireSession();

  const subscription = await db.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription) {
    return { error: "Nenhuma assinatura ativa" };
  }

  if (subscription.stripeSubscriptionId && process.env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
  }

  await db.subscription.update({
    where: { userId: session.user.id },
    data: { cancelAtPeriodEnd: true },
  });

  revalidatePath("/dashboard/billing");
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
