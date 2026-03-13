"use client";

import { useState } from "react";
import { ChevronDown, Calendar, ArrowUpRight, User, Image as ImageIcon, Phone, DollarSign } from "lucide-react";
import { motion, Variants } from "motion/react";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

interface DashboardClientProps {
    stats: any;
    recentGenerations: any[];
    recentSubscriptions: any[];
}

export function AdminDashboardClient({ stats, recentGenerations, recentSubscriptions }: DashboardClientProps) {
    const [activeTab, setActiveTab] = useState<"geracoes" | "assinaturas">("geracoes");
    const [dateRange, setDateRange] = useState("Últimos 30 Dias");

    return (
        <div className="w-full min-h-[calc(100vh-4rem)] p-4 md:p-8 relative">
            {/* Actions Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-[#12121a] hover:bg-[#1a1a24] border border-white/10 rounded-md px-3 py-1.5 text-sm font-medium transition-all hover:scale-[1.02] cursor-pointer active:scale-95">
                        <div className="bg-white text-black w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold">
                            F
                        </div>
                        FotoPro Workspace
                        <ChevronDown className="w-4 h-4 text-white/50" />
                    </button>

                    <div className="flex items-center bg-[#12121a] border border-white/10 rounded-md p-1">
                        <button
                            onClick={() => setActiveTab("geracoes")}
                            className={`px-3 py-1 text-sm font-medium rounded transition-all ${activeTab === 'geracoes' ? 'bg-white/10 text-white shadow-sm' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
                        >
                            Gerações
                        </button>
                        <button
                            onClick={() => setActiveTab("assinaturas")}
                            className={`px-3 py-1 text-sm font-medium rounded transition-all ${activeTab === 'assinaturas' ? 'bg-white/10 text-white shadow-sm' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
                        >
                            Assinaturas
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => {
                        const options = ["Hoje", "Últimos 7 Dias", "Últimos 30 Dias", "Este Ano"];
                        setDateRange(options[(options.indexOf(dateRange) + 1) % options.length]);
                    }}
                    className="flex items-center gap-2 bg-[#12121a] hover:bg-[#1a1a24] border border-white/10 rounded-md px-3 py-1.5 text-sm font-medium transition-all hover:scale-[1.02] cursor-pointer active:scale-95"
                >
                    <Calendar className="w-4 h-4 text-white/50" />
                    {dateRange}
                </button>
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="show">
                {/* Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <motion.div variants={itemVariants} className="bg-[#12121a] border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:bg-white/[0.04] transition-all relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-white/60">Total de Usuários</span>
                            <User className="w-4 h-4 text-white/40" />
                        </div>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-bold tracking-tight">{stats.totalUsers}</span>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-[#12121a] border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:bg-white/[0.04] transition-all relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-white/60">Gerações Totais</span>
                            <ImageIcon className="w-4 h-4 text-white/40" />
                        </div>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-bold tracking-tight">{stats.totalGenerations}</span>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-[#12121a] border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:bg-white/[0.04] transition-all relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-white/60">Assinaturas Ativas</span>
                            <Phone className="w-4 h-4 text-white/40" />
                        </div>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-bold tracking-tight">{stats.activeSubscriptions}</span>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-[#12121a] border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:bg-white/[0.04] transition-all relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-white/60">Usuários Pagantes</span>
                            <DollarSign className="w-4 h-4 text-white/40" />
                        </div>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-bold tracking-tight">{stats.paidUsers}</span>
                        </div>
                    </motion.div>
                </div>

                {/* Recent Activity Table */}
                <motion.div variants={itemVariants} className="bg-[#12121a] border border-white/5 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-medium text-white/80">
                            {activeTab === "geracoes" ? "Todas as Gerações (Tempo Real)" : "Últimas Assinaturas (Tempo Real)"}
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="text-white/40 border-b border-white/5">
                                <tr>
                                    <th className="pb-3 font-normal">Usuário</th>
                                    <th className="pb-3 font-normal">Plano</th>
                                    <th className="pb-3 font-normal text-right">{activeTab === "geracoes" ? "Qualidade" : "Status"}</th>
                                    <th className="pb-3 font-normal text-right">Data</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {activeTab === "geracoes" ? (
                                    recentGenerations.map((gen) => (
                                        <tr key={gen.id} className="hover:bg-white/5 transition-colors cursor-pointer">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                                                        {gen.user?.name?.substring(0, 1) || "U"}
                                                    </div>
                                                    <span className="font-medium">{gen.user?.name || "Anônimo"}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 text-white/80">{gen.user?.plan}</td>
                                            <td className="py-4 text-right font-medium">{gen.quality}</td>
                                            <td className="py-4 text-right text-white/60">
                                                {new Date(gen.createdAt).toLocaleDateString("pt-BR")}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    recentSubscriptions.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-white/5 transition-colors cursor-pointer">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-[var(--brand)] text-black flex items-center justify-center text-[10px] font-bold">
                                                        {sub.user?.name?.substring(0, 1) || "U"}
                                                    </div>
                                                    <span className="font-medium">{sub.user?.name || "Anônimo"}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 text-white/80">{sub.plan}</td>
                                            <td className="py-4 text-right font-medium text-[var(--brand)]">{sub.status}</td>
                                            <td className="py-4 text-right text-white/60">
                                                {new Date(sub.updatedAt).toLocaleDateString("pt-BR")}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
