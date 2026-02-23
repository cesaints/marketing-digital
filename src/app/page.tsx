import Link from "next/link";
import { FeatureCarousel } from "@/components/home/feature-carousel";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-10">
      {/* HERO */}
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            Base pronta • Next.js + Tailwind • tema dark
          </p>

          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Marketing Digital com{" "}
            <span className="bg-gradient-to-r from-violet-300 to-cyan-200 bg-clip-text text-transparent">
              cálculo, planejamento e execução
            </span>{" "}
            em um só lugar.
          </h1>

          <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/75">
            Ferramentas práticas para decidir mais rápido: simulações,
            estimativas e organização do que importa. Menos improviso, mais
            resultado — com uma interface simples e bonita.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              Entrar
            </Link>

            <Link
              href="/simples"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-violet-400/30"
            >
              Começar pelo Simples Nacional
            </Link>
          </div>

          <div className="mt-6 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-xs text-white/60">Foco</p>
              <p className="mt-1 text-sm font-medium text-white/85">
                Decisão rápida
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-xs text-white/60">Clareza</p>
              <p className="mt-1 text-sm font-medium text-white/85">
                Sem planilhas
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-xs text-white/60">Evolução</p>
              <p className="mt-1 text-sm font-medium text-white/85">
                Dashboard depois
              </p>
            </div>
          </div>
        </div>

        {/* “Painel” lateral */}
        <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <p className="text-sm font-semibold text-white/85">
            O que você ganha aqui
          </p>

          <ul className="mt-4 grid gap-3 text-sm text-white/75">
            <li className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="font-medium text-white/85">Planejamento que cabe no seu dia</p>
              <p className="mt-1 text-white/60">
                Simulações e atalhos prontos para você tomar decisão em minutos.
              </p>
            </li>
            <li className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="font-medium text-white/85">Interface moderna</p>
              <p className="mt-1 text-white/60">
                Visual limpo, dark, com foco no essencial e sem ruído.
              </p>
            </li>
          </ul>

          <div className="mt-5 rounded-xl border border-white/10 bg-gradient-to-r from-violet-500/10 to-cyan-400/10 p-4">
            <p className="text-xs font-medium text-white/70">Comece agora</p>
            <p className="mt-1 text-sm text-white/70">
              Abra a primeira ferramenta e veja o resultado em poucos cliques.
            </p>
          </div>
        </aside>
      </section>

      {/* CARROSSEL */}
      <div className="mt-10">
        <FeatureCarousel />
      </div>

      {/* SEO extra (discreto) */}
      <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="text-lg font-semibold text-white/90">
          Calculadora do Simples Nacional para simular cenários
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          Use a calculadora do Simples Nacional para estimar valores com base no
          faturamento e organizar o planejamento. A proposta aqui é reduzir
          dúvidas e acelerar decisões — especialmente quando você precisa
          comparar cenários e explicar resultados de forma simples.
        </p>
      </section>
    </main>
  );
}
