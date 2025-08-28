import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neena",
  description: "Don par étapes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased bg-[var(--bg)] text-[var(--text)]">
        {children}
      </body>
    </html>
  );
}
