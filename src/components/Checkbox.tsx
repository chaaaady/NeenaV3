"use client";

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="checkbox-touch">
        <input
          type="checkbox"
          className="app-checkbox mt-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
      </div>
      <label className="text-[16px] leading-[22px] text-[var(--text-muted)]">
        {label}
      </label>
    </div>
  );
}

