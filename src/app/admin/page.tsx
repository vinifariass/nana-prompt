"use client";

import { useState } from "react";
import { AdminSidebarLayout } from "@/components/AdminSidebarLayout";
import { ChevronDown, Calendar, ArrowUpRight, ArrowDownRight, User, Image as ImageIcon, Phone, DollarSign } from "lucide-react";
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

export default function AdminDashboardPage() {
    const [activeTab, setActiveTab] = useState<"geracoes" | "assinaturas">("geracoes");
    const [dateRange, setDateRange] = useState("Últimos 30 Dias");

    return (
        <AdminSidebarLayout>
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

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {/* Metrics Row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                        {/* Card 1 */}
                        <motion.div variants={itemVariants} className="bg-[#12121a] border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:bg-white/[0.04] hover:border-white/20 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1 relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <span className="text-sm font-medium text-white/60">Novos Ensaios Gerados</span>
                                <ImageIcon className="w-4 h-4 text-white/40 group-hover:text-[var(--brand)] transition-colors" />
                            </div>
                            <div className="flex items-end gap-3 relative z-10">
                                <span className="text-3xl font-bold tracking-tight">352</span>
                                <span className="flex items-center text-sm font-medium text-[#22c55e] mb-1">
                                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                                    13.5%
                                </span>
                            </div>
                            {/* Sparkline SVG */}
                            <div className="absolute bottom-0 left-0 w-full h-12 opacity-20 pointer-events-none">
                                <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full text-[var(--brand)]">
                                    <path d="M0,30 L10,25 L20,28 L30,15 L40,20 L50,10 L60,18 L70,5 L80,12 L90,2 L100,8 L100,30 Z" fill="currentColor" />
                                </svg>
                            </div>
                        </motion.div>

                        {/* Card 2 */}
                        <motion.div variants={itemVariants} className="bg-[#12121a] border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:bg-white/[0.04] hover:border-white/20 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1 relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <span className="text-sm font-medium text-white/60">Novos Assinantes (Pro)</span>
                                <User className="w-4 h-4 text-white/40 group-hover:text-[var(--brand)] transition-colors" />
                            </div>
                            <div className="flex items-end gap-3 relative z-10">
                                <span className="text-3xl font-bold tracking-tight">246</span>
                                <span className="flex items-center text-sm font-medium text-[#22c55e] mb-1">
                                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                                    14.4%
                                </span>
                            </div>
                            {/* Sparkline SVG */}
                            <div className="absolute bottom-0 left-0 w-full h-12 opacity-20 pointer-events-none">
                                <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full text-[#22c55e]">
                                    <path d="M0,30 L15,28 L30,22 L45,26 L60,15 L75,18 L90,5 L100,10 L100,30 Z" fill="currentColor" />
                                </svg>
                            </div>
                        </motion.div>

                        {/* Card 3 */}
                        <motion.div variants={itemVariants} className="bg-[#12121a] border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:bg-white/[0.04] hover:border-white/20 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1 relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <span className="text-sm font-medium text-white/60">Cancelamentos Totais</span>
                                <Phone className="w-4 h-4 text-white/40 group-hover:text-red-400 transition-colors" />
                            </div>
                            <div className="flex items-end gap-3 relative z-10">
                                <span className="text-3xl font-bold tracking-tight">59</span>
                                <span className="flex items-center text-sm font-medium text-[#ef4444] mb-1">
                                    <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                                    15.8%
                                </span>
                            </div>
                            {/* Sparkline SVG */}
                            <div className="absolute bottom-0 left-0 w-full h-12 opacity-10 pointer-events-none">
                                <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full text-[#ef4444]">
                                    <path d="M0,5 L20,8 L40,15 L60,12 L80,22 L100,28 L100,30 L0,30 Z" fill="currentColor" />
                                </svg>
                            </div>
                        </motion.div>

                        {/* Card 4 */}
                        <motion.div variants={itemVariants} className="bg-[#12121a] border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:bg-white/[0.04] hover:border-white/20 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1 relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <span className="text-sm font-medium text-white/60">Faturamento Diário</span>
                                <DollarSign className="w-4 h-4 text-white/40 group-hover:text-[#22c55e] transition-colors" />
                            </div>
                            <div className="flex items-end gap-3 relative z-10">
                                <span className="text-3xl font-bold tracking-tight">R$ 1.875</span>
                                <span className="flex items-center text-sm font-medium text-[#22c55e] mb-1">
                                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                                    29.3%
                                </span>
                            </div>
                            {/* Sparkline SVG */}
                            <div className="absolute bottom-0 left-0 w-full h-12 opacity-20 pointer-events-none">
                                <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full text-[#22c55e]">
                                    <path d="M0,30 L10,25 L20,29 L30,12 L40,18 L50,5 L60,10 L70,8 L80,15 L90,2 L100,5 L100,30 Z" fill="currentColor" />
                                </svg>
                            </div>
                        </motion.div>

                    </div>

                    {/* Recent Purchases Table */}
                    <motion.div variants={itemVariants} className="bg-[#12121a] border border-white/5 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-medium text-white/80">
                                {activeTab === "geracoes" ? "Últimas Gerações (Tempo Real)" : "Últimas Assinaturas (Tempo Real)"}
                            </h2>
                            <button className="text-xs font-medium text-white/50 hover:text-white transition-all hover:underline">
                                Ver todas
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left whitespace-nowrap">
                                <thead className="text-white/40 border-b border-white/5">
                                    <tr>
                                        <th className="pb-3 font-normal">Usuário</th>
                                        <th className="pb-3 font-normal">Plano</th>
                                        <th className="pb-3 font-normal text-right">{activeTab === "geracoes" ? "Estilo" : "Valor"}</th>
                                        <th className="pb-3 font-normal text-right">Data</th>
                                        <th className="pb-3 font-normal text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr className="hover:bg-white/5 transition-colors cursor-pointer">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">L</div>
                                                <span className="font-medium">Lucas Schmidt</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-white/80">Creator</td>
                                        <td className="py-4 text-right font-medium">{activeTab === "geracoes" ? "Cyberpunk" : "R$ 29,00"}</td>
                                        <td className="py-4 text-right text-white/60">Há 5 min</td>
                                        <td className="py-4 text-center">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#22c55e]/10 text-[#22c55e]">{activeTab === "geracoes" ? "Concluído" : "Pago"}</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors cursor-pointer">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-[var(--brand)] text-black flex items-center justify-center text-[10px] font-bold">M</div>
                                                <span className="font-medium">Mariana Lopes</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-white/80">Pro</td>
                                        <td className="py-4 text-right font-medium text-[var(--brand)]">{activeTab === "geracoes" ? "Corporativo" : "R$ 69,00"}</td>
                                        <td className="py-4 text-right text-white/60">Há 22 min</td>
                                        <td className="py-4 text-center">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#22c55e]/10 text-[#22c55e]">{activeTab === "geracoes" ? "Concluído" : "Pago"}</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors cursor-pointer">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">D</div>
                                                <span className="font-medium">Diego Alves</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-white/80">Pro</td>
                                        <td className="py-4 text-right font-medium text-[var(--brand)]">{activeTab === "geracoes" ? "Fashion" : "R$ 69,00"}</td>
                                        <td className="py-4 text-right text-white/60">Há 1 hora</td>
                                        <td className="py-4 text-center">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#22c55e]/10 text-[#22c55e]">{activeTab === "geracoes" ? "Concluído" : "Pago"}</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors cursor-pointer">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">C</div>
                                                <span className="font-medium">Camila Vilela</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-white/80">Creator</td>
                                        <td className="py-4 text-right font-medium">{activeTab === "geracoes" ? "Casual" : "R$ 29,00"}</td>
                                        <td className="py-4 text-right text-white/60">Hoje, 09:15</td>
                                        <td className="py-4 text-center">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-white/10 text-white/70">{activeTab === "geracoes" ? "Falhou" : "Pendente"}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </motion.div>

            </div>
        </AdminSidebarLayout>
    );
}
