// Generated with: stripe-webhooks skill
// https://github.com/hookdeck/webhook-skills
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/server/db";
import type { Plan } from "@prisma/client";
import { sendUpgradeSuccessEmail } from "@/lib/email";

import Stripe from "stripe";
const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
};

const getWebhookSecret = () => process.env.STRIPE_WEBHOOK_SECRET;

const PLAN_CREDITS: Record<Plan, number> = {
  FREE: 10,
  CREATOR: 100,
  PRO: 200,
};

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  const webhookSecret = getWebhookSecret();

  if (!stripe || !webhookSecret) {
    console.warn("Stripe keys missing. Skipping webhook processing.");
    return NextResponse.json({ error: "Stripe configuration missing" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const plan = (session.metadata?.plan as Plan) ?? "CREATOR";

        if (!userId) break;

        // Retrieve actual subscription period dates from Stripe
        const stripeSub = session.subscription
          ? await stripe.subscriptions.retrieve(session.subscription as string)
          : null;

        const now = new Date();
        const firstItem = stripeSub?.items?.data?.[0];
        const periodStart = firstItem ? new Date(firstItem.current_period_start * 1000) : now;
        const periodEnd = firstItem
          ? new Date(firstItem.current_period_end * 1000)
          : new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

        await db.$transaction(async (tx) => {
          const user = await tx.user.update({
            where: { id: userId },
            data: { plan },
          });

          if (user.email) {
            await sendUpgradeSuccessEmail(user.email, plan);
          }

          await tx.subscription.upsert({
            where: { userId },
            create: {
              userId,
              plan,
              status: "ACTIVE",
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
            },
            update: {
              plan,
              status: "ACTIVE",
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
              cancelAtPeriodEnd: false,
            },
          });

          await tx.credit.upsert({
            where: { userId },
            create: {
              userId,
              balance: PLAN_CREDITS[plan],
              resetAt: periodEnd,
            },
            update: {
              balance: PLAN_CREDITS[plan],
              resetAt: periodEnd,
            },
          });
        });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object;
        const customerId = sub.customer as string;
        const newPlan = (sub.metadata?.plan as Plan) ?? null;

        const subscription = await db.subscription.findUnique({
          where: { stripeCustomerId: customerId },
          select: { userId: true },
        });

        if (!subscription) break;

        const subFirstItem = sub.items?.data?.[0];
        const subNow = new Date();
        const periodStart = subFirstItem ? new Date(subFirstItem.current_period_start * 1000) : subNow;
        const periodEnd = subFirstItem
          ? new Date(subFirstItem.current_period_end * 1000)
          : new Date(subNow.getFullYear(), subNow.getMonth() + 1, subNow.getDate());

        await db.$transaction(async (tx) => {
          await tx.subscription.update({
            where: { stripeCustomerId: customerId },
            data: {
              status: sub.status === "active" ? "ACTIVE" : "PAST_DUE",
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
              cancelAtPeriodEnd: sub.cancel_at_period_end,
              ...(newPlan ? { plan: newPlan } : {}),
            },
          });

          if (newPlan) {
            await tx.user.update({
              where: { id: subscription.userId },
              data: { plan: newPlan },
            });

            await tx.credit.update({
              where: { userId: subscription.userId },
              data: {
                balance: PLAN_CREDITS[newPlan],
                resetAt: periodEnd,
              },
            });
          }
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;

        const subscription = await db.subscription.findUnique({
          where: { stripeCustomerId: customerId },
          select: { userId: true, plan: true },
        });

        if (!subscription) break;

        // Use actual period end from the invoice lines
        const lineItem = invoice.lines?.data?.[0];
        const periodEnd = lineItem?.period?.end
          ? new Date(lineItem.period.end * 1000)
          : new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());

        await db.credit.upsert({
          where: { userId: subscription.userId },
          create: {
            userId: subscription.userId,
            balance: PLAN_CREDITS[subscription.plan],
            resetAt: periodEnd,
          },
          update: {
            balance: PLAN_CREDITS[subscription.plan],
            resetAt: periodEnd,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const customerId = sub.customer as string;

        const subscription = await db.subscription.findUnique({
          where: { stripeCustomerId: customerId },
          select: { userId: true },
        });

        if (!subscription) break;

        await db.$transaction(async (tx) => {
          await tx.user.update({
            where: { id: subscription.userId },
            data: { plan: "FREE" },
          });

          await tx.subscription.update({
            where: { stripeCustomerId: customerId },
            data: { status: "CANCELED" },
          });

          await tx.credit.update({
            where: { userId: subscription.userId },
            data: { balance: PLAN_CREDITS.FREE },
          });
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;

        await db.subscription.updateMany({
          where: { stripeCustomerId: customerId },
          data: { status: "PAST_DUE" },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
