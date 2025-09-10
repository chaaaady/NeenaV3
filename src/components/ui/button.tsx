"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-10 font-[600] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variants: Record<string, string> = {
      primary: "bg-[var(--success)] text-white hover:bg-[var(--success-strong)] focus:ring-[var(--success)]",
      secondary: "bg-[var(--surface-2)] text-[var(--text)] hover:bg-gray-100 focus:ring-[var(--border)]",
      ghost: "bg-transparent text-[var(--text)] hover:bg-gray-100 focus:ring-[var(--border)]",
    };
    const sizes: Record<string, string> = {
      sm: "h-8 px-3 text-[12px]",
      md: "h-10 px-4 text-[14px]",
      lg: "h-12 px-5 text-[15px]",
    };
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

