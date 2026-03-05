"use client";

import { useState } from "react";
import { AdminSidebarLayout } from "@/components/AdminSidebarLayout";
import { Search, MoreVertical, ShieldBan, Mail, CheckCircle2, ShieldAlert } from "lucide-react";
import Image from "next/image";

const USERS_MOCK = [
    { id: "1", name: "João Silva", email: "joao@exemplo.com", avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&q=80", plan: "Pro", credits: 154, status: "active", date: "01 Mar, 2026" },
    { id: "2", name: "Maria Oliveira", email: "maria.o@exemplo.com", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&q=80", plan: "Creator", credits: 89, status: "active", date: "28 Fev, 2026" },
    { id: "3", name: "Carlos Mendes", email: "cmendes@exemplo.com", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80", plan: "Free", credits: 5, status: "banned", date: "25 Fev, 2026" },
    { id: "4", name: "Ana Costa", email: "ana.costa22@exemplo.com", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80", plan: "Pro", credits: 400, status: "active", date: "22 Fev, 2026" },
    { id: "5", name: "Lucas Fernandes", email: "lucasf@exemplo.com", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80", plan: "Free", credits: 0, status: "active", date: "20 Fev, 2026" },
];

export default function AdminUsersPage() {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState(USERS_MOCK);

    const toggleBan = (id: string) => {
        setUsers(users.map(u => {
            if (u.id === id) {
                return { ...u, status: u.status === 'active' ? 'banned' : 'active' };
            }
            return u;
        }));
    };

    const deleteUser = (id: string) => {
        setUsers(users.filter(u => u.id !== id));
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminSidebarLayout>
            <div className="space-y-6 max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
                        <p className="text-muted-foreground mt-2">
                            Visualize e gerencie os clientes e planos da sua plataforma.
                        </p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por nome ou email..."
                            className="w-full bg-muted/50 border border-border rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Usuário</th>
                                    <th className="px-6 py-4 font-medium">Plano</th>
                                    <th className="px-6 py-4 font-medium">Créditos</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center ${user.plan === 'Pro' ? 'bg-[var(--brand)] border border-[var(--brand)]' : 'bg-muted border border-border'}`}>
                                                    <Image src={user.avatar} alt={user.name} width={32} height={32} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-muted text-muted-foreground border border-border">
                                                {user.plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {user.credits} <span className="text-muted-foreground text-xs font-normal">restantes</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.status === "active" ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-500">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Ativo
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-500">
                                                    <ShieldAlert className="w-3.5 h-3.5" /> Banido
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition-all hover:scale-110" title="Enviar Email">
                                                    <Mail className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => toggleBan(user.id)}
                                                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all hover:scale-110"
                                                    title={user.status === 'active' ? "Banir" : "Desbanir"}
                                                >
                                                    <ShieldBan className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(user.id)}
                                                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all hover:scale-110"
                                                    title="Excluir Usuário"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminSidebarLayout>
    );
}
