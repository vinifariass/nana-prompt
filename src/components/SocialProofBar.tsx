import { Star } from "lucide-react";

export function SocialProofBar() {
    return (
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
    );
}
