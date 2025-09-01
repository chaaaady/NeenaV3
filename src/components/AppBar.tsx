"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { Menu } from "lucide-react";

interface AppBarProps {
  onMenu: () => void;
}

export function AppBar({ onMenu }: AppBarProps) {
  const [isMenuPressed, setIsMenuPressed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onMenu) {
      onMenu();
    }
  };

  return (
    <header className={cn("modern-header", scrolled && "header-scrolled") }>
      <div className="header-container">
        {/* Logo Neena à gauche */}
        <div className="header-left">
          <div className="logo-neena">Neena</div>
        </div>

        {/* Menu à droite */}
        <div className="header-right">
          <button
            aria-label="Menu"
            onClick={handleMenuClick}
            onMouseDown={() => setIsMenuPressed(true)}
            onMouseUp={() => setIsMenuPressed(false)}
            onMouseLeave={() => setIsMenuPressed(false)}
            className={cn(
              "menu-button",
              isMenuPressed && "pressed"
            )}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

