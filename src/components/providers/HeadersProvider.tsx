"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

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
    const ro = new (window as any).ResizeObserver?.((entries: any) => {
      const height = entries[0]?.contentRect?.height ?? el.offsetHeight;
      setH(height);
      document.documentElement.style.setProperty("--global-header-h", `${height}px`);
    });
    ro?.observe(el);
    const height = el.offsetHeight;
    setH(height);
    document.documentElement.style.setProperty("--global-header-h", `${height}px`);
    return () => ro?.disconnect();
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

