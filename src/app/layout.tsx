import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jakarta",
});

const cabinetGrotesk = localFont({
  src: [
    { path: "../../fonts/CabinetGrotesk-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/CabinetGrotesk-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/CabinetGrotesk-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../fonts/CabinetGrotesk-Extrabold.woff2", weight: "800", style: "normal" },
    { path: "../../fonts/CabinetGrotesk-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-cabinet",
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
      </head>
      <body className={`${plusJakartaSans.className} ${cabinetGrotesk.variable}`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
