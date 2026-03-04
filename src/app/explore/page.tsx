"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Lock, ArrowLeft, Search, Copy, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Dados visuais impressionantes para a galeria
const EXPLORE_IMAGES = [
    {
        id: 1,
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
        prompt: "A ultra-realistic cinematic portrait of a young woman with freckles, soft golden hour lighting, 85mm lens, f/1.8, highly detailed reflection in eyes.",
        category: "Portrait"
    },
    {
        id: 2,
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
        prompt: "Abstract fluid art with vibrant neon glowing colors spreading like ink in water, dark background, 8k resolution, macro photography.",
        category: "Abstract"
    },
    {
        id: 3,
        url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop",
        prompt: "Cyberpunk street style photography, neon lights reflecting on wet pavement, cinematic mood, moody atmospheric environment.",
        category: "Cinematic"
    },
    {
        id: 4,
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
        prompt: "Professional corporate headshot, soft natural lighting, elegant smile, clean blurred studio background.",
        category: "Professional"
    },
    {
        id: 5,
        url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
        prompt: "Dramatic artistic portrait with red and blue color gels, chiaroscuro lighting, intense expression.",
        category: "Artistic"
    },
    {
        id: 6,
        url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
        prompt: "Beauty portrait with perfect skin texture, glossy lips, studio beauty dish lighting, rim light, ultra high definition.",
        category: "Beauty"
    },
];

export default function ExplorePage() {
    // A pedido do usuário: "mas por enquanto deixa desvbloqueado" = true
    const hasPremium = true;

    const [copiedId, setCopiedId] = useState<number | null>(null);

    const handleCopy = (prompt: string, id: number) => {
        if (!hasPremium) return;
        navigator.clipboard.writeText(prompt);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-[var(--brand)] selection:text-black">

            {/* Top Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-white/70 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium hide-on-mobile">
                            <ArrowLeft className="w-4 h-4" />
                            Voltar
                        </Link>
                        <div className="w-px h-4 bg-white/10" />
                        <span className="font-bold text-lg tracking-tight flex items-center gap-2 text-[var(--brand)]">
                            <Sparkles className="w-5 h-5" />
                            FotoPro Prompts
                        </span>
                    </div>

                    {!hasPremium && (
                        <Link
                            href="/#pricing"
                            className="text-xs font-bold md:text-sm bg-[var(--brand)] text-black px-4 py-2 rounded-full hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_20px_rgba(var(--brand-rgb),0.3)]"
                        >
                            Assinar Mensal
                        </Link>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <header className="pt-32 pb-16 px-6 max-w-7xl mx-auto text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
                >
                    Explore. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand)] to-purple-400">Inspire-se.</span> Crie.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10"
                >
                    Descubra as fórmulas perfeitas criadas por nossa IA. Assinantes mensais têm acesso irrestrito a todos os parâmetros exatos.
                </motion.p>

                {/* Search Bar Visual Only */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-xl mx-auto relative group"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--brand)] to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <div className="relative flex items-center bg-[#12121a] border border-white/10 rounded-2xl p-2">
                        <Search className="w-5 h-5 text-white/40 ml-3" />
                        <input
                            type="text"
                            placeholder="Buscar por estilo literário, lente ou iluminação..."
                            className="w-full bg-transparent border-none text-white px-4 py-3 outline-none placeholder:text-white/30"
                        />
                    </div>
                </motion.div>
            </header>

            {/* Masonry / Grid Gallery */}
            <main className="max-w-7xl mx-auto px-6 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {EXPLORE_IMAGES.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            className="bg-[#12121a] border border-white/5 rounded-3xl overflow-hidden flex flex-col group hover:border-white/10 transition-colors"
                        >
                            {/* Image Container */}
                            <Link
                                href={`/generate?prompt=${encodeURIComponent(item.prompt)}`}
                                className="relative aspect-square w-full overflow-hidden bg-black block cursor-pointer"
                            >
                                <Image
                                    src={item.url}
                                    alt={item.category}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-medium text-white/90 border border-white/10">
                                        {item.category}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                                    <Sparkles className="w-8 h-8 text-[var(--brand)] mb-3" />
                                    <span className="text-white font-bold text-lg mb-1">Usar este estilo</span>
                                    <span className="text-white/70 text-sm">Abrir no Gerador IA</span>
                                </div>
                            </Link>

                            {/* Prompt Container */}
                            <div className="p-6 relative flex flex-col flex-1">
                                <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center justify-between">
                                    Prompt Utilizado
                                    {hasPremium ? (
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
                                </h3>

                                <div className="relative flex-1">
                                    <p className={cn(
                                        "text-sm font-mono leading-relaxed transition-all duration-300",
                                        hasPremium ? "text-white/70" : "text-white/30 blur-md select-none"
                                    )}>
                                        "{item.prompt}"
                                    </p>

                                    {/* Lock Overlay */}
                                    {!hasPremium && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#12121a]/20">
                                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl text-center transform group-hover:scale-105 transition-transform">
                                                <Lock className="w-6 h-6 text-[var(--brand)] mx-auto mb-2" />
                                                <p className="text-sm font-bold text-white mb-1">Conteúdo Bloqueado</p>
                                                <p className="text-xs text-white/60">Assine para revelar a magia</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
