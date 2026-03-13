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

export async function getRevenueStats() {
  const subscriptions = await db.subscription.findMany({
    where: { status: "ACTIVE" },
    select: { plan: true },
  });

  const PLAN_PRICES = {
    FREE: 0,
    CREATOR: 19.9, // Exemplo: R$ 19,90
    PRO: 49.9,    // Exemplo: R$ 49,90
  };

  const mrr = subscriptions.reduce((acc, sub) => {
    return acc + (PLAN_PRICES[sub.plan as keyof typeof PLAN_PRICES] || 0);
  }, 0);

  // Simplificação: Total Revenue = MRR por enquanto (faturamento mensal base)
  return {
    mrr,
    totalRevenue: mrr * 1.5, // Simulação
    planBreakdown: subscriptions.reduce((acc, sub) => {
      acc[sub.plan] = (acc[sub.plan] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
}

export async function getRecentActivity(limit = 10) {
  const [generations, subscriptions] = await db.$transaction([
    db.generation.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, plan: true } } },
    }),
    db.subscription.findMany({
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
  ]);

  return { generations, subscriptions };
}
