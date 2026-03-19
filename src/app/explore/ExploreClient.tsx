"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles, Lock, Search, Copy, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PromptPublic } from "@/server/queries/prompts";

export default function ExploreClient({ prompts }: { prompts: PromptPublic[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const locked = prompts[0]?.locked ?? true;

  const filtered = search.trim()
    ? prompts.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.category?.toLowerCase().includes(search.toLowerCase()) ||
          p.type.toLowerCase().includes(search.toLowerCase())
      )
    : prompts;

  const handleCopy = (prompt: string | null, id: string) => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Search bar */}
      <div className="max-w-xl mx-auto mb-12 relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--brand)] to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
        <div className="relative flex items-center bg-[#12121a] border border-white/10 rounded-2xl p-2">
          <Search className="w-5 h-5 text-white/40 ml-3 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por estilo, categoria ou tipo..."
            className="w-full bg-transparent border-none text-white px-4 py-3 outline-none placeholder:text-white/30"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.05, 0.5) }}
            className="bg-[#12121a] border border-white/5 rounded-3xl overflow-hidden flex flex-col group hover:border-white/10 transition-colors"
          >
            {/* Image */}
            <Link
              href={`/generate?prompt=${item.prompt ? encodeURIComponent(item.prompt) : ""}`}
              className="relative aspect-square w-full overflow-hidden bg-black block cursor-pointer"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-medium text-white/90 border border-white/10">
                  {item.category ?? item.type}
                </span>
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                <Sparkles className="w-8 h-8 text-[var(--brand)] mb-3" />
                <span className="text-white font-bold text-lg mb-1">Usar este estilo</span>
                <span className="text-white/70 text-sm">Abrir no Gerador IA</span>
              </div>
            </Link>

            {/* Prompt */}
            <div className="p-6 flex flex-col flex-1 relative">
              <h3 className="text-sm font-semibold text-white/80 mb-1">{item.title}</h3>
              <p className="text-xs text-white/40 mb-3">{item.type}</p>

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white/60">Prompt Utilizado</span>
                {!locked ? (
                  <button
                    onClick={() => handleCopy(item.prompt, item.id)}
                    className="text-white/40 hover:text-[var(--brand)] transition-colors"
                    title="Copiar Prompt"
                  >
                    {copiedId === item.id ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                ) : (
                  <Lock className="w-4 h-4 text-white/40" />
                )}
              </div>

              <p className={cn(
                "text-sm font-mono leading-relaxed transition-all duration-300 flex-1",
                !locked ? "text-white/70" : "text-white/20 blur-sm select-none pointer-events-none"
              )}>
                &ldquo;{item.prompt ?? "••••••••••••••••••••••••••••••••••••••••••••••••••"}&rdquo;
              </p>

              {/* Lock overlay — cobre o bloco inteiro do prompt */}
              {locked && (
                <div className="absolute inset-0 rounded-b-3xl flex items-center justify-center z-10 bg-[#12121a]/60 backdrop-blur-[2px]">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl text-center group-hover:scale-105 transition-transform">
                    <Lock className="w-6 h-6 text-[var(--brand)] mx-auto mb-2" />
                    <p className="text-sm font-bold text-white mb-1">Conteúdo Bloqueado</p>
                    <p className="text-xs text-white/60">Assine para revelar</p>
                    <Link
                      href="/#pricing"
                      className="mt-3 inline-block text-xs font-bold bg-[var(--brand)] text-black px-4 py-1.5 rounded-full hover:opacity-90 transition"
                    >
                      Ver Planos
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && search && (
        <div className="text-center text-white/40 py-16">
          <p>Nenhum resultado para &ldquo;{search}&rdquo;</p>
        </div>
      )}
    </>
  );
}
