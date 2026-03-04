import Link from "next/link";
import { Camera, Instagram, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer style={{
            borderTop: "1px solid var(--border-subtle)",
            padding: "4rem 1.5rem 2rem",
        }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div className="grid-footer">
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 12,
                                background: "var(--brand)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <Camera style={{ width: 22, height: 22, color: "#0a0a0f" }} />
                            </div>
                            <span className="gradient-text" style={{ fontSize: "1.25rem", fontWeight: 800 }}>FotoPro AI</span>
                        </div>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", lineHeight: 1.7, maxWidth: 320, marginBottom: "1.5rem" }}>
                            Transforme suas fotos em ensaios profissionais com a magia da Inteligência Artificial.
                        </p>
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <Link href="https://instagram.com" target="_blank" style={{
                                width: 40, height: 40, borderRadius: "50%",
                                border: "1px solid var(--border-subtle)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", transition: "all 0.2s",
                            }} className="text-[var(--text-secondary)] hover:bg-white/10 hover:text-pink-500 hover:border-pink-500/50">
                                <Instagram style={{ width: 18, height: 18 }} />
                            </Link>
                            <Link href="https://twitter.com" target="_blank" style={{
                                width: 40, height: 40, borderRadius: "50%",
                                border: "1px solid var(--border-subtle)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", transition: "all 0.2s",
                            }} className="text-[var(--text-secondary)] hover:bg-white/10 hover:text-blue-400 hover:border-blue-400/50">
                                <Twitter style={{ width: 18, height: 18 }} />
                            </Link>
                            <Link href="https://linkedin.com" target="_blank" style={{
                                width: 40, height: 40, borderRadius: "50%",
                                border: "1px solid var(--border-subtle)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", transition: "all 0.2s",
                            }} className="text-[var(--text-secondary)] hover:bg-white/10 hover:text-blue-600 hover:border-blue-600/50">
                                <Linkedin style={{ width: 18, height: 18 }} />
                            </Link>
                        </div>
                    </div>

                    {[
                        { title: "Produto", links: [{ label: "Funcionalidades", href: "#features" }, { label: "Preços", href: "#pricing" }, { label: "Estilos", href: "#styles" }, { label: "Galeria", href: "#" }] },
                        { title: "Empresa", links: [{ label: "Sobre", href: "#" }, { label: "Contato", href: "#" }, { label: "Blog", href: "#" }, { label: "Carreiras", href: "#" }] },
                        { title: "Legal", links: [{ label: "Termos de Uso", href: "#" }, { label: "Privacidade", href: "#" }, { label: "Cookies", href: "#" }] },
                    ].map((col) => (
                        <div key={col.title}>
                            <h4 style={{ fontWeight: 600, marginBottom: "1rem", fontSize: "0.9375rem" }}>{col.title}</h4>
                            <ul style={{ listStyle: "none", padding: 0 }}>
                                {col.links.map((link) => (
                                    <li key={link.label} style={{ marginBottom: "0.75rem" }}>
                                        <Link href={link.href} style={{
                                            fontSize: "0.875rem", color: "var(--text-secondary)",
                                            textDecoration: "none", transition: "color 0.2s",
                                        }}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: "4rem", paddingTop: "2rem",
                    borderTop: "1px solid var(--border-subtle)",
                    textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem",
                }}>
                    © {new Date().getFullYear()} FotoPro AI. Todos os direitos reservados.
                </div>
            </div>
        </footer>
    );
}
