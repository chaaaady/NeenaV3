"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Calendar, TrendingUp } from "lucide-react";
import { SideMenu, DesktopSidebar } from "@/components";
import type { ProjectData } from "@/types/project";
import { PHASE_STATUS_LABELS, PROJECT_FEATURE_LABELS } from "@/lib/validations/project";
import { calculateProjectProgress } from "@/lib/api/projects";

interface ProjectTemplateProps {
  data: ProjectData;
}

export function ProjectTemplate({ data }: ProjectTemplateProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const progress = calculateProjectProgress(data);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: data.financials.currency || 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Set theme-color
  useEffect(() => {
    const themeColor = "#2e3246";
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

  const glassBlurClass = "backdrop-blur-xl";

  return (
    <>
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="relative w-full min-h-[100svh]">
        {/* Background */}
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
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: 'url(/prayer-asr.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Logo Neena mobile */}
        <div className="absolute top-0 left-0 z-10 p-4 lg:hidden">
          <a href="/qui-sommes-nous" className="text-[20px] font-[800] text-white tracking-[-0.2px] drop-shadow-lg hover:opacity-80 transition-opacity">
            Neena
          </a>
        </div>

        {/* Burger menu mobile */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            aria-label="Menu" 
            onClick={() => setIsMenuOpen(true)} 
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
        
        {/* Main content */}
        <div className="lg:ml-64 lg:flex lg:justify-center lg:items-start lg:min-h-screen">
          <main className="relative px-4 pb-12 pt-20 md:px-6 max-w-3xl w-full mx-auto">
            {/* Hero Card */}
            <div className={`rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6 md:p-7 space-y-4`}>
              {/* Hero Image */}
              {data.assets.hero_image && (
                <div className="w-full rounded-2xl overflow-hidden relative h-[260px]">
                  <Image
                    src={data.assets.hero_image}
                    alt={data.content.name}
                    fill
                    sizes="(max-width: 600px) 100vw, 600px"
                    className="object-cover"
                  />
                </div>
              )}

              {/* Title/Location */}
              <div>
                <h1 className="text-[20px] font-[800] text-white leading-tight">{data.content.name}</h1>
                <div className="mt-1 text-[13px] text-white/80 flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{data.metadata.city} • Département {data.metadata.department}</span>
                </div>
              </div>

              {/* Short Description */}
              {data.content.short_description && (
                <p className="text-white/80 text-[14px] leading-relaxed">
                  {data.content.short_description}
                </p>
              )}
            </div>

            {/* Financial Progress Card */}
            <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6`}>
              <h2 className="text-[18px] font-[700] text-white mb-4">Progression du financement</h2>
              
              {/* Progress Bar */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-[13px] text-white/80">
                  <span>{formatCurrency(data.financials.current_amount)}</span>
                  <span>{formatCurrency(data.financials.target_amount)}</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-center text-white font-semibold text-[16px]">
                  {progress}% collecté
                </div>
              </div>

              {/* Donate Button */}
              <a
                href="/step-amount-v26"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-white hover:bg-white/90 text-gray-900 font-semibold text-[14px] transition-all active:scale-[0.98]"
              >
                <TrendingUp size={16} />
                <span>Contribuer au projet</span>
              </a>
            </div>

            {/* Timeline Card */}
            {data.timeline.length > 0 && (
              <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6`}>
                <h2 className="text-[18px] font-[700] text-white mb-4">Avancement du projet</h2>
                <div className="space-y-3">
                  {data.timeline.map((phase, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                      <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                        phase.status === 'completed' ? 'bg-emerald-400' :
                        phase.status === 'in_progress' ? 'bg-blue-400' :
                        phase.status === 'delayed' ? 'bg-orange-400' :
                        'bg-white/30'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium text-[14px]">{phase.phase}</span>
                          <span className="text-[12px] text-white/60">{PHASE_STATUS_LABELS[phase.status]}</span>
                        </div>
                        {phase.description && (
                          <p className="text-white/70 text-[13px]">{phase.description}</p>
                        )}
                        {phase.date && (
                          <div className="flex items-center gap-1 mt-1 text-white/60 text-[12px]">
                            <Calendar size={12} />
                            <span>{phase.date}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description Card */}
            {data.content.description && (
              <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6`}>
                <h2 className="text-[18px] font-[700] text-white mb-4">À propos du projet</h2>
                <p className="text-white/80 text-[14px] leading-relaxed whitespace-pre-line">
                  {data.content.description}
                </p>
              </div>
            )}

            {/* Features Card */}
            {data.features.length > 0 && (
              <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6`}>
                <h2 className="text-[18px] font-[700] text-white mb-4">Équipements prévus</h2>
                <div className="grid grid-cols-2 gap-2">
                  {data.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-white text-[13px]">{PROJECT_FEATURE_LABELS[feature]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {data.assets.gallery.length > 0 && (
              <div className={`mt-4 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] ${glassBlurClass} shadow-2xl p-6`}>
                <h2 className="text-[18px] font-[700] text-white mb-4">Galerie</h2>
                <div className="grid grid-cols-2 gap-3">
                  {data.assets.gallery.map((image, index) => (
                    <div key={index} className="relative h-[150px] rounded-xl overflow-hidden">
                      <Image
                        src={image}
                        alt={`${data.content.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 space-y-4">
              <p className="text-white/60 text-[13px] leading-relaxed text-center">
                Neena accompagne les projets de construction de mosquées en France. Chaque don contribue directement au financement du projet.
              </p>
              <div className="flex flex-col items-center gap-2 text-white/50 text-[12px]">
                <div>© 2025 {data.content.name}</div>
                <div className="flex gap-4">
                  <a href="/confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</a>
                  <a href="/a-propos" className="hover:text-white transition-colors">Qui sommes-nous ?</a>
                  <a href="/contact" className="hover:text-white transition-colors">Nous contacter</a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

