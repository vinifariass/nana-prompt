"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import {
  Camera,
  Check,
  Sparkles,
  Zap,
  Shield,
  Star,
  ArrowRight,
  Clock,
  Lock,
  TrendingUp,
  Users,
  Image as ImageIcon,
  CreditCard,
  Banknote,
  Instagram,
  Twitter,
  Linkedin,
  Menu,
  X,
} from "lucide-react";
import PricingCard from "@/components/PricingCard";
import { Footer } from "@/components/Footer";

/* ───────── DATA ───────── */

const styles = [
  { name: "Elden Ring (Realista)", description: "Dark fantasy RPG, textures ultra-detalhadas", samples: 1234, image: "/generated/elden_ring_real.png" },
  { name: "Jujutsu Kaisen (Realista)", description: "Dark urban fantasy, estilo live-action incrível", samples: 892, image: "/generated/jjk_real.png" },
  { name: "Hell's Paradise (Realista)", description: "Kunoichi ninja e iluminação cinematográfica", samples: 2103, image: "/generated/hells_paradise_real.png" },
  { name: "Jujutsu Kaisen (Anime)", description: "2D detalhado em estilo Nana Anime, super vibrante", samples: 756, image: "/generated/jjk_gojo.png" },
  { name: "The Matrix (Anime)", description: "Sci-fi cyberpunk tenso com estética de graphic novel", samples: 1432, image: "/generated/matrix_neo.png" },
  { name: "Demons Slayer (Anime)", description: "Ilustração anime de alta qualidade com katana flamejante", samples: 941, image: "/generated/demon_slayer.png" },
];

const testimonials = [
  { name: "Ana Silva", role: "Designer Gráfica", content: "Incrível! Consegui fotos profissionais para meu portfólio sem gastar com fotógrafo. A qualidade é surpreendente!", rating: 5, generated: 47, avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&q=80" },
  { name: "Carlos Mendes", role: "Empresário", content: "Precisava atualizar minha foto do LinkedIn urgentemente. Em 5 minutos tinha 20 opções profissionais para escolher.", rating: 5, generated: 23, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80" },
  { name: "Juliana Costa", role: "Influenciadora", content: "Uso para criar conteúdo para Instagram. Economizo tempo e dinheiro, e o resultado é sempre impecável!", rating: 5, generated: 156, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80" },
];

const stats = [
  { value: "50K+", label: "Fotos Geradas" },
  { value: "10K+", label: "Criadores Ativos" },
  { value: "4.9/5", label: "Avaliação Média" },
  { value: "98%", label: "Satisfação" },
];

const features = [
  { icon: Camera, title: "Qualidade 4K", description: "Fotos em altíssima resolução, prontas para impressão ou redes sociais", iconBg: "rgba(202,138,4,0.12)", iconColor: "#EAB308" },
  { icon: Clock, title: "Resultado em 2min", description: "Da escolha do estilo até o download, tudo em menos de 2 minutos", iconBg: "rgba(255,255,255,0.06)", iconColor: "#ffffff" },
  { icon: Lock, title: "100% Seguro", description: "Seus dados e fotos protegidos com criptografia de ponta", iconBg: "rgba(34,197,94,0.12)", iconColor: "#4ADE80" },
  { icon: TrendingUp, title: "15+ Estilos", description: "Do corporativo ao artístico, escolha o estilo perfeito para você", iconBg: "rgba(202,138,4,0.08)", iconColor: "#CA8A04" },
];

const steps = [
  { step: "1", title: "Escolha o Estilo", description: "Selecione entre 15+ estilos profissionais de fotografia" },
  { step: "2", title: "Faça Upload", description: "Envie suas fotos comuns (selfie, foto de documento, etc)" },
  { step: "3", title: "IA Processa", description: "Nossa IA transforma em fotos profissionais em 2 minutos" },
  { step: "4", title: "Download 4K", description: "Baixe suas fotos em alta qualidade e use onde quiser" },
];

/* ───────── COMPONENT ───────── */

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* ═══════════════ NAV ═══════════════ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid var(--border-subtle)",
        background: "rgba(10,10,15,0.88)",
        backdropFilter: "blur(20px)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1rem 1.5rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "var(--brand)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Camera style={{ width: 22, height: 22, color: "#0a0a0f" }} />
            </div>
            <span className="gradient-text" style={{ fontSize: "1.25rem", fontWeight: 800 }}>
              FotoPro AI
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}
            className="hidden-mobile">
            {[
              { label: "Gerador IA", href: "/generate" },
              { label: "Galeria", href: "/explore" },
              { label: "Funcionalidades", href: "#features" },
              { label: "Preços", href: "#pricing" },
              { label: "Como Funciona", href: "#how-it-works" },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors"
                style={{ textDecoration: "none" }}>
                {link.label}
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link href="/login"
              className="hidden sm:inline-flex text-sm font-medium text-[var(--text-secondary)] hover:text-white px-4 py-2 transition-colors"
              style={{ textDecoration: "none" }}>
              Entrar
            </Link>
            <Link href="/login" className="btn-primary hover:opacity-90 transition-opacity" style={{ fontSize: "0.8125rem", padding: "0.5rem 1.25rem" }}>
              Começar Grátis
            </Link>
            <button className="sm:hidden text-white ml-2 hover:bg-white/10 p-1.5 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="sm:hidden border-t border-white/10 bg-[#0a0a0f] overflow-hidden"
            >
              <div className="flex flex-col p-4 space-y-2">
                {[
                  { label: "Gerador IA", href: "/generate" },
                  { label: "Galeria", href: "/explore" },
                  { label: "Funcionalidades", href: "#features" },
                  { label: "Preços", href: "#pricing" },
                  { label: "Como Funciona", href: "#how-it-works" },
                  { label: "Entrar", href: "/login" },
                ].map((link) => (
                  <Link key={link.href} href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-medium text-white/70 hover:text-white p-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══════════════ HERO ═══════════════ */}
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
                <Link href="/generate" className="btn-primary hover:scale-105 transition-transform" style={{ padding: "0.875rem 2rem" }}>
                  Começar a Criar <ArrowRight style={{ width: 18, height: 18 }} />
                </Link>
                <Link href="/explore" className="btn-secondary hover:bg-white/10 transition-colors" style={{ padding: "0.875rem 2rem" }}>
                  Ver Galeria de IAs
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
              }}>
                <div style={{ width: "100%", height: "100%", position: "relative" }}>
                  <Image src="https://images.unsplash.com/photo-1531123897727-8f129e1bfcd5?w=800&q=80" alt="Exemplo gerado por IA" fill priority sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                </div>
                <div style={{
                  position: "absolute", top: 16, right: 16,
                  background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
                  borderRadius: 9999, padding: "0.5rem 1rem",
                  fontSize: "0.8125rem", fontWeight: 500,
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

      {/* ═══════════════ SOCIAL PROOF BAR ═══════════════ */}
      <section style={{
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "2.5rem 1.5rem",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
            Confiado por <strong style={{ color: "var(--text-primary)" }}>10.000+</strong> criadores de conteúdo
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Star style={{ width: 16, height: 16, fill: "var(--brand)", color: "var(--brand)" }} />
              <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                <strong style={{ color: "var(--text-secondary)" }}>4.9/5</strong> média
              </span>
            </div>
            <span style={{ color: "var(--border-subtle)" }}>•</span>
            <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
              <strong style={{ color: "var(--text-secondary)" }}>50.000+</strong> fotos geradas
            </span>
            <span style={{ color: "var(--border-subtle)" }}>•</span>
            <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
              <strong style={{ color: "var(--text-secondary)" }}>98%</strong> satisfação
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
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

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
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

      {/* ═══════════════ STYLES GALLERY ═══════════════ */}
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
                <div className="glass-card group" style={{
                  position: "relative", overflow: "hidden", borderRadius: 20,
                  aspectRatio: "3/4", cursor: "pointer",
                }}>
                  <div style={{ position: "absolute", inset: 0 }}>
                    <Image src={style.image} alt={style.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>

                  {/* Hover overlay with mobile fallback */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent sm:opacity-0 sm:group-hover:opacity-100 opacity-100 transition-all duration-300" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:translate-y-4 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 translate-y-0 opacity-100 transition-all duration-300">
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>{style.name}</h3>
                    <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)", marginBottom: "0.75rem" }}>{style.description}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--brand)" }}>
                      <Users style={{ width: 14, height: 14 }} />
                      {style.samples.toLocaleString()} fotos geradas
                    </div>
                  </div>

                  <div style={{
                    position: "absolute", top: 12, right: 12,
                    background: "rgba(255,255,255,0.06)", backdropFilter: "blur(8px)",
                    borderRadius: 9999, padding: "0.25rem 0.75rem",
                    fontSize: "0.6875rem", fontWeight: 500, color: "var(--text-secondary)",
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

      {/* ═══════════════ PRICING ═══════════════ */}
      <PricingCard />

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
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
                    <Image src={t.avatar} alt={t.name} width={56} height={56} className="rounded-full object-cover border border-[var(--brand-border)]" />
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

      {/* ═══════════════ CTA FINAL ═══════════════ */}
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

      <Footer />
    </div>
  );
}
