"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Menu, ChevronDown } from "lucide-react";
import Link from "next/link";

type HeaderMosqueeProps = { 
  onMenuClick?: () => void; 
  wide?: boolean; 
  glass?: boolean; 
  glassTone?: "light" | "dark"; 
  transparent?: boolean; 
  hideNav?: boolean; 
  overlay?: boolean;
  mosqueeSlug?: string; // Pour personnaliser les liens en fonction de la mosquée
  showNeenaLogo?: boolean; // Pour afficher "Neena" au lieu du nom de la mosquée
  scrollThreshold?: number; // Seuil de scroll personnalisé (en px)
  heroElementId?: string; // ID de l'élément hero pour calculer le seuil automatiquement
};

export function HeaderMosquee({ 
  onMenuClick, 
  wide = false, 
  glass = false, 
  glassTone = "light", 
  transparent = false, 
  hideNav = false, 
  overlay = false,
  mosqueeSlug = "creteil",
  showNeenaLogo = false,
  scrollThreshold = 16,
  heroElementId
}: HeaderMosqueeProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showSpecialMenu, setShowSpecialMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (heroElementId) {
        const heroEl = document.getElementById(heroElementId);
        if (heroEl) {
          const rect = heroEl.getBoundingClientRect();
          setScrolled(rect.bottom <= 0);
        } else {
          setScrolled(window.scrollY >= scrollThreshold);
        }
      } else {
        setScrolled(window.scrollY >= scrollThreshold);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollThreshold, heroElementId]);

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
  
  // Si showNeenaLogo = true et heroElementId fourni, on affiche "Neena" avant le scroll
  // et "Mosquée [Nom]" après le scroll avec un fond glass
  const shouldHideHeader = showNeenaLogo && !scrolled && heroElementId !== undefined;
  
  // Si on a scrollé et showNeenaLogo + heroElementId, on force le fond glass
  const shouldShowGlassOnScroll = showNeenaLogo && scrolled && heroElementId !== undefined;
  
  const bgClass = shouldHideHeader
    ? "bg-transparent"
    : shouldShowGlassOnScroll
      ? (glassTone === "dark"
          ? "bg-gradient-to-b from-black/20 to-black/10 backdrop-blur-2xl border-b border-white/15 shadow-2xl ring-1 ring-white/10"
          : "bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl border-b border-white/15 shadow-2xl ring-1 ring-white/10")
      : transparent
        ? "bg-transparent"
        : glass
          ? (glassTone === "dark"
              ? "bg-gradient-to-b from-black/20 to-black/10 backdrop-blur-2xl border-b border-white/15 shadow-2xl ring-1 ring-white/10"
              : "bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl border-b border-white/15 shadow-2xl ring-1 ring-white/10")
          : "bg-white/90";
  
  const isGlassMode = transparent || glass || shouldHideHeader || shouldShowGlassOnScroll;
  const brandClass = isGlassMode ? "text-white" : "text-[var(--text)]";
  const navTextClass = isGlassMode ? "text-white/90" : "text-[var(--text)]";
  const linkClass = isGlassMode ? "hover:text-white" : "hover:text-black";

  return (
    <div className={(overlay ? "absolute inset-x-0 top-0 z-20 " : "sticky top-0 z-20 ") + "w-full transition-all duration-300 ease-out " + bgClass}>
      <div ref={ref} className="mx-auto flex h-14 items-center justify-between" style={{ maxWidth: maxW, paddingLeft: 16, paddingRight: 16 }}>
        <Link href={shouldHideHeader && showNeenaLogo ? "/" : `/mosquee/${mosqueeSlug}/v8`} className={"text-[16px] font-[800] tracking-[-0.2px] transition-opacity duration-300 " + brandClass}>
          {shouldHideHeader && showNeenaLogo ? "Neena" : `Mosquée ${mosqueeSlug.charAt(0).toUpperCase() + mosqueeSlug.slice(1)}`}
        </Link>
        
        <nav className={(hideNav ? "hidden " : "hidden md:flex ") + "items-center gap-5 text-[13px] font-[600] " + navTextClass}>
          <Link href={`/mosquee/${mosqueeSlug}/v8`} className={linkClass}>Information</Link>
          <Link href="/step-amount-v2" className={linkClass}>Faire un don</Link>
          <Link href="/duaa" className={linkClass}>Duaa</Link>
          <Link href="/benevolat" className={linkClass}>Bénévolat</Link>
          <Link href="/qui-sommes-nous" className={linkClass}>Qui est Neena ?</Link>
          
          {/* Menu déroulant Spécial */}
          <div 
            className="relative"
            onMouseEnter={() => setShowSpecialMenu(true)}
            onMouseLeave={() => setShowSpecialMenu(false)}
          >
            <button className={"flex items-center gap-1 " + linkClass}>
              Spécial
              <ChevronDown size={14} className={showSpecialMenu ? "rotate-180 transition-transform" : "transition-transform"} />
            </button>
            
            {/* Sous-menu */}
            {showSpecialMenu && (
              <div className="absolute top-full left-0 mt-2 min-w-[200px] rounded-xl bg-white shadow-xl border border-gray-200 py-2 z-[9999]">
                <Link 
                  href="/zakat-al-fitr" 
                  className="block px-4 py-2 text-[13px] font-[600] text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowSpecialMenu(false)}
                >
                  🌙 Zakat al Fitr
                </Link>
                <Link 
                  href="/qurbani" 
                  className="block px-4 py-2 text-[13px] font-[600] text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowSpecialMenu(false)}
                >
                  🐑 Qurbani
                </Link>
                <Link 
                  href="/zakat-al-maal" 
                  className="block px-4 py-2 text-[13px] font-[600] text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowSpecialMenu(false)}
                >
                  💰 Zakat al Maal
                </Link>
                <Link 
                  href="/aqiqa" 
                  className="block px-4 py-2 text-[13px] font-[600] text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowSpecialMenu(false)}
                >
                  👶 Aqiqa
                </Link>
              </div>
            )}
          </div>
        </nav>

        <button aria-label="Menu" aria-controls="side-menu" aria-expanded={false} onClick={onMenuClick} className="menu-button md:hidden">
          <Menu size={20} className={transparent || glass ? "text-white" : undefined} />
        </button>
      </div>
    </div>
  );
}

