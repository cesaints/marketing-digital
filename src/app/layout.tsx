import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marketing Digital",
  description: "Ferramentas de marketing e cálculo de tráfego.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Fundo galáxia */}
        <div className="starry fixed inset-0 -z-10" />
        {children}
      </body>
    </html>
  );
}
