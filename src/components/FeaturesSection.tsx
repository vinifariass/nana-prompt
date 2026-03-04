"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { features } from "../data/content";

export function FeaturesSection() {
    return (
        <section id="features" className="section-padding">
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    style={{ textAlign: "center", marginBottom: "4rem" }}>
                    <div className="badge-accent" style={{ margin: "0 auto 1rem" }}>
                        <Sparkles style={{ width: 14, height: 14 }} /> Por que FotoPro AI?
                    </div>
                    <h2 className="heading-section" style={{ marginBottom: "1rem" }}>
                        Fotos Profissionais <span className="gradient-text">em Minutos</span>
                    </h2>
                    <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", maxWidth: 600, margin: "0 auto" }}>
                        Tudo que você precisa para criar fotos incríveis, sem complicação
                    </p>
                </motion.div>

                <div className="grid-4">
                    {features.map((feature, index) => (
                        <motion.div key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="glass-card" style={{ borderRadius: 20, padding: "2rem 1.5rem", height: "100%" }}>
                                <div style={{
                                    width: 56, height: 56, borderRadius: 16,
                                    background: feature.iconBg,
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    marginBottom: "1.25rem",
                                }}>
                                    <feature.icon style={{ width: 28, height: 28, color: feature.iconColor }} />
                                </div>
                                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>{feature.title}</h3>
                                <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
