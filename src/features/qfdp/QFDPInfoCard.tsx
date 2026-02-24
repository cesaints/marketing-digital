"use client";

import * as React from "react";

export function QFDPInfoCard() {
    return (
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-white">
            <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/20">
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
                    <div className="text-sm font-semibold text-amber-100">
                        Como usar o QFDP (rápido)
                    </div>
                    <div className="mt-1 text-sm leading-relaxed text-white/70">
                        A pessoa precisa <b>entender, acreditar</b> e <b>gostar</b> que aquela <b>furadeira</b> aquele <b>método</b> de realizar o <b>quadro</b> vai ser bom pra ela.
                    </div>
                </div>
            </div>
        </section>
    );
}
