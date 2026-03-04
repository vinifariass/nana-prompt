import {
    Camera,
    Check,
    Sparkles,
    Zap,
    Shield,
    Star,
    ArrowRight,
    Clock,
    Lock,
    TrendingUp,
    Users,
    Image as ImageIcon,
    CreditCard,
    Banknote,
    LucideIcon
} from "lucide-react";

/* ───────── TYPES ───────── */

export interface Plan {
    name: string;
    price: number;
    period: string;
    credits: string;
    description: string;
    detailedDesc: string;
    features: string[];
    cta: string;
    popular: boolean;
    badge?: string;
}

export interface Style {
    name: string;
    description: string;
    samples: number;
    image: string;
}

export interface Testimonial {
    name: string;
    role: string;
    content: string;
    rating: number;
    generated: number;
    avatar: string;
}

export interface Stat {
    value: string;
    label: string;
}

export interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
    iconBg: string;
    iconColor: string;
}

export interface Step {
    step: string;
    title: string;
    description: string;
}

/* ───────── DATA ───────── */

export const plans: Plan[] = [
    {
        name: "Free",
        price: 0,
        period: "mês",
        credits: "10 fotos HD",
        description: "Ideal para testar sem compromisso",
        detailedDesc: "Comece gratuitamente e explore os recursos básicos da plataforma.",
        features: [
            "10 fotos HD por mês",
            "Marca d'água",
            "3 estilos básicos",
            "Qualidade 1080p",
        ],
        cta: "Começar Grátis",
        popular: false,
    },
    {
        name: "Creator",
        price: 29.9,
        period: "mês",
        credits: "100 fotos HD",
        description: "Perfeito para Instagram e TikTok",
        detailedDesc: "Ideal para quem produz conteúdo e precisa de fotos profissionais regularmente.",
        features: [
            "100 fotos HD por mês",
            "Sem marca d'água",
            "10 estilos disponíveis",
            "Qualidade 1080p",
            "Suporte por email",
        ],
        cta: "Começar Agora",
        popular: false,
        badge: "Mais Vendido",
    },
    {
        name: "Pro",
        price: 69.9,
        period: "mês",
        credits: "200 fotos 4K",
        description: "Ideal para LinkedIn e portfólio",
        detailedDesc: "Todos os recursos para profissionais que exigem qualidade máxima.",
        features: [
            "200 fotos 4K por mês",
            "Todos os estilos",
            "Qualidade 4K",
            "Suporte prioritário",
            "Acesso antecipado",
            "API básica",
        ],
        cta: "Começar Pro",
        popular: true,
        badge: "Mais Popular",
    },
    {
        name: "Premium",
        price: 149.9,
        period: "mês",
        credits: "500 fotos 4K",
        description: "Solução completa para empresas",
        detailedDesc: "Solução completa para empresas com necessidades personalizadas.",
        features: [
            "500 fotos 4K por mês",
            "Modelo personalizado",
            "API completa",
            "White-label",
            "Account manager",
            "Suporte 24/7",
        ],
        cta: "Falar com Vendas",
        popular: false,
    },
];

export const styles: Style[] = [
    {
        name: "Corporativo",
        description: "Fotos profissionais para LinkedIn e currículos",
        samples: 1234,
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop"
    },
    {
        name: "Fashion",
        description: "Ensaios de moda e editorial",
        samples: 892,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop"
    },
    {
        name: "Casual",
        description: "Fotos naturais para redes sociais",
        samples: 2103,
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop"
    },
    {
        name: "Artístico",
        description: "Fotos criativas e únicas",
        samples: 756,
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
    },
];

export const testimonials: Testimonial[] = [
    {
        name: "Ana Silva",
        role: "Designer Gráfica",
        content: "Incrível! Consegui fotos profissionais para meu portfólio sem gastar com fotógrafo. A qualidade é surpreendente!",
        rating: 5,
        generated: 47,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
    },
    {
        name: "Carlos Mendes",
        role: "Empresário",
        content: "Precisava atualizar minha foto do LinkedIn urgentemente. Em 5 minutos tinha 20 opções profissionais para escolher.",
        rating: 5,
        generated: 23,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
    },
    {
        name: "Juliana Costa",
        role: "Influenciadora",
        content: "Uso para criar conteúdo para Instagram. Economizo tempo e dinheiro, e o resultado é sempre impecável!",
        rating: 5,
        generated: 156,
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"
    },
];

export const stats: Stat[] = [
    { value: "50K+", label: "Fotos Geradas" },
    { value: "10K+", label: "Criadores Ativos" },
    { value: "4.9/5", label: "Avaliação Média" },
    { value: "98%", label: "Satisfação" },
];

export const features: Feature[] = [
    { icon: Camera, title: "Qualidade 4K", description: "Fotos em altíssima resolução, prontas para impressão ou redes sociais", iconBg: "rgba(202,138,4,0.12)", iconColor: "#EAB308" },
    { icon: Clock, title: "Resultado em 2min", description: "Da escolha do estilo até o download, tudo em menos de 2 minutos", iconBg: "rgba(255,255,255,0.06)", iconColor: "#ffffff" },
    { icon: Lock, title: "100% Seguro", description: "Seus dados e fotos protegidos com criptografia de ponta", iconBg: "rgba(34,197,94,0.12)", iconColor: "#4ADE80" },
    { icon: TrendingUp, title: "15+ Estilos", description: "Do corporativo ao artístico, escolha o estilo perfeito para você", iconBg: "rgba(202,138,4,0.08)", iconColor: "#CA8A04" },
];

export const steps: Step[] = [
    { step: "1", title: "Escolha o Estilo", description: "Selecione entre 15+ estilos profissionais de fotografia" },
    { step: "2", title: "Faça Upload", description: "Envie suas fotos comuns (selfie, foto de documento, etc)" },
    { step: "3", title: "IA Processa", description: "Nossa IA transforma em fotos profissionais em 2 minutos" },
    { step: "4", title: "Download 4K", description: "Baixe suas fotos em alta qualidade e use onde quiser" },
];
