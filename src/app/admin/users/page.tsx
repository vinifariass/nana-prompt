import { AdminSidebarLayout } from "@/components/AdminSidebarLayout";
import { getAllUsers, getUsersCount } from "@/server/queries/users";
import { UsersClient } from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const [users, total] = await Promise.all([getAllUsers(), getUsersCount()]);

  return (
    <AdminSidebarLayout>
      <UsersClient users={users} total={total} />
    </AdminSidebarLayout>
  );
}
