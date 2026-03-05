"use client";

import { useState, useRef } from "react";
import { AdminSidebarLayout } from "@/components/AdminSidebarLayout";
import { motion, AnimatePresence } from "motion/react";
import { UploadCloud, Image as ImageIcon, X, Sparkles, Wand2 } from "lucide-react";
import Image from "next/image";

export default function UploadPage() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    // Preset Prompts for Inspiration
    const PRESET_PROMPTS = [
        "Retrato corporativo em estúdio com fundo escuro e iluminação dramática",
        "Fotografia estilo cyberpunk, luzes neon refletindo em chão molhado, lente 85mm",
        "Ensaio casual ao ar livre, golden hour, luz suave, estilo cinemático",
    ];
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
            const possibleResults = [
                "/generated/re_requiem_real.png",
                "/generated/crimson_desert_real.png",
                "/generated/elden_ring_real.png",
                "/generated/dune_diverse.png",
                "/generated/cyberpunk.png",
                "/generated/demon_slayer.png"
            ];
            const randomResult = possibleResults[Math.floor(Math.random() * possibleResults.length)];
            setGeneratedImage(randomResult);
        }, 3000);
    };

    return (
        <AdminSidebarLayout>
            <div className="max-w-5xl mx-auto w-full space-y-8 lg:space-y-12">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gerador de Imagens</h1>
                    <p className="text-muted-foreground mt-2">
                        Envie uma foto de referência, descreva o que deseja no prompt e deixe a IA trabalhar.
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
                                                    sizes="(max-width: 1024px) 100vw, 50vw"
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
                                                        sizes="(max-width: 1024px) 100vw, 50vw"
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

                                {/* Form do Prompt e Botões */}
                                <div className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-4">
                                    <div className="space-y-3">
                                        <label htmlFor="prompt" className="text-sm font-medium text-white/90">
                                            O que você deseja gerar? (Prompt)
                                        </label>
                                        <textarea
                                            id="prompt"
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="Ex: Transforme em uma fotografia com estilo cyberpunk, luzes neon refletindo em chão molhado, lente 85mm..."
                                            className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-[var(--brand)] resize-none h-28 transition-colors"
                                            disabled={isGenerating || !!generatedImage}
                                        />

                                        {/* Galeria de Inspiração */}
                                        {!generatedImage && (
                                            <div className="pt-2">
                                                <p className="text-xs text-white/50 mb-2 font-medium uppercase tracking-wider">Inspiração Rápida</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {PRESET_PROMPTS.map((preset, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setPrompt(preset)}
                                                            className="text-xs bg-white/5 hover:bg-white/10 border border-white/5 rounded-full px-3 py-1.5 text-white/70 hover:text-white transition-colors text-left max-w-full truncate"
                                                        >
                                                            {preset}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {!generatedImage ? (
                                        <button
                                            onClick={simulateGeneration}
                                            disabled={isGenerating || !prompt}
                                            className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                                                ${(isGenerating || !prompt)
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
                                                    Gerar Imagem
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
                                                Salvar na Galeria
                                            </button>
                                        </motion.div>
                                    )}
                                </div>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AdminSidebarLayout>
    );
}
