import NextAuth, { type NextAuthOptions } from "next-auth";
import type { Provider } from "next-auth/providers";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { env, assertServerEnv } from "@/lib/env";

assertServerEnv();

const credentialsProvider = CredentialsProvider({
  name: "Email e senha",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Senha", type: "password" },
  },
  async authorize(credentials) {
    const email = String(credentials?.email ?? "").toLowerCase().trim();
    const password = String(credentials?.password ?? "");

    if (!email || email !== env.adminEmail) return null;
    if (!password) return null;

    const user = await prisma.user.findUnique({ where: { email } });

    const passwordHash = user?.passwordHash || env.adminPasswordHash;
    if (!passwordHash) return null;

    const ok = await bcrypt.compare(password, passwordHash);
    if (!ok) return null;

    const ensuredUser =
      user ??
      (await prisma.user.create({
        data: { email, name: "Owner" },
      }));

    return { id: ensuredUser.id, email: ensuredUser.email, name: ensuredUser.name };
  },
});

const googleEnabled = Boolean(env.googleClientId && env.googleClientSecret);

const googleProvider: Provider | null = googleEnabled
  ? GoogleProvider({
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
      allowDangerousEmailAccountLinking: false,
    })
  : null;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  pages: { signIn: "/login", error: "/login" },

  providers: [
    ...(googleProvider ? [googleProvider] : []),
    credentialsProvider,
  ],

  callbacks: {
    async signIn({ user, profile, account }) {
      const email =
        String(user?.email ?? (profile as any)?.email ?? "")
          .toLowerCase()
          .trim();

      if (!email || email !== env.adminEmail) return false;

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
