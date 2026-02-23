import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Marketing Digital</h1>
        <ThemeToggle />
      </div>

      <p className="mt-6 text-gray-600 dark:text-gray-300">
        Tema com Tailwind + next-themes.
      </p>
    </main>
  );
}
