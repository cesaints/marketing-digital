import { Suspense } from "react";
import LoginClient from "./login-client";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[calc(100vh-1px)] px-6 py-10">
          <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-6xl items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
              <h1 className="text-xl font-semibold text-white">Entrar</h1>
              <p className="mt-2 text-sm text-white/65">Carregando…</p>
            </div>
          </div>
        </main>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
