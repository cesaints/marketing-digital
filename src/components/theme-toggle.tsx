"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const current = theme === "system" ? systemTheme : theme;

  return (
    <button
      type="button"
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      className="rounded-md border px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Alternar tema"
    >
      Tema: {current === "dark" ? "Dark" : "Light"}
    </button>
  );
}
