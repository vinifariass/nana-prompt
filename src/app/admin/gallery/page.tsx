"use client";

import { useState } from "react";
import Image from "next/image";
import { AdminSidebarLayout } from "@/components/AdminSidebarLayout";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "motion/react";
import Link from "next/link";
import { Lock, Sparkles, CheckCircle2, Search, Filter, SlidersHorizontal, Copy } from "lucide-react";

// Mock Data
const MOCK_IMAGES = [
    {
        id: 1,
        url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop",
        originalUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop&blur=100",
        prompt: "A high-fashion portrait of a model in cyberpunk attire, neon lights reflection, 85mm lens, highly detailed.",
        date: "28 Fev, 2026",
        plan: "Pro"
    },
    {
        id: 2,
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
        originalUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop&blur=100",
        prompt: "Professional corporate headshot of a smiling man, clean gray background, studio lighting.",
        date: "27 Fev, 2026",
        plan: "Free"
    },
    {
        id: 3,
        url: "https://images.unsplash.com/photo-1531123414708-f142f33c56ce?q=80&w=800&auto=format&fit=crop",
        originalUrl: "https://images.unsplash.com/photo-1531123414708-f142f33c56ce?q=80&w=800&auto=format&fit=crop&blur=100",
        prompt: "Cinematic portrait of a woman looking thoughtfully out a rainy window, soft natural light.",
        date: "25 Fev, 2026",
        plan: "Creator"
    },
    {
        id: 4,
        url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
        originalUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop&blur=100",
        prompt: "Creative artistic portrait with vibrant color gels, dramatic lighting, contemporary photography style.",
        date: "22 Fev, 2026",
        plan: "Pro"
    }
];

export default function AdminGalleryPage() {
    const [selectedImage, setSelectedImage] = useState<typeof MOCK_IMAGES[0] | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPlan, setFilterPlan] = useState("all");

    // TRUE para demonstrar o slider e o prompt
    const hasPaidPlan = true;
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (selectedImage?.prompt) {
            navigator.clipboard.writeText(selectedImage.prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleImageClick = (img: typeof MOCK_IMAGES[0]) => {
        setSelectedImage(img);
        setSliderPosition(50);
        setIsDialogOpen(true);
    };

    const handleDialogChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setSelectedImage(null);
        }
    };

    const filteredImages = MOCK_IMAGES.filter(img => {
        const matchesSearch = img.prompt.toLowerCase().includes(searchQuery.toLowerCase()) || img.id.toString().includes(searchQuery);
        const matchesPlan = filterPlan === "all" || img.plan.toLowerCase() === filterPlan.toLowerCase();
        return matchesSearch && matchesPlan;
    });

    return (
        <AdminSidebarLayout>
            <div className="space-y-6 max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Galeria de Uploads</h1>
                        <p className="text-muted-foreground mt-2">
                            Gerencie suas fotos geradas e visualize os prompts utilizados.
                        </p>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar por prompt ou #ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-muted/50 border border-border rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-48">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <select
                                value={filterPlan}
                                onChange={(e) => setFilterPlan(e.target.value)}
                                className="w-full bg-muted/50 border border-border rounded-lg pl-9 pr-4 py-2 text-sm outline-none appearance-none focus:ring-2 focus:ring-[var(--brand)]"
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
                    {filteredImages.map((img, idx) => (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group cursor-pointer rounded-2xl overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all flex flex-col"
                            onClick={() => handleImageClick(img)}
                        >
                            <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                                <Image
                                    src={img.url}
                                    alt="Generated photo"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <div className="bg-white/10 p-3 rounded-full backdrop-blur-md border border-white/20 text-white">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">#{img.id}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                                        {img.plan}
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">{img.date}</span>
                            </div>
                        </motion.div>
                    ))}
                    {filteredImages.length === 0 && (
                        <div className="col-span-full py-12 text-center text-muted-foreground">
                            Nenhuma imagem encontrada com esses filtros.
                        </div>
                    )}
                </div>

                {/* Prompt & Sliders Modal */}
                <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
                    <DialogContent className="sm:max-w-md overflow-hidden p-0 border-none bg-background rounded-2xl shadow-2xl">
                        {selectedImage && (
                            <div key={selectedImage.id} className="flex flex-col">
                                {hasPaidPlan && selectedImage.originalUrl ? (
                                    <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] max-h-[60vh] overflow-hidden bg-black/95 flex items-center justify-center select-none">
                                        {/* Original Image (Before) - Background Layer */}
                                        <Image
                                            src={selectedImage.originalUrl}
                                            alt="Original photo"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 800px"
                                            className="object-contain"
                                            draggable={false}
                                        />

                                        {/* Generated Image (After) - Cropped Overlay Layer using clipPath */}
                                        <div
                                            className="absolute inset-0 z-10"
                                            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                                        >
                                            <Image
                                                src={selectedImage.url}
                                                alt="Generated photo"
                                                fill
                                                sizes="(max-width: 768px) 100vw, 800px"
                                                className="object-contain"
                                                draggable={false}
                                            />
                                        </div>

                                        {/* Slider Handle */}
                                        <div
                                            className="absolute top-0 bottom-0 z-20 w-1 bg-white cursor-ew-resize transform -translate-x-1/2 flex items-center justify-center pointer-events-none"
                                            style={{ left: `${sliderPosition}%` }}
                                        >
                                            <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 pointer-events-auto">
                                                <SlidersHorizontal className="w-4 h-4 text-gray-800" />
                                            </div>
                                        </div>

                                        {/* Invisible Range Input spanning the whole image */}
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={sliderPosition}
                                            onChange={(e) => setSliderPosition(Number(e.target.value))}
                                            className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-ew-resize"
                                        />

                                        {/* Badges */}
                                        <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md text-white text-xs font-medium px-2 py-1 rounded-md pointer-events-none">
                                            Depois
                                        </div>
                                        <div className="absolute top-4 right-4 z-20 bg-white/50 backdrop-blur-md text-white/50 text-xs font-medium px-2 py-1 rounded-md pointer-events-none">
                                            Antes
                                        </div>

                                        {/* Gradient fade */}
                                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
                                    </div>
                                ) : (
                                    <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] max-h-[60vh] overflow-hidden bg-black/95 flex items-center justify-center">
                                        <Image
                                            src={selectedImage.url}
                                            alt="Selected preview"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 800px"
                                            className="object-contain"
                                        />
                                        {/* Gradient fade */}
                                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
                                    </div>
                                )}

                                <div className="p-6 pt-2">
                                    <DialogHeader className="mb-4">
                                        <DialogTitle className="text-xl flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-[var(--brand)]" />
                                            Prompt Original
                                        </DialogTitle>
                                        <DialogDescription>
                                            Detalhes da geração fotográfica.
                                        </DialogDescription>
                                    </DialogHeader>

                                    {/* Access Control View */}
                                    <div className="bg-muted/50 p-4 rounded-xl border border-border/50 relative overflow-hidden">
                                        {hasPaidPlan ? (
                                            <div className="space-y-3">
                                                <p className="text-sm font-medium leading-relaxed font-mono text-foreground/80 pr-10">
                                                    "{selectedImage.prompt}"
                                                </p>

                                                <button
                                                    onClick={handleCopy}
                                                    className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                                                    title="Copiar prompt"
                                                >
                                                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                                </button>

                                                <div className="flex items-center gap-2 text-xs text-green-500 font-medium">
                                                    <CheckCircle2 className="w-4 h-4" /> Acesso Premium Liberado
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-6 px-2 space-y-4">
                                                <div className="w-12 h-12 bg-white/5 mx-auto rounded-full flex items-center justify-center border border-white/10 mb-2">
                                                    <Lock className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                                <h3 className="font-semibold text-lg">Conteúdo Exclusivo</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Para visualizar os prompts originais e usar o comparador, faça o upgrade para o plano <span className="text-[var(--brand)] font-medium">Creator</span> ou superior.
                                                </p>
                                                <Link
                                                    href="/#pricing"
                                                    onClick={() => setIsDialogOpen(false)}
                                                    className="inline-flex items-center justify-center w-full bg-primary text-primary-foreground font-semibold rounded-lg h-10 px-4 mt-2 hover:bg-primary/90 transition-colors"
                                                >
                                                    Ver Planos
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

            </div>
        </AdminSidebarLayout>
    );
}
