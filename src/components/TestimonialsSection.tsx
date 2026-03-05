"use client";

import { motion } from "motion/react";
import { Star } from "lucide-react";
import { testimonials } from "../data/content";

export function TestimonialsSection() {
    return (
        <section className="section-padding">
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                    <h2 className="heading-section" style={{ marginBottom: "1rem" }}>
                        O que Dizem Nossos <span className="gradient-text">Usuários</span>
                    </h2>
                    <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)" }}>
                        Milhares já transformaram suas fotos
                    </p>
                </div>

                <div className="grid-3">
                    {testimonials.map((t, index) => (
                        <motion.div key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="glass-card" style={{ borderRadius: 20, padding: "2rem", height: "100%" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                                    <div style={{
                                        width: 56, height: 56, borderRadius: "50%",
                                        background: "var(--brand-bg)",
                                        border: "1px solid var(--brand-border)",
                                        backgroundImage: `url('${t.avatar}')`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }} />
                                    <div>
                                        <h4 style={{ fontWeight: 700, fontSize: "1.0625rem" }}>{t.name}</h4>
                                        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{t.role}</p>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: 2, marginBottom: "1rem" }}>
                                    {[...Array(t.rating)].map((_, i) => (
                                        <Star key={i} style={{ width: 18, height: 18, fill: "var(--brand)", color: "var(--brand)" }} />
                                    ))}
                                </div>

                                <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "1rem" }}>{t.content}</p>
                                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>✨ {t.generated} fotos geradas</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
