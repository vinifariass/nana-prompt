import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Conta Suspensa | Nana Prompt",
};

export default function BannedPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
          <ShieldAlert className="w-10 h-10 text-red-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Conta Suspensa</h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Sua conta foi suspensa. Entre em contato com o suporte para mais informações.
          </p>
        </div>

        <div className="bg-[#12121a] border border-white/10 rounded-xl p-4 text-left space-y-1">
          <p className="text-xs text-white/30 font-medium uppercase tracking-wider">Suporte</p>
          <p className="text-sm text-white/60">
            Envie um email para{" "}
            <a
              href="mailto:suporte@nanaprompt.com"
              className="text-white underline underline-offset-2 hover:text-white/80 transition-colors"
            >
              suporte@nanaprompt.com
            </a>{" "}
            descrevendo sua situação.
          </p>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center justify-center w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-xl h-11 px-4 transition-colors"
        >
          Voltar ao Login
        </Link>
      </div>
    </div>
  );
}
