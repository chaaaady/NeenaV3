"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { HeaderPrimary } from "@/components/headers/HeaderPrimary";
import { SideMenu } from "@/components";
import { GlassCard, GlassTextarea, PrimaryButton, StepLabels } from "@/components/ds";
import { useDuaaFeed } from "@/features/duaa/useDuaaFeed";

export default function MerciPage() {
  const params = useSearchParams();
  const router = useRouter();
  const mosqueName = params.get("mosque") || "notre mosquée";
  const amount = params.get("amount");
  const frequency = params.get("freq");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [duaa, setDuaa] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [topGap, setTopGap] = useState(32);
  const labelsRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const update = () => {
      const labelsHeight = labelsRef.current?.getBoundingClientRect().bottom ?? 0;
      const bottomHeight = bottomRef.current?.getBoundingClientRect().height ?? 0;
      const cardHeight = cardRef.current?.getBoundingClientRect().height ?? 0;
      const available = window.innerHeight - labelsHeight - bottomHeight;
      const gap = Math.max(32, Math.floor((available - cardHeight) / 2));
      setTopGap(Number.isFinite(gap) ? gap : 32);
    };
    update();
    window.addEventListener("resize", update);
    const roCard = cardRef.current ? new ResizeObserver(update) : null;
    if (cardRef.current && roCard) roCard.observe(cardRef.current);
    return () => {
      window.removeEventListener("resize", update);
      roCard?.disconnect();
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

  const goHome = () => router.push("/");
  const goToDuaas = () => router.push("/duaa");

  return (
    <>
      <HeaderPrimary wide transparent overlay onMenuClick={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="relative" style={{ height: "100svh", overflow: "hidden" }}>
        <Image
          src="/hero-creteil.png"
          alt="Mosquée"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="px-4" style={{ paddingTop: "calc(var(--hdr-primary-h) + 6px)" }}>
          <div ref={labelsRef} className="mx-auto w-full max-w-lg md:max-w-xl mb-2 flex justify-center">
            <div className="rounded-full bg-white/12 border border-white/15 backdrop-blur-md px-3 py-1 shadow-sm">
              <StepLabels current="Merci" previous={["Montant", "Information", "Paiement"]} />
            </div>
          </div>
        </div>

        <div className="px-4">
          <div
            ref={cardRef}
            className="mx-auto w-full max-w-lg md:max-w-xl"
            style={{ marginTop: `${topGap}px`, marginBottom: `${topGap}px` }}
          >
            <GlassCard className="space-y-6 text-center text-white">
              <div className="space-y-2">
                <div className="text-[13px] uppercase tracking-[0.22em] text-white/70">Alhamdoulillah</div>
                <h1 className="text-[26px] md:text-[32px] font-semibold leading-tight">
                  Merci pour votre don à la mosquée {mosqueName}.
                </h1>
                <p className="text-white/80 text-[15px] leading-relaxed">
                  Qu'Allah ﷻ accepte votre sadaqa, vous comble de Sa miséricorde et la fasse rayonner au sein de la mosquée {mosqueName}.
                </p>
                {amount ? (
                  <div className="text-white/70 text-[14px]">
                    Montant confirmé : <span className="font-semibold text-white">{amount} €</span>
                    {frequency ? <span className="text-white/60"> · {frequency}</span> : null}
                  </div>
                ) : null}
              </div>

              <div className="pt-2 text-left space-y-3">
                <div>
                  <div className="text-[15px] font-medium text-white">Partager une demande de du’a</div>
                  <div className="text-[13px] text-white/65">Exprimez une intention ou une personne pour laquelle vous souhaitez qu’on invoque Allah. Votre message restera anonyme.</div>
                </div>
                <GlassTextarea
                  value={duaa}
                  minRows={4}
                  onChange={(e) => setDuaa(e.target.value)}
                  placeholder="Je demande des du'a pour..."
                />
                <div className="text-[12px] text-white/60">
                  Vos demandes de du'a sont visibles par la communauté et modérées. Merci de rester centrés sur l’invocation et d’éviter toute information personnelle ou propos sensibles.
                </div>
                {feedback ? <div className="text-[13px] text-emerald-200">{feedback}</div> : null}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <PrimaryButton
                    width="full"
                    variant="glass"
                    onClick={goToDuaas}
                    className="sm:w-auto"
                  >
                    Découvrir les du’as
                  </PrimaryButton>
                  <PrimaryButton
                    width="full"
                    variant="white"
                    onClick={handlePublish}
                    disabled={submitting || !duaa.trim()}
                    className="sm:w-auto"
                  >
                    Publier
                  </PrimaryButton>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      <div ref={bottomRef} className="fixed inset-x-0" style={{ bottom: "calc(env(safe-area-inset-bottom) + 14px)" }}>
        <div className="mx-auto w-full max-w-lg md:max-w-xl px-4">
          <PrimaryButton width="full" variant="white" onClick={goHome}>
            Revenir à l’accueil
          </PrimaryButton>
        </div>
      </div>
    </>
  );
}


