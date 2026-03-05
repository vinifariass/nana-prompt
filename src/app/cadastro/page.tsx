"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Sparkles, ArrowRight, Camera, Check, ChevronLeft } from "lucide-react";

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState("free");

    const plans = [
        { id: "free", name: "Free", price: "R$ 0", features: ["10 fotos HD", "Marca d'água"] },
        { id: "creator", name: "Creator", price: "R$ 29,90", features: ["100 fotos HD", "Sem marca", "Mais popular"] },
        { id: "pro", name: "Pro", price: "R$ 69,90", features: ["200 fotos 4K", "Suporte prioritário"] },
    ];

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Side - Visual presentation */}
            <div className="hidden lg:flex flex-1 relative bg-muted overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background z-10" />

                {/* Decorative background elements */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px] z-0" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] z-0" />

                <div className="relative z-20 flex flex-col justify-between p-12 w-full h-full">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-primary text-primary-foreground p-2 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-primary/25">
                            <Camera className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">FotoPro AI</span>
                    </Link>

                    <div className="space-y-6 max-w-lg">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight"
                        >
                            Crie sua identidade visual fotográfica hoje mesmo.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-muted-foreground"
                        >
                            Junte-se a mais de 10.000 criadores gerando fotografias com qualidade de estúdio através de Inteligência Artificial avançada.
                        </motion.p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex -space-x-3">
                            <div className="w-8 h-8 rounded-full border-2 border-background bg-zinc-200" />
                            <div className="w-8 h-8 rounded-full border-2 border-background bg-zinc-300" />
                            <div className="w-8 h-8 rounded-full border-2 border-background bg-zinc-400" />
                        </div>
                        <span>Aprovado por líderes de mercado.</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Forms */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative">
                {/* Mobile Back Button */}
                <div className="absolute top-6 left-6 lg:hidden">
                    <Link href="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Voltar
                    </Link>
                </div>

                <div className="w-full max-w-sm">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2 text-center lg:text-left">
                                    <h2 className="text-3xl font-bold tracking-tight">Criar Conta</h2>
                                    <p className="text-muted-foreground">Preencha seus dados para iniciar.</p>
                                </div>

                                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                            <label className="text-sm font-medium text-foreground">
                                                Nome Completo
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                className="input-field"
                                            />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                            <label className="text-sm font-medium text-foreground">
                                                E-mail
                                            </label>
                                            <input
                                                required
                                                type="email"
                                                className="input-field"
                                            />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                            <label className="text-sm font-medium text-foreground">
                                                Senha
                                            </label>
                                            <input
                                                required
                                                type="password"
                                                className="input-field"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn-dark"
                                        style={{ padding: "0.875rem", marginTop: "1rem" }}
                                    >
                                        Continuar <ArrowRight className="w-4 h-4 ml-1" />
                                    </button>
                                </form>
                                <p className="text-center text-sm text-muted-foreground">
                                    Já tem uma conta? <Link href="/login" className="text-primary hover:underline font-medium">Entrar</Link>
                                </p>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="text-sm text-muted-foreground hover:text-foreground flex items-center mb-4 transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
                                    </button>
                                    <h2 className="text-3xl font-bold tracking-tight">Escolha seu plano</h2>
                                    <p className="text-muted-foreground">Selecione o pacote perfeito para você.</p>
                                </div>

                                <div className="space-y-4">
                                    {plans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            onClick={() => setSelectedPlan(plan.id)}
                                            className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 
                                                ${selectedPlan === plan.id ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-border hover:border-primary/30'}
                                            `}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-semibold">{plan.name}</h3>
                                                    <p className="text-sm text-muted-foreground flex gap-2 items-center mt-1">
                                                        {plan.features[0]} • {plan.features[1]}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-bold text-lg">{plan.price}</span>
                                                    <span className="text-xs text-muted-foreground block">/mês</span>
                                                </div>
                                            </div>

                                            {/* Selection indicator visually integrated seamlessly */}
                                            <div className={`absolute top-5 right-5 w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                                                ${selectedPlan === plan.id ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}
                                            `}>
                                                {selectedPlan === plan.id && <Check className="w-3 h-3" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/admin"
                                    className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 px-8 transition-colors"
                                >
                                    <Sparkles className="w-4 h-4" /> Finalizar Cadastro
                                </Link>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
