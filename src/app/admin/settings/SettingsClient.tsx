"use client";

import { useTransition, useState } from "react";
import { User, Mail, CreditCard, Bell, Shield, Trash2, Loader2 } from "lucide-react";
import { updateProfile } from "@/server/actions/user";
import { deleteOwnAccount } from "@/server/actions/user";

interface SettingsUser {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    plan: string;
    subscription: {
        plan: string;
        status: string;
        currentPeriodEnd: Date;
    } | null;
}

interface SettingsClientProps {
    user: SettingsUser | null;
}

const PLAN_LABELS: Record<string, string> = {
    FREE: "Free",
    CREATOR: "Creator",
    PRO: "Pro",
};

function getInitials(name: string | null, email: string | null): string {
    if (name && name.trim().length > 0) {
        return name
            .trim()
            .split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    }
    if (email) return email[0].toUpperCase();
    return "U";
}

function getRenewalDays(periodEnd: Date | null | undefined): number | null {
    if (!periodEnd) return null;
    const now = new Date();
    const end = new Date(periodEnd);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
}

export function SettingsClient({ user }: SettingsClientProps) {
    const [saveIsPending, startSave] = useTransition();
    const [deleteIsPending, startDelete] = useTransition();
    const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const renewalDays = getRenewalDays(user?.subscription?.currentPeriodEnd);
    const planLabel = PLAN_LABELS[user?.plan ?? "FREE"] ?? user?.plan ?? "Free";
    const initials = getInitials(user?.name ?? null, user?.email ?? null);

    function handleSave(formData: FormData) {
        startSave(async () => {
            const result = await updateProfile(formData);
            if (result && "error" in result) {
                setSaveMessage({ type: "error", text: result.error ?? "Erro desconhecido" });
            } else {
                setSaveMessage({ type: "success", text: "Perfil atualizado com sucesso!" });
            }
            setTimeout(() => setSaveMessage(null), 3000);
        });
    }

    function handleDeleteAccount() {
        startDelete(async () => {
            await deleteOwnAccount();
        });
    }

    return (
        <div className="max-w-4xl mx-auto w-full space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Configurações da Conta</h1>
                <p className="text-white/50 mt-2">
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
                <div className="col-span-2 space-y-8">

                    {/* Profile Section */}
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold mb-6 text-white">Informações Pessoais</h2>

                        <form action={handleSave}>
                            <div className="flex items-start gap-6 mb-8">
                                {/* Avatar */}
                                <div className="w-20 h-20 rounded-full overflow-hidden bg-white/10 shrink-0 border border-white/20 flex items-center justify-center">
                                    {user?.image ? (
                                        <img
                                            src={user.image}
                                            alt={user.name ?? "Avatar"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xl font-bold text-white">{initials}</span>
                                    )}
                                </div>

                                {/* Fields */}
                                <div className="flex-1 space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/70">Nome</label>
                                        <input
                                            type="text"
                                            name="name"
                                            defaultValue={user?.name ?? ""}
                                            placeholder="Seu nome"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-[var(--brand)] transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/70">E-mail</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                            <input
                                                type="email"
                                                defaultValue={user?.email ?? ""}
                                                disabled
                                                className="w-full bg-black/30 border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-white/50 outline-none cursor-not-allowed"
                                            />
                                        </div>
                                        <p className="text-xs text-white/30">O e-mail não pode ser alterado.</p>
                                    </div>
                                </div>
                            </div>

                            {saveMessage && (
                                <div
                                    className={`mb-4 px-4 py-2.5 rounded-lg text-sm font-medium ${
                                        saveMessage.type === "success"
                                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                                    }`}
                                >
                                    {saveMessage.text}
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saveIsPending}
                                    className="flex items-center gap-2 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-black px-6 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(var(--brand-rgb),0.2)] disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {saveIsPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Subscription Mini Section */}
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)]">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold px-2 py-0.5 rounded text-xs bg-[var(--brand)] text-black uppercase tracking-wider">
                                        Plan {planLabel}
                                    </span>
                                    {user?.subscription?.status && (
                                        <span className="text-xs text-white/40 uppercase">{user.subscription.status}</span>
                                    )}
                                </div>
                                <p className="text-sm text-white/60">
                                    {renewalDays !== null
                                        ? `Sua assinatura renova em ${renewalDays} dias.`
                                        : "Plano gratuito ativo."}
                                </p>
                            </div>
                        </div>
                        <a
                            href="/admin/billing"
                            className="bg-white/5 hover:bg-white/15 border border-white/10 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:scale-[1.02]"
                        >
                            Gerenciar Assinatura
                        </a>
                    </div>

                    {/* Danger Zone */}
                    <div className="border border-red-500/20 rounded-2xl p-6 bg-red-500/5">
                        <h2 className="text-lg font-semibold text-red-500 mb-2">Zona de Perigo</h2>
                        <p className="text-sm text-white/60 mb-6">
                            Esta ação é irreversível. Todos os seus dados, fotos geradas e configurações serão perdidos para sempre.
                        </p>

                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 hover:scale-[1.02] text-red-500 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all border border-red-500/20"
                            >
                                <Trash2 className="w-4 h-4" /> Deletar minha conta
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-sm text-red-400 font-medium">
                                    Tem certeza? Esta ação não pode ser desfeita.
                                </p>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={deleteIsPending}
                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all border border-red-500 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {deleteIsPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                        Sim, deletar minha conta
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        disabled={deleteIsPending}
                                        className="px-4 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
