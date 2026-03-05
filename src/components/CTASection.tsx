"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
    return (
        <section style={{ position: "relative", overflow: "hidden" }} className="section-padding">
            <div style={{
                position: "absolute", inset: 0,
                background: "var(--brand)",
                opacity: 0.95,
            }} />

            <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", textAlign: "center" }}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <h2 className="heading-cta" style={{ marginBottom: "1.5rem", color: "#0a0a0f" }}>
                        Pronto para Se Ver Diferente?
                    </h2>
                    <p style={{ fontSize: "1.25rem", color: "rgba(10,10,15,0.75)", marginBottom: "2rem", lineHeight: 1.6 }}>
                        Milhares já transformaram suas fotos. Sua vez de brilhar!
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                        <Link href="/login" style={{
                            display: "inline-flex", alignItems: "center", gap: "0.5rem",
                            padding: "1rem 2.5rem", borderRadius: 12,
                            fontWeight: 700, fontSize: "1.0625rem",
                            color: "var(--brand)", background: "#0a0a0f",
                            textDecoration: "none", transition: "all 0.25s ease",
                        }}>
                            Começar Grátis Agora <ArrowRight style={{ width: 20, height: 20 }} />
                        </Link>
                        <Link href="#pricing" style={{
                            display: "inline-flex", alignItems: "center", gap: "0.5rem",
                            padding: "1rem 2.5rem", borderRadius: 12,
                            fontWeight: 600, fontSize: "1.0625rem",
                            color: "#0a0a0f", background: "transparent",
                            border: "1px solid rgba(10,10,15,0.3)",
                            textDecoration: "none", transition: "all 0.25s ease",
                        }}>
                            Ver Preços
                        </Link>
                    </div>
                    <p style={{ fontSize: "0.875rem", color: "rgba(10,10,15,0.6)" }}>
                        ✓ Sem cartão de crédito ✓ 10 fotos grátis ✓ Cancele quando quiser
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
