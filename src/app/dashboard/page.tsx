import Link from "next/link";
import Image from "next/image";
import { requireSession } from "@/server/auth/session";
import { db } from "@/server/db";
import {
  Sparkles,
  ImageIcon,
  CreditCard,
  ArrowRight,
  Zap,
  Crown,
  Star,
  Clock,
  LogOut,
  AlertCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard | Nana Prompt",
};

const PLAN_CREDITS: Record<string, number> = {
  FREE: 10,
  CREATOR: 100,
  PRO: 200,
};

const PLAN_LABELS: Record<string, string> = {
  FREE: "Free",
  CREATOR: "Creator",
  PRO: "Pro",
};

const PLAN_ICONS: Record<string, React.ReactNode> = {
  FREE: <Zap className="w-4 h-4" />,
  CREATOR: <Star className="w-4 h-4" />,
  PRO: <Crown className="w-4 h-4" />,
};

const PLAN_COLORS: Record<string, string> = {
  FREE: "text-white/60 bg-white/5 border-white/10",
  CREATOR: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  PRO: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

function formatDate(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export default async function DashboardPage() {
  const session = await requireSession();

  // Admins têm painel próprio em /admin
  if (session.user.role === "ADMIN") {
    const { redirect } = await import("next/navigation");
    redirect("/admin");
  }
  const userId = session.user.id;

  const [user, recentGenerations] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        image: true,
        plan: true,
        credits: { select: { balance: true } },
        subscription: { select: { currentPeriodEnd: true } },
      },
    }),
    db.generation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        imageUrl: true,
        prompt: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  const plan = user?.plan ?? "FREE";
  const balance = user?.credits?.balance ?? 0;
  const maxCredits = PLAN_CREDITS[plan] ?? 10;
  const creditPercent = Math.min(100, Math.round((balance / maxCredits) * 100));
  const displayName = user?.name ?? session.user.email ?? "Usuário";

  const periodEnd = user?.subscription?.currentPeriodEnd ?? null;
  const renewalDays = periodEnd
    ? Math.ceil((new Date(periodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const showCreditAlert = creditPercent <= 20;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Top bar */}
      <header className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">Nana Prompt</span>
          <div className="flex items-center gap-3">
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 bg-white text-black text-sm font-semibold rounded-xl h-9 px-4 hover:bg-white/90 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Gerar
            </Link>
            <Link
              href="/api/auth/signout"
              className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </Link>
            {user?.image ? (
              <Image
                src={user.image}
                alt={displayName}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover border border-white/10"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold text-white/70">
                {displayName[0]?.toUpperCase() ?? "U"}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold">
            Olá, {displayName.split(" ")[0]}
          </h1>
          <p className="text-white/40 mt-1 text-sm">Bem-vindo de volta ao seu painel.</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Plan card */}
          <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/40 font-medium">Seu Plano</p>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${PLAN_COLORS[plan]}`}
              >
                {PLAN_ICONS[plan]}
                {PLAN_LABELS[plan]}
              </span>
            </div>
            {plan !== "PRO" ? (
              <Link
                href="/#pricing"
                className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
              >
                Fazer upgrade <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <p className="text-sm text-amber-400 font-medium">Plano mais avancado ativo</p>
            )}
          </div>

          {/* Credits card */}
          <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/40 font-medium">Créditos Restantes</p>
              <CreditCard className="w-4 h-4 text-white/20" />
            </div>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold">{balance}</span>
              <span className="text-white/30 text-sm mb-1">/ {maxCredits}</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  creditPercent > 40
                    ? "bg-green-500"
                    : creditPercent > 15
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${creditPercent}%` }}
              />
            </div>
            <p className="text-xs text-white/30">{creditPercent}% disponível</p>
          </div>
        </div>

        {/* Low credit alert */}
        {showCreditAlert && (
          <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            {plan === "PRO" ? (
              <p className="text-sm text-amber-300">
                Seus créditos estão quase no limite.{" "}
                {renewalDays !== null && renewalDays > 0
                  ? `Renovam em ${renewalDays} ${renewalDays === 1 ? "dia" : "dias"}.`
                  : "Renovam em breve."}
              </p>
            ) : (
              <p className="text-sm text-amber-300">
                Seus créditos estão acabando.{" "}
                <a
                  href="/#pricing"
                  className="font-semibold underline underline-offset-2 hover:text-amber-200 transition-colors"
                >
                  Faça upgrade para continuar gerando.
                </a>
              </p>
            )}
          </div>
        )}

        {/* Quick links */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/generate"
              className="flex items-center gap-3 bg-[#12121a] hover:bg-white/[0.07] border border-white/10 rounded-xl p-4 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Gerar Foto</p>
                <p className="text-xs text-white/40">Criar nova imagem</p>
              </div>
            </Link>
            <Link
              href="/explore"
              className="flex items-center gap-3 bg-[#12121a] hover:bg-white/[0.07] border border-white/10 rounded-xl p-4 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Explorar</p>
                <p className="text-xs text-white/40">Ver galeria pública</p>
              </div>
            </Link>
            <Link
              href="/#pricing"
              className="flex items-center gap-3 bg-[#12121a] hover:bg-white/[0.07] border border-white/10 rounded-xl p-4 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Upgrade</p>
                <p className="text-xs text-white/40">Ver planos</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent generations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">
              Gerações Recentes
            </h2>
            <Link
              href="/explore"
              className="text-xs text-white/30 hover:text-white transition-colors flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentGenerations.length === 0 ? (
            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-10 text-center space-y-3">
              <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-white/20" />
              </div>
              <p className="text-white/30 text-sm">Você ainda não gerou nenhuma foto.</p>
              <Link
                href="/generate"
                className="inline-flex items-center gap-2 bg-white text-black text-sm font-semibold rounded-xl h-9 px-4 hover:bg-white/90 transition-colors"
              >
                Criar primeira foto
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {recentGenerations.map((gen) => (
                <div
                  key={gen.id}
                  className="relative group bg-[#12121a] border border-white/10 rounded-xl overflow-hidden aspect-[4/5]"
                >
                  {gen.imageUrl ? (
                    <Image
                      src={gen.imageUrl}
                      alt={gen.prompt.slice(0, 40)}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10">
                      <Clock className="w-8 h-8" />
                    </div>
                  )}
                  {/* Overlay with date */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <div className="space-y-1">
                      <p className="text-[10px] text-white/60">{formatDate(gen.createdAt)}</p>
                      <p className="text-xs text-white line-clamp-2">{gen.prompt}</p>
                    </div>
                  </div>
                  {/* Status badge for non-completed */}
                  {gen.status !== "COMPLETED" && (
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-[10px] text-white/60 px-2 py-0.5 rounded-full border border-white/10">
                      {gen.status === "PENDING" ? "Pendente" : gen.status === "PROCESSING" ? "Processando" : "Falhou"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
