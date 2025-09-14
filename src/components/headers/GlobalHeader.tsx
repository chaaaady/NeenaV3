"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";

type GlobalHeaderProps = { onMenuClick?: () => void };

export function GlobalHeader({ onMenuClick }: GlobalHeaderProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);

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
      document.documentElement.style.setProperty("--global-header-h", `${h}px`);
    };
    update();
    const onResize = () => update();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      className={
        "sticky top-0 z-50 w-full " +
        (scrolled
          ? "bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b border-black/5"
          : "bg-white/35 backdrop-blur-sm")
      }
      style={{ WebkitBackdropFilter: scrolled ? "saturate(150%) blur(24px)" : "blur(6px)" }}
    >
      <div ref={ref} className="mx-auto flex h-14 items-center justify-between" style={{ maxWidth: 560, paddingLeft: 16, paddingRight: 16 }}>
        <div className="text-[16px] font-[800] tracking-[-0.2px]">Neena</div>
        <button aria-label="Menu" aria-controls="side-menu" aria-expanded={false} onClick={onMenuClick} className="menu-button">
          <Menu size={20} />
        </button>
      </div>
    </div>
  );
}

