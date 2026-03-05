# FotoPro AI — Sprint 1: Backend, Banco de Dados & Autenticação

> **Stack:** Next.js 16 App Router · Prisma 7 · Supabase (Postgres) · NextAuth v4 · Tailwind CSS v4
> **Data:** 05/03/2026 · **Status:** Planejamento

---

## Sumário

1. [Arquitetura Geral](#1-arquitetura-geral)
2. [Banco de Dados — Schema Prisma](#2-banco-de-dados--schema-prisma)
3. [Autenticação — NextAuth + Middleware](#3-autenticação--nextauth--middleware)
4. [API Routes & Server Actions](#4-api-routes--server-actions)
5. [Estrutura de Pastas](#5-estrutura-de-pastas)
6. [Regras de UI — Tailwind CSS v4](#6-regras-de-ui--tailwind-css-v4)
7. [Variáveis de Ambiente](#7-variáveis-de-ambiente)
8. [Checklist de Execução](#8-checklist-de-execução)

---

## 1. Arquitetura Geral

```
┌─────────────────────────────────────────────────┐
│                   CLIENTE                        │
│  Landing · Login · Cadastro · Dashboard · Admin  │
│  (React 19, "use client" onde necessário)        │
└───────────────┬─────────────────────────────────┘
                │
        ┌───────▼────────┐
        │  MIDDLEWARE.TS  │ ← Protege rotas, refresh de sessão
        └───────┬────────┘
                │
┌───────────────▼──────────────────────────────────┐
│              NEXT.JS SERVER                       │
│                                                   │
│  Server Components (RSC)  → Leitura de dados      │
│  Server Actions           → Mutações (CRUD)       │
│  API Routes               → Webhooks, NextAuth    │
│                                                   │
│  src/server/db.ts         → Prisma Client         │
│  src/server/auth/         → NextAuth config        │
│  src/server/actions/      → Server Actions          │
└───────────────┬──────────────────────────────────┘
                │
        ┌───────▼────────┐
        │   SUPABASE     │
        │   PostgreSQL   │ ← Via Prisma ORM
        │   + Storage    │ ← Bucket para imagens (futuro)
        └────────────────┘
```

### Princípios

| Regra | Descrição |
|-------|-----------|
| **Server-first** | Tudo que pode rodar no server, roda no server. `"use client"` só para interatividade. |
| **Prisma como ORM único** | Nunca acessar Supabase Postgres via `supabase-js` para dados. Prisma é a fonte da verdade. |
| **NextAuth para auth** | Sessão via JWT. Middleware faz refresh e proteção de rotas. |
| **Server Actions para mutações** | Formulários e ações do usuário usam `"use server"`. Nada de API REST manual para CRUD. |
| **API Routes só para webhooks** | `src/app/api/` reservado para NextAuth handler e webhooks externos (Stripe, etc). |

---

## 2. Banco de Dados — Schema Prisma

### 2.1 Diagnóstico do Schema Atual

O schema em `prisma/schema.prisma` tem o mínimo do NextAuth + um model `Generation` básico. Problemas:

| Problema | Impacto |
|----------|---------|
| Sem `@@index` em nenhuma FK | Queries lentas em joins |
| Sem `@@map` nos models | Nomes de tabela em PascalCase (não padrão SQL) |
| `User.plan` é `String` | Sem validação, aceita qualquer valor |
| Sem model de `Subscription` | Não rastreia billing, datas, status |
| Sem model de `Credit` | Não controla saldo de gerações |
| `Generation` não armazena estilo nem resolução | Dados insuficientes para analytics |
| Sem `updatedAt` nos models | Impossível saber quando dados mudaram |
| Sem campo `role` no `User` | Não diferencia admin de usuário |

### 2.2 Schema Proposto

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────
// AUTENTICAÇÃO (NextAuth obrigatório)
// ─────────────────────────────────────────

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ─────────────────────────────────────────
// CORE: USERS
// ─────────────────────────────────────────

enum Role {
  USER
  ADMIN
}

enum Plan {
  FREE
  CREATOR
  PRO
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          Role      @default(USER)
  plan          Plan      @default(FREE)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts      Account[]
  sessions      Session[]
  subscription  Subscription?
  credits       Credit?
  generations   Generation[]

  @@index([email])
  @@index([plan])
  @@map("users")
}

// ─────────────────────────────────────────
// BILLING: SUBSCRIPTIONS
// ─────────────────────────────────────────

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  PAST_DUE
  TRIALING
  UNPAID
}

model Subscription {
  id                   String             @id @default(cuid())
  userId               String             @unique
  plan                 Plan
  status               SubscriptionStatus @default(ACTIVE)
  stripeCustomerId     String?            @unique
  stripeSubscriptionId String?            @unique
  stripePriceId        String?
  currentPeriodStart   DateTime
  currentPeriodEnd     DateTime
  cancelAtPeriodEnd    Boolean            @default(false)
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([status])
  @@index([stripeCustomerId])
  @@map("subscriptions")
}

// ─────────────────────────────────────────
// CRÉDITOS: CONTROLE DE GERAÇÕES
// ─────────────────────────────────────────

model Credit {
  id          String   @id @default(cuid())
  userId      String   @unique
  balance     Int      @default(10) // Free = 10 créditos iniciais
  totalUsed   Int      @default(0)
  resetAt     DateTime // Próximo reset mensal
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("credits")
}

// ─────────────────────────────────────────
// CORE: GERAÇÕES DE IMAGENS
// ─────────────────────────────────────────

enum GenerationStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

enum ImageQuality {
  HD      // 1080p
  FULL_HD // 1920x1080
  QHD     // 2K
  UHD     // 4K
}

model Generation {
  id          String           @id @default(cuid())
  userId      String
  prompt      String
  style       String?          // ex: "elden_ring_real", "jjk_anime"
  imageUrl    String?          // URL no storage (preenchido após conclusão)
  originalUrl String?          // URL da foto original enviada
  status      GenerationStatus @default(PENDING)
  quality     ImageQuality     @default(HD)
  width       Int?
  height      Int?
  duration    Int?             // Tempo de geração em ms
  error       String?          // Mensagem de erro se FAILED
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([userId, createdAt(sort: Desc)])
  @@index([status])
  @@index([createdAt(sort: Desc)])
  @@map("generations")
}
```

### 2.3 Índices — Justificativa

| Índice | Query que serve |
|--------|-----------------|
| `Account.@@index([userId])` | Buscar contas OAuth de um usuário |
| `Session.@@index([userId])` | Listar sessões ativas do usuário |
| `User.@@index([email])` | Login por email (NextAuth lookup) |
| `User.@@index([plan])` | Dashboard admin: filtrar por plano |
| `Subscription.@@index([status])` | Listar assinaturas ativas/canceladas |
| `Subscription.@@index([stripeCustomerId])` | Webhook Stripe busca por customer |
| `Generation.@@index([userId])` | Galeria do usuário |
| `Generation.@@index([userId, createdAt])` | Galeria ordenada por data (composto) |
| `Generation.@@index([status])` | Queue de processamento: buscar pendentes |
| `Generation.@@index([createdAt])` | Admin: listar gerações recentes globais |

### 2.4 Fluxo de Créditos

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  CADASTRO    │     │  GERAR FOTO  │     │  RESET MENSAL│
│              │     │              │     │              │
│ Free → 10    │     │ balance -= 1 │     │ balance =    │
│ Creator→100  │     │ totalUsed+=1 │     │  plan.quota  │
│ Pro → 200    │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
```

| Plano | Créditos/mês | Qualidade máxima |
|-------|-------------|------------------|
| FREE | 10 | HD (1080p) |
| CREATOR | 100 | HD (1080p) |
| PRO | 200 | UHD (4K) |

### 2.5 Migrations — Workflow

```bash
# 1. Desenvolvimento (local)
npx prisma migrate dev --name init_full_schema

# 2. Gerar Prisma Client
npx prisma generate

# 3. Produção (Supabase)
npx prisma migrate deploy

# ⚠️ NUNCA usar `migrate dev` em produção
# ⚠️ NUNCA usar `migrate reset` em produção
```

---

## 3. Autenticação — NextAuth + Middleware

### 3.1 Arquitetura de Sessão

```
Browser → Middleware → Server Component → Prisma
           │                  │
           ▼                  ▼
     Valida JWT        getServerSession()
     Redirect se       Lê user do token
     não autenticado   Passa dados pro RSC
```

| Componente | Método de acesso à sessão |
|------------|---------------------------|
| **Middleware** | `getToken()` do `next-auth/jwt` |
| **Server Component** | `getServerSession(authOptions)` |
| **Server Action** | `getServerSession(authOptions)` |
| **Client Component** | `useSession()` via `<SessionProvider>` |
| **API Route** | `getServerSession(authOptions)` |

### 3.2 Arquivo: `src/middleware.ts` (NOVO)

Proteção de rotas + refresh automático de JWT:

```typescript
// src/middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas que EXIGEM autenticação
const protectedPaths = [
  "/admin",
  "/upload",
  "/generate",
  "/explore",
];

// Rotas que EXIGEM role ADMIN
const adminPaths = [
  "/admin/users",
  "/admin/billing",
  "/admin/settings",
];

// Rotas acessíveis SOMENTE para não-autenticados
const authPaths = ["/login", "/cadastro"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request });

  // 1. Se está numa rota de auth e JÁ está logado → redireciona pro admin
  if (authPaths.some(path => pathname.startsWith(path))) {
    if (token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // 2. Se está numa rota protegida e NÃO está logado → redireciona pro login
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Se está numa rota admin e NÃO é ADMIN → redireciona pro dashboard
  if (adminPaths.some(path => pathname.startsWith(path))) {
    if (token && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Aplica middleware em TODAS as rotas exceto assets e API interna
    "/((?!_next/static|_next/image|favicon.ico|generated|api/auth).*)",
  ],
};
```

### 3.3 Atualizar: `src/server/auth/index.ts`

Mudanças necessárias no auth config existente:

```typescript
// src/server/auth/index.ts

import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/server/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Futuramente: CredentialsProvider para email/senha
  ],
  pages: {
    signIn: "/login",
    newUser: "/cadastro", // Redirect após primeiro login
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Primeiro login: adiciona dados do DB ao token
      if (user) {
        token.id = user.id;
        token.role = (user as any).role ?? "USER";
        token.plan = (user as any).plan ?? "FREE";
      }

      // Quando session é atualizada via update() no client
      if (trigger === "update" && session) {
        token.plan = session.plan;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.plan = token.plan as string;
      }
      return session;
    },
  },
  events: {
    // Ao criar um novo usuário, inicializar créditos
    async createUser({ user }) {
      await db.credit.create({
        data: {
          userId: user.id,
          balance: 10, // Free tier
          resetAt: getNextMonthDate(),
        },
      });
    },
  },
};

function getNextMonthDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

export default NextAuth(authOptions);
```

### 3.4 Tipos de Sessão (Type-safe)

```typescript
// src/types/next-auth.d.ts (NOVO)

import { DefaultSession, DefaultUser } from "next-auth";
import { Role, Plan } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      plan: Plan;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: Role;
    plan: Plan;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    plan: Plan;
  }
}
```

### 3.5 SessionProvider no Layout

```typescript
// src/app/layout.tsx — Mudança necessária

import { SessionProvider } from "@/components/providers/SessionProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${plusJakartaSans.className} ${cabinetGrotesk.variable}`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

```typescript
// src/components/providers/SessionProvider.tsx (NOVO)

"use client";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
```

### 3.6 Helper: getSession (Server-side)

```typescript
// src/server/auth/session.ts (NOVO)

import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";

// Para Server Components e Server Actions
export async function getSession() {
  return getServerSession(authOptions);
}

// Versão que redireciona se não autenticado
export async function requireSession() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

// Versão que exige admin
export async function requireAdmin() {
  const session = await requireSession();
  if (session.user.role !== "ADMIN") {
    redirect("/admin");
  }
  return session;
}
```

### 3.7 Mapa de Rotas — Proteção

| Rota | Acesso | Middleware |
|------|--------|-----------|
| `/` | Público | — |
| `/login` | Só não-autenticados | Redireciona para `/admin` se logado |
| `/cadastro` | Só não-autenticados | Redireciona para `/admin` se logado |
| `/explore` | Autenticado | Redireciona para `/login` |
| `/generate` | Autenticado | Redireciona para `/login` |
| `/upload` | Autenticado | Redireciona para `/login` |
| `/admin` | Autenticado | Redireciona para `/login` |
| `/admin/gallery` | Autenticado | Redireciona para `/login` |
| `/admin/users` | Admin only | Redireciona para `/admin` se USER |
| `/admin/billing` | Admin only | Redireciona para `/admin` se USER |
| `/admin/settings` | Admin only | Redireciona para `/admin` se USER |
| `/api/auth/**` | Público | Excluído do middleware |
| `/api/webhooks/**` | Público (com validação interna) | Excluído do middleware |

---

## 4. API Routes & Server Actions

### 4.1 Server Actions (Mutações)

| Action | Arquivo | Descrição |
|--------|---------|-----------|
| `generateImage` | `src/server/actions/generation.ts` | Valida créditos → cria Generation PENDING → chama API IA → atualiza status |
| `updateProfile` | `src/server/actions/user.ts` | Atualiza nome, email do usuário |
| `cancelSubscription` | `src/server/actions/subscription.ts` | Marca cancelamento no Stripe + DB |
| `upgradePlan` | `src/server/actions/subscription.ts` | Cria checkout Stripe → atualiza plano |
| `deleteGeneration` | `src/server/actions/generation.ts` | Soft-delete ou remove imagem |

Exemplo de estrutura de um Server Action:

```typescript
// src/server/actions/generation.ts
"use server";

import { requireSession } from "@/server/auth/session";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";

export async function generateImage(formData: FormData) {
  const session = await requireSession();
  const prompt = formData.get("prompt") as string;
  const style = formData.get("style") as string;

  // 1. Verificar créditos
  const credit = await db.credit.findUnique({
    where: { userId: session.user.id },
  });

  if (!credit || credit.balance <= 0) {
    return { error: "Créditos insuficientes" };
  }

  // 2. Criar generation + decrementar crédito em transação
  const generation = await db.$transaction(async (tx) => {
    await tx.credit.update({
      where: { userId: session.user.id },
      data: {
        balance: { decrement: 1 },
        totalUsed: { increment: 1 },
      },
    });

    return tx.generation.create({
      data: {
        userId: session.user.id,
        prompt,
        style,
        status: "PENDING",
      },
    });
  });

  // 3. Disparar geração (async, não bloqueia)
  // TODO: Integrar com API de geração (fila ou background job)

  revalidatePath("/admin/gallery");
  return { success: true, generationId: generation.id };
}
```

### 4.2 API Routes (Webhooks)

| Route | Arquivo | Descrição |
|-------|---------|-----------|
| `POST /api/auth/[...nextauth]` | Já existe | Handler NextAuth |
| `POST /api/webhooks/stripe` | `src/app/api/webhooks/stripe/route.ts` | Webhook Stripe: atualiza Subscription + Credits |

### 4.3 Queries (Server Components)

Consultas de leitura ficam diretamente nos Server Components ou em funções helper:

```typescript
// src/server/queries/generations.ts
import { db } from "@/server/db";

export async function getUserGenerations(userId: string, page = 1, limit = 20) {
  return db.generation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
    select: {
      id: true,
      prompt: true,
      style: true,
      imageUrl: true,
      status: true,
      quality: true,
      createdAt: true,
    },
  });
}

export async function getAdminStats() {
  const [totalUsers, totalGenerations, activeSubscriptions] = await db.$transaction([
    db.user.count(),
    db.generation.count(),
    db.subscription.count({ where: { status: "ACTIVE" } }),
  ]);

  return { totalUsers, totalGenerations, activeSubscriptions };
}
```

---

## 5. Estrutura de Pastas

```
src/
├── app/
│   ├── layout.tsx                 ← + SessionProvider
│   ├── globals.css                (sem mudanças)
│   ├── page.tsx                   (landing — público)
│   ├── login/page.tsx             ← Integrar signIn()
│   ├── cadastro/page.tsx          ← Integrar signIn() com redirect
│   ├── explore/page.tsx           ← RSC + query getUserGenerations
│   ├── generate/page.tsx          ← Server Action generateImage
│   ├── upload/page.tsx            ← Server Action generateImage
│   ├── admin/
│   │   ├── page.tsx               ← RSC + getAdminStats()
│   │   ├── gallery/page.tsx       ← RSC + getAllGenerations()
│   │   ├── users/page.tsx         ← RSC + getAllUsers() [ADMIN]
│   │   ├── billing/page.tsx       ← RSC + getSubscriptions() [ADMIN]
│   │   └── settings/page.tsx      ← Server Actions [ADMIN]
│   └── api/
│       ├── auth/[...nextauth]/route.ts   (sem mudanças)
│       └── webhooks/
│           └── stripe/route.ts    (NOVO)
│
├── components/
│   ├── providers/
│   │   └── SessionProvider.tsx    (NOVO)
│   ├── ui/                        (shadcn — sem mudanças)
│   ├── animate-ui/                (sem mudanças)
│   ├── AdminSidebarLayout.tsx     ← Mostrar role/plan do useSession
│   └── ...landing components      (sem mudanças)
│
├── server/
│   ├── db.ts                      (sem mudanças)
│   ├── auth/
│   │   ├── index.ts               ← Atualizar callbacks + events
│   │   └── session.ts             (NOVO) helpers getSession/requireSession
│   ├── actions/
│   │   ├── generation.ts          (NOVO) generateImage, deleteGeneration
│   │   ├── user.ts                (NOVO) updateProfile
│   │   └── subscription.ts        (NOVO) upgradePlan, cancelSubscription
│   └── queries/
│       ├── generations.ts         (NOVO) getUserGenerations, getAllGenerations
│       ├── users.ts               (NOVO) getAllUsers, getUserById
│       └── stats.ts               (NOVO) getAdminStats, getRevenueStats
│
├── types/
│   └── next-auth.d.ts             (NOVO) tipos de sessão
│
├── lib/
│   ├── utils.ts                   (sem mudanças)
│   └── get-strict-context.tsx     (sem mudanças)
│
├── hooks/
│   ├── use-mobile.ts              (sem mudanças)
│   └── use-session-user.ts        (NOVO) hook tipado para dados do user
│
└── middleware.ts                   (NOVO) proteção de rotas
```

### Arquivos Novos (9 arquivos)

| # | Arquivo | Propósito |
|---|---------|-----------|
| 1 | `src/middleware.ts` | Proteção de rotas + redirect |
| 2 | `src/types/next-auth.d.ts` | Tipos de sessão customizados |
| 3 | `src/components/providers/SessionProvider.tsx` | Client wrapper pro NextAuth |
| 4 | `src/server/auth/session.ts` | Helpers getSession/requireSession/requireAdmin |
| 5 | `src/server/actions/generation.ts` | Server Actions de geração |
| 6 | `src/server/actions/user.ts` | Server Actions de perfil |
| 7 | `src/server/actions/subscription.ts` | Server Actions de billing |
| 8 | `src/server/queries/generations.ts` | Queries de leitura (RSC) |
| 9 | `src/server/queries/users.ts` | Queries de admin (RSC) |

### Arquivos Modificados (4 arquivos)

| # | Arquivo | Mudança |
|---|---------|---------|
| 1 | `prisma/schema.prisma` | Schema completo com enums, indexes, @@map |
| 2 | `src/server/auth/index.ts` | Callbacks JWT/session + event createUser |
| 3 | `src/app/layout.tsx` | + SessionProvider wrapper |
| 4 | `src/components/AdminSidebarLayout.tsx` | useSession() para dados reais do user |

---

## 6. Regras de UI — Tailwind CSS v4

### 6.1 Decisões de Arquitetura CSS

Baseado na skill `tailwind-patterns` e no estado atual do `globals.css`:

| Decisão | Regra |
|---------|-------|
| **Config em CSS, não JS** | Já usamos `@theme {}` no `globals.css`. Manter. Nunca voltar para `tailwind.config.ts`. |
| **Dark mode via classe** | `@custom-variant dark (&:is(.dark *))` já configurado. Manter. |
| **Variáveis semânticas** | Usar o sistema `--brand`, `--bg-*`, `--text-*` existente. Nunca hardcodar hex inline. |
| **Componentes > @apply** | Extrair componentes React ao invés de criar mais classes `.btn-*` no CSS. |
| **Mobile-first** | Estilos base = mobile. Prefixos `sm:`, `md:`, `lg:` para telas maiores. |

### 6.2 Inventário de Classes Customizadas — O que Manter

| Classe | Decisão | Motivo |
|--------|---------|--------|
| `.glass-card` | **MANTER** | Usado em 10+ lugares, padrão visual core |
| `.btn-primary` | **MANTER** | Botão CTA principal da landing page |
| `.btn-secondary` | **MANTER** | Botão alternativo |
| `.btn-dark` | **MANTER** | Botão dark em formulários |
| `.btn-outline-login` | **MANTER** | Botão OAuth |
| `.input-field` | **MANTER** | Input padrão de formulários |
| `.badge-*` | **MANTER** | Badges da landing + admin |
| `.separator` | **MANTER** | Separador "OU CONTINUE COM" |
| `.gradient-text` | **MANTER** | Efeito gradiente no texto |
| `.card-glow` | **MANTER** | Borda animada no card popular |
| `.heading-*` | **MANTER** | Tipografia responsiva (clamp) |
| `.grid-*` | **AVALIAR** | Considerar migrar para Tailwind grid utils |
| `.hidden-mobile` | **REMOVER** | Substituir por `hidden sm:flex` nativo |
| `.section-padding` | **MANTER** | Padding responsivo de seção |

### 6.3 Regras para Novos Componentes (Sprint 1+)

| Regra | Implementação |
|-------|---------------|
| **Não criar novas classes CSS globais** | Componentes novos usam classes Tailwind inline |
| **Extrair para componente React quando repetir 3x** | Ex: `<Badge variant="success">` ao invés de nova classe |
| **Cores via variáveis** | `text-[var(--brand)]` ou `bg-brand` (via @theme), nunca `text-[#EAB308]` |
| **Sem inline `style={{}}` em código novo** | Migrar gradualmente os existentes. Código novo = 100% Tailwind |
| **Container queries para componentes reutilizáveis** | Sidebar, cards, modals → `@container` ao invés de breakpoints |

### 6.4 Prioridades de Refactor de UI (pós-Sprint 1)

| Prioridade | Item | Arquivo |
|------------|------|---------|
| 🟡 Média | Migrar `style={{}}` para Tailwind | `src/app/page.tsx` (60+ inline styles) |
| 🟡 Média | Migrar `style={{}}` para Tailwind | `src/app/login/page.tsx` (quase todo inline) |
| 🟢 Baixa | Substituir `.grid-*` por Tailwind grid | `globals.css` |
| 🟢 Baixa | Remover `.hidden-mobile` | `globals.css` + `page.tsx` |
| 🔴 Alta | Footer `© 2024` → `© 2026` | `src/components/Footer.tsx` |

> **Nota:** Essas migrações de UI são para Sprints futuros. Sprint 1 foca exclusivamente em backend + auth + schema.

---

## 7. Variáveis de Ambiente

### 7.1 Arquivo `.env.local` (desenvolvimento)

```env
# ── DATABASE ──
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# ── NEXTAUTH ──
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gerar-com-openssl-rand-base64-32"

# ── GOOGLE OAUTH ──
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"

# ── STRIPE (futuro) ──
# STRIPE_SECRET_KEY="sk_test_xxx"
# STRIPE_WEBHOOK_SECRET="whsec_xxx"
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
```

### 7.2 Arquivo `.env.example` (NOVO — commitar no repo)

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""

# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe (opcional na Sprint 1)
# STRIPE_SECRET_KEY=""
# STRIPE_WEBHOOK_SECRET=""
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
```

### 7.3 Setup Supabase

| Passo | Ação |
|-------|------|
| 1 | Criar projeto no [supabase.com](https://supabase.com) (plano Pro = $25/mês) |
| 2 | Copiar a `DATABASE_URL` de Settings → Database → Connection String → URI |
| 3 | Usar a string no `.env.local` |
| 4 | Rodar `npx prisma migrate dev --name init` para criar as tabelas |
| 5 | Verificar no Supabase Dashboard → Table Editor se as 7 tabelas apareceram |

### 7.4 Setup Google OAuth

| Passo | Ação |
|-------|------|
| 1 | Acessar [console.cloud.google.com](https://console.cloud.google.com) |
| 2 | Criar projeto ou selecionar existente |
| 3 | APIs & Services → OAuth consent screen → Configurar |
| 4 | Credentials → Create → OAuth 2.0 Client ID |
| 5 | Authorized redirect URI: `http://localhost:3000/api/auth/callback/google` |
| 6 | Copiar Client ID e Client Secret pro `.env.local` |

---

## 8. Checklist de Execução

### Fase 1: Database Setup (dia 1)

- [ ] Criar projeto Supabase Pro
- [ ] Copiar `DATABASE_URL`
- [ ] Criar `.env.local` com todas as variáveis
- [ ] Criar `.env.example` (sem secrets)
- [ ] Atualizar `prisma/schema.prisma` com o schema proposto
- [ ] Rodar `npx prisma migrate dev --name init_full_schema`
- [ ] Verificar tabelas no Supabase Dashboard
- [ ] Rodar `npx prisma generate`

### Fase 2: Auth Setup (dia 1-2)

- [ ] Criar `src/types/next-auth.d.ts` (tipos de sessão)
- [ ] Atualizar `src/server/auth/index.ts` (callbacks + events)
- [ ] Criar `src/server/auth/session.ts` (helpers)
- [ ] Criar `src/components/providers/SessionProvider.tsx`
- [ ] Atualizar `src/app/layout.tsx` (+ SessionProvider)
- [ ] Criar `src/middleware.ts` (proteção de rotas)
- [ ] Configurar Google OAuth no Google Cloud Console
- [ ] Testar: login com Google → sessão criada → redirect correto
- [ ] Testar: acessar `/admin` sem login → redirect para `/login`
- [ ] Testar: acessar `/login` logado → redirect para `/admin`

### Fase 3: Server-Side Logic (dia 2-3)

- [ ] Criar `src/server/queries/generations.ts`
- [ ] Criar `src/server/queries/users.ts`
- [ ] Criar `src/server/actions/generation.ts`
- [ ] Criar `src/server/actions/user.ts`
- [ ] Criar `src/server/actions/subscription.ts` (placeholder)
- [ ] Atualizar `src/components/AdminSidebarLayout.tsx` (useSession)
- [ ] Testar: Dashboard admin mostra dados reais do DB

### Fase 4: Verificação Final

- [ ] `npx prisma validate` → sem erros
- [ ] `npm run build` → compila sem erros
- [ ] Fluxo completo: Landing → Login Google → Dashboard → Galeria
- [ ] Middleware: rotas protegidas redirecionam corretamente
- [ ] Middleware: rotas admin bloqueiam USER normal
- [ ] Sessão: `useSession()` retorna `id`, `role`, `plan` no client
- [ ] Sessão: `getServerSession()` funciona em Server Components
- [ ] Créditos: novo usuário recebe 10 créditos ao criar conta
- [ ] Mobile: sidebar funciona com sessão real

---

> **Próximos Sprints (fora do escopo desta Sprint):**
> - Sprint 2: Integração com API de geração de IA + fila de processamento
> - Sprint 3: Stripe Checkout + webhook de billing + upgrade/downgrade
> - Sprint 4: Refactor de UI (migrar inline styles → Tailwind puro)
> - Sprint 5: Storage (Cloudflare R2 ou Supabase Storage) para imagens geradas
