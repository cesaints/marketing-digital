import type { Metadata } from "next";
import "./globals.css";
import { StarSky } from "@/components/star-sky";

export const metadata: Metadata = {
  title: "Marketing Digital",
  description: "Ferramentas de marketing e cálculo de tráfego.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="relative isolate min-h-dvh">
          <StarSky
            tintHue={218}      // mais azulado
            starCount={320}    // mais estrelas
            twinkle={0.6}
            meteorRate={0.14}  // mais cadentes
            meteorSpeed={1.05}
            className="pointer-events-none absolute inset-0 z-0 opacity-100"
          />
          
          <div className="starry pointer-events-none absolute inset-0 z-0 opacity-25" />

          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
