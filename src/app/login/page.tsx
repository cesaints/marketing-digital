import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-semibold">Entrar</h1>

        <div className="mt-6 max-w-md rounded-lg border border-slate-200 p-4 dark:border-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            (UI temporária) Aqui vamos colocar o formulário de login.
          </p>

          <div className="mt-4 flex gap-3">
            <Link
              href="/cadastro"
              className="text-sm underline underline-offset-4"
            >
              Criar conta
            </Link>
            <Link href="/" className="text-sm underline underline-offset-4">
              Voltar
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
