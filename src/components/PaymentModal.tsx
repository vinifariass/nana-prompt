"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CreditCard, QrCode, Copy, Check, Lock, ChevronRight } from "lucide-react";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    planName?: string;
    price?: string;
}

export function PaymentModal({ isOpen, onClose, planName = "Pro", price = "R$ 69,90" }: PaymentModalProps) {
    const [method, setMethod] = useState<"credit" | "pix">("credit");
    const [copied, setCopied] = useState(false);

    const handleCopyPix = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] max-w-md bg-[#12121a] border border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-white/5 relative bg-white/[0.02]">
                            <div>
                                <h3 className="text-lg font-bold text-white">Finalizar Assinatura</h3>
                                <p className="text-sm text-white/50">Plano {planName} • <span className="text-[var(--brand)] font-semibold">{price}</span>/mês</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Method Selector */}
                            <div className="flex bg-black/50 p-1 rounded-xl border border-white/5 mb-6">
                                <button
                                    onClick={() => setMethod("credit")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${method === "credit" ? "bg-white/10 text-white shadow-sm" : "text-white/50 hover:text-white"
                                        }`}
                                >
                                    <CreditCard className="w-4 h-4" /> Cartão
                                </button>
                                <button
                                    onClick={() => setMethod("pix")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${method === "pix" ? "bg-white/10 text-white shadow-sm" : "text-white/50 hover:text-white"
                                        }`}
                                >
                                    <QrCode className="w-4 h-4" /> PIX
                                </button>
                            </div>

                            {/* Content */}
                            <div className="min-h-[280px]">
                                {method === "credit" ? (
                                    <motion.div
                                        key="credit"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-3">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="0000 0000 0000 0000"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none transition-all"
                                                />
                                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                            </div>

                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="MM/AA"
                                                    className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[var(--brand)] outline-none transition-all"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="CVC"
                                                    className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[var(--brand)] outline-none transition-all"
                                                />
                                            </div>

                                            <input
                                                type="text"
                                                placeholder="Nome como está no cartão"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[var(--brand)] outline-none transition-all"
                                            />
                                        </div>

                                        <button className="w-full bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-black py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(var(--brand-rgb),0.3)] mt-6">
                                            <span>Pagar {price}</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                        <div className="flex items-center justify-center gap-1.5 text-xs text-white/40 mt-3 font-medium">
                                            <Lock className="w-3 h-3" /> Pagamento seguro via Stripe
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="pix"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex flex-col items-center justify-center pt-2"
                                    >
                                        <div className="bg-white p-2 rounded-xl mb-4">
                                            <img
                                                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=example_pix_code_000000"
                                                alt="QR Code PIX"
                                                className="w-[150px] h-[150px] rounded-lg opacity-90"
                                            />
                                        </div>
                                        <p className="text-sm text-white/60 mb-6 text-center">
                                            Escaneie o QR Code com o app do seu banco para finalizar o pagamento.
                                        </p>

                                        <button
                                            onClick={handleCopyPix}
                                            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all hover:border-white/20"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="w-4 h-4 text-green-400" /> <span className="text-green-400">Código Copiado!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" /> Copiar Código PIX
                                                </>
                                            )}
                                        </button>
                                        <div className="flex items-center justify-center gap-1.5 text-xs text-[#22c55e]/60 mt-4 font-medium px-4 py-2 bg-[#22c55e]/10 rounded-lg">
                                            <Check className="w-3.5 h-3.5" /> Aprovação imediata
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
