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
      await fetch("/api/logout", { method: "POST" });
      router.replace("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-14">
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/80" />
          Área logada • MVP
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
          Dashboard
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-white/65">
          Acesse as ferramentas do MVP. Comece definindo sua estratégia (QFDP),
          depois cadastre seus produtos e simule ROI por campanha.
        </p>

        {/* Botões do topo: responsivos e consistentes */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/estrategia"
            className="w-full rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 sm:w-auto"
          >
            Abrir QFDP & Gestão
          </Link>

          <Link
            href="/produtos"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 sm:w-auto"
          >
            Ir para Produtos
          </Link>

          <Link
            href="/simulador"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 sm:w-auto"
          >
            Abrir Simulador
          </Link>

          <button
            type="button"
            onClick={onLogout}
            disabled={loading}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Saindo..." : "Sair"}
          </button>
        </div>
      </div>

      {/* Cards de navegação (ordem: QFDP 1°, Produtos 2°, Simulação 3°) */}
      <div className="mx-auto mt-10 grid max-w-5xl items-stretch gap-4 md:auto-rows-fr md:grid-cols-3">
        <ToolCard
          href="/estrategia"
          title="QFDP & Gestão de Projeto"
          badge="Estratégia"
          description="Defina posicionamento (QFDP) e organize canais e campanhas em árvore hierárquica."
          icon={<IconPlan />}
          highlights={[
            "QFDP (quadro, furadeira, decorado, público)",
            "Árvore de grupos e subgrupos",
            "Controle com painel de edição + modal de exclusão",
          ]}
        />

        <ToolCard
          href="/produtos"
          title="Cadastro de Produtos"
          badge="Segundo passo"
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
      className="group relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition hover:bg-white/[0.05]"
    >
      {/* Conteúdo principal */}
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

      {/* Rodapé fixo no final do card (alinha em todos) */}
      <div className="mt-auto pt-5 inline-flex items-center gap-2 text-sm font-medium text-violet-200/90">
        Abrir
        <span className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/5" />
    </Link>
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

function IconPlan() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="4" width="10" height="16" rx="2" />
      <path d="M9 8h8a2 2 0 0 1 2 2v9" />
      <path d="M7 12h2" />
      <path d="M7 16h2" />
      <circle cx="17" cy="7" r="2" />
    </svg>
  );
}
