// src/lib/env.ts
export const env = {
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
  nextAuthUrl: process.env.NEXTAUTH_URL,

  adminEmail: (process.env.ADMIN_EMAIL ?? "").toLowerCase().trim(),
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH ?? "",

  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
};

export function assertServerEnv() {
  const missing: string[] = [];

  if (!env.nextAuthSecret) missing.push("NEXTAUTH_SECRET");
  if (!env.adminEmail) missing.push("ADMIN_EMAIL");
  if (!env.adminPasswordHash) missing.push("ADMIN_PASSWORD_HASH");

  // Google é opcional no MVP — só valida se algum foi preenchido
  const hasAnyGoogle = !!env.googleClientId || !!env.googleClientSecret;
  if (hasAnyGoogle) {
    if (!env.googleClientId) missing.push("GOOGLE_CLIENT_ID");
    if (!env.googleClientSecret) missing.push("GOOGLE_CLIENT_SECRET");
  }

  if (missing.length) {
    throw new Error(
      `Missing required env vars: ${missing.join(", ")}. Check your .env file.`
    );
  }
}
