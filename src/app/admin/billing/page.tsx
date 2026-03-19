export const dynamic = "force-dynamic";

import { requireSession } from "@/server/auth/session";
import { db } from "@/server/db";
import { AdminSidebarLayout } from "@/components/AdminSidebarLayout";
import { BillingClient } from "./BillingClient";

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
                },
            },
            credits: {
                select: {
                    balance: true,
                },
            },
        },
    });

    return (
        <AdminSidebarLayout>
            <BillingClient user={user} />
        </AdminSidebarLayout>
    );
}
