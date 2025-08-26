"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";
import { ChevronRight } from "lucide-react";

export * from "./AppBar";
export * from "./ProductHeader";
export * from "./MosqueSelectorModal";
export * from "./SideMenu";
export * from "./Stepper";
export * from "./SegmentedControl";
export * from "./Slider";
export * from "./AmountDisplay";
export * from "./Input";
export * from "./Checkbox";
export * from "./SummaryRow";
export * from "./CompactSummaryRow";
export * from "./InlineNote";
export * from "./PayPalButton";
export * from "./DonateOverlay";
export * from "./LayoutNoScroll";
export * from "./ProgressHeader";
export function PageTransition({ 
  children, 
  isVisible = true,
  onTransitionComplete
}: { 
  children: React.ReactNode; 
  isVisible?: boolean;
  onTransitionComplete?: () => void;
}) {
  const [animationState, setAnimationState] = useState<'entering' | 'entered' | 'exiting' | 'exited'>('entered');

  useEffect(() => {
    if (isVisible) {
      setAnimationState('entering');
      setTimeout(() => {
        setAnimationState('entered');
        onTransitionComplete?.();
      }, 240);
    } else {
      setAnimationState('exiting');
      setTimeout(() => setAnimationState('exited'), 240);
    }
  }, [isVisible, onTransitionComplete]);

  if (animationState === 'exited') return null;

  return (
    <div 
      className={cn(
        "page-transition",
        animationState === 'entering' && "slide-in",
        animationState === 'exiting' && "slide-out"
      )}
    >
      {children}
    </div>
  );
}

export function AnimatedCard({ 
  children, 
  className, 
  isVisible = true,
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  isVisible?: boolean;
  delay?: number;
}) {
  const [animationState, setAnimationState] = useState<'entering' | 'entered' | 'exiting' | 'exited'>('exited');

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimationState('entering');
        setTimeout(() => setAnimationState('entered'), 240); // Durée de l'animation
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setAnimationState('exiting');
      setTimeout(() => setAnimationState('exited'), 240);
    }
  }, [isVisible, delay]);

  if (animationState === 'exited') return null;

  return (
    <div 
      className={cn(
        "card-container app-card",
        animationState === 'entering' && "entering",
        animationState === 'exiting' && "exiting",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CollapsibleStepCard({
  title,
  summaryValue,
  isActive,
  children,
  className,
  delay = 0,
  onClick
}: {
  title: string;
  summaryValue?: string;
  isActive: boolean;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
}) {
  // Gestion d'état simplifiée - juste ouvert/fermé
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Petit délai pour éviter l'apparition trop brusque au chargement initial
    const timer = setTimeout(() => {
      setIsReady(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!isReady) return null;

  // Mode résumé (carte fermée) - même structure que SummaryRow
  if (!isActive) {
    return (
      <button 
        className={cn("summary-row w-full text-[16px] transition-all duration-200 ease-in-out", className)}
        onClick={onClick}
        aria-label={`${title} ${summaryValue || "Add"}`}
      >
        <span className="text-[var(--text-muted)] font-[700] text-[16px]">{title}</span>
        <span className="flex items-center gap-2 text-[var(--text-soft)] font-[600] text-[16px]">
          {summaryValue || "Add"}
          {onClick && <ChevronRight size={18} className="text-[var(--text-soft)]" />}
        </span>
      </button>
    );
  }

  // Mode déployé (carte ouverte) - simple et fluide
  return (
    <div 
      className={cn(
        "app-card overflow-hidden transition-all duration-250 ease-in-out",
        className
      )}
      style={{
        maxHeight: '1000px',
      }}
    >
      <div className="space-y-4">
        <div className="app-title">{title}</div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}

// Intentionally drop MosqueSelector (inline list) in favor of modal version