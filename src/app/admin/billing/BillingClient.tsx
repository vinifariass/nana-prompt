"use client";

import { useTransition, useState } from "react";
import { CheckCircle2, AlertCircle, CreditCard, Loader2, ArrowUpRight, Clock } from "lucide-react";
import { cancelSubscription } from "@/server/actions/subscription";

interface BillingUser {
    plan: string;
    subscription: {
        plan: string;
        status: string;
        currentPeriodEnd: Date;
        cancelAtPeriodEnd: boolean;
        stripeSubscriptionId: string | null;
    } | null;
    credits: {
        balance: number;
    } | null;
}

interface BillingClientProps {
    user: BillingUser | null;
    invoices: Invoice[];
}

type InvoiceStatus = "paid" | "open" | "void" | "uncollectible" | null;

interface Invoice {
  id: string;
  date: Date;
  amount: number;
  status: InvoiceStatus;
  pdfUrl: string | null;
  hostedUrl: string | null;
}

const INVOICE_STATUS: Record<string, { label: string; className: string }> = {
  paid: { label: "Pago", className: "bg-green-500/15 text-green-400 border-green-500/20" },
  open: { label: "Em aberto", className: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
  void: { label: "Cancelada", className: "bg-white/10 text-white/40 border-white/10" },
  uncollectible: { label: "Não cobrada", className: "bg-red-500/15 text-red-400 border-red-500/20" },
};

function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  if (!status) return <span className="text-white/20 text-xs">—</span>;
  const meta = INVOICE_STATUS[status] ?? { label: status, className: "bg-white/10 text-white/40 border-white/10" };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${meta.className}`}>
      {meta.label}
    </span>
  );
}

const PLAN_LIMITS: Record<string, number> = {
    FREE: 10,
    CREATOR: 100,
    PRO: 200,
};

const PLAN_LABELS: Record<string, string> = {
    FREE: "Free",
    CREATOR: "Creator",
    PRO: "Pro",
};

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
    ACTIVE: { label: "Ativo", className: "bg-green-500/15 text-green-400 border-green-500/20" },
    CANCELED: { label: "Cancelado", className: "bg-red-500/15 text-red-400 border-red-500/20" },
    PAST_DUE: { label: "Pagamento Pendente", className: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
    TRIALING: { label: "Trial", className: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
    UNPAID: { label: "Não Pago", className: "bg-red-500/15 text-red-400 border-red-500/20" },
};

function getDaysUntilRenewal(periodEnd: Date | null | undefined): number | null {
    if (!periodEnd) return null;
    const now = new Date();
    const end = new Date(periodEnd);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
}

function formatDate(date: Date | null | undefined): string {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export function BillingClient({ user, invoices }: BillingClientProps) {
    const [cancelIsPending, startCancel] = useTransition();
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [cancelMessage, setCancelMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const plan = user?.plan ?? "FREE";
    const planLabel = PLAN_LABELS[plan] ?? plan;
    const creditBalance = user?.credits?.balance ?? 0;
    const creditLimit = PLAN_LIMITS[plan] ?? 10;
    const creditUsed = creditLimit - creditBalance;
    const creditPct = Math.min(100, Math.round((creditUsed / creditLimit) * 100));
    const renewalDays = getDaysUntilRenewal(user?.subscription?.currentPeriodEnd);
    const subStatus = user?.subscription?.status ?? null;
    const cancelAtEnd = user?.subscription?.cancelAtPeriodEnd ?? false;
    const statusMeta = subStatus ? STATUS_LABELS[subStatus] ?? { label: subStatus, className: "bg-white/10 text-white/70 border-white/10" } : null;

    function handleCancel() {
        startCancel(async () => {
            const result = await cancelSubscription();
            if (result && "error" in result) {
                setCancelMessage({ type: "error", text: result.error ?? "Erro desconhecido" });
            } else {
                setCancelMessage({ type: "success", text: "Assinatura marcada para cancelamento no fim do período." });
                setShowCancelConfirm(false);
            }
            setTimeout(() => setCancelMessage(null), 4000);
        });
    }

    const isPaidPlan = plan !== "FREE";

    return (
        <div className="max-w-5xl mx-auto w-full space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Faturamento</h1>
                <p className="text-white/50 mt-2">
                    Gerencie sua assinatura e acompanhe seu uso.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Current Plan Card */}
                    <div className="bg-[#12121a] border border-[var(--brand)]/30 shadow-[0_0_30px_rgba(var(--brand-rgb),0.05)] rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand)]/10 blur-3xl rounded-full pointer-events-none" />

                        <h2 className="text-sm font-medium text-white/60 mb-2">Plano Atual</h2>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-4xl font-black text-white">{planLabel}</span>
                            {isPaidPlan && <span className="text-sm text-white/50 mb-1">/mês</span>}
                        </div>

                        {statusMeta && (
                            <span className={`inline-block mb-4 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusMeta.className}`}>
                                {statusMeta.label}
                            </span>
                        )}

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-2 text-sm text-white/80">
                                <CheckCircle2 className="w-4 h-4 text-[var(--brand)] shrink-0" />
                                <span>{creditLimit} créditos por mês</span>
                            </div>
                            {isPaidPlan && (
                                <div className="flex items-center gap-2 text-sm text-white/80">
                                    <CheckCircle2 className="w-4 h-4 text-[var(--brand)] shrink-0" />
                                    <span>Sem marca d'água</span>
                                </div>
                            )}
                            {plan === "PRO" && (
                                <div className="flex items-center gap-2 text-sm text-white/80">
                                    <CheckCircle2 className="w-4 h-4 text-[var(--brand)] shrink-0" />
                                    <span>Todos os estilos disponíveis</span>
                                </div>
                            )}
                        </div>

                        {plan !== "PRO" && (
                            <a
                                href="/#pricing"
                                className="flex items-center justify-center gap-2 w-full bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-black py-2.5 rounded-lg text-sm font-bold transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(var(--brand-rgb),0.3)]"
                            >
                                <ArrowUpRight className="w-4 h-4" />
                                {plan === "FREE" ? "Ver Planos" : "Upgrade para Pro"}
                            </a>
                        )}
                    </div>

                    {/* Usage Card */}
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <h2 className="text-sm font-medium text-white/60 mb-6">Uso do Ciclo Atual</h2>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm text-white">
                                <span>Créditos Usados</span>
                                <span className="font-medium">{creditUsed} / {creditLimit}</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[var(--brand)] rounded-full transition-all"
                                    style={{ width: `${creditPct}%` }}
                                />
                            </div>
                            <p className="text-xs text-white/40 text-right mt-1">
                                {creditBalance} créditos restantes
                            </p>
                        </div>

                        {renewalDays !== null && (
                            <div className="mt-6 flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-white/60 shrink-0 mt-0.5" />
                                <p className="text-xs text-white/60">
                                    Sua franquia {cancelAtEnd ? "expira" : "renova"} em{" "}
                                    <strong className="text-white">{renewalDays} dias</strong>.{" "}
                                    Créditos não utilizados não se acumulam.
                                </p>
                            </div>
                        )}
                    </div>

                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Subscription Management */}
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-6">Gerenciar Assinatura</h2>

                        {!isPaidPlan ? (
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                <CreditCard className="w-8 h-8 text-white/40 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-white">Você está no plano gratuito</p>
                                    <p className="text-xs text-white/50 mt-1">
                                        Faça upgrade para obter mais créditos e recursos exclusivos.
                                    </p>
                                </div>
                                <a
                                    href="/#pricing"
                                    className="ml-auto shrink-0 flex items-center gap-1.5 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-black px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-[1.02]"
                                >
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                    Upgrade
                                </a>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Subscription details */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                        <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Plano</p>
                                        <p className="font-semibold text-white">{planLabel}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                        <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Status</p>
                                        {statusMeta ? (
                                            <span className={`text-sm font-semibold px-2 py-0.5 rounded border ${statusMeta.className}`}>
                                                {statusMeta.label}
                                            </span>
                                        ) : (
                                            <p className="font-semibold text-white/60">-</p>
                                        )}
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                        <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
                                            {cancelAtEnd ? "Cancela em" : "Próxima Renovação"}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-white/40 shrink-0" />
                                            <p className="font-semibold text-white text-sm">
                                                {formatDate(user?.subscription?.currentPeriodEnd)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                        <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Créditos Restantes</p>
                                        <p className="font-semibold text-white">{creditBalance} / {creditLimit}</p>
                                    </div>
                                </div>

                                {/* Cancel / Cancel-at-end indicator */}
                                {cancelAtEnd ? (
                                    <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                        <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
                                        <p className="text-sm text-yellow-300">
                                            Sua assinatura cancela em{" "}
                                            <strong>{formatDate(user?.subscription?.currentPeriodEnd)}</strong>.
                                            Você mantém acesso até essa data.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {cancelMessage && (
                                            <div
                                                className={`px-4 py-2.5 rounded-lg text-sm font-medium ${
                                                    cancelMessage.type === "success"
                                                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                                                }`}
                                            >
                                                {cancelMessage.text}
                                            </div>
                                        )}

                                        {!showCancelConfirm ? (
                                            <button
                                                onClick={() => setShowCancelConfirm(true)}
                                                className="text-sm text-red-400 hover:text-red-300 underline-offset-2 hover:underline transition-colors"
                                            >
                                                Cancelar assinatura
                                            </button>
                                        ) : (
                                            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl space-y-3">
                                                <p className="text-sm text-red-400 font-medium">
                                                    Tem certeza? Sua assinatura permanecerá ativa até o fim do período atual.
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={handleCancel}
                                                        disabled={cancelIsPending}
                                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all border border-red-500 disabled:opacity-60 disabled:cursor-not-allowed"
                                                    >
                                                        {cancelIsPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                                        Confirmar cancelamento
                                                    </button>
                                                    <button
                                                        onClick={() => setShowCancelConfirm(false)}
                                                        disabled={cancelIsPending}
                                                        className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                                                    >
                                                        Voltar
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Invoice History */}
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Histórico de Faturas</h2>

                        {invoices.length === 0 ? (
                            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                                <CreditCard className="w-5 h-5 text-white/40 shrink-0" />
                                <p className="text-sm text-white/50">Nenhuma fatura encontrada.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-white/40 border-b border-white/10">
                                            <th className="pb-3 font-medium">Data</th>
                                            <th className="pb-3 font-medium">Valor</th>
                                            <th className="pb-3 font-medium">Status</th>
                                            <th className="pb-3 font-medium text-right">PDF</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {invoices.map((inv) => (
                                            <tr key={inv.id} className="text-white/70">
                                                <td className="py-3">
                                                    {inv.date.toLocaleDateString("pt-BR", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </td>
                                                <td className="py-3">
                                                    {inv.amount.toLocaleString("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    })}
                                                </td>
                                                <td className="py-3">
                                                    <InvoiceStatusBadge status={inv.status} />
                                                </td>
                                                <td className="py-3 text-right">
                                                    {inv.pdfUrl ? (
                                                        <a
                                                            href={inv.pdfUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-white/40 hover:text-white underline-offset-2 hover:underline transition-colors"
                                                        >
                                                            Baixar
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs text-white/20">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
