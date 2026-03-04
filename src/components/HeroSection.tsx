"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight, Shield, Check, Zap, Star, Users, Image as ImageIcon } from "lucide-react";
import { stats } from "../data/content";

export function HeroSection() {
    return (
        <section className="section-padding" style={{ position: "relative", overflow: "hidden" }}>
            {/* Background glow */}
            <div style={{
                position: "absolute", top: -300, right: -200, width: 700, height: 700,
                background: "radial-gradient(circle, var(--brand-glow) 0%, transparent 70%)",
                borderRadius: "50%", pointerEvents: "none", opacity: 0.4,
            }} />

            <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
                <div className="grid-2-hero">
                    {/* Left */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                        <div className="badge-accent" style={{ marginBottom: "1.5rem" }}>
                            <Sparkles style={{ width: 16, height: 16 }} />
                            <span>Tecnologia Nano Banana Pro</span>
                        </div>

                        <h1 className="heading-hero" style={{ marginBottom: "1.5rem" }}>
                            Fotos Profissionais com{" "}
                            <span className="gradient-text">Inteligência Artificial</span>
                        </h1>

                        <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "2rem" }}>
                            Transforme fotos comuns em ensaios profissionais de alta qualidade.
                            Sem estúdio, sem fotógrafo. Apenas você e a magia da IA.
                        </p>

                        {/* Stats */}
                        <div className="stats-grid" style={{ marginBottom: "2rem" }}>
                            {stats.map((stat, i) => (
                                <div key={i} style={{ textAlign: "center" }}>
                                    <div className="gradient-text" style={{ fontSize: "1.75rem", fontWeight: 800 }}>{stat.value}</div>
                                    <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="cta-row" style={{ marginBottom: "2rem" }}>
                            <Link href="/login" className="btn-primary" style={{ padding: "0.875rem 2rem" }}>
                                Começar Grátis <ArrowRight style={{ width: 18, height: 18 }} />
                            </Link>
                            <Link href="#how-it-works" className="btn-secondary" style={{ padding: "0.875rem 2rem" }}>
                                Ver Como Funciona
                            </Link>
                        </div>

                        {/* Trust */}
                        <div className="trust-row" style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Shield style={{ width: 16, height: 16, color: "var(--green-400)" }} /> 100% Seguro
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Check style={{ width: 16, height: 16, color: "var(--brand)" }} /> Sem cartão
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Zap style={{ width: 16, height: 16, color: "var(--brand)" }} /> Resultado em 2min
                            </div>
                        </div>
                    </motion.div>

                    {/* Right - Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        style={{ position: "relative" }}
                    >
                        <div style={{
                            aspectRatio: "4/5", borderRadius: 24,
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid var(--border-subtle)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            overflow: "hidden", position: "relative",
                            backgroundImage: "url('https://images.unsplash.com/photo-1598555234125-5e01bddeec47?q=80&w=1200&auto=format&fit=crop')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}>
                            <div style={{
                                position: "absolute", top: 16, right: 16,
                                background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
                                borderRadius: 9999, padding: "0.5rem 1rem",
                                fontSize: "0.8125rem", fontWeight: 500,
                                color: "white"
                            }}>
                                ✨ Gerado por IA em 2min
                            </div>
                        </div>

                        {/* Floating cards */}
                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            style={{
                                position: "absolute", left: -30, top: "25%",
                                background: "rgba(10,10,15,0.92)", backdropFilter: "blur(16px)",
                                borderRadius: 16, padding: "1rem 1.25rem",
                                border: "1px solid var(--border-subtle)",
                                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                            }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: "50%",
                                    background: "var(--brand-bg)", border: "1px solid var(--brand-border)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <Star style={{ width: 22, height: 22, color: "var(--brand)" }} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: "1.125rem" }}>4.9/5</div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>1.200+ reviews</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            style={{
                                position: "absolute", right: -30, bottom: "25%",
                                background: "rgba(10,10,15,0.92)", backdropFilter: "blur(16px)",
                                borderRadius: 16, padding: "1rem 1.25rem",
                                border: "1px solid var(--border-subtle)",
                                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                            }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: "50%",
                                    background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-subtle)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <Users style={{ width: 22, height: 22, color: "var(--text-primary)" }} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: "1.125rem" }}>10K+</div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Criadores ativos</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
