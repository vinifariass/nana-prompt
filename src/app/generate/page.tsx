"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { UploadCloud, Image as ImageIcon, X, Sparkles, Wand2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { getUserBalance } from "@/server/actions/user";
import { generateImage } from "@/server/actions/generation";

const INSPIRATION_IMAGES = [
    {
        id: 21,
        url: "/generated/elden_ring_real.png",
        prompt: "Buat saya memakai the heavy, battle-worn armor of a Tarnished Knight from Elden Ring. Buatkan pose khas nya holding a massive, intricately textured greatsword. Characterized by stark cinematic lighting and intense contrast, featuring volumetric fog and an ethereal atmosphere. Captured with a slightly low, upward-facing angle that dramatizes the subject's posture. The background is a glowing, gloomy mystical landscape dominated by the massive golden Erdtree in the distance, creating a bold visual clash between the dark fantasy foreground and the holy light. Lighting is tightly directional, casting warm golden highlights on the brushed steel armor while plunging the other side into velvety pitch shadow. The subject's expression is resolute and unreadable, suggesting quiet defiance. Minimal retouching preserves sweat, dirt, and skin imperfections for hyper-realism. Make the face and hairstyle as similar as possible to the photo. Buat kostumnya sangat detail dan realistis dengan tekstur AAA game graphics."
    },
    {
        id: 22,
        url: "/generated/jjk_real.png",
        prompt: "Buat saya memakai the sleek, dark navy Tokyo Jujutsu High uniform from Jujutsu Kaisen. Buatkan pose khas nya charging powerful cursed energy. Characterized by high-octane cinematic lighting and intense neon contrast. Captured with a dynamic Dutch angle that dramatizes the subject's face. The background is a ruined, post-apocalyptic Tokyo street at night, creating a bold visual clash with the glowing bright blue cursed energy wrapping around the fists. Lighting is tightly directional, casting erratic, vibrant cyan highlights on one side of the face while plunging the other into shadow, emphasizing bone structure with architectural precision. The subject's expression is fierce yet focused. The uniform fabric is richly defined. Minimal retouching preserves skin texture and subtle grit. Make the face and hairstyle as similar as possible to the photo. Buat kostumnya sangat detail dan realistis."
    },
    {
        id: 23,
        url: "/generated/re_requiem_real.png",
        prompt: "Buat saya memakai rugged, dirt-covered survival gear suitable for a survival horror protagonist, inspired by Resident Evil. Buatkan pose khas nya holding a detailed tactical shotgun, characterized by stark cinematic lighting. Captured with a tight, claustrophobic close-up angle that dramatizes the subject's jawline and tense shoulders. The background is a pitched-black, gothic castle hallway filled with ominous volumetric fog. Lighting is strictly from a single, harsh flashlight source, casting stark, blinding highlights on one side of the face while plunging the rest into velvety shadow, emphasizing bone structure. The subject's expression is intense, sweat-beaded forehead, jaw clenched, suggesting extreme hyper-vigilance. The rugged clothing is richly defined with grime. Minimal retouching preserves skin texture and extreme imperfections. Make the face and hairstyle as similar as possible. Buat pencahayaan dan tekstur sangat realistis layaknya game next-gen."
    },
    {
        id: 24,
        url: "/generated/hells_paradise_real.png",
        prompt: "Buat saya memakai traditional yet highly tactical kunoichi shinobi garb from Hell's Paradise, including delicate but lethal twin curved blades. Buatkan pose khas nya characterized by stark cinematic lighting and lush environmental contrast. Captured with a dynamic framing that dramatizes the intense gaze. The composition evokes serene lethality. The background is a mysterious island overgrown with exotic blooming lotus flowers in surreal magenta and turquoise hues, creating a bold visual clash with the model's dark stealth wardrobe. Lighting is soft, dappled, and tightly directional, piercing through a thick canopy to cast warm golden highlights on the skin and metallic blades. The subject's expression is unreadable and cool-toned. Minimal retouching preserves skin texture. Make the face and hairstyle as similar as possible to the photo. Buat kostumnya sangat detail."
    },
    {
        id: 1,
        url: "/generated/jjk_gojo.png",
        prompt: "Nana anime art style. A cool powerful jujutsu sorcerer with white spiky hair and a black blindfold, floating in the air, glowing purple and red cursed energy surrounding him. Dark urban street background, highly detailed 2D animation style, masterpiece."
    },
    {
        id: 2,
        url: "/generated/matrix_neo.png",
        prompt: "Cinematic movie still, Nana anime aesthetic. A pale hacker with dark sunglasses and a long black trenchcoat bending backward to dodge glowing green digital data bullets in slow motion. Dark sci-fi atmosphere, green tint, dramatic lighting."
    },
    {
        id: 3,
        url: "/generated/jjk_diverse.png",
        prompt: "Nana anime art style. A badass Black female jujutsu sorcerer with dreadlocks, wearing a dark navy tokyo high school uniform, glowing bright blue cursed energy wrapping around her fists. Dynamic combat action pose, highly detailed 2D animation style, masterpiece."
    },
    {
        id: 4,
        url: "/generated/ghost_tsushima.png",
        prompt: "Cinematic samurai action game, Nana anime style. A badass Afro-Samurai wearing traditional worn ronin armor and a straw hat, drawing a katana in a field of glowing red spider lilies under a giant full moon. Dramatic shadows, historical fantasy graphic novel style."
    },
    {
        id: 5,
        url: "/generated/resident_evil.png",
        prompt: "Photorealistic survival horror video game concept art, Resident Evil style. A brave Black female survivor exploring a dark, creepy abandoned mansion, holding a flashlight. Unreal Engine 5 render, volumetric fog, eerie atmosphere, ray tracing, 8k."
    },
    {
        id: 6,
        url: "/generated/demon_slayer.png",
        prompt: "Highly detailed anime illustration, Demon Slayer style. A young Afro-Latino swordsman wearing a bold patterned haori, wielding a glowing katana with water breathing effects. Dynamic combat pose, dark forest, cinematic lighting, masterpiece."
    },
    {
        id: 7,
        url: "/generated/cyberpunk.png",
        prompt: "Photorealistic cyberpunk city street at night, Cyberpunk 2077 style. A diverse Asian female mercenary with subtle cybernetic facial enhancements, wearing a glowing jacket, standing in neon rain. Reflective wet pavement, Unreal Engine 5, 8k."
    },
    {
        id: 8,
        url: "/generated/ghibli_fantasy.png",
        prompt: "Beautiful Studio Ghibli style anime background. A young Indian girl in travel clothes with a glowing staff, exploring a magical lush green forest filled with glowing spirits. Serene atmosphere, watercolor painting style, vibrant, masterpiece."
    }
];

function GenerateContent() {
    const searchParams = useSearchParams();
    const initialPrompt = searchParams.get("prompt") || "";

    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Estado da imagem 2 (Estilo/Personagem)
    const [isDraggingStyle, setIsDraggingStyle] = useState(false);
    const [styleFile, setStyleFile] = useState<File | null>(null);
    const [stylePreview, setStylePreview] = useState<string | null>(null);
    const styleFileInputRef = useRef<HTMLInputElement>(null);

    const [prompt, setPrompt] = useState(initialPrompt);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [balance, setBalance] = useState<number | null>(null);

    useEffect(() => {
        const fetchBalance = async () => {
            const data = await getUserBalance();
            setBalance(data.balance);
        };
        fetchBalance();
    }, []);

    const enhancePrompt = async () => {
        if (!prompt) return;
        setIsEnhancing(true);
        try {
            const res = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, action: 'enhance_prompt' })
            });
            const data = await res.json();
            if (data.text) {
                setPrompt(data.text);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsEnhancing(false);
        }
    };

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

    const handleStyleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingStyle(true);
    };

    const handleStyleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingStyle(false);
    };

    const handleStyleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingStyle(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleStyleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (selectedFile: File) => {
        if (!selectedFile.type.startsWith("image/")) return;
        setFile(selectedFile);
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
        setGeneratedImage(null);
    };

    const handleStyleFileSelect = (selectedFile: File) => {
        if (!selectedFile.type.startsWith("image/")) return;
        setStyleFile(selectedFile);
        const objectUrl = URL.createObjectURL(selectedFile);
        setStylePreview(objectUrl);
        setGeneratedImage(null);
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
    };

    const handleRemoveStyleFile = () => {
        setStyleFile(null);
        if (stylePreview) URL.revokeObjectURL(stylePreview);
        setStylePreview(null);
    };

    const handleGenerate = async () => {
        if (!prompt || !file) return;
        setIsGenerating(true);

        try {
            const formData = new FormData();
            formData.append("prompt", prompt);
            if (styleFile) formData.append("style", styleFile.name); // Using name as a placeholder for now as per previous implementation logic

            const result = await generateImage(formData);

            if (result.success) {
                // Fetch real balance after generation
                const b = await getUserBalance();
                setBalance(b.balance);

                // For now, use a placeholder or simulated result if generateImage doesn't return the URL yet (it currently returns generationId)
                // The current generateImage implementation marks it as COMPLETED with a placeholder URL
                setGeneratedImage("/generated/elden_ring_real.png");
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
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
                            Créditos restantes: <span className="text-white font-bold">{balance !== null ? balance : "..."}</span>
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
                        {(!file || !styleFile) && !isGenerating && !generatedImage ? (
                            <motion.div
                                key="dropzones"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                {/* Dropzone 1: Imagem Base (Obrigatória) */}
                                {!file ? (
                                    <div
                                        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors duration-300 ease-in-out cursor-pointer h-full flex flex-col justify-center ${isDragging ? "border-[var(--brand)] bg-[var(--brand)]/5" : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
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
                                                <h3 className="font-semibold text-lg text-white">Sua Foto (Base)</h3>
                                                <p className="text-sm text-white/50">
                                                    Obrigatória. PNG/JPG (Max. 10MB)
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-black border border-white/5 group">
                                        <Image
                                            src={preview!}
                                            alt="Base Image"
                                            fill
                                            className="object-contain"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={handleRemoveFile}
                                                className="bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 backdrop-blur-sm transition-colors"
                                            >
                                                <X className="w-4 h-4" /> Trocar Base
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Dropzone 2: Imagem de Estilo (Opcional) */}
                                {!styleFile ? (
                                    <div
                                        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors duration-300 ease-in-out cursor-pointer h-full flex flex-col justify-center ${isDraggingStyle ? "border-purple-500 bg-purple-500/5" : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                                            }`}
                                        onDragOver={handleStyleDragOver}
                                        onDragLeave={handleStyleDragLeave}
                                        onDrop={handleStyleDrop}
                                        onClick={() => styleFileInputRef.current?.click()}
                                    >
                                        <input
                                            type="file"
                                            ref={styleFileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => e.target.files && handleStyleFileSelect(e.target.files[0])}
                                        />
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className={`p-4 rounded-full ${isDraggingStyle ? "bg-purple-500 text-white" : "bg-white/5 text-white/40"} transition-colors`}>
                                                <ImageIcon className="w-8 h-8" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-semibold text-lg text-white">Estilo / Personagem</h3>
                                                <p className="text-sm text-white/50">
                                                    Opcional para guiar a IA melhor.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-black border border-white/5 group">
                                        <Image
                                            src={stylePreview!}
                                            alt="Style Image"
                                            fill
                                            className="object-contain"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={handleRemoveStyleFile}
                                                className="bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 backdrop-blur-sm transition-colors"
                                            >
                                                <X className="w-4 h-4" /> Trocar Estilo
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ) : null}
                    </AnimatePresence>

                    {/* Resultado / Geração (Oculta os dropzones quando gerando/gerado) */}
                    <AnimatePresence>
                        {(isGenerating || generatedImage) && (
                            <motion.div
                                key="editor"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8 relative z-10"
                            >
                                {/* Grid: Base & Estilo (Pequenos) x Resultado (Grande) */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Imagens Originais (Inputs) */}
                                    <div className="space-y-4 lg:col-span-1">
                                        <h3 className="font-medium text-sm flex items-center gap-2 text-white/80">
                                            <ImageIcon className="w-4 h-4 text-white/40" />
                                            Suas Imagens
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-black border border-white/5">
                                                {preview && (
                                                    <Image
                                                        src={preview}
                                                        alt="Base preview"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                                <div className="absolute bottom-2 inset-x-0 text-center text-[10px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md py-1">
                                                    Base
                                                </div>
                                            </div>
                                            {stylePreview ? (
                                                <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-black border border-white/5">
                                                    <Image
                                                        src={stylePreview}
                                                        alt="Style preview"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <div className="absolute bottom-2 inset-x-0 text-center text-[10px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md py-1 text-purple-300">
                                                        Estilo
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-black/50 border border-dashed border-white/10 flex items-center justify-center opacity-50">
                                                    <span className="text-[10px] font-bold uppercase text-white/40 text-center px-2">Sem Estilo</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Imagem Gerada ou Placeholder */}
                                    <div className="space-y-4 lg:col-span-2">
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
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form do Prompt e Inspirações - Agora sempre visível */}
                    <div className="space-y-6 mt-8 relative z-10">
                        <div className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="prompt" className="text-sm font-medium text-white/90">
                                        O que você deseja gerar? (Prompt)
                                    </label>
                                    <button
                                        onClick={enhancePrompt}
                                        disabled={isEnhancing || isGenerating || !prompt}
                                        className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed border border-white/5"
                                        title="Usa a IA Gemini para melhorar e detalhar seu prompt"
                                    >
                                        {isEnhancing ? (
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Sparkles className="w-3 h-3 text-[var(--brand)]" />
                                        )}
                                        {isEnhancing ? "Magia da Nana..." : "Melhorar com a Nana (IA)"}
                                    </button>
                                </div>
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
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !prompt || !file || (balance !== null && balance <= 0)}
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
                                        sizes="(max-width: 768px) 50vw, 25vw"
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
