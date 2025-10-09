"use client";

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import type { Duaa } from "@/types/duaa";

type DuaaModalProps = {
  isOpen: boolean;
  onClose: () => void;
  duaa: Duaa;
  onDuaaDone: () => void;
  context: string;
};

export function DuaaModal({ isOpen, onClose, duaa, onDuaaDone, context }: DuaaModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(duaa.text_ar);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleDuaaDone = () => {
    onDuaaDone();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-md z-[200] transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
        <div 
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/20 bg-gradient-to-br from-white/[0.25] to-white/[0.18] backdrop-blur-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/10 bg-white/5 backdrop-blur-xl">
            <h2 className="text-[18px] font-[700] text-white">Du&apos;a</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Context reminder */}
            {context && (
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                <p className="text-[13px] text-white/70 mb-1">Demande</p>
                <p className="text-[14px] text-white leading-relaxed">{context}</p>
              </div>
            )}

            {/* Intention reminder */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-[14px] text-white/90 leading-relaxed">
                ✨ Prends un instant pour invoquer sincèrement. Qu&apos;Allah ﷻ exauce cette invocation.
              </p>
            </div>

            {/* Texte arabe */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-white/70">Texte arabe</p>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-[13px] font-medium transition-all"
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      Copié
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copier
                    </>
                  )}
                </button>
              </div>
              <div className="p-5 rounded-2xl bg-white/10 border border-white/15">
                <p className="text-[20px] md:text-[24px] text-white leading-[2] text-right font-arabic">
                  {duaa.text_ar}
                </p>
              </div>
            </div>

            {/* Translittération */}
            <div className="space-y-2">
              <p className="text-[13px] font-semibold text-white/70">Translittération</p>
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                <p className="text-[15px] text-white/90 leading-relaxed italic">
                  {duaa.translit}
                </p>
              </div>
            </div>

            {/* Traduction */}
            <div className="space-y-2">
              <p className="text-[13px] font-semibold text-white/70">Traduction française</p>
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                <p className="text-[15px] text-white leading-relaxed">
                  {duaa.translation_fr}
                </p>
              </div>
            </div>

            {/* Source */}
            <div className="flex items-center gap-2 text-[12px] text-white/60">
              <span className="px-2 py-1 rounded-lg bg-white/10 border border-white/15">
                {duaa.source_type === "quran" ? "Coran" : "Hadith"}
              </span>
              <span>·</span>
              <span>{duaa.source_ref}</span>
              <span>·</span>
              <span className="px-2 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-100">
                {duaa.auth_grade === "quran" ? "Coran" : duaa.auth_grade === "sahih" ? "Sahih" : "Hasan"}
              </span>
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                onClick={handleDuaaDone}
                className="w-full h-12 rounded-2xl bg-white hover:bg-white/90 text-zinc-900 font-semibold text-[16px] shadow-lg transition-all"
              >
                Du&apos;a réalisée ✓
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

