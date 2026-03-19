export const dynamic = "force-dynamic";

import { requireSession } from "@/server/auth/session";
import { db } from "@/server/db";
import { AdminSidebarLayout } from "@/components/AdminSidebarLayout";
import { BillingClient } from "./BillingClient";
import { getInvoices } from "@/server/actions/subscription";

export default async function BillingPage() {
    const session = await requireSession();

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
            plan: true,
            subscription: {
                select: {
                    plan: true,
                    status: true,
                    currentPeriodEnd: true,
                    cancelAtPeriodEnd: true,
                    stripeSubscriptionId: true,
                    stripeCustomerId: true,
                },
            },
            credits: {
                select: {
                    balance: true,
                },
            },
        },
    });

    const stripeCustomerId = user?.subscription?.stripeCustomerId ?? null;
    const invoices = stripeCustomerId ? await getInvoices(stripeCustomerId) : [];

    return (
        <AdminSidebarLayout>
            <BillingClient user={user} invoices={invoices} />
        </AdminSidebarLayout>
    );
}
