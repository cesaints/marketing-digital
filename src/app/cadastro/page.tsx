import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function CadastroPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-semibold">Criar conta</h1>

        <div className="mt-6 max-w-md rounded-lg border p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            (UI temporária) Aqui vamos colocar o formulário de cadastro.
          </p>

          <div className="mt-4 flex gap-3">
            <Link href="/login" className="text-sm underline underline-offset-4">
              Já tenho conta
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
