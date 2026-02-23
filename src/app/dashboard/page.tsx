export default function DashboardPage() {
    return (
        <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-10">
            <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
            <p className="mt-2 text-sm text-white/65">
                Selecione uma ferramenta para começar.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <a
                    href="/produtos"
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05]"
                >
                    <div className="text-sm text-white/60">Primeiro passo</div>
                    <div className="mt-1 text-lg font-semibold text-white">
                        Cadastro de Produtos
                    </div>
                    <div className="mt-2 text-sm text-white/70">
                        Cadastre preço, custo e metas. Use isso como base para simulações.
                    </div>
                </a>

                <a
                    href="/simulador"
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05]"
                >
                    <div className="text-sm text-white/60">Simulação</div>
                    <div className="mt-1 text-lg font-semibold text-white">
                        Simulador de ROI / Tráfego Pago
                    </div>
                    <div className="mt-2 text-sm text-white/70">
                        Informe investimento, CPC e conversão para ver vendas, ROAS e lucro.
                    </div>
                </a>
            </div>
        </main>
    );
}
