export const dynamic = "force-dynamic";

import { getAdminStats, getRecentActivity } from "@/server/queries/stats";
import { AdminSidebarLayout } from "@/components/AdminSidebarLayout";
import { AdminDashboardClient } from "./DashboardClient";
import { requireAdmin } from "@/server/auth/session";

export default async function AdminDashboardPage() {
    await requireAdmin();
    const stats = await getAdminStats();
    const { generations, subscriptions } = await getRecentActivity(10);

    return (
        <AdminSidebarLayout>
            <AdminDashboardClient
                stats={stats}
                recentGenerations={generations}
                recentSubscriptions={subscriptions}
            />
        </AdminSidebarLayout>
    );
}
