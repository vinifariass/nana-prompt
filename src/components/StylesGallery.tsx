"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Users, Image as ImageIcon } from "lucide-react";
import { styles } from "../data/content";

export function StylesGallery() {
    return (
        <section id="styles" className="section-padding">
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                    <h2 className="heading-section" style={{ marginBottom: "1rem" }}>
                        Explore Nossos <span className="gradient-text">Estilos</span>
                    </h2>
                    <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)" }}>
                        Do corporativo ao artístico, encontre o estilo perfeito
                    </p>
                </div>

                <div className="grid-4">
                    {styles.map((style, index) => (
                        <motion.div key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="glass-card" style={{
                                position: "relative", overflow: "hidden", borderRadius: 20,
                                aspectRatio: "3/4", cursor: "pointer",
                                backgroundImage: `url('${style.image}')`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}>
                                <div style={{
                                    position: "absolute", inset: 0,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    background: "rgba(10, 10, 15, 0.4)", // Dark tint to ensure text readability from start
                                }}>
                                    <ImageIcon style={{ width: 48, height: 48, color: "rgba(255,255,255,0.0)" }} />
                                </div>

                                {/* Hover overlay */}
                                <div className="style-overlay" style={{
                                    position: "absolute", inset: 0,
                                    background: "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.4), transparent)",
                                    opacity: 0, transition: "opacity 0.35s ease",
                                }} />

                                <div className="style-info" style={{
                                    position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.5rem",
                                    transform: "translateY(10px)", opacity: 0,
                                    transition: "all 0.35s ease",
                                }}>
                                    <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem", color: "white" }}>{style.name}</h3>
                                    <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.85)", marginBottom: "0.75rem" }}>{style.description}</p>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--brand)" }}>
                                        <Users style={{ width: 14, height: 14 }} />
                                        {style.samples.toLocaleString()} fotos geradas
                                    </div>
                                </div>

                                <div style={{
                                    position: "absolute", top: 12, right: 12,
                                    background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
                                    borderRadius: 9999, padding: "0.25rem 0.75rem",
                                    fontSize: "0.6875rem", fontWeight: 600, color: "white",
                                    border: "1px solid rgba(255,255,255,0.1)"
                                }}>
                                    {style.name}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div style={{ textAlign: "center", marginTop: "3rem" }}>
                    <Link href="#" className="btn-secondary" style={{ padding: "0.875rem 2rem" }}>
                        Ver Todos os Estilos <ArrowRight style={{ width: 18, height: 18 }} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
