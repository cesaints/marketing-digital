import Link from "next/link";

type Feature = {
  id: string;
  badge?: string;
  title: string;
  subtitle: string;
  seoParagraph: string;
  bullets: string[];
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

const FEATURES: Feature[] = [
  {
    id: "simples",
    badge: "Primeira ferramenta",
    title: "Simples Nacional — simulação rápida e clara",
    subtitle:
      "Descubra estimativas, compare cenários e entenda o impacto no caixa com poucos dados. Sem planilhas confusas.",
    seoParagraph:
      "Calcule o Simples Nacional com uma experiência simples e objetiva: simule cenários por faturamento, visualize estimativas e organize seu planejamento com clareza. Uma calculadora pensada para quem precisa tomar decisão rápido e explicar resultados sem complicação.",
    bullets: [
      "Simulação por faturamento com leitura fácil",
      "Comparação de cenários para decidir com confiança",
      "Resultado pronto para compartilhar com cliente/sócio",
    ],
    primaryCta: { label: "Calcular Simples Nacional", href: "/simples" },
    secondaryCta: { label: "Entender a lógica", href: "/simples#como-funciona" },
  },
];

export function FeatureCarousel() {
  return (
    <section aria-label="Funcionalidades" className="w-full">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-white/60">Arraste para o lado</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
            O que você consegue fazer aqui
          </h2>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-white/50">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            Scroll-snap (0 JS)
          </span>
        </div>
      </div>

      {/* Track */}
      <div
        className="
          mt-4
          flex gap-4
          overflow-x-auto
          scroll-smooth
          snap-x snap-mandatory
          pb-2
          [-ms-overflow-style:none]
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {FEATURES.map((feature) => (
          <article
            key={feature.id}
            className="
              relative
              min-w-[88%] sm:min-w-[70%] lg:min-w-[56%]
              snap-center
              overflow-hidden
              rounded-2xl
              border border-white/10
              bg-gradient-to-b from-white/[0.06] to-white/[0.03]
              p-6
              shadow-[0_0_0_1px_rgba(255,255,255,0.06)]
              backdrop-blur
            "
          >
            {/* glows */}
            <div className="pointer-events-none absolute inset-0">
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
          </article>
        ))}
      </div>

      {/* Dots (estáticos, sem estado) */}
      <div className="mt-3 flex items-center justify-center gap-2">
        {FEATURES.map((f, i) => (
          <span
            key={f.id}
            className={[
              "h-1.5 w-6 rounded-full border border-white/10 bg-white/10",
              i === 0 ? "bg-white/30" : "opacity-60",
            ].join(" ")}
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  );
}
