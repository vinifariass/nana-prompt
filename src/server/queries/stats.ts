import { db } from "@/server/db";

export async function getAdminStats() {
  const [totalUsers, totalGenerations, activeSubscriptions, revenue] =
    await db.$transaction([
      db.user.count(),
      db.generation.count(),
      db.subscription.count({ where: { status: "ACTIVE" } }),
      db.subscription.count({
        where: { status: "ACTIVE", plan: { in: ["CREATOR", "PRO"] } },
      }),
    ]);

  return {
    totalUsers,
    totalGenerations,
    activeSubscriptions,
    paidUsers: revenue,
  };
}

export async function getGenerationsByDay(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  return db.generation.groupBy({
    by: ["createdAt"],
    where: { createdAt: { gte: since } },
    _count: { id: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function getUsersByPlan() {
  return db.user.groupBy({
    by: ["plan"],
    _count: { id: true },
    orderBy: { plan: "asc" },
  });
}
