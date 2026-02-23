"use client";

import * as React from "react";
import { signIn } from "next-auth/react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  hasGoogle?: boolean;
};

export function LoginForm({ hasGoogle = true }: Props) {
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
      setMessage("Não foi possível entrar. Acesso restrito ao proprietário.");
      return;
    }

    // redireciona manualmente
    window.location.href = res.url ?? "/";
  }

  async function onGoogle() {
    setMessage(null);
    setLoading(true);
    // redireciona pelo próprio provider
    await signIn("google", { callbackUrl: "/" });
  }

  return (
    <div className="mt-6 max-w-md rounded-2xl border border-slate-200 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40">
      <div className="space-y-1">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Acesso restrito ao proprietário.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <input
            autoComplete="email"
            inputMode="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cx(
              "w-full rounded-xl border px-3 py-2 text-sm outline-none transition",
              "border-slate-200 bg-white focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-600"
            )}
            placeholder="seuemail@dominio.com"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Senha</label>
          <input
            autoComplete="current-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cx(
              "w-full rounded-xl border px-3 py-2 text-sm outline-none transition",
              "border-slate-200 bg-white focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-600"
            )}
            placeholder="••••••••"
          />
        </div>

        {message ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
            {message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className={cx(
            "w-full rounded-xl px-3 py-2 text-sm font-medium transition",
            "bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          )}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {hasGoogle ? (
          <>
            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ou
              </span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <button
              type="button"
              onClick={onGoogle}
              disabled={loading}
              className={cx(
                "w-full rounded-xl border px-3 py-2 text-sm font-medium transition",
                "border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
              )}
            >
              Continuar com Google
            </button>
          </>
        ) : null}
      </form>

      <div className="mt-4 flex items-center justify-between text-sm">
        <a
          href="/"
          className="text-slate-600 underline underline-offset-4 dark:text-slate-300"
        >
          Voltar
        </a>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Marketing Digital • MVP
        </span>
      </div>
    </div>
  );
}
