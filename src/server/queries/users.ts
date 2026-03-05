import { db } from "@/server/db";
import type { Plan } from "@prisma/client";

export async function getAllUsers(page = 1, limit = 20, planFilter?: Plan) {
  const where = planFilter ? { plan: planFilter } : {};

  return db.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      plan: true,
      createdAt: true,
      credits: {
        select: {
          balance: true,
          totalUsed: true,
        },
      },
      _count: {
        select: { generations: true },
      },
    },
  });
}

export async function getUsersCount(planFilter?: Plan) {
  const where = planFilter ? { plan: planFilter } : {};
  return db.user.count({ where });
}

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      plan: true,
      createdAt: true,
      credits: true,
      subscription: true,
      _count: {
        select: { generations: true },
      },
    },
  });
}
