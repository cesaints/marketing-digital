import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-neutral-800/60 bg-transparent">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link href="/" className="font-semibold tracking-tight">
          Marketing Digital
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 px-3 py-2 text-sm hover:bg-neutral-900/70"
          >
            Entrar
          </Link>
        </nav>
      </div>
    </header>
  );
}
