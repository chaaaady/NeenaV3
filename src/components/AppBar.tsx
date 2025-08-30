"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Menu } from "lucide-react";

interface AppBarProps {
  onMenu: () => void;
}

export function AppBar({ onMenu }: AppBarProps) {
  const [isMenuPressed, setIsMenuPressed] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onMenu) {
      onMenu();
    }
  };

  return (
    <header className="modern-header">
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

