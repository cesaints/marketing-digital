"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { loadProducts, saveProducts, type MvpProduct } from "@/lib/mvp-products";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function money(n: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(n) ? n : 0);
}

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(new Error("Falha ao ler arquivo"));
    r.onload = () => resolve(String(r.result));
    r.readAsDataURL(file);
  });
}

function toNumberBRLike(input: string): number {
  // mantém simples: aceita vazio; aceita "10", "10.5"
  // (se você quiser aceitar "10,5", dá pra adaptar)
  if (!input.trim()) return 0;
  const n = Number(input);
  return Number.isFinite(n) ? n : 0;
}

export default function ProdutosPage() {
  const [items, setItems] = React.useState<MvpProduct[]>([]);

  const [name, setName] = React.useState("");
  // IMPORTANTÍSSIMO: manter como string para permitir apagar o conteúdo
  const [price, setPrice] = React.useState<string>("");
  const [cogs, setCogs] = React.useState<string>("");

  const [imageDataUrl, setImageDataUrl] = React.useState<string>("");
  const [imageError, setImageError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setItems(loadProducts());
  }, []);

  function persist(next: MvpProduct[]) {
    setItems(next);
    saveProducts(next);
  }

  async function onPickImage(file: File | null) {
    setImageError(null);

    if (!file) {
      setImageDataUrl("");
      return;
    }

    const isImg = file.type.startsWith("image/");
    if (!isImg) {
      setImageError("Selecione um arquivo de imagem (PNG/JPG/WebP).");
      return;
    }

    const maxBytes = 700 * 1024; // ~700KB
    if (file.size > maxBytes) {
      setImageError("Imagem muito grande. Use até ~700KB (ex: 800x800 WebP).");
      return;
    }

    const dataUrl = await fileToDataUrl(file);
    setImageDataUrl(dataUrl);
  }

  function add(e: React.FormEvent) {
    e.preventDefault();

    const n = name.trim();
    if (!n) return;

    const p: MvpProduct = {
      id: uid(),
      name: n,
      price: toNumberBRLike(price),
      cogs: toNumberBRLike(cogs),
      imageDataUrl: imageDataUrl || undefined,
    };

    persist([p, ...items]);

    // limpa o form (agora fica vazio mesmo)
    setName("");
    setPrice("");
    setCogs("");
    setImageDataUrl("");
    setImageError(null);
  }

  function remove(id: string) {
    persist(items.filter((x) => x.id !== id));
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-14">
      {/* Header centralizado (igual simulador/dashboard) */}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Produtos
        </h1>

        <p className="mt-2 text-sm text-white/65">
          Cadastre preço e custo para usar no simulador.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            Voltar
          </Link>

          <Link
            href="/simulador"
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
          >
            Abrir Simulador
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {/* Cadastro */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-white/80">Novo produto</h2>
            <span className="text-xs text-white/45">Imagem opcional</span>
          </div>

          <form onSubmit={add} className="mt-4 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-[120px,1fr] sm:items-start">
              <div>
                <div className="text-xs text-white/60">Imagem</div>

                <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                  <div className="relative aspect-square w-full">
                    {imageDataUrl ? (
                      <Image
                        src={imageDataUrl}
                        alt="Preview do produto"
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-white/45">
                        Sem imagem
                      </div>
                    )}
                  </div>
                </div>

                <label className="mt-3 inline-flex cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10">
                  Escolher arquivo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onPickImage(e.target.files?.[0] ?? null)}
                  />
                </label>

                {imageDataUrl && (
                  <button
                    type="button"
                    onClick={() => onPickImage(null)}
                    className="ml-2 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
                  >
                    Remover
                  </button>
                )}

                {imageError && (
                  <div className="mt-2 text-xs text-rose-200/90">
                    {imageError}
                  </div>
                )}
              </div>

              <div className="grid gap-3">
                <div>
                  <label className="text-xs text-white/60">Nome</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-violet-400/30"
                    placeholder="Ex: Mentoria 1:1"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/60">Preço (R$)</label>
                    <input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      inputMode="decimal"
                      type="number"
                      step="0.01"
                      min="0"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-violet-400/30"
                      placeholder="Ex: 457"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/60">Custo (R$)</label>
                    <input
                      value={cogs}
                      onChange={(e) => setCogs(e.target.value)}
                      inputMode="decimal"
                      type="number"
                      step="0.01"
                      min="0"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-violet-400/30"
                      placeholder="Ex: 120"
                    />
                  </div>
                </div>

                <button
                  className="mt-1 rounded-xl bg-violet-600 py-2.5 text-sm font-medium text-white hover:bg-violet-500"
                  type="submit"
                >
                  Salvar
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Lista */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <h2 className="text-sm font-semibold text-white/80">
            Produtos cadastrados
          </h2>

          {items.length === 0 ? (
            <p className="mt-4 text-sm text-white/60">
              Nenhum produto ainda. Cadastre o primeiro para simular ROI.
            </p>
          ) : (
            <ul className="mt-4 grid gap-3">
              {items.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/10 p-4"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                      {p.imageDataUrl ? (
                        <Image
                          src={p.imageDataUrl}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-white/45">
                          —
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-white">
                        {p.name}
                      </div>
                      <div className="mt-1 text-xs text-white/60">
                        Preço: {money(p.price)} • Custo: {money(p.cogs)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => remove(p.id)}
                    className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/75 hover:bg-white/10"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
