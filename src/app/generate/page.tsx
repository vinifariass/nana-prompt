"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Image as ImageIcon, X, Sparkles, Wand2, ArrowLeft } from "lucide-react";
import Image from "next/image";

// Dados de inspiração que o usuário quer ver para não ficar "perdido"
const INSPIRATION_IMAGES = [
    {
        id: 1,
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
        prompt: "A ultra-realistic cinematic portrait of a young woman with freckles, soft golden hour lighting, 85mm lens, f/1.8, highly detailed reflection in eyes."
    },
    {
        id: 2,
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
        prompt: "Abstract fluid art with vibrant neon glowing colors spreading like ink in water, dark background, 8k resolution, macro photography."
    },
    {
        id: 3,
        url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop",
        prompt: "Cyberpunk street style photography, neon lights reflecting on wet pavement, cinematic mood, moody atmospheric environment."
    },
    {
        id: 4,
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
        prompt: "Professional corporate headshot, soft natural lighting, elegant smile, clean blurred studio background."
    }
];

function GenerateContent() {
    const searchParams = useSearchParams();
    const initialPrompt = searchParams.get("prompt") || "";

    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState(initialPrompt);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (selectedFile: File) => {
        if (!selectedFile.type.startsWith("image/")) return;
        setFile(selectedFile);
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
        setGeneratedImage(null);
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setPrompt("");
        setGeneratedImage(null);
    };

    const simulateGeneration = () => {
        if (!prompt) return;
        setIsGenerating(true);
        // Simula o tempo de latência de uma API de Geração de IA
        setTimeout(() => {
            setIsGenerating(false);
            // Result mockup - you can change this to any image URL
            setGeneratedImage("https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop");
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-[var(--brand)] selection:text-black">

            {/* Top Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/explore" className="text-white/70 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                            <ArrowLeft className="w-4 h-4" />
                            Voltar para Explorar
                        </Link>
                        <div className="w-px h-4 bg-white/10 hidden sm:block" />
                        <span className="font-bold text-lg tracking-tight hidden sm:flex items-center gap-2 text-[var(--brand)]">
                            <Sparkles className="w-5 h-5" />
                            FotoPro Generator
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-sm font-medium text-white/60 hidden md:block">
                            Créditos restantes: <span className="text-white font-bold">14</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 pt-32 pb-24 space-y-8 lg:space-y-12">
                <div className="text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Crie sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand)] to-purple-400">Arte</span>
                    </h1>
                    <p className="text-white/60 text-lg">
                        Envie uma foto de referência, descreva o que deseja no prompt e deixe nossa IA transformar sua visão em realidade.
                    </p>
                </div>

                <div className="bg-[#12121a] border border-white/5 rounded-3xl p-6 lg:p-10 shadow-sm relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--brand)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <AnimatePresence mode="wait">
                        {!file ? (
                            <motion.div
                                key="dropzone"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-colors duration-300 ease-in-out cursor-pointer ${isDragging ? "border-[var(--brand)] bg-[var(--brand)]/5" : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                                    }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                                />
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <div className={`p-4 rounded-full ${isDragging ? "bg-[var(--brand)] text-black" : "bg-white/5 text-white/40"} transition-colors`}>
                                        <UploadCloud className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-lg text-white">Clique ou arraste sua imagem base</h3>
                                        <p className="text-sm text-white/50">
                                            Suporta PNG, JPG ou WEBP (Max. 10MB)
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="editor"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8 relative z-10"
                            >
                                {/* Grid: Referência x Resultado */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                                    {/* Imagem Original (Referência) */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium text-sm flex items-center gap-2 text-white/80">
                                                <ImageIcon className="w-4 h-4 text-white/40" />
                                                Imagem de Referência
                                            </h3>
                                            {!isGenerating && (
                                                <button
                                                    onClick={handleRemoveFile}
                                                    className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                                                >
                                                    <X className="w-3 h-3" /> Remover
                                                </button>
                                            )}
                                        </div>
                                        <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-black border border-white/5">
                                            {preview && (
                                                <Image
                                                    src={preview}
                                                    alt="Upload preview"
                                                    fill
                                                    className="object-contain"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Imagem Gerada ou Placeholder */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium text-sm flex items-center gap-2 text-white/80">
                                                <Sparkles className="w-4 h-4 text-[var(--brand)]" />
                                                Resultado da IA
                                            </h3>
                                        </div>
                                        <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-black/50 border border-white/5 flex items-center justify-center">
                                            {generatedImage ? (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="absolute inset-0"
                                                >
                                                    <Image
                                                        src={generatedImage}
                                                        alt="Generated Result"
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </motion.div>
                                            ) : isGenerating ? (
                                                <div className="flex flex-col items-center text-center space-y-4 px-4">
                                                    <div className="w-12 h-12 border-4 border-white/10 border-t-[var(--brand)] rounded-full animate-spin" />
                                                    <p className="text-sm font-medium text-[var(--brand)] animate-pulse">
                                                        Processando os traços mágicos...
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="text-center px-6 opacity-30 flex flex-col items-center">
                                                    <Wand2 className="w-10 h-10 mb-3" />
                                                    <p className="text-sm font-medium text-white">A imagem gerada aparecerá aqui</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form do Prompt e Inspirações - Agora sempre visível */}
                    <div className="space-y-6 mt-8 relative z-10">
                        <div className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-4">
                            <div className="space-y-3">
                                <label htmlFor="prompt" className="text-sm font-medium text-white/90">
                                    O que você deseja gerar? (Prompt)
                                </label>
                                <textarea
                                    id="prompt"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Ex: Transforme em uma fotografia com estilo cyberpunk, luzes neon refletindo em chão molhado..."
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-[var(--brand)] resize-none h-28 transition-colors"
                                    disabled={isGenerating || !!generatedImage}
                                />
                            </div>

                            {!generatedImage ? (
                                <button
                                    onClick={simulateGeneration}
                                    disabled={isGenerating || !prompt || !file}
                                    className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                                        ${(isGenerating || !prompt || !file)
                                            ? "bg-white/5 text-white/30 cursor-not-allowed"
                                            : "bg-[var(--brand)] hover:scale-[1.02] text-black shadow-[0_0_20px_rgba(var(--brand-rgb),0.2)]"
                                        }`}
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                            Gerando...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="w-5 h-5" />
                                            {file ? "Gerar Imagem" : "Faça upload da imagem de referência primeiro"}
                                        </>
                                    )}
                                </button>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col sm:flex-row gap-3"
                                >
                                    <button
                                        onClick={() => {
                                            setGeneratedImage(null);
                                            setPrompt("");
                                        }}
                                        className="flex-1 py-3.5 rounded-xl font-bold transition-all bg-white/5 hover:bg-white/10 text-white flex items-center justify-center gap-2"
                                    >
                                        Fazer nova magia
                                    </button>
                                    <button
                                        className="flex-1 py-3.5 rounded-xl font-bold transition-all bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-black flex items-center justify-center gap-2"
                                    >
                                        Baixar Imagem
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 🔥 INPIRATION GALLERY 🔥 - Movido para fora do AnimatePresence para ser sempre visível */}
                {!generatedImage && !isGenerating && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pt-8 space-y-4"
                    >
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-[var(--brand)]" />
                            Precisa de inspiração?
                            <span className="text-sm font-normal text-white/50 ml-2">Clique em uma imagem para copiar o prompt</span>
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {INSPIRATION_IMAGES.map((img) => (
                                <div
                                    key={img.id}
                                    onClick={() => {
                                        setPrompt(img.prompt);
                                        // Rola suavemente para o input para mostrar que copiou
                                        window.scrollTo({ top: 400, behavior: 'smooth' });
                                    }}
                                    className="group cursor-pointer rounded-2xl overflow-hidden relative aspect-square border-2 border-transparent hover:border-[var(--brand)] transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(var(--brand-rgb),0.3)]"
                                >
                                    <Image
                                        src={img.url}
                                        alt="Inspiration"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <span className="text-xs font-bold text-black bg-[var(--brand)] px-3 py-1.5 rounded-full shadow-lg">
                                                Usar este estilo
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}

export default function GeneratePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
            <GenerateContent />
        </Suspense>
    );
}
