"use client";

import { useMemo, useState } from "react";
import { HeaderPrimary } from "@/components/headers/HeaderPrimary";
import { SideMenu } from "@/components";
import { GlassCard, GlassTextarea, PrimaryButton } from "@/components/ds";
import { useDuaaFeed } from "@/features/duaa/useDuaaFeed";

export default function DuaasPage() {
  const { sortedFeed, addPost, like } = useDuaaFeed();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [duaa, setDuaa] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const formatter = useMemo(
    () => new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }),
    []
  );

  const handleSubmit = () => {
    const text = duaa.trim();
    if (!text) return;
    setSubmitting(true);
    addPost(text, "Anonyme");
    setDuaa("");
    setFeedback("Votre du’a a été partagée. Qu’Allah ﷻ exauce votre invocation.");
    setTimeout(() => setFeedback(null), 4000);
    setSubmitting(false);
  };

  return (
    <>
      <HeaderPrimary wide transparent overlay onMenuClick={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="min-h-[100svh] w-full bg-[#0d3326]">
        <main className="px-4 pb-28 pt-[calc(var(--hdr-primary-h)+28px)] md:px-8">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
            <GlassCard className="border-white/20 bg-white/12 text-white">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[12px] uppercase tracking-[0.24em] text-white/60">Communauté</p>
                  <h1 className="text-[26px] font-semibold md:text-[30px]">Partagez votre du’a</h1>
                  <p className="text-[14px] leading-relaxed text-white/70">
                    Toutes les invocations publiées sont visibles par la communauté Neena. Elles restent anonymes et sont
                    modérées avant diffusion.
                  </p>
                </div>

                <GlassTextarea
                  value={duaa}
                  onChange={(e) => setDuaa(e.target.value)}
                  minRows={5}
                  placeholder="Je demande du’a pour..."
                />

                <div className="text-[12px] text-white/60">
                  Merci d’éviter tout appel personnel, numéro de téléphone ou message sensible. Concentrez-vous sur
                  l’invocation sincère et bienveillante.
                </div>

                {feedback ? <div className="text-[13px] text-emerald-200">{feedback}</div> : null}

                <div className="flex justify-end">
                  <PrimaryButton
                    width="full"
                    variant="white"
                    onClick={handleSubmit}
                    disabled={submitting || !duaa.trim()}
                    className="sm:w-auto"
                  >
                    Publier ma du’a
                  </PrimaryButton>
                </div>
              </div>
            </GlassCard>

            <div className="space-y-4">
              <div className="flex flex-col gap-1 text-white sm:flex-row sm:items-end sm:justify-between">
                <h2 className="text-[22px] font-semibold">Toutes les du’as</h2>
                <span className="text-[13px] text-white/60">{sortedFeed.length} invocations partagées</span>
              </div>

              {sortedFeed.length === 0 ? (
                <GlassCard className="border-white/15 bg-white/10 text-white/75">
                  Aucune du’a publiée pour le moment. Soyez le premier à partager une invocation.
                </GlassCard>
              ) : (
                <div className="flex flex-col gap-4">
                  {sortedFeed.map((post) => (
                    <GlassCard key={post.id} className="border-white/12 bg-white/10 text-white">
                      <div className="space-y-3">
                        <div className="flex flex-col gap-1 text-[12px] text-white/65 sm:flex-row sm:items-center sm:justify-between">
                          <span>Posté le {formatter.format(new Date(post.createdAt))}</span>
                          <span>{post.author ?? "Anonyme"}</span>
                        </div>
                        <p className="text-[15px] leading-relaxed text-white/90 whitespace-pre-line">{post.text}</p>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-[12px] text-white/60">Dire « Amine » pour soutenir cette du’a.</span>
                          <PrimaryButton
                            width="full"
                            variant="glass"
                            onClick={() => like(post.id)}
                            className="sm:w-auto"
                          >
                            Amine ({post.likes})
                          </PrimaryButton>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

