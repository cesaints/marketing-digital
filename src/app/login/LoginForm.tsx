"use client";

import * as React from "react";
import { signIn } from "next-auth/react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function LoginForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/",
    });

    setLoading(false);

    if (!res?.ok) {
      setMessage("Acesso negado. Este app está em modo proprietário (MVP).");
      return;
    }

    window.location.href = res.url ?? "/";
  }

  return (
    <div className="mt-6 max-w-md">
      <div className="card p-5 shadow-[0_0_0_1px_rgba(124,58,237,0.12),0_20px_60px_rgba(0,0,0,0.45)]">
        <p className="text-sm text-neutral-300">
          Acesso restrito ao proprietário.
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-200">
              Email
            </label>
            <input
              autoComplete="email"
              inputMode="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cx(
                "w-full rounded-xl border px-3 py-2 text-sm outline-none transition",
                "border-neutral-800 bg-neutral-950/40 focus:border-violet-500/60"
              )}
              placeholder="seuemail@dominio.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-200">
              Senha
            </label>
            <input
              autoComplete="current-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cx(
                "w-full rounded-xl border px-3 py-2 text-sm outline-none transition",
                "border-neutral-800 bg-neutral-950/40 focus:border-violet-500/60"
              )}
              placeholder="••••••••"
            />
          </div>

          {message ? (
            <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-200">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className={cx(
              "w-full rounded-xl px-3 py-2 text-sm font-semibold transition",
              "bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-60"
            )}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
          <a href="/" className="underline underline-offset-4">
            Voltar
          </a>
          <span>Marketing Digital • MVP</span>
        </div>
      </div>
    </div>
  );
}
