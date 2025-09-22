"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

type HeaderSecondaryProps = { title: string; visible: boolean };

export function HeaderSecondary({ title, visible }: HeaderSecondaryProps) {
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState<Array<{ id: string; title: string }>>([]);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-observe-section][data-section-title][id]"));
    const mapped = nodes.map((el) => ({ id: el.id, title: el.dataset.sectionTitle || el.id })).filter((s) => !!s.id && !!s.title);
    setSections(mapped);
  }, []);

  const handleNavigate = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const varH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hdr-primary-h")) || 56;
    const offset = Math.max(0, rect.top + scrollTop - (varH + 44));
    window.scrollTo({ top: offset, behavior: "smooth" });
    setOpen(false);
  };
  return (
    <div
      className={"fixed inset-x-0 top-0 z-[60]"}
      style={{
        top: 0,
        transition: "transform 180ms ease, opacity 180ms ease",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(-8px)",
      }}
    >
      <div className="backdrop-blur-md bg-white/75 dark:bg-neutral-900/60 border-b border-black/10 dark:border-white/10" style={{ WebkitBackdropFilter: "saturate(150%) blur(16px)" }}>
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="h-[48px] sm:h-[52px] flex items-center justify-between">
            <div className="flex items-center min-w-0">
              <div className="text-[18px] sm:text-[22px] font-semibold tracking-tight text-[var(--text)] truncate">{title}</div>
              <span
                role="button"
                aria-label="Afficher la navigation des sections"
                aria-expanded={open}
                tabIndex={0}
                onClick={() => setOpen((v) => !v)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setOpen((v) => !v); }}
                className="ml-2 h-8 w-8 flex items-center justify-center cursor-pointer text-[var(--text)]/80 hover:opacity-80"
              >
                <ChevronDown size={16} />
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/step-amount-v2"
                className="inline-flex h-7 sm:h-8 items-center rounded-[12px] px-3 sm:px-4 text-[14px] font-medium bg-[#0E3B2E] text-white hover:bg-[#0C3528] active:translate-y-[0.5px] focus:outline-none focus:ring-2 focus:ring-emerald-300/60 focus:ring-offset-1 disabled:opacity-60"
              >
                Faire un don
              </a>
            </div>
          </div>
          <div
            className="overflow-hidden transition-[max-height] duration-200 ease-out"
            style={{ maxHeight: open ? Math.min(Math.max(sections.length * 40 + 12, 56), 320) : 0 }}
          >
            <div className="pt-2 border-t border-black/10 dark:border-white/10">
              {sections.length === 0 ? (
                <div className="px-1 py-2 text-[12px] text-[var(--text-muted)]">Aucune section</div>
              ) : (
                <div className="grid gap-1">
                  {sections.map((s) => (
                    <button key={s.id} className="text-left px-1 py-2 rounded-8 text-[13px] hover:bg-black/5 dark:hover:bg-white/5" onClick={() => handleNavigate(s.id)}>
                      {s.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

