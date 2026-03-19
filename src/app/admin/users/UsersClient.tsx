"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, ShieldBan, CheckCircle2, ShieldAlert, Trash2 } from "lucide-react";
import { toggleUserBan, deleteUser, changeUserPlan } from "@/server/actions/user";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  plan: string;
  banned: boolean;
  createdAt: Date;
  credits: { balance: number; totalUsed: number } | null;
  _count: { generations: number };
};

interface UsersClientProps {
  users: User[];
  total: number;
}

function UserAvatar({ user }: { user: User }) {
  const initials = (user.name ?? user.email ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (user.image) {
    return (
      <Image
        src={user.image}
        alt={user.name ?? "User"}
        width={32}
        height={32}
        className="w-8 h-8 rounded-full object-cover border border-white/10"
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold text-white/70">
      {initials}
    </div>
  );
}

const PLAN_LABELS: Record<string, string> = {
  FREE: "Free",
  CREATOR: "Creator",
  PRO: "Pro",
};

export function UsersClient({ users, total }: UsersClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [pending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredUsers = users.filter(
    (u) =>
      (u.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleBan = (userId: string) => {
    setLoadingId(userId + "_ban");
    startTransition(async () => {
      await toggleUserBan(userId);
      router.refresh();
      setLoadingId(null);
    });
  };

  const handleDelete = (userId: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário? Esta ação é irreversível.")) return;
    setLoadingId(userId + "_delete");
    startTransition(async () => {
      await deleteUser(userId);
      router.refresh();
      setLoadingId(null);
    });
  };

  const handleChangePlan = (userId: string, plan: "FREE" | "CREATOR" | "PRO") => {
    setLoadingId(userId + "_plan");
    startTransition(async () => {
      await changeUserPlan(userId, plan);
      router.refresh();
      setLoadingId(null);
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
          <p className="text-white/50 mt-2">
            {total} usuário{total !== 1 ? "s" : ""} cadastrado{total !== 1 ? "s" : ""} na plataforma.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-[#12121a] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou email..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#12121a] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 border-b border-white/10 text-white/50">
              <tr>
                <th className="px-6 py-4 font-medium">Usuário</th>
                <th className="px-6 py-4 font-medium">Plano</th>
                <th className="px-6 py-4 font-medium">Créditos</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => {
                const isBanLoading = loadingId === user.id + "_ban";
                const isDeleteLoading = loadingId === user.id + "_delete";
                const isPlanLoading = loadingId === user.id + "_plan";

                return (
                  <tr key={user.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} />
                        <div>
                          <p className="font-medium text-white">{user.name ?? "Sem nome"}</p>
                          <p className="text-xs text-white/40">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.plan}
                        disabled={isPlanLoading || pending}
                        onChange={(e) =>
                          handleChangePlan(user.id, e.target.value as "FREE" | "CREATOR" | "PRO")
                        }
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 text-white/70 border border-white/10 outline-none cursor-pointer hover:border-white/20 transition-colors disabled:opacity-50"
                      >
                        <option value="FREE">Free</option>
                        <option value="CREATOR">Creator</option>
                        <option value="PRO">Pro</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {user.credits?.balance ?? 0}{" "}
                      <span className="text-white/40 text-xs font-normal">restantes</span>
                    </td>
                    <td className="px-6 py-4">
                      {user.banned ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-400">
                          <ShieldAlert className="w-3.5 h-3.5" /> Banido
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ativo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleBan(user.id)}
                          disabled={isBanLoading || pending || user.role === "ADMIN"}
                          className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                          title={user.banned ? "Desbanir usuário" : "Banir usuário"}
                        >
                          <ShieldBan className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={isDeleteLoading || pending || user.role === "ADMIN"}
                          className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                          title="Excluir usuário"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/30">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
