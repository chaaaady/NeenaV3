"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DonationFormValues } from "@/lib/schema";

type Props = {
  open: boolean;
  cx: number;
  cy: number;
  background?: string;
  summary: string;
  values: DonationFormValues;
  onClose: () => void;
};

export function DonateOverlay({ open, cx, cy, background, summary, values, onClose }: Props) {
  const router = useRouter();
  const [isDuaaOpen, setIsDuaaOpen] = useState(false);
  const [duaaText, setDuaaText] = useState("
");

  const style: React.CSSProperties & { [key: string]: string | undefined } = {
    "--cx": `${cx}px`,
    "--cy": `${cy}px`,
    background: background || undefined,
  };

  return (
    <div className={`donate-overlay ${open ? "open" : ""}`} style={style} aria-hidden={!open}>
      <div className="donate-overlay-content">
        <div className="text-[28px] font-[800] tracking-[-0.3px]">Thank you!</div>
        <div className="text-[15px] opacity-90 text-center max-w-sm">
          {summary}
        </div>
        <div className="grid gap-2 w-full max-w-md mt-2">
          {values.wantsReceipt && (
            <button
              onClick={() => alert("Receipt download placeholder")}
              className="btn-secondary pressable w-full text-[15px] font-[700]"
            >
              Download receipt
            </button>
          )}
          <button
            onClick={async () => {
              try {
                if (navigator.share) {
                  await navigator.share({ title: "Neena Donation", text: summary, url: window.location.href });
                } else {
                  await navigator.clipboard.writeText(`${summary} ${window.location.href}`);
                  alert("Link copied to clipboard");
                }
              } catch {}
            }}
            className="btn-secondary pressable w-full text-[15px] font-[700]"
          >
            Share as a gift
          </button>
          <button
            onClick={() => router.push("/how-it-helps")}
            className="btn-secondary pressable w-full text-[15px] font-[700]"
          >
            How is my donation used?
          </button>
          <button
            onClick={() => router.push("/contact")}
            className="btn-secondary pressable w-full text-[15px] font-[700]"
          >
            Ask a question
          </button>
          <button
            onClick={() => setIsDuaaOpen((v) => !v)}
            className="btn-secondary pressable w-full text-[15px] font-[700]"
          >
            Share a du’a
          </button>
          {isDuaaOpen && (
            <div className="space-y-2">
              <label className="block text-[14px] font-[700] opacity-90">Your du’a (optional)</label>
              <textarea
                value={duaaText}
                onChange={(e) => setDuaaText(e.target.value)}
                rows={4}
                placeholder="Write a short du’a to share"
                className="app-input w-full"
                style={{ height: 120 }}
              />
              <div className="text-[13px] opacity-80">Every du’a is anonymous.</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsDuaaOpen(false)}
                  className="btn-secondary pressable w-full text-[15px] font-[700]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const text = duaaText.trim();
                    const params = new URLSearchParams();
                    if (text.length > 0) params.set("text", text);
                    const url = params.toString().length > 0 ? `/duaa?${params.toString()}` : "/duaa";
                    onClose();
                    setTimeout(() => router.push(url), 50);
                  }}
                  className="btn-primary pressable w-full text-[15px] font-[700]"
                  disabled={duaaText.trim().length === 0}
                >
                  Share du’a
                </button>
              </div>
            </div>
          )}
          <button
            onClick={() => router.push("/")}
            className="btn-primary pressable w-full text-[15px] font-[700]"
          >
            Go to home
          </button>
        </div>
      </div>
    </div>
  );
}

