"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";

type HeaderPrimaryProps = { onMenuClick?: () => void; wide?: boolean; glass?: boolean; glassTone?: "light" | "dark"; transparent?: boolean; hideNav?: boolean; overlay?: boolean };

export function HeaderPrimary({ onMenuClick, wide = false, glass = false, glassTone = "light", transparent = false, hideNav = false, overlay = false }: HeaderPrimaryProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [_scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const h = el.offsetHeight || 56;
      document.documentElement.style.setProperty("--hdr-primary-h", `${h}px`);
    };
    update();
    const onResize = () => update();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const maxW = wide ? 1280 : 560;
  const bgClass = transparent
    ? "bg-transparent"
    : glass
      ? (glassTone === "dark"
          ? "bg-gradient-to-b from-black/20 to-black/10 backdrop-blur-2xl border-b border-white/15 shadow-2xl ring-1 ring-white/10"
          : "bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl border-b border-white/15 shadow-2xl ring-1 ring-white/10")
      : "bg-white/90";
  const brandClass = transparent || glass ? "text-white" : "text-[var(--text)]";
  const navTextClass = transparent || glass ? "text-white/90" : "text-[var(--text)]";
  const linkClass = transparent || glass ? "hover:text-white" : "hover:text-black";

  return (
    <div className={(overlay ? "absolute inset-x-0 top-0 z-20 " : "") + "w-full transition-all duration-300 ease-out " + bgClass}>
      <div ref={ref} className="mx-auto flex h-14 items-center justify-between" style={{ maxWidth: maxW, paddingLeft: 16, paddingRight: 16 }}>
        <Link href="/qui-sommes-nous" className={"text-[16px] font-[800] tracking-[-0.2px] " + brandClass}>Neena</Link>
        <nav className={(hideNav ? "hidden " : "hidden md:flex ") + "items-center gap-6 text-[14px] font-[600] " + navTextClass}>
          <Link href="/" className={linkClass}>Accueil</Link>
          <Link href="/step-amount-v2" className={linkClass}>Montant</Link>
          <Link href="/step-personal-ds" className={linkClass}>Infos</Link>
          <Link href="/step-payment-ds" className={linkClass}>Paiement</Link>
          <Link href="/steps-ds" className={linkClass}>Tout-en-un</Link>
          <Link href="/mosquee/creteil" className={linkClass}>Mosquée</Link>
          <Link href="/benevolat" className={linkClass}>Bénévolat</Link>
        </nav>
        <button aria-label="Menu" aria-controls="side-menu" aria-expanded={false} onClick={onMenuClick} className="menu-button md:hidden">
          <Menu size={20} className={transparent || glass ? "text-white" : undefined} />
        </button>
      </div>
    </div>
  );
}

