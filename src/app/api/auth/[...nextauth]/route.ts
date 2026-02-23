// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { env, assertServerEnv } from "@/lib/env";

assertServerEnv();

const providers = [
  CredentialsProvider({
    name: "Email e senha",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Senha", type: "password" },
    },
    async authorize(credentials) {
      const email = String(credentials?.email ?? "").toLowerCase().trim();
      const password = String(credentials?.password ?? "");

      // owner-only gate
      if (!email || email !== env.adminEmail) return null;
      if (!password) return null;

      // MVP simples: passwordHash vem do banco (se existir), senão do ENV.
      // Eu recomendo manter no DB (seu script set:pw provavelmente faz isso).
      const user = await prisma.user.findUnique({ where: { email } });

      const passwordHash = user?.passwordHash || env.adminPasswordHash;
      if (!passwordHash) return null;

      const ok = await bcrypt.compare(password, passwordHash);
      if (!ok) return null;

      // garante que existe usuário no DB pra sessão/adapter (se não existir, cria)
      const ensuredUser =
        user ??
        (await prisma.user.create({
          data: { email, name: "Owner" },
        }));

      return { id: ensuredUser.id, email: ensuredUser.email, name: ensuredUser.name };
    },
  }),
];

// Google é opcional: só adiciona se as vars existirem
const hasGoogle = !!env.googleClientId && !!env.googleClientSecret;
if (hasGoogle) {
  providers.unshift(
    GoogleProvider({
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
      allowDangerousEmailAccountLinking: false,
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers,

  callbacks: {
    async signIn({ user, profile, account }) {
      const email =
        String(user?.email ?? (profile as any)?.email ?? "")
          .toLowerCase()
          .trim();

      // Bloqueia tudo que não for owner
      if (!email || email !== env.adminEmail) return false;

      // Extra: para Google, exige email verificado (boa prática)
      if (account?.provider === "google") {
        const emailVerified = Boolean((profile as any)?.email_verified);
        if (!emailVerified) return false;
      }

      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
