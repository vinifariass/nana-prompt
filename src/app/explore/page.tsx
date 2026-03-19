import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { getPromptsForExplore } from "@/server/queries/prompts";
import ExploreClient from "./ExploreClient";

// Catálogo em cache; só o lock varia por usuário (resolvido no servidor)
export const revalidate = 60;

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; category?: string; q?: string }>;
}) {
  const [params, session] = await Promise.all([
    searchParams,
    getServerSession(authOptions),
  ]);

  const hasPaidPlan =
    session?.user?.plan === "CREATOR" || session?.user?.plan === "PRO";

  const prompts = await getPromptsForExplore(hasPaidPlan, {
    type: params.type,
    category: params.category,
    search: params.q,
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-[var(--brand)] selection:text-black">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-white/70 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium hide-on-mobile">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
            <div className="w-px h-4 bg-white/10" />
            <span className="font-bold text-lg tracking-tight flex items-center gap-2 text-[var(--brand)]">
              <Sparkles className="w-5 h-5" />
              FotoPro Prompts
            </span>
          </div>
          {!hasPaidPlan && (
            <Link
              href="/#pricing"
              className="text-xs font-bold md:text-sm bg-[var(--brand)] text-black px-4 py-2 rounded-full hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_20px_rgba(var(--brand-rgb),0.3)]"
            >
              Assinar Mensal
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-32 pb-16 px-6 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Explore.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand)] to-purple-400">
            Inspire-se.
          </span>{" "}
          Crie.
        </h1>
        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          {prompts.length > 0 ? `${prompts.length} prompts profissionais` : "Prompts profissionais"} criados pela nossa IA.
          {!hasPaidPlan && " Assine para revelar os parâmetros exatos."}
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-32">
        {prompts.length === 0 ? (
          <div className="text-center text-white/40 py-24">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Nenhum prompt encontrado.</p>
          </div>
        ) : (
          <ExploreClient prompts={prompts} />
        )}
      </main>
    </div>
  );
}
