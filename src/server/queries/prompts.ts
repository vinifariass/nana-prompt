"use server";

import { db } from "@/server/db";
import { unstable_cache } from "next/cache";

export type PromptPublic = {
  id: string;
  title: string;
  image: string;
  type: string;
  category: string | null;
  price: number;
  prompt: string | null;
  locked: boolean;
};

type PromptRow = {
  id: string;
  title: string;
  image: string;
  type: string;
  category: string | null;
  price: number;
  prompt: string;
};

// Busca o catálogo em cache — não bate no banco a cada request
const fetchCatalog = unstable_cache(
  async () => {
    return db.prompt.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        image: true,
        type: true,
        category: true,
        price: true,
        prompt: true,
      },
    }) as Promise<PromptRow[]>;
  },
  ["prompts-catalog"],
  { revalidate: 60 } // cache 60s
);

/**
 * Retorna prompts do catálogo compartilhado.
 * O texto do prompt só é entregue se hasPaidPlan=true.
 * O catálogo em si fica em cache para evitar round-trips ao banco.
 */
export async function getPromptsForExplore(
  hasPaidPlan: boolean,
  filters?: { type?: string; category?: string; search?: string }
): Promise<PromptPublic[]> {
  let rows = await fetchCatalog();

  if (filters?.type) rows = rows.filter((p) => p.type === filters.type);
  if (filters?.category) rows = rows.filter((p) => p.category === filters.category);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    rows = rows.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }

  return rows.map((p) => ({
    ...p,
    prompt: hasPaidPlan ? p.prompt : null,
    locked: !hasPaidPlan,
  }));
}
