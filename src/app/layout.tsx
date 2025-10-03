import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Neena",
  description: "Don par étapes",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" data-theme="light" suppressHydrationWarning>
      <body className="antialiased bg-[var(--bg)] text-[var(--text)]">
        <Script id="theme-init" strategy="beforeInteractive">
          {`
(function initTheme() {
  try {
    // Constants
    const THEME_LIGHT = 'light';
    const THEME_DARK = 'dark';
    const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);

    // Shortcuts
    const root = document.documentElement;
    const host = location.hostname;
    const isLocal = LOCAL_HOSTS.has(host);
    const media = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

    // 1) Respect explicit theme already set (e.g., by server or future toggle)
    const explicit = root.getAttribute('data-theme');
    if (explicit === THEME_LIGHT || explicit === THEME_DARK) {
      return;
    }

    // 2) Local override: preview in light mode when developing locally
    if (isLocal) {
      root.setAttribute('data-theme', THEME_LIGHT);
      return;
    }

    // 3) Fallback to system preference
    const apply = (isDark) => root.setAttribute('data-theme', isDark ? THEME_DARK : THEME_LIGHT);
    if (media && typeof media.matches === 'boolean') {
      apply(media.matches);
      // 4) Keep theme in sync if user changes OS theme
      if (typeof media.addEventListener === 'function') {
        media.addEventListener('change', (e) => apply(e.matches));
      } else if (typeof media.addListener === 'function') {
        media.addListener((e) => apply(e.matches));
      }
    } else {
      // No media query support: default to light
      apply(false);
    }
  } catch (err) {
    // Safe fallback
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
