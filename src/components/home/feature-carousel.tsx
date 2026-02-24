"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

type Feature = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  imageSrc: string; // coloque em /public
  imageAlt: string;
  searches: string[]; // “formas de pesquisa” (termos)
  bullets: string[];
};

const FEATURES: Feature[] = [
  {
    id: "produtos",
    title: "Cadastro de Produtos",
    subtitle:
      "Guarde preço e custo para não fazer conta na cabeça e alimentar as simulações.",
    href: "/produtos",
    imageSrc: "/features/produtos.png",
    imageAlt: "Tela do Cadastro de Produtos no Astrosign",
    searches: [
      "precificação",
      "preço e custo",
      "margem",
      "produto",
      "catálogo",
      "lucro por produto",
    ],
    bullets: [
      "Você cadastra o produto uma vez",
      "Preço e custo ficam salvos para simular",
      "Ajuda a enxergar margem antes de anunciar",
    ],
  },
  {
    id: "simulador",
    title: "Simulador de ROI (tráfego pago)",
    subtitle:
      "Descubra se anunciar pode dar lucro com poucos números: investimento, CPC e conversão.",
    href: "/simulador",
    imageSrc: "/features/simulador.png",
    imageAlt: "Tela do Simulador de ROI no Astrosign",
    searches: [
      "roi",
      "roas",
      "cac",
      "tráfego pago",
      "anúncios",
      "google ads",
      "meta ads",
      "vale a pena anunciar",
    ],
    bullets: [
      "Transforma cliques em pedidos (estimativa)",
      "Mostra ROAS/ROI/CAC de forma simples",
      "Bom para comparar cenários rapidamente",
    ],
  },
  {
    id: "simples",
    title: "Simples Nacional (cenários)",
    subtitle:
      "Simule valores do Simples para reduzir dúvidas e planejar com mais previsibilidade.",
    href: "/simples",
    imageSrc: "/features/simples.png",
    imageAlt: "Tela da Calculadora do Simples Nacional no Astrosign",
    searches: [
      "simples nacional",
      "imposto",
      "faturamento",
      "alíquota",
      "planejamento",
      "cenários",
    ],
    bullets: [
      "Você informa faturamento e vê estimativas",
      "Útil para planejar e comparar alternativas",
      "Evita depender de planilhas soltas",
    ],
  },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function FeatureCarousel() {
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return FEATURES;

    return FEATURES.filter((f) => {
      const hay = [
        f.title,
        f.subtitle,
        ...f.bullets,
        ...f.searches,
        f.href,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
  }, [q]);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white/90">
            Ferramentas (com exemplos visuais)
          </h2>
          <p className="mt-1 text-sm text-white/65">
            Pesquise por objetivo (ex: “vale a pena anunciar?”) ou por ferramenta
            (ex: “produtos”, “ROI”, “simples”).
          </p>
        </div>

        <div className="w-full sm:max-w-sm">
          <label className="text-xs text-white/55">Pesquisar</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className={cx(
              "mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none",
              "focus:ring-2 focus:ring-violet-400/30"
            )}
            placeholder='Ex: "roi", "precificação", "simples", "lucro"...'
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {filtered.map((f) => (
          <article
            key={f.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"
          >
            <div className="relative aspect-[16/9] w-full border-b border-white/10">
              <Image
                src={f.imageSrc}
                alt={f.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority={false}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
            </div>

            <div className="p-5">
              <div className="text-sm font-semibold text-white/90">
                {f.title}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                {f.subtitle}
              </p>

              <ul className="mt-4 grid gap-2 text-sm text-white/60">
                {f.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-300/80" />
                    <span className="min-w-0">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
                {f.searches.slice(0, 6).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQ(s)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10"
                    title={`Pesquisar: ${s}`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <Link
                  href={f.href}
                  className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
                >
                  Abrir
                </Link>

                <Link
                  href={f.href}
                  className="text-xs text-white/55 hover:text-white/80"
                >
                  Ver detalhes →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/65">
          Nada encontrado para <span className="font-semibold">“{q}”</span>. Tente
         : <span className="text-white/80">roi</span>,{" "}
          <span className="text-white/80">precificação</span>,{" "}
          <span className="text-white/80">simples nacional</span>,{" "}
          <span className="text-white/80">lucro</span>.
        </div>
      ) : null}
    </section>
  );
}
