"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Check, ArrowRight, CreditCard, Banknote } from "lucide-react";
import { plans } from "../data/content";

export function PricingSection() {
    const [billingPeriod, setBillingPeriod] = useState<"mensal" | "anual">("mensal");
    const [language, setLanguage] = useState<"pt" | "en" | "es">("pt");

    const locale = language === "pt" ? "pt-BR" : language === "en" ? "en-US" : "es-ES";
    const currency = language === "pt" ? "BRL" : language === "en" ? "USD" : "EUR";

    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    });

    return (
        <section id="pricing" className="section-padding" style={{
            background: "var(--bg-elevated)", position: "relative",
        }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <h2 className="heading-section" style={{ marginBottom: "1rem" }}>
                        Planos para <span className="gradient-text">Todos</span>
                    </h2>
                    <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", maxWidth: 600, margin: "0 auto 2rem" }}>
                        Escolha o plano ideal e comece hoje mesmo
                    </p>

                    {/* Billing and Language Toggles */}
                    <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                        <div className="toggle-container">
                            <button className={`toggle-btn ${billingPeriod === "mensal" ? "active" : ""}`}
                                onClick={() => setBillingPeriod("mensal")}>
                                Mensal
                            </button>
                            <button className={`toggle-btn ${billingPeriod === "anual" ? "active" : ""}`}
                                onClick={() => setBillingPeriod("anual")}>
                                Anual <span style={{ fontSize: "0.75rem", color: "var(--green-400)", marginLeft: 4 }}>-20%</span>
                            </button>
                        </div>

                        <div className="toggle-container">
                            <button className={`toggle-btn ${language === "pt" ? "active" : ""}`}
                                onClick={() => setLanguage("pt")}>
                                PT-BR
                            </button>
                            <button className={`toggle-btn ${language === "en" ? "active" : ""}`}
                                onClick={() => setLanguage("en")}>
                                EN-US
                            </button>
                            <button className={`toggle-btn ${language === "es" ? "active" : ""}`}
                                onClick={() => setLanguage("es")}>
                                ES-ES
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid-4" style={{ alignItems: "start" }}>
                    {plans.map((plan, index) => (
                        <motion.div key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            style={{
                                transform: plan.popular ? "scale(1.03)" : "none",
                                zIndex: plan.popular ? 10 : 1,
                            }}
                        >
                            <div
                                className={plan.popular ? "card-glow" : ""}
                                style={{
                                    borderRadius: 20,
                                    background: plan.popular ? "var(--brand-bg)" : "var(--bg-card)",
                                    border: plan.popular ? "none" : "1px solid var(--border-subtle)",
                                    overflow: "hidden",
                                    backdropFilter: "blur(20px)",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                {/* Badge */}
                                {plan.badge && (
                                    <div style={{
                                        padding: "0.625rem",
                                        textAlign: "center",
                                        fontSize: "0.8125rem",
                                        fontWeight: 600,
                                        color: plan.popular ? "#0a0a0f" : "var(--text-secondary)",
                                        background: plan.popular
                                            ? "var(--brand)"
                                            : "rgba(255,255,255,0.06)",
                                        borderBottom: plan.popular ? "none" : "1px solid var(--border-subtle)",
                                    }}>
                                        {plan.popular && "⭐ "}{plan.badge}
                                    </div>
                                )}

                                <div style={{ padding: "2rem 1.5rem" }}>
                                    {/* Header */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.25rem" }}>
                                        <h3 style={{ fontSize: "1.375rem", fontWeight: 700 }}>{plan.name}</h3>
                                        {plan.popular && <span className="badge-green">Recomendado</span>}
                                    </div>
                                    <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                                        {plan.description}
                                    </p>

                                    {/* Price */}
                                    <div style={{ marginBottom: "0.5rem" }}>
                                        <span style={{ fontSize: "2.75rem", fontWeight: 800 }}>{formatter.format(plan.price)}</span>
                                        <span style={{ fontSize: "0.9375rem", color: "var(--text-muted)", marginLeft: 4 }}>
                                            /{language === "en" && plan.period === "mês" ? "month" : language === "es" && plan.period === "mês" ? "mes" : plan.period}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--brand)", marginBottom: "1.5rem" }}>
                                        {plan.credits}
                                    </div>

                                    {/* Detailed description */}
                                    <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.5 }}>
                                        {plan.detailedDesc}
                                    </p>

                                    {/* What's included */}
                                    <p style={{ fontSize: "0.8125rem", fontWeight: 600, marginBottom: "1rem", color: "var(--text-primary)" }}>
                                        O que está incluído:
                                    </p>

                                    <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.5rem" }}>
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="check-item" style={{ marginBottom: "0.75rem" }}>
                                                <div className="check-icon"><Check /></div>
                                                <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA */}
                                    <Link href="/login"
                                        style={{
                                            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                                            width: "100%", padding: "0.875rem",
                                            borderRadius: 12, fontWeight: 600, fontSize: "0.9375rem",
                                            textDecoration: "none", transition: "all 0.25s ease",
                                            color: plan.popular ? "#0a0a0f" : "var(--text-primary)",
                                            background: plan.popular ? "var(--brand)" : "rgba(255,255,255,0.06)",
                                            border: plan.popular ? "none" : "1px solid var(--border-subtle)",
                                        }}
                                    >
                                        {plan.cta} <ArrowRight style={{ width: 16, height: 16 }} />
                                    </Link>

                                    {/* Payment methods */}
                                    <div style={{ marginTop: "1rem", textAlign: "center" }}>
                                        <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Ou pague com</p>
                                        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                                            <span className="payment-badge"><CreditCard style={{ width: 12, height: 12 }} /> Pix</span>
                                            <span className="payment-badge"><Banknote style={{ width: 12, height: 12 }} /> Boleto</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
