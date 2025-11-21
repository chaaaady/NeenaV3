"use client";

import { useMemo, useState, useEffect } from "react";
import { HeaderPrimary } from "@/components/headers/HeaderPrimary";
import { SideMenu } from "@/components";
import { ScrollReveal } from "@/components/ScrollReveal";
import { GlassCard, GlassTextarea, GlassSelect, PrimaryButton } from "@/components/ds";
import { useDuaaFeed } from "@/features/duaa/useDuaaFeed";
import { useCurrentPrayer } from "@/hooks/useCurrentPrayer";
import type { Category, Duaa, Request } from "@/types/duaa";

export default function DuaasPage() {
  const { sortedFeed, addRequest, incrementDuaaDone } = useDuaaFeed();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [duaa, setDuaa] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentDuaa, setCurrentDuaa] = useState<{ duaa: Duaa; request: Request } | null>(null);

  // Déterminer la prière actuelle et le background correspondant
  const currentPrayer = useCurrentPrayer("mosquee-sahaba-creteil");
  
  const PRAYER_BACKGROUNDS: Record<string, { image: string; flip: boolean; statusBarColor: string }> = {
    fajr: { image: '/prayer-fajr.jpg', flip: false, statusBarColor: '#041a31' },
    dhuhr: { image: '/prayer-dhuhr.jpg', flip: false, statusBarColor: '#1b466b' },
    asr: { image: '/prayer-asr.jpg', flip: false, statusBarColor: '#2e3246' },
    maghrib: { image: '/prayer-maghrib.jpg', flip: false, statusBarColor: '#1f2339' },
    isha: { image: '/prayer-isha.jpg', flip: true, statusBarColor: '#1e2738' },
  };
  
  const currentBackground = useMemo(() => 
    PRAYER_BACKGROUNDS[currentPrayer] || PRAYER_BACKGROUNDS.fajr,
    [currentPrayer]
  );

  // Load categories
  useEffect(() => {
    fetch("/api/duaa/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
        setCategories([]);
      });
  }, []);

  // Set theme-color for iPhone notch - dynamically based on current prayer
  useEffect(() => {
    const themeColor = currentBackground.statusBarColor;
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
  }, [currentBackground.statusBarColor]);

  const formatter = useMemo(
    () => new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }),
    []
  );

  const handleSubmit = () => {
    const text = duaa.trim();
    if (!text || !selectedCategory) return;
    setSubmitting(true);
    addRequest(text, selectedCategory, "Anonyme");
    setDuaa("");
    setSelectedCategory("");
    setFeedback("Votre demande a été partagée. Qu'Allah ﷻ exauce votre invocation.");
    setTimeout(() => setFeedback(null), 4000);
    setSubmitting(false);
  };

  const handleMakeDuaa = (request: Request) => {
    try {
      const category = categories.find((c) => c.id === request.category_id);
      if (category && Array.isArray(category.duaas) && category.duaas.length > 0) {
        setCurrentDuaa({ duaa: category.duaas[0], request });
        setModalOpen(true);
      } else {
        console.warn("No duaa available for this category");
      }
    } catch (error) {
      console.error("Error opening duaa modal:", error);
    }
  };

  const handleDuaaDone = () => {
    if (currentDuaa) {
      incrementDuaaDone(currentDuaa.request.id);
      setCurrentDuaa(null);
    }
  };

  return (
    <>
      <HeaderPrimary wide transparent overlay onMenuClick={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="relative min-h-[100svh] w-full">
        {/* Background image dynamique selon la prière actuelle */}
        <div 
          className="fixed inset-0 overflow-hidden" 
          style={{ 
            top: "calc(-1 * env(safe-area-inset-top))",
            bottom: "calc(-1 * env(safe-area-inset-bottom))",
            left: "calc(-1 * env(safe-area-inset-left))",
            right: "calc(-1 * env(safe-area-inset-right))"
          }}
        >
          <div
            className="absolute inset-0 w-full h-full transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${currentBackground.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: currentBackground.flip ? 'scaleY(-1)' : 'none',
            }}
          />
          
          {/* Overlay pour lisibilité */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <main className="px-4 pb-28 pt-[calc(var(--hdr-primary-h)+28px)] md:px-8">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
            <ScrollReveal delay={0}>
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

                {/* Category selector */}
                <div className="space-y-2">
                  <div className="text-[13px] font-medium text-white/80">Catégorie (pour une recommandation appropriée)</div>
                  <GlassSelect
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    options={categories.map((cat) => ({
                      value: cat.id,
                      label: cat.title,
                    }))}
                    placeholder="Choisir une catégorie..."
                  />
                </div>

                <GlassTextarea
                  value={duaa}
                  onChange={(e) => setDuaa(e.target.value)}
                  minRows={4}
                  placeholder="Je demande du'a pour..."
                />

                <div className="text-[12px] text-white/60">
                  Merci d&apos;éviter tout appel personnel, numéro de téléphone ou message sensible. Concentrez-vous sur
                  l&apos;invocation sincère et bienveillante.
                </div>

                {feedback ? <div className="text-[13px] text-emerald-200">{feedback}</div> : null}

                <div className="flex justify-end">
                  <PrimaryButton
                    width="full"
                    variant="white"
                    onClick={handleSubmit}
                    disabled={submitting || !duaa.trim() || !selectedCategory}
                    className="sm:w-auto"
                  >
                    Publier ma demande
                  </PrimaryButton>
                </div>
              </div>
            </GlassCard>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="space-y-4">
                <div className="flex flex-col gap-1 text-white sm:flex-row sm:items-end sm:justify-between">
                <h2 className="text-[22px] font-semibold">Toutes les demandes</h2>
                <span className="text-[13px] text-white/60">{sortedFeed.length} demande{sortedFeed.length > 1 ? "s" : ""} partagée{sortedFeed.length > 1 ? "s" : ""}</span>
              </div>

              {sortedFeed.length === 0 ? (
                <GlassCard className="border-white/15 bg-white/10 text-white/75">
                  Aucune demande publiée pour le moment. Soyez le premier à partager une invocation.
                </GlassCard>
              ) : (
                <div className="flex flex-col gap-4">
                  {sortedFeed.map((request) => {
                    const category = categories.find((c) => c.id === request.category_id);
                    return (
                      <GlassCard key={request.id} className="border-white/12 bg-white/10 text-white">
                        <div className="space-y-3">
                          <div className="flex flex-col gap-1 text-[12px] text-white/65 sm:flex-row sm:items-center sm:justify-between">
                            <span>Posté le {formatter.format(new Date(request.created_at))}</span>
                            <span>{request.author}</span>
                          </div>
                          
                          {category && (
                            <div className="inline-flex items-center px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-[12px] text-white/80">
                              {category.title}
                            </div>
                          )}

                          <p className="text-[15px] leading-relaxed text-white/90 whitespace-pre-line">{request.context_text}</p>
                          
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <span className="text-[12px] text-white/60">
                              {request.counters.duaa_done} personne{request.counters.duaa_done > 1 ? "s ont" : " a"} fait cette du&apos;a
                            </span>
                            <PrimaryButton
                              width="full"
                              variant="glass"
                              onClick={() => handleMakeDuaa(request)}
                              className="sm:w-auto"
                            >
                              Faire la du&apos;a
                            </PrimaryButton>
                          </div>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              )}
            </div>
            </ScrollReveal>
          </div>
        </main>
      </div>

      {/* Duaa Modal */}
      {currentDuaa && modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="relative w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold text-white mb-4">{currentDuaa.duaa.text_ar}</h3>
            <p className="text-white/80 mb-4">{currentDuaa.duaa.translit}</p>
            <p className="text-white/60 mb-6 text-sm">{currentDuaa.duaa.translation_fr}</p>
            {currentDuaa.request.context_text && (
              <div className="bg-white/5 rounded-2xl p-4 mb-6">
                <p className="text-white/70 text-sm">{currentDuaa.request.context_text}</p>
              </div>
            )}
            <button
              onClick={handleDuaaDone}
              className="w-full bg-white text-black font-semibold py-3 rounded-2xl hover:bg-white/90 transition-all active:scale-[0.98]"
            >
              J&apos;ai fait la duaa
            </button>
          </div>
        </div>
      )}
    </>
  );
}

