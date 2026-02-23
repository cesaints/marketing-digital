import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-semibold">Marketing Digital</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Base do projeto pronta: Next.js + Tailwind + tema light/dark.
        </p>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <h2 className="font-medium">Próximo</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Login e autenticação.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <h2 className="font-medium">Depois</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Dashboard e ferramentas.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
