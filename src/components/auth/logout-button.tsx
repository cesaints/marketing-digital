"use client";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/logout", { method: "POST" });
        window.location.href = "/";
      }}
      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
    >
      Sair
    </button>
  );
}
