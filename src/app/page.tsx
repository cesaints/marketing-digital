import Link from "next/link";
import { FeatureCarousel } from "@/components/home/feature-carousel";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-10">
      {/* HERO */}
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            Astrosign • Ferramentas simples para decisão rápida
          </p>

          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Menos confusão, mais clareza —{" "}
            <span className="bg-gradient-to-r from-violet-300 to-cyan-200 bg-clip-text text-transparent">
              calcule, simule e organize
            </span>{" "}
            em minutos.
          </h1>

          <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/75">
            O Astrosign junta ferramentas práticas para quem não quer depender de
            planilhas. Você preenche poucos campos, entende o resultado e sabe o
            próximo passo — mesmo se estiver começando do zero.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              Entrar
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-violet-400/30"
            >
              Ver ferramentas
            </Link>
          </div>
        </div>

        {/* Painel lateral: “como usar / pesquisar” */}
        <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <p className="text-sm font-semibold text-white/85">
            Encontre rápido o que você precisa
          </p>

          <ul className="mt-4 grid gap-3 text-sm text-white/75">
            <li className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="font-medium text-white/85">Por objetivo</p>
              <p className="mt-1 text-white/60">
                “Quero saber se compensa anunciar”, “Quero precificar”, “Quero
                entender lucro”.
              </p>
            </li>

            <li className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="font-medium text-white/85">Por ferramenta</p>
              <p className="mt-1 text-white/60">
                Produtos, Simulador de ROI, Simples Nacional (e outras que você
                vai adicionar).
              </p>
            </li>

            <li className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="font-medium text-white/85">Por passo a passo</p>
              <p className="mt-1 text-white/60">
                1) cadastre → 2) simule → 3) compare → 4) decida.
              </p>
            </li>
          </ul>
        </aside>
      </section>

      {/* CARROSSEL (agora com imagens e busca) */}
      <div className="mt-10">
        <FeatureCarousel />
      </div>

      {/* Bloco final discreto (explica o propósito sem “SEOzão”) */}
      <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="text-lg font-semibold text-white/90">
          Feito para leigos (e para quem quer velocidade)
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          Aqui você não precisa “saber marketing”. Você só responde perguntas
          simples (preço, custo, investimento etc.) e o Astrosign devolve números
          que ajudam a decidir com segurança.
        </p>
      </section>
    </main>
  );
}
