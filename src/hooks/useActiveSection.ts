"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export function useActiveSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-observe-section]"));
    if (!sections.length) return;

    const globalH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--global-header-h").replace("px", "")) || 0;
    const sectionHeaderH = 44; // approx mini-header height
    const topOffset = -(globalH + sectionHeaderH + 16);
    const rootMargin = `${topOffset}px 0px -40% 0px`;

    const io = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (a.boundingClientRect.top - b.boundingClientRect.top));
      const top = visible[0];
      if (top?.target) {
        const el = top.target as HTMLElement;
        const id = el.id || null;
        const title = el.getAttribute("data-section-title") || el.getAttribute("aria-label") || id || null;
        setActiveId(id);
        setActiveTitle(title);
      }
    }, { threshold: [0.4, 0.6], rootMargin });

    sections.forEach((el) => io.observe(el));
    observerRef.current = io;
    return () => io.disconnect();
  }, []);

  return useMemo(() => ({ activeId, activeTitle }), [activeId, activeTitle]);
}

