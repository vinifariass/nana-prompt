"use client";

import Link from "next/link";
import { Camera } from "lucide-react";

export function NavBar() {
    return (
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
                        { label: "Funcionalidades", href: "#features" },
                        { label: "Estilos", href: "#styles" },
                        { label: "Preços", href: "#pricing" },
                        { label: "Como Funciona", href: "#how-it-works" },
                    ].map((link) => (
                        <Link key={link.href} href={link.href}
                            style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }}>
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Link href="/login" style={{
                        fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)",
                        textDecoration: "none", padding: "0.5rem 1rem",
                    }}>
                        Entrar
                    </Link>
                    <Link href="/login" className="btn-primary" style={{ fontSize: "0.8125rem", padding: "0.5rem 1.25rem" }}>
                        Começar Grátis
                    </Link>
                </div>
            </div>
        </nav>
    );
}
