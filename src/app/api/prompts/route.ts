import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

// Retorna prompts ativos do catálogo compartilhado (taylor-ai-web)
// limit=4 para preview na home, sem limit para /explore
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") ?? "0");

  const prompts = await db.prompt.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    ...(limit > 0 ? { take: limit } : {}),
    select: {
      id: true,
      title: true,
      image: true,
      type: true,
      category: true,
      price: true,
    },
  });

  const res = NextResponse.json(prompts);
  res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  return res;
}
