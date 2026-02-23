import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link href="/" className="font-semibold">
          Marketing Digital
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-md px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="rounded-md px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            Criar conta
          </Link>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
