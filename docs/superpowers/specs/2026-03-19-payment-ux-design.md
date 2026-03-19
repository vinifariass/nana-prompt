# Payment UX — Design Spec
**Data:** 2026-03-19
**Status:** Aprovado

## Visão Geral

Melhoria da experiência do usuário no fluxo de pagamento do Nana Prompt. O foco é fechar o loop do checkout com feedback visual claro, ampliar os métodos de pagamento disponíveis, exibir histórico real de faturas e alertar usuários com créditos baixos.

Prioridade: métodos de pagamento e página de sucesso primeiro; histórico de faturas e alerta de créditos na sequência.

---

## Seção 1 — Métodos de Pagamento

### Objetivo
Ampliar os métodos aceitos no Stripe Checkout de apenas cartão para cartão (crédito/débito), Pix e Boleto.

### Arquivo
`src/app/api/checkout/route.ts`

### Mudança
```ts
// Antes
payment_method_types: ["card"],

// Depois
payment_method_types: ["card", "pix", "boleto"],
```

### Detalhes
- `"card"` cobre crédito e débito automaticamente no Stripe
- `"pix"` exige moeda BRL (já configurado) e tem expiração padrão de 1h no Checkout
- `"boleto"` exige moeda BRL e prazo padrão de 3 dias para vencimento
- O Stripe renderiza as abas de método automaticamente no Checkout — nenhuma mudança de UI necessária no frontend
- Sem necessidade de configuração adicional para assinaturas via Stripe Checkout

### Restrições
- Verificar no Stripe Dashboard que os métodos Pix e Boleto estão habilitados para a conta

---

## Seção 2 — Página de Sucesso `/checkout/success`

### Objetivo
Substituir o redirect pós-checkout direto para `/admin` por uma página de confirmação dedicada que fecha o loop visual do pagamento.

### Arquivo novo
`src/app/checkout/success/page.tsx`

### Comportamento
1. Usuário conclui checkout no Stripe
2. Stripe redireciona para `/checkout/success?plan=Creator` (ou `Pro`)
3. Página exibe confirmação com: nome do plano contratado, número de créditos disponíveis, mensagem de boas-vindas
4. Após 5 segundos, redireciona automaticamente para `/dashboard`
5. Botão "Ir ao Dashboard" disponível para quem não quiser esperar

### Dados exibidos
- Nome do plano via query param `?plan=`
- Créditos do plano (mapeamento local: Creator=100, Pro=200) — não depende do webhook ter chegado
- Data do próximo ciclo (calculada localmente: hoje + 30 dias para mensal)

> **Nota sobre assincronicidade:** O webhook do Stripe pode chegar após o redirect. A página não deve tentar buscar dados do banco em tempo real — usa os dados do query param para exibição imediata e redireciona para o dashboard onde os dados reais estarão disponíveis.

### Redirect de sucesso no checkout
```ts
// Antes (em /api/checkout/route.ts)
success_url: `${baseUrl}/admin?checkout=success&plan=${planName}`,

// Depois
success_url: `${baseUrl}/checkout/success?plan=${planName}`,
```

### Design visual
- Fundo escuro consistente com o restante do app (`bg-[#0a0a0f]`)
- Ícone de check animado (Framer Motion)
- Card central com informações do plano
- Contador regressivo de 5s visível
- Botão CTA para dashboard

---

## Seção 3 — Histórico de Faturas

### Objetivo
Substituir o placeholder "Histórico de faturas disponível em breve" por dados reais do Stripe.

### Arquivos
- `src/server/actions/subscription.ts` — nova action `getInvoices()`
- `src/app/admin/billing/BillingClient.tsx` — renderiza a lista de faturas
- `src/app/admin/billing/page.tsx` — busca faturas no servidor e passa para o client

### Server Action `getInvoices()`
```ts
// Busca até 10 faturas mais recentes do cliente no Stripe
// Retorna: id, amount_paid, status, created, hosted_invoice_url, invoice_pdf
```

### Fluxo de dados
1. `BillingPage` (Server Component) chama `stripe.invoices.list({ customer: stripeCustomerId, limit: 10 })`
2. Passa resultado como prop para `BillingClient`
3. `BillingClient` renderiza tabela

### Tabela de faturas
Colunas: Data | Valor | Status | PDF

Status mapeados:
- `paid` → "Pago" (verde)
- `open` → "Em aberto" (amarelo)
- `void` → "Cancelada" (cinza)
- `uncollectible` → "Não cobrada" (vermelho)

### Caso sem assinatura
Se `stripeCustomerId` for null (usuário FREE sem histórico), manter mensagem vazia elegante no lugar da tabela.

---

## Seção 4 — Alerta de Créditos Baixos

### Objetivo
Avisar o usuário no dashboard quando seus créditos estiverem abaixo de 20% do limite do plano, incentivando upgrade.

### Arquivo
`src/app/dashboard/page.tsx`

### Lógica
```ts
// Já calculado na página:
const creditPercent = Math.min(100, Math.round((balance / maxCredits) * 100));

// Banner exibido se:
if (creditPercent <= 20) { /* renderiza banner */ }
```

### Banner visual
- Posição: entre os cards de stats e as ações rápidas
- Cor: fundo âmbar/laranja com borda (`bg-amber-500/10 border-amber-500/20`)
- Conteúdo: ícone de alerta + texto "Seus créditos estão acabando. Faça upgrade para continuar gerando." + link para `/#pricing`
- Não exibido para usuários PRO com créditos baixos (já estão no plano máximo) — exibir mensagem alternativa: "Seus créditos renovam em X dias"

---

## Ordem de Implementação

1. **Métodos de pagamento** — 1 linha, deploy imediato, maior impacto na conversão
2. **Página de sucesso** — fecha o loop do checkout, nova rota isolada
3. **Histórico de faturas** — depende do `stripeCustomerId` salvo no banco (já está)
4. **Alerta de créditos** — última, lógica simples no dashboard existente

---

## Arquivos Afetados

| Arquivo | Tipo de mudança |
|---|---|
| `src/app/api/checkout/route.ts` | Edição — métodos de pagamento + redirect de sucesso |
| `src/app/checkout/success/page.tsx` | Novo arquivo |
| `src/server/actions/subscription.ts` | Adição — `getInvoices()` |
| `src/app/admin/billing/page.tsx` | Edição — busca faturas |
| `src/app/admin/billing/BillingClient.tsx` | Edição — tabela de faturas |
| `src/app/dashboard/page.tsx` | Edição — banner de créditos baixos |

---

## Fora do Escopo

- Upgrade/downgrade de plano dentro do app (próxima fase)
- Reativação de assinatura cancelada (próxima fase)
- Gestão de método de pagamento (próxima fase)
- Stripe Customer Portal
