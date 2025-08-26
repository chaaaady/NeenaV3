"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export function AppBar({ title = "Neena", onMenu, onTitleClick }: { title?: string; onMenu?: () => void; onTitleClick?: () => void }) {
  const [isMenuPressed, setIsMenuPressed] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onMenu) {
      onMenu();
    }
  };

  return (
    <div className="app-header">
      <div className="header-content">
        {onTitleClick ? (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTitleClick(); }}
            className="font-[800] text-[20px] leading-[24px] tracking-[-0.3px] text-[var(--text)] hover:opacity-80"
            aria-label="Home"
          >
            {title}
          </button>
        ) : (
          <div className="font-[800] text-[20px] leading-[24px] tracking-[-0.3px] text-[var(--text)]">
            {title}
          </div>
        )}

        <button
          aria-label="menu"
          onClick={handleMenuClick}
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsMenuPressed(true);
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            setIsMenuPressed(false);
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            setIsMenuPressed(false);
          }}
          className={cn(
            "relative w-10 h-10 rounded-[var(--radius-all)] flex items-center justify-center transition-all duration-200 ease-out",
            "hover:bg-[var(--surface-2)] active:bg-[var(--border)]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-2",
            isMenuPressed && "scale-95"
          )}
        >
          <div className="relative w-5 h-5 flex flex-col justify-center items-center">
            <div className={cn(
              "w-4 h-0.5 bg-[var(--text)] rounded-full transition-all duration-200 ease-out",
              "transform origin-center",
              isMenuPressed && "scale-90"
            )} />
            <div className={cn(
              "w-4 h-0.5 bg-[var(--text)] rounded-full mt-1 transition-all duration-200 ease-out",
              "transform origin-center",
              isMenuPressed && "scale-90"
            )} />
            <div className={cn(
              "w-4 h-0.5 bg-[var(--text)] rounded-full mt-1 transition-all duration-200 ease-out",
              "transform origin-center",
              isMenuPressed && "scale-90"
            )} />
          </div>
        </button>
      </div>
    </div>
  );
}

