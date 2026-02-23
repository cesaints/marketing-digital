"use client";

import * as React from "react";
import Link from "next/link";

type Feature = {
  id: string;
  title: string;
  subtitle: string;
  seoParagraph: string;
  bullets: string[];
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  badge?: string;
};

const FEATURES: Feature[] = [
  {
    id: "simples",
    badge: "Primeira ferramenta",
    title: "Simples Nacional — cálculo rápido e confiável",
    subtitle:
      "Simule alíquotas, faixa/Anexo e estimativas com clareza. Ideal para MEI, ME e EPP que precisam decidir com segurança.",
    seoParagraph:
      "Faça o cálculo do Simples Nacional de forma prática e transparente: simule cenários, compare valores e entenda a estimativa mensal com base em faturamento. Uma calculadora de Simples Nacional feita para quem quer agilidade, previsibilidade e decisões melhores — sem planilhas confusas.",
    bullets: [
      "Simulação por faturamento (mensal e anual) com estimativas claras",
      "Visão rápida de impacto no caixa e planejamento tributário básico",
      "Resultado fácil de explicar para cliente/sócio (copiar e compartilhar)",
    ],
    primaryCta: { label: "Calcular Simples Nacional", href: "/simples" },
    secondaryCta: { label: "Ver como funciona", href: "/simples#como-funciona" },
  },
  // Próximas funcionalidades você adiciona depois (dashboard, tráfego, etc.)
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function FeatureCarousel() {
  const [index, setIndex] = React.useState(0);

  const feature = FEATURES[index];

  const prev = React.useCallback(() => {
    setIndex((i) => (i - 1 + FEATURES.length) % FEATURES.length);
  }, []);

  const next = React.useCallback(() => {
    setIndex((i) => (i + 1) % FEATURES.length);
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  return (
    <section aria-label="Funcionalidades" className="w-full">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-white/60">
            Explore as ferramentas (use ← →)
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
            O que você consegue fazer aqui
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-violet-400/40"
            aria-label="Anterior"
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-violet-400/40"
            aria-label="Próximo"
          >
            →
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Card principal */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur">
          <div className="absolute inset-0 pointer-events-none">
            {/* brilho suave */}
            <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />
            <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
          </div>

          <div className="relative">
            {feature.badge && (
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                {feature.badge}
              </div>
            )}

            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              {feature.subtitle}
            </p>

            {/* Parágrafo SEO (visível, mas sem exagero) */}
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {feature.seoParagraph}
            </p>

            <ul className="mt-5 grid gap-2">
              {feature.bullets.map((b) => (
                <li key={b} className="flex gap-2 text-sm text-white/80">
                  <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300/80" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={feature.primaryCta.href}
                className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-600/20 hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400/40"
              >
                {feature.primaryCta.label}
              </Link>

              {feature.secondaryCta && (
                <Link
                  href={feature.secondaryCta.href}
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-violet-400/30"
                >
                  {feature.secondaryCta.label}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Lista lateral (mini “carrossel”) */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
          <p className="text-sm font-medium text-white/80">Funcionalidades</p>

          <div className="mt-3 grid gap-2">
            {FEATURES.map((f, i) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setIndex(i)}
                className={cx(
                  "text-left rounded-xl border px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-violet-400/30",
                  i === index
                    ? "border-white/15 bg-white/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {f.title}
                    </div>
                    <div className="mt-1 text-xs text-white/60 line-clamp-2">
                      {f.subtitle}
                    </div>
                  </div>

                  <div className="text-xs text-white/50">
                    {i + 1}/{FEATURES.length}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs font-medium text-white/70">Dica</p>
            <p className="mt-1 text-xs leading-relaxed text-white/60">
              Comece pela ferramenta que resolve o problema mais urgente.
              Depois, evolua para o dashboard e automações.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
