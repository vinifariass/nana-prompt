"use client";

import { motion } from "motion/react";
import { steps } from "../data/content";

export function HowItWorks() {
    return (
        <section id="how-it-works" className="section-padding" style={{ background: "var(--bg-elevated)" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                    <h2 className="heading-section" style={{ marginBottom: "1rem" }}>
                        Como <span className="gradient-text">Funciona</span>
                    </h2>
                    <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)" }}>
                        4 passos simples para fotos profissionais
                    </p>
                </div>

                <div className="grid-4">
                    {steps.map((item, index) => (
                        <motion.div key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="glass-card" style={{ borderRadius: 20, padding: "2rem 1.5rem" }}>
                                <div style={{
                                    width: 64, height: 64, borderRadius: "50%",
                                    background: "var(--brand)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "1.75rem", fontWeight: 800, color: "#0a0a0f",
                                    marginBottom: "1.25rem",
                                }}>
                                    {item.step}
                                </div>
                                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>{item.title}</h3>
                                <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
