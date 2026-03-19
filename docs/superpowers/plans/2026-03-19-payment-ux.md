# Payment UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Melhorar a experiência do usuário no fluxo de pagamento com página de sucesso dedicada, histórico de faturas real e alerta de créditos baixos.

**Architecture:** Quatro mudanças incrementais com dependência sequencial: (1) nova rota `/checkout/success` (base para os redirects), (2) atualização dos redirects de sucesso nos dois arquivos de checkout (depende da Task 1 existir), (3) nova função `getInvoices(stripeCustomerId)` + tabela no BillingClient, (4) banner de créditos baixos no dashboard.

**Tech Stack:** Next.js 14 App Router, Stripe SDK v20, Prisma, Framer Motion (`motion`), Tailwind CSS v4, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-19-payment-ux-design.md`

---

## File Map

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `src/app/checkout/success/SuccessClient.tsx` | Criar | Client Component: countdown, redirect, animações |
| `src/app/checkout/success/page.tsx` | Criar | Server Component: lê searchParams, renderiza SuccessClient |
| `src/app/api/checkout/route.ts` | Editar | Corrigir success_url (depende da Task 1) |
| `src/server/actions/subscription.ts` | Editar | Corrigir success_url em upgradePlan() + adicionar getInvoices() |
| `src/app/admin/billing/page.tsx` | Editar | Adicionar stripeCustomerId ao select, buscar faturas |
| `src/app/admin/billing/BillingClient.tsx` | Editar | Receber prop de faturas + renderizar tabela |
| `src/app/dashboard/page.tsx` | Editar | Adicionar subscription.currentPeriodEnd ao select + banner |

**Nota sobre auth:** `/checkout/success` é uma rota pública — o middleware (`src/middleware.ts`) só protege `/admin`, `/upload`, `/generate`, `/explore` e `/dashboard`. Nenhuma alteração no middleware é necessária.

---

## Task 1: Página de sucesso `/checkout/success`

**Files:**
- Create: `src/app/checkout/success/SuccessClient.tsx`
- Create: `src/app/checkout/success/page.tsx`

### Contexto
Server Component (`page.tsx`) lê o query param `?plan=CREATOR` ou `?plan=PRO` e passa para o Client Component (`SuccessClient.tsx`). Não consulta o banco — usa dados locais para evitar race condition com o webhook Stripe.

- [ ] **Step 1: Criar SuccessClient.tsx**

Criar `src/app/checkout/success/SuccessClient.tsx`:

```tsx
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
```

- [ ] **Step 2: Criar page.tsx**

Criar `src/app/checkout/success/page.tsx`:

```tsx
import { SuccessClient } from "./SuccessClient";

interface PageProps {
  searchParams: Promise<{ plan?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const plan = (params.plan ?? "CREATOR").toUpperCase();
  return <SuccessClient plan={plan} />;
}
```

- [ ] **Step 3: Verificar tipos**

```bash
cd "C:\Users\vinic\Documents\nana-prompt" && npx tsc --noEmit
```

Esperado: sem erros nos arquivos novos.

- [ ] **Step 4: Testar manualmente**

1. `npm run dev`
2. Acessar `http://localhost:3000/checkout/success?plan=CREATOR` (sem login — deve funcionar, rota é pública)
3. Verificar: animação do check, "100 créditos", countdown de 5s visível
4. Verificar: após 5s redireciona para `/dashboard`
5. Acessar `http://localhost:3000/checkout/success?plan=PRO` — confirmar "200 créditos"

- [ ] **Step 5: Commit**

```bash
git add src/app/checkout/success/
git commit -m "feat: add checkout success page with animated confirmation and 5s redirect"
```

---

## Task 2: Atualizar redirects de sucesso no checkout

> **Depende da Task 1** — só faça este commit após a Task 1 estar deployada. Caso contrário, o Stripe redirecionará para uma rota que não existe.

**Files:**
- Modify: `src/app/api/checkout/route.ts`
- Modify: `src/server/actions/subscription.ts`

### Contexto
Dois arquivos criam sessões Stripe independentemente com `success_url` diferentes. Ambos precisam apontar para `/checkout/success?plan=UPPERCASE`.

- [ ] **Step 1: Atualizar success_url no API route**

Em `src/app/api/checkout/route.ts`, linha ~73:

```ts
// Antes
success_url: `${baseUrl}/admin?checkout=success&plan=${planName}`,

// Depois
success_url: `${baseUrl}/checkout/success?plan=${planName.toUpperCase()}`,
```

- [ ] **Step 2: Atualizar success_url no server action**

Em `src/server/actions/subscription.ts`, dentro de `upgradePlan()`, linha ~45:

```ts
// Antes
success_url: `${baseUrl}/dashboard?checkout=success&plan=${newPlan}`,

// Depois
success_url: `${baseUrl}/checkout/success?plan=${newPlan}`,
```

> `newPlan` já é uppercase (`"CREATOR" | "PRO"`), não precisa de `.toUpperCase()`.

- [ ] **Step 3: Verificar tipos**

```bash
cd "C:\Users\vinic\Documents\nana-prompt" && npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/checkout/route.ts src/server/actions/subscription.ts
git commit -m "feat: redirect checkout success to /checkout/success"
```

---

## Task 3: Histórico de faturas real via Stripe

**Files:**
- Modify: `src/server/actions/subscription.ts`
- Modify: `src/app/admin/billing/page.tsx`
- Modify: `src/app/admin/billing/BillingClient.tsx`

### Contexto
`BillingPage` é Server Component e já busca o usuário do banco. Adicionamos `stripeCustomerId` ao select existente e passamos para uma função `getInvoices(customerId)` — que recebe o ID como parâmetro para evitar consulta duplicada ao banco.

O padrão de instanciação do Stripe segue o mesmo já usado em `subscription.ts` (`new Stripe(stripeKey)` com guard de env var).

- [ ] **Step 1: Adicionar getInvoices() em subscription.ts**

Em `src/server/actions/subscription.ts`, adicionar ao final do arquivo a seguinte função. O Stripe já está importado no topo do arquivo.

```ts
type InvoiceStatus = "paid" | "open" | "void" | "uncollectible";

function toInvoiceStatus(s: string | null): InvoiceStatus | null {
  if (s === "paid" || s === "open" || s === "void" || s === "uncollectible") return s;
  return null;
}

export async function getInvoices(stripeCustomerId: string) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return [];

  const stripe = new Stripe(stripeKey);
  const invoices = await stripe.invoices.list({
    customer: stripeCustomerId,
    limit: 10,
  });

  return invoices.data.map((inv) => ({
    id: inv.id,
    date: new Date(inv.created * 1000),
    amount: inv.amount_paid / 100,
    status: toInvoiceStatus(inv.status),
    pdfUrl: inv.invoice_pdf,
    hostedUrl: inv.hosted_invoice_url,
  }));
}
```

> `toInvoiceStatus` é uma função de narrowing de tipo — evita o `as` cast inseguro e garante que status inesperados do Stripe (ex: `"draft"`) sejam tratados como `null`.

- [ ] **Step 2: Adicionar stripeCustomerId ao select em billing/page.tsx**

Em `src/app/admin/billing/page.tsx`, atualizar o select da subscription para incluir `stripeCustomerId`:

```ts
// select completo atualizado:
select: {
  plan: true,
  status: true,
  currentPeriodEnd: true,
  cancelAtPeriodEnd: true,
  stripeSubscriptionId: true,
  stripeCustomerId: true, // ← adicionar
},
```

- [ ] **Step 3: Adicionar import de getInvoices em billing/page.tsx**

No topo de `src/app/admin/billing/page.tsx`, adicionar `getInvoices` ao import existente:

```ts
// Antes
import { db } from "@/server/db";

// Depois (adicionar nova linha de import)
import { db } from "@/server/db";
import { getInvoices } from "@/server/actions/subscription";
```

- [ ] **Step 4: Buscar faturas em billing/page.tsx e passar como prop**

Ainda em `src/app/admin/billing/page.tsx`, após o `db.user.findUnique`, buscar as faturas usando o `stripeCustomerId` já disponível no resultado:

```ts
const stripeCustomerId = user?.subscription?.stripeCustomerId ?? null;
const invoices = stripeCustomerId ? await getInvoices(stripeCustomerId) : [];

return (
  <AdminSidebarLayout>
    <BillingClient user={user} invoices={invoices} />
  </AdminSidebarLayout>
);
```

- [ ] **Step 5: Atualizar BillingClient para receber e exibir faturas**

Em `src/app/admin/billing/BillingClient.tsx`:

**5a.** Adicionar o tipo `Invoice` e o componente `InvoiceStatusBadge` antes da função `BillingClient`:

```ts
type InvoiceStatus = "paid" | "open" | "void" | "uncollectible" | null;

interface Invoice {
  id: string;
  date: Date;
  amount: number;
  status: InvoiceStatus;
  pdfUrl: string | null;
  hostedUrl: string | null;
}

const INVOICE_STATUS: Record<string, { label: string; className: string }> = {
  paid: { label: "Pago", className: "bg-green-500/15 text-green-400 border-green-500/20" },
  open: { label: "Em aberto", className: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
  void: { label: "Cancelada", className: "bg-white/10 text-white/40 border-white/10" },
  uncollectible: { label: "Não cobrada", className: "bg-red-500/15 text-red-400 border-red-500/20" },
};

function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  if (!status) return <span className="text-white/20 text-xs">—</span>;
  const meta = INVOICE_STATUS[status] ?? { label: status, className: "bg-white/10 text-white/40 border-white/10" };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${meta.className}`}>
      {meta.label}
    </span>
  );
}
```

**5b.** Atualizar `BillingClientProps` para incluir `invoices`:

```ts
interface BillingClientProps {
  user: BillingUser | null;
  invoices: Invoice[];
}
```

**5c.** Atualizar a desestruturação da função:

```ts
export function BillingClient({ user, invoices }: BillingClientProps) {
```

**5d.** Substituir o bloco placeholder "Histórico de Faturas" (atualmente linhas 307-316 com texto "disponível em breve"):

```tsx
{/* Invoice History */}
<div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
  <h2 className="text-lg font-semibold text-white mb-4">Histórico de Faturas</h2>

  {invoices.length === 0 ? (
    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
      <CreditCard className="w-5 h-5 text-white/40 shrink-0" />
      <p className="text-sm text-white/50">Nenhuma fatura encontrada.</p>
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-white/40 border-b border-white/10">
            <th className="pb-3 font-medium">Data</th>
            <th className="pb-3 font-medium">Valor</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium text-right">PDF</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {invoices.map((inv) => (
            <tr key={inv.id} className="text-white/70">
              <td className="py-3">
                {inv.date.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="py-3">
                {inv.amount.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
              <td className="py-3">
                <InvoiceStatusBadge status={inv.status} />
              </td>
              <td className="py-3 text-right">
                {inv.pdfUrl ? (
                  <a
                    href={inv.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/40 hover:text-white underline-offset-2 hover:underline transition-colors"
                  >
                    Baixar
                  </a>
                ) : (
                  <span className="text-xs text-white/20">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
```

- [ ] **Step 6: Verificar tipos**

```bash
cd "C:\Users\vinic\Documents\nana-prompt" && npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 7: Commit**

```bash
git add src/server/actions/subscription.ts src/app/admin/billing/page.tsx src/app/admin/billing/BillingClient.tsx
git commit -m "feat: add real invoice history via Stripe API"
```

---

## Task 4: Alerta de créditos baixos no dashboard

**Files:**
- Modify: `src/app/dashboard/page.tsx`

### Contexto
O dashboard já calcula `creditPercent`. Adicionamos `subscription.currentPeriodEnd` ao select para calcular dias até renovação (usado na mensagem para usuários PRO com créditos baixos).

- [ ] **Step 1: Adicionar subscription ao select de db.user.findUnique**

Em `src/app/dashboard/page.tsx`, o `db.user.findUnique` está dentro de `Promise.all`. Atualizar o select completo do user para incluir subscription:

```ts
db.user.findUnique({
  where: { id: userId },
  select: {
    name: true,
    image: true,
    plan: true,
    credits: { select: { balance: true } },
    subscription: { select: { currentPeriodEnd: true } }, // ← adicionar
  },
}),
```

- [ ] **Step 2: Adicionar lógica do alerta após as variáveis existentes**

Após a linha `const displayName = user?.name ?? session.user.email ?? "Usuário";`, adicionar:

```ts
const periodEnd = user?.subscription?.currentPeriodEnd ?? null;
const renewalDays = periodEnd
  ? Math.ceil((new Date(periodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  : null;
const showCreditAlert = creditPercent <= 20;
```

- [ ] **Step 3: Adicionar AlertCircle ao import de lucide-react**

No import do lucide-react no topo do arquivo:

```ts
import {
  Sparkles,
  ImageIcon,
  CreditCard,
  ArrowRight,
  Zap,
  Crown,
  Star,
  Clock,
  LogOut,
  AlertCircle, // ← adicionar
} from "lucide-react";
```

- [ ] **Step 4: Inserir banner no JSX**

Localizar o comentário `{/* Quick links */}` no JSX e inserir o banner imediatamente antes dele:

```tsx
{/* Low credit alert */}
{showCreditAlert && (
  <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
    {plan === "PRO" ? (
      <p className="text-sm text-amber-300">
        Seus créditos estão quase no limite.{" "}
        {renewalDays !== null && renewalDays > 0
          ? `Renovam em ${renewalDays} ${renewalDays === 1 ? "dia" : "dias"}.`
          : "Renovam em breve."}
      </p>
    ) : (
      <p className="text-sm text-amber-300">
        Seus créditos estão acabando.{" "}
        <a
          href="/#pricing"
          className="font-semibold underline underline-offset-2 hover:text-amber-200 transition-colors"
        >
          Faça upgrade para continuar gerando.
        </a>
      </p>
    )}
  </div>
)}
```

- [ ] **Step 5: Verificar tipos**

```bash
cd "C:\Users\vinic\Documents\nana-prompt" && npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 6: Testar manualmente**

Para forçar o banner aparecer sem alterar dados reais, temporariamente mudar `creditPercent <= 20` para `creditPercent <= 100`, verificar que o banner aparece, depois reverter.

- [ ] **Step 7: Commit**

```bash
git add src/app/dashboard/page.tsx
git commit -m "feat: add low credit alert banner on dashboard"
```

---

## Verificação Final

- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm run build` completa sem erros
- [ ] `http://localhost:3000/checkout/success?plan=CREATOR` — animação, 100 créditos, countdown 5s
- [ ] `http://localhost:3000/checkout/success?plan=PRO` — 200 créditos
- [ ] `/admin/billing` com conta com assinatura — tabela de faturas real (ou "Nenhuma fatura encontrada")
- [ ] `/dashboard` com créditos ≤ 20% — banner âmbar aparece
- [ ] `/dashboard` com usuário PRO e créditos ≤ 20% — mensagem de renovação (não de upgrade)
