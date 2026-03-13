# FotoPro AI — Sprint 2: Técnicas de Monetização Passiva

> **Baseado em:** Posts virais X/Twitter (2026) sobre SaaS passivo com Claude Code + Gemini
> **Objetivo:** Transformar o FotoPro em máquina de renda passiva recorrente

---

## Mapa de Técnicas → Implementação

| # | Técnica | Status | Prioridade | Sprint |
|---|---------|--------|------------|--------|
| 1 | Prompt Optimizer (JSON → Gemini) | 🔧 Parcial | 🔴 Alta | 2 |
| 2 | Sistema de Créditos conectado | 🔧 Parcial | 🔴 Alta | 2 |
| 3 | Referral System ("indique e ganhe") | ❌ Não existe | 🔴 Alta | 2 |
| 4 | SEO Automático (sitemap, OG, meta) | ❌ Não existe | 🔴 Alta | 2 |
| 5 | Watermark no plano Free | ❌ Não existe | 🟡 Média | 2 |
| 6 | Stripe Webhook | ❌ Não existe | 🟡 Média | 2 |
| 7 | Email automático (welcome, low credits) | ❌ Não existe | 🟢 Baixa | 3 |
| 8 | Revenue Dashboard real | 🔧 Mock data | 🟢 Baixa | 3 |
| 9 | White-label / Template vendável | ❌ Não existe | 🟢 Baixa | 4 |

---

## O Que Já Temos (Sprint 1)

- ✅ Schema Prisma com User, Credit, Subscription, Generation
- ✅ NextAuth (Google + Credentials) com JWT
- ✅ Middleware protegendo rotas
- ✅ Server Actions (generation, user, subscription)
- ✅ Server Queries (generations, users, stats)
- ✅ Gemini API route (`/api/gemini`) com `enhance_prompt`
- ✅ Generate page com drag-and-drop + enhance
- ✅ Register route (`/api/auth/register`) com bcrypt
- ✅ Explore page com galeria de prompts

## O Que Falta Conectar

- ❌ Credits hardcoded (14) na generate page → precisa ler do DB
- ❌ Explore page `hasPremium = true` hardcoded → precisa ler do session
- ❌ Generate page não chama Server Action → simula com setTimeout
- ❌ Admin dashboard com dados mock → precisa das server queries
- ❌ Sem referral, sem SEO, sem watermark

---

## Implementação Detalhada

### 1. Prompt Optimizer (Técnica @mikefutia)

**Já temos:** `/api/gemini` com `enhance_prompt` action
**Falta:** Estruturar o prompt como JSON otimizado (lighting, camera, style, negative prompts)

**Arquivo:** `src/app/api/gemini/route.ts`

Melhorar o system prompt para retornar JSON estruturado:
```json
{
  "enhanced_prompt": "full optimized prompt in English",
  "style": "photorealistic | anime | artistic",
  "lighting": "studio | natural | dramatic",
  "camera": "85mm portrait | wide angle | macro",
  "negative_prompts": "blurry, low quality, watermark"
}
```

**Impacto:** Resultados 10x melhores → usuários gastam mais créditos → mais receita.

### 2. Créditos Reais nas Páginas

**Arquivos a modificar:**
- `src/app/generate/page.tsx` → ler créditos via `getUserCredits()`, decrementar via `generateImage()`
- `src/app/explore/page.tsx` → `hasPremium` baseado em `session.user.plan !== "FREE"`
- `src/app/upload/page.tsx` → mesma lógica de créditos

### 3. Referral System

**Novo model no Prisma:**
```prisma
model Referral {
  id           String   @id @default(cuid())
  referrerId   String
  referredId   String   @unique
  creditAwarded Boolean @default(false)
  createdAt    DateTime @default(now())

  referrer User @relation("referrals_given", fields: [referrerId], references: [id])
  referred User @relation("referral_received", fields: [referredId], references: [id])

  @@index([referrerId])
  @@map("referrals")
}
```

**Campo novo no User:**
```prisma
referralCode  String   @unique @default(cuid())
```

**Fluxo:**
1. Todo usuário recebe um `referralCode` único ao criar conta
2. Link de convite: `fotopro.ai/?ref=CODIGO`
3. Novo usuário se cadastra com o código
4. Ambos ganham 10 créditos (referrer + referred)
5. Máximo de 50 referrals por usuário (anti-abuse)

### 4. SEO Automático

**Novos arquivos:**
- `src/app/sitemap.ts` → Sitemap dinâmico
- `src/app/robots.ts` → robots.txt
- `src/app/opengraph-image.tsx` → OG image dinâmica
- Melhorar `metadata` em cada page

### 5. Watermark no Plano Free

**Lógica:** Imagens geradas por usuários Free recebem watermark "FotoPro AI" no canto.
Usuários Creator/Pro recebem imagem limpa.

**Implementação:** No Server Action `generateImage`, após receber a imagem da API:
- Se `user.plan === "FREE"` → aplicar watermark via Canvas API (server-side)
- Se `user.plan !== "FREE"` → entregar imagem limpa

### 6. Stripe Webhook

**Arquivo:** `src/app/api/webhooks/stripe/route.ts`

Eventos a tratar:
- `checkout.session.completed` → Criar/atualizar Subscription + Credits
- `invoice.payment_succeeded` → Renovar créditos mensais
- `customer.subscription.deleted` → Downgrade para FREE
- `invoice.payment_failed` → Marcar como PAST_DUE

---

## Checklist Sprint 2

- [ ] Atualizar schema Prisma (+ Referral model + referralCode no User)
- [ ] Migrar banco (`prisma migrate dev --name add_referral_system`)
- [ ] Melhorar `/api/gemini` com prompt JSON estruturado
- [ ] Conectar créditos reais no generate page
- [ ] Conectar `hasPremium` real no explore page
- [ ] Implementar Server Action de referral
- [ ] Criar `/api/webhooks/stripe/route.ts`
- [ ] Criar `src/app/sitemap.ts`
- [ ] Criar `src/app/robots.ts`
- [ ] Implementar watermark para Free
- [ ] Verificar build final
