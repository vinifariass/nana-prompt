"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { CheckCircle2, ArrowRight } from "lucide-react";

const PLAN_CREDITS: Record<string, number> = {
  CREATOR: 100,
  PRO: 200,
};

const PLAN_LABELS: Record<string, string> = {
  CREATOR: "Creator",
  PRO: "Pro",
};

interface SuccessClientProps {
  plan: string;
}

export function SuccessClient({ plan }: SuccessClientProps) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(5);

  const planLabel = PLAN_LABELS[plan] ?? plan;
  const credits = PLAN_CREDITS[plan] ?? 0;

  useEffect(() => {
    if (seconds <= 0) {
      router.push("/dashboard");
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, router]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold text-white">Pagamento confirmado!</h1>
          <p className="text-white/50">
            Bem-vindo ao plano{" "}
            <span className="text-white font-semibold">{planLabel}</span>.
          </p>
        </motion.div>

        {credits > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-[#12121a] border border-white/10 rounded-2xl p-6 space-y-1"
          >
            <p className="text-4xl font-black text-white">{credits}</p>
            <p className="text-sm text-white/40">créditos disponíveis neste mês</p>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold rounded-xl h-11 px-6 hover:bg-white/90 transition-colors"
          >
            Ir ao Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-white/30">
            Redirecionando automaticamente em {seconds}s...
          </p>
        </motion.div>
      </div>
    </div>
  );
}
