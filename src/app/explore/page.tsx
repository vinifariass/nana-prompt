"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Lock, ArrowLeft, Search, Copy, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserBalance } from "@/server/actions/user";

const EXPLORE_IMAGES = [
    {
        id: 21,
        url: "/generated/elden_ring_real.png",
        prompt: "Buat saya memakai the heavy, battle-worn armor of a Tarnished Knight from Elden Ring. Buatkan pose khas nya holding a massive, intricately textured greatsword. Characterized by stark cinematic lighting and intense contrast, featuring volumetric fog and an ethereal atmosphere. Captured with a slightly low, upward-facing angle that dramatizes the subject's posture. The background is a glowing, gloomy mystical landscape dominated by the massive golden Erdtree in the distance, creating a bold visual clash between the dark fantasy foreground and the holy light. Lighting is tightly directional, casting warm golden highlights on the brushed steel armor while plunging the other side into velvety pitch shadow. The subject's expression is resolute and unreadable, suggesting quiet defiance. Minimal retouching preserves sweat, dirt, and skin imperfections for hyper-realism. Make the face and hairstyle as similar as possible to the photo. Buat kostumnya sangat detail dan realistis dengan tekstur AAA game graphics.",
        category: "Elden Ring"
    },
    {
        id: 22,
        url: "/generated/jjk_real.png",
        prompt: "Buat saya memakai the sleek, dark navy Tokyo Jujutsu High uniform from Jujutsu Kaisen. Buatkan pose khas nya charging powerful cursed energy. Characterized by high-octane cinematic lighting and intense neon contrast. Captured with a dynamic Dutch angle that dramatizes the subject's face. The background is a ruined, post-apocalyptic Tokyo street at night, creating a bold visual clash with the glowing bright blue cursed energy wrapping around the fists. Lighting is tightly directional, casting erratic, vibrant cyan highlights on one side of the face while plunging the other into shadow, emphasizing bone structure with architectural precision. The subject's expression is fierce yet focused. The uniform fabric is richly defined. Minimal retouching preserves skin texture and subtle grit. Make the face and hairstyle as similar as possible to the photo. Buat kostumnya sangat detail dan realistis.",
        category: "Jujutsu Kaisen"
    },
    {
        id: 23,
        url: "/generated/hells_paradise_real.png",
        prompt: "Buat saya memakai traditional yet highly tactical kunoichi shinobi garb from Hell's Paradise, including delicate but lethal twin curved blades. Buatkan pose khas nya characterized by stark cinematic lighting and lush environmental contrast. Captured with a dynamic framing that dramatizes the intense gaze. The composition evokes serene lethality. The background is a mysterious island overgrown with exotic blooming lotus flowers in surreal magenta and turquoise hues, creating a bold visual clash with the model's dark stealth wardrobe. Lighting is soft, dappled, and tightly directional, piercing through a thick canopy to cast warm golden highlights on the skin and metallic blades. The subject's expression is unreadable and cool-toned. Minimal retouching preserves skin texture. Make the face and hairstyle as similar as possible to the photo. Buat kostumnya sangat detail.",
        category: "Hell's Paradise"
    },
    {
        id: 24,
        url: "/generated/re_requiem_real.png",
        prompt: "Buat saya memakai rugged, dirt-covered survival gear suitable for a survival horror protagonist, inspired by Resident Evil. Buatkan pose khas nya holding a detailed tactical shotgun, characterized by stark cinematic lighting. Captured with a tight, claustrophobic close-up angle that dramatizes the subject's jawline and tense shoulders. The background is a pitched-black, gothic castle hallway filled with ominous volumetric fog. Lighting is strictly from a single, harsh flashlight source, casting stark, blinding highlights on one side of the face while plunging the rest into velvety shadow, emphasizing bone structure. The subject's expression is intense, sweat-beaded forehead, jaw clenched, suggesting extreme hyper-vigilance. The rugged clothing is richly defined with grime. Minimal retouching preserves skin texture and extreme imperfections. Make the face and hairstyle as similar as possible. Buat pencahayaan dan tekstur sangat realistis layaknya game next-gen.",
        category: "Survival Horror"
    },
    {
        id: 25,
        url: "/generated/crimson_desert_real.png",
        prompt: "Buat saya memakai heavily weathered leather armor and thick animal fur mantles from Crimson Desert. Buatkan pose khas nya sitting victorious on a muddy medieval battlefield. Characterized by stark cinematic lighting and intense, gritty contrast. Captured with a low, upward-facing angle that dramatizes the heroic presence. The background is a brutal, fog-drenched fantasy battlefield under an overcast sky, creating a bold visual clash with the rich earthy tones of the armor. Lighting is tightly directional from a breaking sun, casting warm golden god-rays on one side of the face. The subject's expression is battle-weary yet unbroken. The leather and fur textures are richly defined against the skin's sweat. Minimal retouching preserves scars and skin texture. Make the face and hairstyle as similar as possible to the photo. Buat kostumnya sangat detail dengan kualitas AAA gaming.",
        category: "Crimson Desert"
    },
    {
        id: 1,
        url: "/generated/jjk_gojo.png",
        prompt: "Nana anime art style. A cool powerful jujutsu sorcerer with white spiky hair and a black blindfold, floating in the air, glowing purple and red cursed energy surrounding him. Dark urban street background, highly detailed 2D animation style, masterpiece.",
        category: "Jujutsu Kaisen"
    },
    {
        id: 2,
        url: "/generated/matrix_neo.png",
        prompt: "Cinematic movie still, Nana anime aesthetic. A pale hacker with dark sunglasses and a long black trenchcoat bending backward to dodge glowing green digital data bullets in slow motion. Dark sci-fi atmosphere, green tint, dramatic lighting.",
        category: "The Matrix"
    },
    {
        id: 3,
        url: "/generated/elden_ring.png",
        prompt: "Dark fantasy RPG concept art, Nana anime style. A pale tarnished knight with silver hair wearing intricate worn medieval armor, holding a glowing golden sword, facing a massive glowing magical tree in the distance. Epic scale, atmospheric.",
        category: "Elden Ring"
    },
    {
        id: 4,
        url: "/generated/jjk_diverse.png",
        prompt: "Nana anime art style. A badass Black female jujutsu sorcerer with dreadlocks, wearing a dark navy tokyo high school uniform, glowing bright blue cursed energy wrapping around her fists. Dynamic combat action pose, highly detailed 2D animation style, masterpiece.",
        category: "Jujutsu Kaisen"
    },
    {
        id: 5,
        url: "/generated/dune_diverse.png",
        prompt: "Cinematic sci-fi movie still, Nana anime aesthetic. A young South Asian warrior standing in a vast orange desert, wearing a highly detailed futuristic survival stillsuit, blue eyes glowing slightly, golden spice dust floating in the air. Epic lighting.",
        category: "Dune"
    },
    {
        id: 6,
        url: "/generated/ghost_tsushima.png",
        prompt: "Cinematic samurai action game, Nana anime style. A badass Afro-Samurai wearing traditional worn ronin armor and a straw hat, drawing a katana in a field of glowing red spider lilies under a giant full moon. Dramatic shadows, historical fantasy graphic novel style.",
        category: "Ghost of Tsushima"
    },
    {
        id: 7,
        url: "/generated/resident_evil.png",
        prompt: "Photorealistic survival horror video game concept art, Resident Evil style. A brave Black female survivor exploring a dark, creepy abandoned mansion, holding a flashlight. Unreal Engine 5 render, volumetric fog, eerie atmosphere, ray tracing, 8k.",
        category: "Survival Horror"
    },
    {
        id: 8,
        url: "/generated/demon_slayer.png",
        prompt: "Highly detailed anime illustration, Demon Slayer style. A young Afro-Latino swordsman wearing a bold patterned haori, wielding a glowing katana with water breathing effects. Dynamic combat pose, dark forest, cinematic lighting, masterpiece.",
        category: "Anime Combat"
    },
    {
        id: 9,
        url: "/generated/cyberpunk.png",
        prompt: "Photorealistic cyberpunk city street at night, Cyberpunk 2077 style. A diverse Asian female mercenary with subtle cybernetic facial enhancements, wearing a glowing jacket, standing in neon rain. Reflective wet pavement, Unreal Engine 5, 8k.",
        category: "Cyberpunk"
    },
    {
        id: 10,
        url: "/generated/ghibli_fantasy.png",
        prompt: "Beautiful Studio Ghibli style anime background. A young Indian girl in travel clothes with a glowing staff, exploring a magical lush green forest filled with glowing spirits. Serene atmosphere, watercolor painting style, vibrant, masterpiece.",
        category: "Studio Ghibli"
    },
    {
        id: 11,
        url: "/generated/final_fantasy.png",
        prompt: "Epic high fantasy RPG concept art, Final Fantasy style. A majestic Black male paladin in ornate glowing silver armor, holding a magical greatsword, standing on a cliff overlooking a futuristic fantasy city. Photorealistic, 8k.",
        category: "Fantasy RPG"
    },
    {
        id: 12,
        url: "/generated/valorant_style.png",
        prompt: "Stylized 3D digital art, Valorant game style. A cool Latina agent with vibrant pink and purple hair, wearing tactical streetwear, wielding a futuristic glowing pistol. Dynamic action pose, vibrant colors, esports aesthetic, 8k.",
        category: "Tactical Shooter"
    },
];

export default function ExplorePage() {
    const [userPlan, setUserPlan] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlan = async () => {
            const data = await getUserBalance();
            setUserPlan(data.plan);
            setIsLoading(false);
        };
        fetchPlan();
    }, []);

    const hasPremium = userPlan !== "FREE" && userPlan !== null;

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
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
