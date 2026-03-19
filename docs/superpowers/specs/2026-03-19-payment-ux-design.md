# Payment UX — Design Spec
**Data:** 2026-03-19
**Status:** Aprovado

## Visão Geral

Melhoria da experiência do usuário no fluxo de pagamento do Nana Prompt. O foco é fechar o loop do checkout com feedback visual claro, ampliar os métodos de pagamento disponíveis, exibir histórico real de faturas e alertar usuários com créditos baixos.

Prioridade: métodos de pagamento e página de sucesso primeiro; histórico de faturas e alerta de créditos na sequência.

---

## Seção 1 — Métodos de Pagamento

### Objetivo
Ampliar os métodos aceitos no Stripe Checkout de apenas cartão (crédito/débito) para cartão + Pix + Boleto.

### Limitação técnica do Stripe
**Pix e Boleto não são suportados em modo `subscription`** — o Stripe só aceita esses métodos para pagamentos avulsos (`mode: "payment"`). O checkout atual usa `mode: "subscription"`.

### Solução
Para assinaturas, o Stripe recomenda usar **Stripe Checkout com `payment_method_configuration`** ou habilitar Pix/Boleto como método de pagamento no Customer Portal para renovações. Porém, para manter a implementação simples e dentro do escopo desta fase:

- **Cartão** (crédito e débito): já funciona — `"card"` cobre ambos no Stripe
- **Pix e Boleto**: ficam fora do escopo desta fase. O Stripe não suporta esses métodos em `mode: "subscription"` diretamente

> **Decisão de design:** manter `payment_method_types: ["card"]` por ora. Pix/Boleto requerem uma mudança arquitetural maior (ex: cobrar primeira mensalidade como `mode: "payment"` e criar assinatura separada via API), o que está fora do escopo desta melhoria de UX.

### Arquivos afetados
- `src/app/api/checkout/route.ts` — manter como está para payment_method_types
- `src/server/actions/subscription.ts` — manter como está

> Esta seção documenta a limitação conhecida. Pix/Boleto devem ser revisitados na fase de gestão de assinatura.

---

## Seção 2 — Página de Sucesso `/checkout/success`

### Objetivo
Substituir o redirect pós-checkout para uma página de confirmação dedicada que fecha o loop visual do pagamento.

### Arquivo novo
`src/app/checkout/success/page.tsx`

### Comportamento
1. Usuário conclui checkout no Stripe
2. Stripe redireciona para `/checkout/success?plan=CREATOR` (ou `PRO`)
3. Página exibe confirmação com: nome do plano contratado, número de créditos do plano, mensagem de boas-vindas
4. Após 5 segundos, redireciona automaticamente para `/dashboard`
5. Botão "Ir ao Dashboard" disponível para quem não quiser esperar

### Dados exibidos
- Nome do plano via query param `?plan=` (valores uppercase: `CREATOR`, `PRO`)
- Créditos mapeados localmente: `{ CREATOR: 100, PRO: 200 }` — não depende do webhook ter chegado

> **Convenção de casing:** padronizar em uppercase (`CREATOR`, `PRO`) em todos os lugares. O API route hoje envia title-case no `success_url` — isso será corrigido na atualização do redirect abaixo.

### Redirects de sucesso — dois arquivos para atualizar

**`src/app/api/checkout/route.ts`** (usado pelo PricingCard):
```ts
// Antes
success_url: `${baseUrl}/admin?checkout=success&plan=${planName}`,

// Depois
success_url: `${baseUrl}/checkout/success?plan=${planName.toUpperCase()}`,
```

**`src/server/actions/subscription.ts`** (função `upgradePlan()`):
```ts
// Antes
success_url: `${baseUrl}/dashboard?checkout=success&plan=${newPlan}`,

// Depois
success_url: `${baseUrl}/checkout/success?plan=${newPlan}`,
```
> `newPlan` já é uppercase pois o tipo é `"CREATOR" | "PRO"`.

### Race condition com webhook
O webhook do Stripe pode chegar após o redirect do usuário para o dashboard. Para mitigar:
- A página de sucesso exibe dados locais (sem consulta ao banco) e redireciona para `/dashboard`
- O dashboard receberá `?from=checkout` no futuro (fora do escopo desta fase) para exibir aviso "Seu plano está sendo ativado..."
- Esta fase aceita a race condition como trade-off aceitável — o usuário vê a confirmação na página de sucesso

### Design visual
- Fundo escuro consistente com o restante do app (`bg-[#0a0a0f]`)
- Ícone de check animado (Framer Motion)
- Card central com nome do plano e créditos
- Contador regressivo de 5s visível
- Botão CTA para dashboard

---

## Seção 3 — Histórico de Faturas

### Objetivo
Substituir o placeholder "Histórico de faturas disponível em breve" por dados reais do Stripe.

### Arquivos
- `src/server/actions/subscription.ts` — nova action `getInvoices()`
- `src/app/admin/billing/page.tsx` — busca faturas no servidor e passa como prop (adicionar `stripeCustomerId` ao select)
- `src/app/admin/billing/BillingClient.tsx` — renderiza tabela de faturas

### Mudança no query da BillingPage
O query atual não seleciona `stripeCustomerId`. Precisa ser adicionado:

```ts
// Em billing/page.tsx, adicionar ao select da subscription:
subscription: {
  select: {
    plan: true,
    status: true,
    currentPeriodEnd: true,
    cancelAtPeriodEnd: true,
    stripeSubscriptionId: true,
    stripeCustomerId: true, // ← adicionar
  },
},
```

### Server Action `getInvoices()`
Usar o padrão `getStripe()` já estabelecido no codebase (lazy init):

```ts
export async function getInvoices() {
  const session = await requireSession();
  const subscription = await db.subscription.findUnique({
    where: { userId: session.user.id },
    select: { stripeCustomerId: true },
  });
  if (!subscription?.stripeCustomerId) return [];

  const stripe = getStripe(); // lazy init, mesmo padrão do webhook
  if (!stripe) return [];

  const invoices = await stripe.invoices.list({
    customer: subscription.stripeCustomerId,
    limit: 10,
  });

  return invoices.data.map((inv) => ({
    id: inv.id,
    date: new Date(inv.created * 1000),
    amount: inv.amount_paid / 100,
    status: inv.status,
    pdfUrl: inv.invoice_pdf,
    hostedUrl: inv.hosted_invoice_url,
  }));
}
```

### Tabela de faturas no BillingClient
Colunas: Data | Valor | Status | PDF

Status mapeados:
- `paid` → "Pago" (verde)
- `open` → "Em aberto" (amarelo)
- `void` → "Cancelada" (cinza)
- `uncollectible` → "Não cobrada" (vermelho)

### Caso sem assinatura
Se `stripeCustomerId` for null (usuário FREE sem histórico de pagamento), exibir mensagem vazia elegante no lugar da tabela: "Nenhuma fatura encontrada."

---

## Seção 4 — Alerta de Créditos Baixos

### Objetivo
Avisar o usuário no dashboard quando seus créditos estiverem abaixo de 20% do limite do plano.

### Arquivo
`src/app/dashboard/page.tsx`

### Mudança no query do Dashboard
Para exibir "renova em X dias" para usuários PRO, o query precisa incluir a data de renovação:

```ts
// Adicionar ao select do user:
subscription: {
  select: { currentPeriodEnd: true },
},
```

### Lógica do banner
```ts
// creditPercent já calculado na página
if (creditPercent <= 20) {
  if (plan === "PRO") {
    // exibe: "Seus créditos renovam em X dias"
    // calcula dias com base em subscription.currentPeriodEnd
  } else {
    // exibe banner de upgrade com link para /#pricing
  }
}
```

### Design do banner
- Posição: entre os cards de stats e as ações rápidas
- Cor: fundo âmbar (`bg-amber-500/10 border-amber-500/20 text-amber-400`)
- Conteúdo para não-PRO: ícone de alerta + "Seus créditos estão acabando. Faça upgrade para continuar gerando." + link `/#pricing`
- Conteúdo para PRO: "Seus créditos renovam em X dias."
- Não exibido se `creditPercent > 20`

---

## Ordem de Implementação

1. **Página de sucesso** — nova rota isolada, sem dependências
2. **Redirect de sucesso** — atualizar `success_url` nos dois arquivos de checkout
3. **Histórico de faturas** — requer `stripeCustomerId` no query + nova action
4. **Alerta de créditos** — requer `currentPeriodEnd` no query do dashboard

> Métodos de pagamento (Pix/Boleto) removidos desta fase por incompatibilidade com `mode: "subscription"` do Stripe.

---

## Arquivos Afetados

| Arquivo | Tipo de mudança |
|---|---|
| `src/app/checkout/success/page.tsx` | Novo arquivo |
| `src/app/api/checkout/route.ts` | Edição — success_url |
| `src/server/actions/subscription.ts` | Edição — success_url em upgradePlan() + nova getInvoices() |
| `src/app/admin/billing/page.tsx` | Edição — adicionar stripeCustomerId ao select |
| `src/app/admin/billing/BillingClient.tsx` | Edição — tabela de faturas |
| `src/app/dashboard/page.tsx` | Edição — adicionar subscription.currentPeriodEnd ao select + banner |

---

## Fora do Escopo

- Pix e Boleto em assinaturas (requer mudança arquitetural — próxima fase)
- Upgrade/downgrade de plano dentro do app (próxima fase)
- Reativação de assinatura cancelada (próxima fase)
- Gestão de método de pagamento (próxima fase)
- Stripe Customer Portal
