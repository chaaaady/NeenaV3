"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Menu, ChevronDown } from "lucide-react";
import Link from "next/link";

type HeaderPrimaryProps = { onMenuClick?: () => void; wide?: boolean; glass?: boolean; glassTone?: "light" | "dark"; transparent?: boolean; hideNav?: boolean; overlay?: boolean };

export function HeaderPrimary({ onMenuClick, wide = false, glass = false, glassTone = "light", transparent = false, hideNav = false, overlay = false }: HeaderPrimaryProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [_scrolled, setScrolled] = useState(false);
  const [showSpecialMenu, setShowSpecialMenu] = useState(false);

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

  const maxW = wide ? 1280 : 1200;
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
        
        <nav className={(hideNav ? "hidden " : "hidden md:flex ") + "items-center gap-5 text-[13px] font-[600] " + navTextClass}>
          <Link href="/qui-sommes-nous" className={linkClass}>Qui sommes-nous</Link>
          <Link href="/mosquees" className={linkClass}>Mosquées partenaires</Link>
          <Link href="/constructions" className={linkClass}>Construction de mosquée</Link>
          <Link href="/duaa" className={linkClass}>Duaa</Link>
          <Link href="/benevolat" className={linkClass}>Bénévolat</Link>
          <Link href="/devenir-partenaire" className={linkClass}>Devenir mosquée partenaire</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link 
            href="/auth/login" 
            className="px-4 py-2 rounded-lg bg-white text-gray-900 text-[13px] font-[700] hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
          >
            Connexion
          </Link>
        </div>

        <button aria-label="Menu" aria-controls="side-menu" aria-expanded={false} onClick={onMenuClick} className="menu-button md:hidden">
          <Menu size={20} className={transparent || glass ? "text-white" : undefined} />
        </button>
      </div>
    </div>
  );
}

