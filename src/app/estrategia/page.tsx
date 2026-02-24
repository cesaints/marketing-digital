"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QFDPCard } from "@/features/qfdp/QFDPCard";
import { QFDPInfoCard } from "@/features/qfdp/QFDPInfoCard";
import { ProjectTreeManager } from "@/features/project/ProjectTreeManager";

export default function EstrategiaPage() {
    const router = useRouter();

    return (
        <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-14">
            {/* Topo centralizado */}
            <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                    Estratégia
                </p>

                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                    QFDP & Gestão de Projeto
                </h1>

                <p className="mt-2 text-sm leading-relaxed text-white/70">
                    Defina o posicionamento do seu produto (Quadro, Furadeira, Decorado,
                    Público) e organize seus canais e campanhas em uma árvore de grupos e
                    subgrupos.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    <button
                        type="button"
                        onClick={() => router.push("/dashboard")}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                    >
                        Voltar ao Dashboard
                    </button>

                    <Link
                        href="/simulador"
                        className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
                    >
                        Ir para o Simulador
                    </Link>
                </div>
            </div>

            {/* QFDP + Info */}
            <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    <QFDPCard />
                </div>

                <div className="md:col-span-1">
                    <QFDPInfoCard />
                </div>
            </div>

            {/* Gestão do Projeto */}
            <div className="mx-auto mt-8 max-w-5xl">
                <ProjectTreeManager />
            </div>
        </main>
    );
}
