"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function onLogout() {
    try {
      setLoading(true);

      // chama API que limpa o cookie
      await fetch("/api/logout", { method: "POST" });

      // manda pra home (tela do Entrar) e revalida
      router.replace("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-14">
      {/* Topo centralizado */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/80" />
          Área logada • MVP
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
          Dashboard
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-white/65">
          Acesse as ferramentas do MVP. Comece cadastrando seus produtos e depois
          simule ROI por campanha.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/produtos"
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
          >
            Ir para Produtos
          </Link>

          <Link
            href="/simulador"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            Abrir Simulador
          </Link>

          <button
            type="button"
            onClick={onLogout}
            disabled={loading}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 disabled:opacity-60"
          >
            {loading ? "Saindo..." : "Sair"}
          </button>
        </div>
      </div>

      {/* Cards centralizados */}
      <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2">
        <ToolCard
          href="/produtos"
          title="Cadastro de Produtos"
          badge="Primeiro passo"
          description="Cadastre preço e custo. Isso alimenta o simulador e evita conta manual."
          icon={<IconBox />}
          highlights={[
            "Preço e custo por produto",
            "Base para simulação",
            "MVP (localStorage)",
          ]}
        />

        <ToolCard
          href="/simulador"
          title="Simulador de ROI / Tráfego Pago"
          badge="Simulação"
          description="Informe investimento, CPC e conversão para visualizar ROAS, CAC e lucro."
          icon={<IconChart />}
          highlights={[
            "Cliques → pedidos",
            "ROAS, ROI e CAC",
            "Dicas para iniciantes",
          ]}
        />
      </div>
    </main>
  );
}

function ToolCard({
  href,
  title,
  description,
  badge,
  icon,
  highlights,
}: {
  href: string;
  title: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
  highlights: string[];
}) {
  return (
    <Link
      href={href}
      className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition hover:bg-white/[0.05]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-white/65">
            {badge}
          </div>

          <h2 className="mt-3 text-lg font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/65">
            {description}
          </p>
        </div>

        <div className="shrink-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/10 text-white/80 transition group-hover:border-white/20 group-hover:bg-black/20">
            {icon}
          </div>
        </div>
      </div>

      <ul className="mt-4 grid gap-2 text-sm text-white/60">
        {highlights.map((x) => (
          <li key={x} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-300/80" />
            <span className="min-w-0">{x}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-violet-200/90">
        Abrir
        <span className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </div>

      {/* brilho sutil */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/5" />
    </Link>
  );
}

function Tip({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-amber-200/10 bg-amber-400/[0.06] p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200/10 bg-amber-400/10">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-amber-200"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M12 2a7 7 0 0 0-4 12c.6.5 1 1.2 1 2v1h6v-1c0-.8.4-1.5 1-2A7 7 0 0 0 12 2Z" />
          </svg>
        </span>

        <div className="min-w-0">
          <div className="text-sm font-semibold text-amber-100">{title}</div>
          <div className="mt-1 text-sm leading-relaxed text-white/70">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function IconBox() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M21 8l-9-5-9 5 9 5 9-5Z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M7 15l3-3 3 2 4-5" />
      <path d="M17 9h0" />
    </svg>
  );
}
