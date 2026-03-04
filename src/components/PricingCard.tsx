"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: "Free",
        priceMensal: "R$ 0",
        priceAnual: "R$ 0",
        period: "mês",
        periodAnual: "ano",
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
        priceMensal: "R$ 29",
        priceAnual: "R$ 278",
        period: "mês",
        periodAnual: "ano",
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
    },
    {
        name: "Pro",
        priceMensal: "R$ 69",
        priceAnual: "R$ 662",
        period: "mês",
        periodAnual: "ano",
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
    },
];

export default function PricingCard() {
    const [billingPeriod, setBillingPeriod] = useState<"mensal" | "anual">("mensal");

    return (
        <section id="pricing" className="py-20 bg-[#000000]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Planos sob medida
                    </h2>
                    <p className="text-lg text-white/50 max-w-2xl mx-auto mb-8">
                        Comece grátis hoje mesmo, com a opção de mudar de plano ou cancelar a qualquer momento.
                    </p>

                    {/* Morphic Styled Toggle */}
                    <div className="flex items-center justify-center gap-3 text-sm font-medium">
                        <span className={cn("transition-colors", billingPeriod === "mensal" ? "text-white/50" : "text-white/50")}>
                            Mensal
                        </span>
                        <button
                            onClick={() => setBillingPeriod(billingPeriod === "mensal" ? "anual" : "mensal")}
                            className="relative inline-flex h-6 w-11 items-center rounded-full bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
                        >
                            <span className="sr-only">Toggle billing period</span>
                            <span
                                className={cn(
                                    "inline-block h-4 w-4 transform rounded-full bg-black transition-transform",
                                    billingPeriod === "anual" ? "translate-x-6" : "translate-x-1"
                                )}
                            />
                        </button>
                        <span className={cn("transition-colors", billingPeriod === "anual" ? "text-white" : "text-white")}>
                            Anual
                        </span>
                    </div>
                </div>

                {/* morphic container */}
                <div className="text-white/50 text-sm mb-4">Ideal para criadores e empresas</div>
                <div className="grid grid-cols-1 md:grid-cols-3 rounded-2xl md:rounded-[24px] bg-[#0d0d0d] border border-white/10 overflow-hidden">
                    {plans.map((plan, index) => (
                        <div
                            key={plan.name}
                            className={cn(
                                "p-8 relative flex flex-col",
                                index !== plans.length - 1 && "border-b md:border-b-0 md:border-r border-white/10"
                            )}
                        >
                            <h3 className="text-base font-semibold text-white mb-4">{plan.name}</h3>

                            <div className="mb-2 flex items-baseline text-white">
                                <span className="text-4xl font-bold tracking-tight flex items-baseline overflow-hidden">
                                    <span className="mr-1">R$</span>
                                    <AnimatePresence mode="popLayout" initial={false}>
                                        <motion.span
                                            key={billingPeriod === "mensal" ? plan.priceMensal : plan.priceAnual}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -20, opacity: 0 }}
                                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                                            className="inline-block"
                                        >
                                            {billingPeriod === "mensal"
                                                ? plan.priceMensal.replace("R$ ", "")
                                                : plan.priceAnual.replace("R$ ", "")}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                                {plan.priceMensal !== "R$ 0" && (
                                    <span className="ml-1 text-sm font-medium text-white/40">
                                        /{billingPeriod === "mensal" ? plan.period : plan.periodAnual}
                                    </span>
                                )}
                                {plan.priceMensal === "R$ 0" && (
                                    <span className="ml-1 text-sm font-medium text-white/40">/ para sempre</span>
                                )}
                            </div>

                            {plan.priceMensal !== "R$ 0" && (
                                <div className="text-sm text-white/40 mb-8 min-h-[20px]">
                                    cobrado como {plan.priceAnual} por {plan.periodAnual}
                                </div>
                            )}
                            {plan.priceMensal === "R$ 0" && (
                                <div className="text-sm text-white/40 mb-8 min-h-[20px]"></div>
                            )}

                            <Link
                                href="/login"
                                className={cn(
                                    "w-full flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors mb-8",
                                    plan.popular
                                        ? "bg-brand text-[#0a0a0f] hover:bg-brand/90"
                                        : "bg-white/5 text-white hover:bg-white/10"
                                )}
                            >
                                {plan.cta}
                            </Link>

                            <ul className="space-y-4 text-sm text-white/80 mt-auto">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <Check className="h-4 w-4 text-white" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
