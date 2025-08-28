import type { Metadata } from "next";
import Link from "next/link";
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
        <footer className="mini-footer">
          <div className="mini-footer-content">
            <Link href="#" className="mini-footer-link">Mentions légales</Link>
            <span className="mini-footer-sep">•</span>
            <Link href="#" className="mini-footer-link">Confidentialité</Link>
            <span className="mini-footer-sep">•</span>
            <Link href="#" className="mini-footer-link">FAQ</Link>
            <span className="mini-footer-sep">•</span>
            <Link href="#" className="mini-footer-link">Contact</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
