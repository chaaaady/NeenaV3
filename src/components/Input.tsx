"use client";

import { cn } from "@/lib/cn";

export function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  pattern,
  leftIcon,
  rightAccessory,
  onEnter,
  onBlur,
  ariaInvalid,
  autoFocus,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: string;
  pattern?: string;
  leftIcon?: React.ReactNode;
  rightAccessory?: React.ReactNode;
  onEnter?: () => void;
  onBlur?: () => void;
  ariaInvalid?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <label className="block w-full">
      {label && (
        <span className="block text-[var(--text-muted)] text-[16px] leading-[20px] font-[700] mb-2">
          {label}
        </span>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-soft)]">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          autoComplete={autoComplete}
          className={cn("app-input w-full", leftIcon ? "pl-10" : "", rightAccessory ? "pr-12" : "", ariaInvalid ? "border-red-500" : "")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode as any}
          pattern={pattern}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onEnter?.();
              (e.currentTarget as HTMLInputElement).blur();
            }
          }}
          onBlur={onBlur}
          aria-invalid={ariaInvalid}
          autoFocus={autoFocus}
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

