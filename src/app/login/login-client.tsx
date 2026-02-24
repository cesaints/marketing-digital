"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/dashboard";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const r = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await r.json().catch(() => ({}));

      if (!r.ok) {
        setError(data?.error || "Não foi possível entrar.");
        return;
      }

      router.replace(next);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[100svh] px-6 py-10">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-6xl items-center justify-center">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
            <h1 className="text-center text-xl font-semibold text-white">
              Entrar
            </h1>

            <form onSubmit={onSubmit} className="mt-6 grid gap-4">
              <div>
                <label className="text-sm font-medium text-white/80">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-violet-400/30"
                  placeholder="seuemail@dominio.com"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white/80">
                  Senha
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete="current-password"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-violet-400/30"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                className="rounded-xl bg-violet-600 py-2.5 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-60"
                type="submit"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>

              <div className="flex items-center justify-between text-xs text-white/55">
                <Link href="/" className="hover:text-white/80">
                  Voltar
                </Link>

                <span className="text-white/35">Acesso restrito</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
