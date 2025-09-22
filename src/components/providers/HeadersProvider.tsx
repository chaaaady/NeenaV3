"use client";

import { createContext, useContext, useLayoutEffect, useRef, useState } from "react";

type HeadersCtx = {
  globalHeaderHeight: number;
};

const Ctx = createContext<HeadersCtx>({ globalHeaderHeight: 0 });

export function HeadersProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [h, setH] = useState(0);

  useLayoutEffect(() => {
    const el = document.querySelector(".header-container") as HTMLElement | null;
    if (!el) return;
    const RO: typeof ResizeObserver | undefined = typeof window !== "undefined" ? (window as Window & typeof globalThis).ResizeObserver : undefined;
    const ro = RO ? new RO((entries: ResizeObserverEntry[]) => {
      const height = entries[0]?.contentRect?.height ?? el.offsetHeight;
      setH(height);
      document.documentElement.style.setProperty("--global-header-h", `${height}px`);
    }) : null;
    ro?.observe?.(el);
    const height = el.offsetHeight;
    setH(height);
    document.documentElement.style.setProperty("--global-header-h", `${height}px`);
    return () => ro?.disconnect?.();
  }, []);

  return (
    <Ctx.Provider value={{ globalHeaderHeight: h }}>
      <div ref={ref}>{children}</div>
    </Ctx.Provider>
  );
}

export function useHeadersContext() {
  return useContext(Ctx);
}

