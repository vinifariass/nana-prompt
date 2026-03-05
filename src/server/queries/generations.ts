import { db } from "@/server/db";

export async function getUserGenerations(userId: string, page = 1, limit = 20) {
  return db.generation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
    select: {
      id: true,
      prompt: true,
      style: true,
      imageUrl: true,
      originalUrl: true,
      status: true,
      quality: true,
      createdAt: true,
    },
  });
}

export async function getUserGenerationsCount(userId: string) {
  return db.generation.count({ where: { userId } });
}

export async function getAllGenerations(page = 1, limit = 20) {
  return db.generation.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
    select: {
      id: true,
      prompt: true,
      style: true,
      imageUrl: true,
      originalUrl: true,
      status: true,
      quality: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          plan: true,
        },
      },
    },
  });
}

export async function getGenerationById(id: string) {
  return db.generation.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          plan: true,
        },
      },
    },
  });
}
