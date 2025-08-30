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
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 px-3 h-9 rounded-full border border-[rgba(15,23,42,0.08)] bg-white shadow-sm text-[14px] font-[600] text-[var(--text-soft)] hover:shadow transition"
      aria-pressed={checked}
    >
      <span
        className="inline-flex items-center justify-center w-5 h-5 rounded-md border border-[var(--border)]"
        aria-hidden
        style={{ background: checked ? '#0B1220' : '#FFFFFF' }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
            <path d="M5 10.5l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}

