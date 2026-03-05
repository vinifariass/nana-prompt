"use client";

import { AdminSidebarLayout } from "@/components/AdminSidebarLayout";
import { Download, CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { PaymentModal } from "@/components/PaymentModal";

const INVOICES = [
    { id: "INV-2026-03", date: "01 Mar, 2026", amount: "R$ 29,90", status: "paid", plan: "Creator" },
    { id: "INV-2026-02", date: "01 Fev, 2026", amount: "R$ 29,90", status: "paid", plan: "Creator" },
    { id: "INV-2026-01", date: "01 Jan, 2026", amount: "R$ 29,90", status: "paid", plan: "Creator" },
];

export default function BillingPage() {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    return (
        <AdminSidebarLayout>
            <div className="max-w-5xl mx-auto w-full space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Faturamento</h1>
                    <p className="text-muted-foreground mt-2">
                        Gerencie sua assinatura, visualize o histórico de faturas e acompanhe seu uso.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column (Plan & Usage) */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Current Plan Card */}
                        <div className="bg-[#12121a] border border-[var(--brand)]/30 shadow-[0_0_30px_rgba(var(--brand-rgb),0.05)] rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand)]/10 blur-3xl rounded-full" />

                            <h2 className="text-sm font-medium text-white/60 mb-2">Plano Atual</h2>
                            <div className="flex items-end gap-2 mb-6">
                                <span className="text-4xl font-black">Creator</span>
                                <span className="text-sm text-white/50 mb-1">/mês</span>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-[var(--brand)]" />
                                    <span>100 fotos HD por mês</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-[var(--brand)]" />
                                    <span>Sem marca d'água</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-[var(--brand)]" />
                                    <span>10 estilos disponíveis</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsPaymentModalOpen(true)}
                                className="w-full bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-black py-2.5 rounded-lg text-sm font-bold transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(var(--brand-rgb),0.3)]">
                                Fazer Upgrade para Pro
                            </button>
                        </div>

                        {/* Usage Card */}
                        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
                            <h2 className="text-sm font-medium text-white/60 mb-6">Uso do Ciclo Atual</h2>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Fotos Geradas</span>
                                    <span className="font-medium">84 / 100</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-[var(--brand)] w-[84%] rounded-full" />
                                </div>
                                <p className="text-xs text-white/40 text-right mt-1">16 créditos restantes</p>
                            </div>

                            <div className="mt-6 flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-white/60 shrink-0 mt-0.5" />
                                <p className="text-xs text-white/60">
                                    Sua franquia será renovada em <strong className="text-white">12 dias</strong>. Créditos não utilizados não se acumulam.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Payment Method & History) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Payment Method */}
                        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold">Método de Pagamento</h2>
                                <button className="text-sm font-medium text-[var(--brand)] hover:text-[var(--brand-hover)] hover:underline transition-all">
                                    Adicionar novo
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-white/80" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Mastercard terminando em 4242</p>
                                        <p className="text-xs text-white/50">Expira em 12/28</p>
                                    </div>
                                </div>
                                <span className="px-2.5 py-1 text-xs font-medium bg-white/10 rounded-md text-white/80">Padrão</span>
                            </div>
                        </div>

                        {/* Invoice History */}
                        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
                            <h2 className="text-lg font-semibold mb-6">Histórico de Faturas</h2>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-white/40 border-b border-white/10">
                                        <tr>
                                            <th className="pb-3 font-normal">Fatura</th>
                                            <th className="pb-3 font-normal">Data</th>
                                            <th className="pb-3 font-normal">Plano</th>
                                            <th className="pb-3 font-normal">Valor</th>
                                            <th className="pb-3 font-normal text-right">Download</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {INVOICES.map((invoice) => (
                                            <tr key={invoice.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="py-4 font-medium">{invoice.id}</td>
                                                <td className="py-4 text-white/70">{invoice.date}</td>
                                                <td className="py-4">
                                                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10">{invoice.plan}</span>
                                                </td>
                                                <td className="py-4 font-medium">{invoice.amount}</td>
                                                <td className="py-4 text-right">
                                                    <button className="p-2 text-white/40 hover:text-white hover:bg-white/20 rounded-lg transition-all hover:scale-110 inline-flex">
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                planName="Pro"
                price="R$ 69,90"
            />
        </AdminSidebarLayout>
    );
}
