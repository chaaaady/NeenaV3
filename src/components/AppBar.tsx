"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Menu, ChevronDown } from "lucide-react";

export function AppBar({ 
  title = "Neena", 
  onMenu, 
  onTitleClick,
  currentMosque,
  onMosqueSelect
}: { 
  title?: string; 
  onMenu?: () => void; 
  onTitleClick?: () => void;
  currentMosque?: string;
  onMosqueSelect?: () => void;
}) {
  const [isMenuPressed, setIsMenuPressed] = useState(false);
  const [isMosquePressed, setIsMosquePressed] = useState(false);

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

        {/* Sélecteur de mosquée centré */}
        <div className="header-center">
          <button
            onClick={onMosqueSelect}
            onMouseDown={() => setIsMosquePressed(true)}
            onMouseUp={() => setIsMosquePressed(false)}
            onMouseLeave={() => setIsMosquePressed(false)}
            className={cn(
              "mosque-selector-modern",
              isMosquePressed && "pressed"
            )}
            aria-label="Changer de mosquée"
          >
            <div className="mosque-info">
              <span className="mosque-label">Mosquée</span>
              <span className="mosque-name">
                {currentMosque || "Sélectionner"}
              </span>
            </div>
            <ChevronDown 
              size={16} 
              className={cn(
                "chevron-icon",
                isMosquePressed && "rotate-180"
              )} 
            />
          </button>
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

