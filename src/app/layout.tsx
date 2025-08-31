import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

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
        <Script id="force-dark-local" strategy="beforeInteractive">
          {`(function(){try{var h=location.hostname; if(h==='localhost'||h==='127.0.0.1'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`}
        </Script>
        {children}
      </body>
    </html>
  );
}
