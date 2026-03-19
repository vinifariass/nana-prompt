import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import Stripe from "stripe";

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
};

// Mapeamento plano → Stripe Price ID
// Substitua pelos Price IDs reais do Stripe Dashboard
const PRICE_IDS: Record<string, { mensal: string; anual: string }> = {
  Creator: {
    mensal: process.env.STRIPE_PRICE_CREATOR_MENSAL ?? "",
    anual: process.env.STRIPE_PRICE_CREATOR_ANUAL ?? "",
  },
  Pro: {
    mensal: process.env.STRIPE_PRICE_PRO_MENSAL ?? "",
    anual: process.env.STRIPE_PRICE_PRO_ANUAL ?? "",
  },
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe não configurado. Adicione STRIPE_SECRET_KEY no .env" },
        { status: 500 }
      );
    }

    const { planName, billingPeriod } = await req.json();

    if (!planName || !PRICE_IDS[planName]) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    const period = billingPeriod === "anual" ? "anual" : "mensal";
    const priceId = PRICE_IDS[planName][period];

    if (!priceId) {
      return NextResponse.json(
        { error: `Price ID não configurado para ${planName} ${period}. Adicione STRIPE_PRICE_${planName.toUpperCase()}_${period.toUpperCase()} no .env` },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        plan: planName.toUpperCase(),
      },
      customer_email: session.user.email ?? undefined,
      success_url: `${baseUrl}/admin?checkout=success&plan=${planName}`,
      cancel_url: `${baseUrl}/#pricing`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message ?? "Erro ao criar sessão de checkout" },
      { status: 500 }
    );
  }
}
