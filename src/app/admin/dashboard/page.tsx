import { getAdminStats, getRevenueStats } from "@/server/queries/stats";
import { DollarSign, Users, Image as ImageIcon, TrendingUp, CreditCard } from "lucide-react";

export default async function AdminDashboardPage() {
    const stats = await getAdminStats();
    const revenue = await getRevenueStats();

    const cards = [
        {
            title: "MRR",
            value: `R$ ${revenue.mrr.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
            icon: DollarSign,
            description: "Receita Mensal Recorrente",
            color: "text-green-400",
        },
        {
            title: "Receita Total",
            value: `R$ ${revenue.totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
            icon: TrendingUp,
            description: "Faturamento acumulado (simulado)",
            color: "text-blue-400",
        },
        {
            title: "Assinaturas Ativas",
            value: stats.activeSubscriptions,
            icon: CreditCard,
            description: "Platnos Creator e Pro",
            color: "text-purple-400",
        },
        {
            title: "Total de Usuários",
            value: stats.totalUsers,
            icon: Users,
            description: "Usuários cadastrados",
            color: "text-orange-400",
        },
    ];

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard Financeiro</h1>
                <p className="text-white/60">Acompanhe a saúde financeira da Nana Prompt.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className="bg-[#12121a] border border-white/5 p-6 rounded-2xl space-y-4 hover:border-white/10 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white/60">{card.title}</span>
                            <card.icon className={`w-5 h-5 ${card.color}`} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{card.value}</div>
                            <p className="text-xs text-white/40 mt-1">{card.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Plan Breakdown Table */}
                <div className="bg-[#12121a] border border-white/5 p-6 rounded-2xl h-fit">
                    <h2 className="text-lg font-bold text-white mb-6">Distribuição por Plano</h2>
                    <div className="space-y-4">
                        {Object.entries(revenue.planBreakdown).map(([plan, count]) => (
                            <div key={plan} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5">
                                <span className="font-bold text-white uppercase tracking-wider text-sm">{plan}</span>
                                <span className="text-white/60 font-medium">{count} assinantes</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Global Stats Table */}
                <div className="bg-[#12121a] border border-white/5 p-6 rounded-2xl h-fit">
                    <h2 className="text-lg font-bold text-white mb-6">Resumo Operacional</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5">
                            <span className="text-white/60 text-sm">Gerações Totais</span>
                            <span className="font-bold text-white">{stats.totalGenerations}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5">
                            <span className="text-white/60 text-sm">Usuários Pagantes</span>
                            <span className="font-bold text-white">{stats.paidUsers}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
