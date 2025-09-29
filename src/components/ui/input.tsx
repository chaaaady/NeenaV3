"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "h-11 w-full rounded-10 border border-[var(--border)] bg-white px-4 text-[14px] text-[var(--text)]",
          "placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border)]",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";