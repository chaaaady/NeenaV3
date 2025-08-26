"use client";

import { Info } from "lucide-react";
import { cn } from "@/lib/cn";

export function ProductHeader({ 
  currentMosque, 
  onMosqueSelect, 
  onInfoNavigation 
}: { 
  currentMosque?: string;
  onMosqueSelect?: () => void;
  onInfoNavigation?: () => void;
}) {
  return (
    <div className="product-header">
      <div className="product-header-content">
        <div className="w-20" />
        <button
          onClick={onMosqueSelect}
          className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-pill)] hover:bg-[var(--surface-2)] transition-colors"
        >
          <span className="text-[15px] font-[600] text-[var(--text)]">
            {currentMosque || "Sélectionner une mosquée"}
          </span>
        </button>

        <button
          onClick={onInfoNavigation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-pill)] bg-[var(--brand)] text-white text-[13px] font-[600] hover:bg-[var(--brand)]/90 transition-colors"
        >
          <Info size={14} />
          Info
        </button>
      </div>
    </div>
  );
}

