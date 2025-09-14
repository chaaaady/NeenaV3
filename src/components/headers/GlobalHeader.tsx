"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type GlobalHeaderProps = {
  onMenuClick?: () => void;
  logo?: React.ReactNode;
  navItems?: Array<{ label: string; href: string }>;
};

export function GlobalHeader({ onMenuClick, logo, navItems }: GlobalHeaderProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new (window as any).ResizeObserver?.((entries: any) => {
      const h = entries[0]?.contentRect?.height ?? el.offsetHeight;
      document.documentElement.style.setProperty("--global-header-h", `${h}px`);
    });
    ro?.observe(el);
    const h = el.offsetHeight;
    document.documentElement.style.setProperty("--global-header-h", `${h}px`);
    return () => ro?.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "modern-header",
        scrolled && "header-scrolled"
      )}
    >
      <div ref={ref} className="header-container">
        <div className="header-left">
          <div className="logo-neena">{logo ?? "Neena"}</div>
        </div>
        <div className="flex-1" />
        <div className="header-right">
          {navItems?.length ? (
            <nav className="hidden sm:flex items-center gap-4 mr-2 text-[14px] font-[600] text-[var(--text)]">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="hover:opacity-80">
                  {item.label}
                </a>
              ))}
            </nav>
          ) : null}
          <button
            aria-label="Menu"
            aria-controls="side-menu"
            aria-expanded={false}
            onClick={onMenuClick}
            className="menu-button"
          >
            <span className="i-lucide-menu w-[20px] h-[20px]" />
          </button>
        </div>
      </div>
    </header>
  );
}

