import { SiteHeader } from "@/components/site-header";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  // Se quiser esconder o botão Google quando não houver env,
  // a gente pode fazer isso depois lendo do server.
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-5xl p-6">
        <div className="mt-10">
          <h1 className="text-3xl font-semibold tracking-tight">Entrar</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Faça login para acessar sua área. Contas públicas estão desativadas.
          </p>

          <LoginForm hasGoogle />
        </div>
      </main>
    </div>
  );
}
