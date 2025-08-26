"use client";

import { cn } from "@/lib/cn";

export function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  leftIcon,
  rightAccessory,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  leftIcon?: React.ReactNode;
  rightAccessory?: React.ReactNode;
}) {
  return (
    <label className="block w-full">
      <span className="block text-[var(--text-muted)] text-[16px] leading-[20px] font-[700] mb-2">
        {label}
      </span>
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-soft)]">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          autoComplete={autoComplete}
          className={cn("app-input w-full", leftIcon ? "pl-10" : "", rightAccessory ? "pr-12" : "")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {rightAccessory && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-soft)] font-[600]">
            {rightAccessory}
          </div>
        )}
      </div>
    </label>
  );
}

