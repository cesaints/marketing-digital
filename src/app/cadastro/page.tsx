import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function CadastroPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-semibold">Cadastro</h1>

        <div className="mt-6 max-w-md rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Cadastro público está desativado no MVP.
          </p>

          <div className="mt-4">
            <Link href="/login" className="text-sm underline underline-offset-4">
              Ir para login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
