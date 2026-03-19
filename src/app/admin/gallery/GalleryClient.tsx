"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "motion/react";
import { Sparkles, Search, Filter, SlidersHorizontal, Copy, CheckCircle2, ImageOff } from "lucide-react";

type Generation = {
  id: string;
  imageUrl: string | null;
  originalUrl: string | null;
  prompt: string;
  status: string;
  quality: string;
  createdAt: string;
  user: {
    name: string | null;
    plan: string;
    email: string | null;
  };
};

interface GalleryClientProps {
  generations: Generation[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function GalleryClient({ generations }: GalleryClientProps) {
  const [selected, setSelected] = useState<Generation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (selected?.prompt) {
      navigator.clipboard.writeText(selected.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleImageClick = (gen: Generation) => {
    setSelected(gen);
    setSliderPosition(50);
    setIsDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) setSelected(null);
  };

  const filtered = generations.filter((g) => {
    const matchesSearch =
      g.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.user.email ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan =
      filterPlan === "all" || g.user.plan.toLowerCase() === filterPlan.toLowerCase();
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Galeria de Uploads</h1>
          <p className="text-white/50 mt-2">
            {generations.length} geraç{generations.length !== 1 ? "ões" : "ão"} mais recentes.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#12121a] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Buscar por prompt, ID ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm outline-none appearance-none focus:ring-2 focus:ring-white/20 text-white"
            >
              <option value="all">Todos os Planos</option>
              <option value="pro">Pro</option>
              <option value="creator">Creator</option>
              <option value="free">Free</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((gen, idx) => (
          <motion.div
            key={gen.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.05, 0.5) }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group cursor-pointer rounded-2xl overflow-hidden border border-white/10 bg-[#12121a] shadow-sm hover:shadow-md transition-all flex flex-col"
            onClick={() => handleImageClick(gen)}
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/5">
              {gen.imageUrl ? (
                <Image
                  src={gen.imageUrl}
                  alt="Generated photo"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                  <ImageOff className="w-10 h-10" />
                </div>
              )}
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <div className="bg-white/10 p-3 rounded-full backdrop-blur-md border border-white/20 text-white">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10">
                  {gen.user.plan}
                </span>
                <span className="text-xs text-white/30 truncate max-w-[80px]">
                  {gen.user.name ?? gen.user.email ?? "—"}
                </span>
              </div>
              <span className="text-xs text-white/30">{formatDate(gen.createdAt)}</span>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-white/30">
            Nenhuma imagem encontrada com esses filtros.
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-md overflow-hidden p-0 border-none bg-[#12121a] rounded-2xl shadow-2xl">
          {selected && (
            <div className="flex flex-col">
              {selected.imageUrl ? (
                <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] max-h-[60vh] overflow-hidden bg-black/95 flex items-center justify-center select-none">
                  {/* Original image (before) */}
                  {selected.originalUrl && (
                    <Image
                      src={selected.originalUrl}
                      alt="Original photo"
                      fill
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="object-contain"
                      draggable={false}
                    />
                  )}

                  {/* Generated image (after) — clipped by slider */}
                  <div
                    className="absolute inset-0 z-10"
                    style={{ clipPath: selected.originalUrl ? `inset(0 ${100 - sliderPosition}% 0 0)` : undefined }}
                  >
                    <Image
                      src={selected.imageUrl}
                      alt="Generated photo"
                      fill
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="object-contain"
                      draggable={false}
                    />
                  </div>

                  {selected.originalUrl && (
                    <>
                      {/* Slider handle */}
                      <div
                        className="absolute top-0 bottom-0 z-20 w-1 bg-white cursor-ew-resize transform -translate-x-1/2 flex items-center justify-center pointer-events-none"
                        style={{ left: `${sliderPosition}%` }}
                      >
                        <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 pointer-events-auto">
                          <SlidersHorizontal className="w-4 h-4 text-gray-800" />
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderPosition}
                        onChange={(e) => setSliderPosition(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-ew-resize"
                      />
                      <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md text-white text-xs font-medium px-2 py-1 rounded-md pointer-events-none">
                        Depois
                      </div>
                      <div className="absolute top-4 right-4 z-20 bg-white/50 backdrop-blur-md text-white/50 text-xs font-medium px-2 py-1 rounded-md pointer-events-none">
                        Antes
                      </div>
                    </>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#12121a] to-transparent z-10 pointer-events-none" />
                </div>
              ) : (
                <div className="w-full aspect-[4/5] sm:aspect-[3/4] max-h-[60vh] flex items-center justify-center bg-black/50 text-white/20">
                  <ImageOff className="w-16 h-16" />
                </div>
              )}

              <div className="p-6 pt-2">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-xl flex items-center gap-2 text-white">
                    <Sparkles className="w-5 h-5 text-[var(--brand)]" />
                    Prompt Original
                  </DialogTitle>
                  <DialogDescription className="text-white/40">
                    Por {selected.user.name ?? selected.user.email ?? "usuário desconhecido"} &middot; Plano {selected.user.plan} &middot; {formatDate(selected.createdAt)}
                  </DialogDescription>
                </DialogHeader>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10 relative overflow-hidden">
                  <p className="text-sm font-medium leading-relaxed font-mono text-white/70 pr-10">
                    &ldquo;{selected.prompt}&rdquo;
                  </p>
                  <button
                    onClick={handleCopy}
                    className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
                    title="Copiar prompt"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <div className="mt-3 flex items-center gap-2 text-xs text-white/30">
                    Status: <span className="text-white/50 font-medium">{selected.status}</span>
                    &nbsp;&middot;&nbsp; Qualidade: <span className="text-white/50 font-medium">{selected.quality}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
