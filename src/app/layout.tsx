import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FotoPro AI - Fotos Profissionais com Inteligência Artificial",
  description: "Transforme fotos comuns em ensaios profissionais de alta qualidade com IA. Sem estúdio, sem fotógrafo. Resultados em 2 minutos.",
  keywords: ["fotos IA", "ensaio fotográfico", "inteligência artificial", "fotos profissionais"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={plusJakartaSans.className}>{children}</body>
    </html>
  );
}
