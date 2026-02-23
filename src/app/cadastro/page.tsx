import { SiteHeader } from "@/components/site-header";
import Link from "next/link";

export default function CadastroPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-5xl p-6">
        <h1 className="h2">Cadastro</h1>
        <div className="mt-6 max-w-md card p-5">
          <p className="text-sm text-neutral-300">
            Cadastro público está desativado no MVP.
          </p>
          <div className="mt-4">
            <Link href="/login" className="underline underline-offset-4 text-sm">
              Ir para login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
