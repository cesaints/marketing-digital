"use client";

import * as React from "react";
import Link from "next/link";
import { loadProducts, type MvpProduct } from "@/lib/mvp-products";

function parseNumBR(raw: string): number {
  // aceita vazio enquanto digita; aceita vírgula ou ponto
  const s = String(raw ?? "").trim().replace(/\./g, "").replace(",", ".");
  if (!s) return 0;
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function money(n: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(n) ? n : 0);
}

export default function SimuladorPage() {
  const [products, setProducts] = React.useState<MvpProduct[]>([]);
  const [productId, setProductId] = React.useState<string>("");

  // IMPORTANT: strings para não travar a digitação em input number
  const [investmentRaw, setInvestmentRaw] = React.useState<string>("500");
  const [cpcRaw, setCpcRaw] = React.useState<string>("1,5");
  const [crRaw, setCrRaw] = React.useState<string>("1,5"); // conversão %
  const [refundRateRaw, setRefundRateRaw] = React.useState<string>("0"); // %
  const [feeRateRaw, setFeeRateRaw] = React.useState<string>("0"); // %

  React.useEffect(() => {
    const items = loadProducts();
    setProducts(items);
    setProductId(items[0]?.id ?? "");
  }, []);

  const p = products.find((x) => x.id === productId);

  // converte só aqui (cálculo)
  const investment = parseNumBR(investmentRaw);
  const cpc = parseNumBR(cpcRaw);
  const cr = parseNumBR(crRaw);
  const refundRate = parseNumBR(refundRateRaw);
  const feeRate = parseNumBR(feeRateRaw);

  const clicks = cpc > 0 ? investment / cpc : 0;
  const grossOrders = clicks * (cr / 100);
  const netOrders = grossOrders * (1 - refundRate / 100);

  const revenue = (p?.price ?? 0) * netOrders;
  const productCost = (p?.cogs ?? 0) * netOrders;

  const fees = revenue * (feeRate / 100);
  const profit = revenue - investment - productCost - fees;

  const roas = investment > 0 ? revenue / investment : 0;
  const roi = investment > 0 ? profit / investment : 0;
  const cac = netOrders > 0 ? investment / netOrders : 0;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-14">
      {/* Header centralizado */}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Simulador
        </h1>
        <p className="mt-2 text-sm text-white/65">
          Simule cliques, pedidos, ROAS e lucro por produto — e entenda cada
          campo com exemplos.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            Voltar
          </Link>
          <Link
            href="/produtos"
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
          >
            Produtos
          </Link>
        </div>
      </div>

      {/* Dica principal (lâmpada) */}
      <div className="mx-auto mt-8 max-w-3xl">
        <Tip title="Como preencher (rápido)">
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <b>Investimento</b>: quanto você vai colocar na campanha (ex: R$
              500).
            </li>
            <li>
              <b>CPC</b>: custo por clique (veja no Gerenciador de Anúncios; se
              não tiver, chute inicial: R$ 1 a R$ 3).
            </li>
            <li>
              <b>Conversão</b>: % de pessoas que compram após clicar (ex: 1% a
              3%).
            </li>
            <li>
              <b>Reembolso</b>: % de pedidos devolvidos/chargeback (se não souber,
              0%).
            </li>
            <li>
              <b>Taxas</b>: taxa de plataforma/gateway/afiliado (ex: 5% a 15%).
            </li>
          </ul>
        </Tip>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {/* Entradas */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <h2 className="text-sm font-semibold text-white/80">Entradas</h2>

          <div className="mt-4 grid gap-3">
            <div>
              <label className="text-xs text-white/60">Produto</label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-violet-400/30"
              >
                {products.length === 0 ? (
                  <option value="">Nenhum produto cadastrado</option>
                ) : (
                  products.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))
                )}
              </select>

              {products.length === 0 && (
                <p className="mt-2 text-xs text-white/45">
                  Cadastre um produto em{" "}
                  <Link className="underline" href="/produtos">
                    /produtos
                  </Link>
                  .
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/60">Investimento (R$)</label>
                <input
                  inputMode="decimal"
                  value={investmentRaw}
                  onChange={(e) => setInvestmentRaw(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-violet-400/30"
                  placeholder="Ex: 500"
                />
              </div>

              <div>
                <label className="text-xs text-white/60">CPC (R$)</label>
                <input
                  inputMode="decimal"
                  value={cpcRaw}
                  onChange={(e) => setCpcRaw(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-violet-400/30"
                  placeholder="Ex: 1,50"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-white/60">Conversão (%)</label>
                <input
                  inputMode="decimal"
                  value={crRaw}
                  onChange={(e) => setCrRaw(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-violet-400/30"
                  placeholder="Ex: 1,5"
                />
              </div>
              <div>
                <label className="text-xs text-white/60">Reembolso (%)</label>
                <input
                  inputMode="decimal"
                  value={refundRateRaw}
                  onChange={(e) => setRefundRateRaw(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-violet-400/30"
                  placeholder="Ex: 0"
                />
              </div>
              <div>
                <label className="text-xs text-white/60">Taxas (%)</label>
                <input
                  inputMode="decimal"
                  value={feeRateRaw}
                  onChange={(e) => setFeeRateRaw(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-violet-400/30"
                  placeholder="Ex: 10"
                />
              </div>
            </div>

            <div className="mt-2 rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-xs text-white/55">
              Produto selecionado:{" "}
              <span className="text-white/80">{p?.name ?? "—"}</span> • Preço:{" "}
              <span className="text-white/80">{money(p?.price ?? 0)}</span> •
              Custo: <span className="text-white/80">{money(p?.cogs ?? 0)}</span>
            </div>

            {/* Dica curta, contextual */}
            <div className="mt-3">
              <Tip title="Dica prática">
                Se você ainda não tem dados, comece com <b>CPC = 1,50</b> e{" "}
                <b>Conversão = 1,5%</b>. Depois ajuste com os números reais do
                seu anúncio e do seu checkout.
              </Tip>
            </div>
          </div>
        </section>

        {/* Resultado */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <h2 className="text-sm font-semibold text-white/80">Resultado</h2>

          <div className="mt-4 grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Card label="Cliques" value={clicks.toFixed(0)} />
              <Card label="Pedidos (líquidos)" value={netOrders.toFixed(2)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card label="Faturamento" value={money(revenue)} />
              <Card label="Gastos em Ads" value={money(investment)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card label="CAC (R$ / pedido)" value={money(cac)} />
              <Card label="Taxas (R$)" value={money(fees)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card label="Custo produto (R$)" value={money(productCost)} />
              <Card label="Lucro (R$)" value={money(profit)} highlight={profit} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card label="ROAS" value={roas.toFixed(2)} />
              <Card label="ROI" value={(roi * 100).toFixed(1) + "%"} />
            </div>

            <p className="mt-2 text-xs text-white/45">
              * MVP: cálculo simples (não inclui impostos). Podemos plugar no
              Simples Nacional depois.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: number;
}) {
  const good = typeof highlight === "number" ? highlight >= 0 : null;

  return (
    <div className="rounded-xl border border-white/10 bg-black/10 px-4 py-3">
      <div className="text-xs text-white/55">{label}</div>
      <div
        className={[
          "mt-1 text-lg font-semibold",
          good === null
            ? "text-white"
            : good
              ? "text-emerald-200"
              : "text-rose-200",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
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
    <div className="rounded-xl border border-amber-200/10 bg-amber-400/[0.06] px-4 py-3">
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
