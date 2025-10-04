"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HeaderPrimary } from "@/components/headers/HeaderPrimary";
import { SideMenu } from "@/components";
import { GlassCard, GlassTextarea, PrimaryButton } from "@/components/ds";
import { useDuaaFeed } from "@/features/duaa/useDuaaFeed";

export default function MerciPage() {
  return (
    <Suspense fallback={<div className="min-h-[100svh] w-full bg-black" />}>
      <MerciContent />
    </Suspense>
  );
}

function MerciContent() {
  const params = useSearchParams();
  const router = useRouter();
  const mosqueName = params.get("mosque") || "notre mosquée";
  const amount = params.get("amount");
  const frequency = params.get("freq");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [duaa, setDuaa] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { addPost } = useDuaaFeed();

  useEffect(() => {
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Set theme-color for iPhone notch
  useEffect(() => {
    const themeColor = "#5a8bb5";
    let meta = document.querySelector('meta[name="theme-color"]');
    
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    
    const previousColor = meta.getAttribute("content");
    meta.setAttribute("content", themeColor);
    
    return () => {
      if (previousColor) {
        meta?.setAttribute("content", previousColor);
      } else {
        meta?.remove();
      }
    };
  }, []);

  const handlePublish = () => {
    const text = duaa.trim();
    if (!text) return;
    setSubmitting(true);
    addPost(text, "Anonyme");
    setFeedback("Votre demande de du'a a bien été partagée. Qu'Allah vous exauce.");
    setDuaa("");
    setTimeout(() => setFeedback(null), 4000);
    setSubmitting(false);
  };

  const goToDuaas = () => router.push("/duaa");

  return (
    <>
      <HeaderPrimary wide transparent overlay onMenuClick={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="relative bg-gradient-to-b from-[#5a8bb5] via-[#6b9ec7] to-[#5a8bb5]" style={{ height: "100svh", overflow: "hidden" }}>

        <div className="flex items-center justify-center px-4" style={{ minHeight: "100svh", paddingTop: "var(--hdr-primary-h)", paddingBottom: "32px" }}>
          <div
            ref={cardRef}
            className="mx-auto w-full max-w-lg md:max-w-xl"
          >
            <GlassCard className="space-y-6 text-center text-white">
              <div className="space-y-2">
                <div className="text-[13px] uppercase tracking-[0.22em] text-white/70">Alhamdoulillah</div>
                <h1 className="text-[26px] md:text-[32px] font-semibold leading-tight">
                  Merci pour votre don à la mosquée {mosqueName}.
                </h1>
                <p className="text-white/80 text-[15px] leading-relaxed">
                  Qu&apos;Allah ﷻ accepte votre sadaqa, vous comble de Sa miséricorde et la fasse rayonner au sein de la mosquée {mosqueName}.
                </p>
                {amount ? (
                  <div className="text-white/70 text-[14px]">
                    Montant confirmé : <span className="font-semibold text-white">{amount} €</span>
                    {frequency ? <span className="text-white/60"> · {frequency}</span> : null}
                  </div>
                ) : null}
              </div>

              <div className="pt-2 text-left space-y-4">
                <div>
                  <div className="text-[15px] font-medium text-white">Partager une demande de du'a</div>
                  <div className="text-[13px] text-white/65">Exprimez une intention ou une personne pour laquelle vous souhaitez qu&apos;on invoque Allah. Votre message restera anonyme.</div>
                </div>
                <div className="space-y-2">
                  <GlassTextarea
                    value={duaa}
                    minRows={3}
                    onChange={(e) => setDuaa(e.target.value)}
                    placeholder="Je demande des du&apos;a pour..."
                  />
                  <div className="flex justify-end">
                    <PrimaryButton
                      variant="white"
                      onClick={handlePublish}
                      disabled={submitting || !duaa.trim()}
                      className="px-6"
                    >
                      Publier
                    </PrimaryButton>
                  </div>
                </div>
                {feedback ? <div className="text-[13px] text-emerald-200">{feedback}</div> : null}
                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={goToDuaas}
                    className="text-[14px] text-white/70 hover:text-white transition-colors underline underline-offset-2"
                  >
                    Découvrir les du&apos;as de la communauté
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </>
  );
}
