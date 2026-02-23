import { SiteHeader } from "@/components/site-header";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-5xl p-6">
        <div className="mt-10 max-w-2xl">
          <h1 className="h2">Entrar</h1>
          <p className="mt-2 text-sm text-neutral-300">
            Faça login para acessar suas ferramentas de cálculo e planejamento.
          </p>

          <LoginForm />
        </div>
      </main>
    </div>
  );
}
