export const dynamic = "force-dynamic";

import { requireSession } from "@/server/auth/session";
import { db } from "@/server/db";
import { AdminSidebarLayout } from "@/components/AdminSidebarLayout";
import { SettingsClient } from "./SettingsClient";

export default async function SettingsPage() {
    const session = await requireSession();

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            plan: true,
            subscription: {
                select: {
                    plan: true,
                    status: true,
                    currentPeriodEnd: true,
                },
            },
        },
    });

    return (
        <AdminSidebarLayout>
            <SettingsClient user={user} />
        </AdminSidebarLayout>
    );
}
