"use client";

import * as React from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/cn";

export type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  delay?: number;
};

export function ScrollReveal({ 
  children, 
  className, 
  as: Component = "div",
  delay = 0 
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal();

  // @ts-ignore - Dynamic component ref type incompatibility
  return (
    <Component
      ref={ref}
      className={cn(
        "scroll-reveal",
        isVisible && "is-visible",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  );
}

