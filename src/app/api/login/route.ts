import { NextResponse } from "next/server";
import { COOKIE_NAME, signSession } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "");
  const password = String(body?.password ?? "");

  const adminEmail = process.env.ADMIN_EMAIL ?? "";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  const secret = process.env.SESSION_SECRET ?? "";

  if (!adminEmail || !adminPassword || !secret) {
    return NextResponse.json(
      { ok: false, error: "Configuração de login ausente no servidor." },
      { status: 500 }
    );
  }

  const ok =
    email.toLowerCase() === adminEmail.toLowerCase() &&
    password === adminPassword;

  if (!ok) {
    return NextResponse.json(
      { ok: false, error: "Email ou senha inválidos." },
      { status: 401 }
    );
  }

  const token = await signSession({ email, role: "admin", iat: Date.now() }, secret);

  const res = NextResponse.json({ ok: true });

  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
