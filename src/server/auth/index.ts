import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/email";

function getNextMonthDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Dados inválidos");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("Usuário não encontrado");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Senha incorreta");
        }

        return user;
      }
    }),
  ],
  pages: {
    signIn: "/login",
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
        if (session.plan) token.plan = session.plan;
        if (session.role) token.role = session.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        session.user.plan = token.plan as any;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Inicializa créditos para novos usuários (Free = 10)
      await db.credit.create({
        data: {
          userId: user.id,
          balance: 10,
          resetAt: getNextMonthDate(),
        },
      });

      // Send Welcome Email
      if (user.email) {
        await sendWelcomeEmail(user.email, user.name);
      }
    },
  },
};

export default NextAuth(authOptions);
