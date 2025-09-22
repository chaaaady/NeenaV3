"use client";


export function SectionHeader({ title }: { title: string | null }) {
  const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!title) return null;

  return (
    <div
      role="region"
      aria-live="polite"
      className={
        "fixed left-0 right-0 will-change-transform z-[60] " +
        "bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b border-black/5"
      }
      style={{
        transition: reduce ? undefined : "transform 180ms ease, opacity 180ms ease",
        top: "var(--global-header-h, 56px)",
      }}
    >
      <div className="mx-auto w-full" style={{ maxWidth: 560, paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6 }}>
        <div className="grid grid-cols-[1fr_auto] items-center gap-3">
          <div className="text-[15px] font-[800] text-[var(--text)] truncate">{title}</div>
          <a href="/step-amount-v2" className="btn-primary pressable h-8 px-3 flex items-center justify-center text-[13px] font-[700]">Faire un don</a>
        </div>
      </div>
    </div>
  );
}

