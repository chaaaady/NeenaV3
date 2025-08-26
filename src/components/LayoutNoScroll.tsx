"use client";

import React from "react";
import { AppBar } from "@/components";

export function LayoutNoScroll({
  title = "Neena",
  onMenu,
  onTitleClick,
  stickyFooterHeight,
  children,
}: {
  title?: string;
  onMenu?: () => void;
  onTitleClick?: () => void;
  stickyFooterHeight?: number;
  children: React.ReactNode;
}) {
  const heroMinHeight = `calc(100dvh - var(--header-h) - env(safe-area-inset-top) - env(safe-area-inset-bottom)${stickyFooterHeight ? ` - ${stickyFooterHeight}px` : ""})`;
  return (
    <div className="NoScrollPage">
      <AppBar title={title} onMenu={onMenu} onTitleClick={onTitleClick} />
      <main className="HeroFill" style={{ minHeight: heroMinHeight }}>
        {children}
      </main>
      <div className="pb-safe" />
    </div>
  );
}

