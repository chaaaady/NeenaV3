"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export function Accordion({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("divide-y divide-[var(--border)] rounded-12 border border-[var(--border)] bg-white", className)}>{children}</div>;
}

export function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <button
        className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-[var(--surface-2)]"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-[14px] font-[600]">{title}</span>
        <span className="text-[16px]">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-4 pb-4 text-[13px] text-[var(--text-muted)]">{children}</div>}
    </div>
  );
}

