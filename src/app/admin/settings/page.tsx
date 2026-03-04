"use client";

import { useState } from "react";
import { AdminSidebarLayout } from "@/components/AdminSidebarLayout";
import { User, Mail, CreditCard, Bell, Shield, Moon, Sun, Monitor, Trash2 } from "lucide-react";

export default function SettingsPage() {
    const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");

    return (
        <AdminSidebarLayout>
            <div className="max-w-4xl mx-auto w-full space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Configurações da Conta</h1>
                    <p className="text-muted-foreground mt-2">
                        Gerencie suas preferências de perfil, aparência e segurança.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Navigation Sidebar */}
                    <div className="space-y-1">
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg bg-white/10 text-white transition-all hover:bg-white/15">
                            <User className="w-4 h-4" /> Perfil
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all">
                            <Bell className="w-4 h-4" /> Notificações
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all">
                            <Shield className="w-4 h-4" /> Segurança
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="hidden md:block col-span-2 space-y-8">

                        {/* Profile Section */}
                        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
                            <h2 className="text-lg font-semibold mb-6">Informações Pessoais</h2>

                            <div className="flex items-start gap-6 mb-8">
                                <div className="w-20 h-20 rounded-full overflow-hidden bg-white/10 shrink-0 border border-white/20 relative group cursor-pointer">
                                    <img
                                        src="https://pbs.twimg.com/profile_images/1909615404789506048/MTqvRsjo_400x400.jpg"
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs font-medium">Trocar</span>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white/70">Nome</label>
                                            <input type="text" defaultValue="Skyleen" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-[var(--brand)] transition-colors" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white/70">Sobrenome</label>
                                            <input type="text" defaultValue="AI" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-[var(--brand)] transition-colors" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/70">E-mail</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                            <input type="email" defaultValue="skyleen@example.com" className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-[var(--brand)] transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button className="bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-black px-6 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(var(--brand-rgb),0.2)]">
                                    Salvar Alterações
                                </button>
                            </div>
                        </div>

                        {/* Subscription Mini Section */}
                        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)]">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold px-2 py-0.5 rounded text-xs bg-[var(--brand)] text-black uppercase tracking-wider">Plan Creator</h3>
                                    </div>
                                    <p className="text-sm text-white/60">Sua assinatura renova em 12 dias.</p>
                                </div>
                            </div>
                            <button className="bg-white/5 hover:bg-white/15 border border-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-[1.02]">
                                Gerenciar Assinatura
                            </button>
                        </div>

                        {/* Theme Section */}
                        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
                            <h2 className="text-lg font-semibold mb-2">Aparência</h2>
                            <p className="text-sm text-white/60 mb-6">Personalize o tema do seu painel administrativo.</p>

                            <div className="grid grid-cols-3 gap-4">
                                <div
                                    onClick={() => setTheme("light")}
                                    className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-colors ${theme === "light" ? "border-[var(--brand)] bg-[var(--brand)]/5" : "border-white/5 hover:border-white/20"}`}
                                >
                                    <Sun className={`w-6 h-6 ${theme === "light" ? "text-[var(--brand)]" : "text-white/40"}`} />
                                    <span className="text-sm font-medium">Claro</span>
                                </div>
                                <div
                                    onClick={() => setTheme("dark")}
                                    className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-colors ${theme === "dark" ? "border-[var(--brand)] bg-[var(--brand)]/5" : "border-white/5 hover:border-white/20"}`}
                                >
                                    <Moon className={`w-6 h-6 ${theme === "dark" ? "text-[var(--brand)]" : "text-white/40"}`} />
                                    <span className="text-sm font-medium">Escuro</span>
                                </div>
                                <div
                                    onClick={() => setTheme("system")}
                                    className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-colors ${theme === "system" ? "border-[var(--brand)] bg-[var(--brand)]/5" : "border-white/5 hover:border-white/20"}`}
                                >
                                    <Monitor className={`w-6 h-6 ${theme === "system" ? "text-[var(--brand)]" : "text-white/40"}`} />
                                    <span className="text-sm font-medium">Sistema</span>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="border border-red-500/20 rounded-2xl p-6 bg-red-500/5">
                            <h2 className="text-lg font-semibold text-red-500 mb-2">Zona de Perigo</h2>
                            <p className="text-sm text-white/60 mb-6">Esta ação é irreversível. Todos os seus dados, fotos geradas e configurações serão perdidos para sempre.</p>

                            <button className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 hover:scale-[1.02] text-red-500 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all border border-red-500/20">
                                <Trash2 className="w-4 h-4" /> Deletar minha conta
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </AdminSidebarLayout>
    );
}
