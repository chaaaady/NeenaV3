"use client";

import { useState, useEffect } from "react";
import { SideMenu } from "@/components";
import { ScrollReveal } from "@/components/ScrollReveal";
import { HeaderPrimary } from "@/components/headers/HeaderPrimary";
import { Building, Users, Heart, CreditCard, Globe, Smartphone, Check } from "lucide-react";

export default function DevenirPartenairePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <>
      <HeaderPrimary wide transparent overlay onMenuClick={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <div className="relative w-full min-h-[100svh] bg-gradient-to-b from-[#5a8bb5] via-[#6b9ec7] to-[#5a8bb5]">
        <main className="relative px-4 pb-24 pt-[calc(var(--hdr-primary-h)+24px)] md:px-6 max-w-4xl mx-auto">
          
          {/* Hero Section */}
          <ScrollReveal delay={0}>
            <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] backdrop-blur-xl shadow-2xl p-8 md:p-10 text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-md mb-4">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-white font-bold text-[32px] md:text-[42px] leading-tight">
                Digitalisez votre mosquée avec Neena
              </h1>
              <p className="text-white/80 text-[16px] md:text-[18px] leading-relaxed max-w-2xl mx-auto">
                Rejoignez notre réseau de mosquées digitalisées et offrez à votre communauté une expérience moderne et connectée.
              </p>
            </div>
          </ScrollReveal>

          {/* Avantages */}
          <ScrollReveal delay={100}>
            <div className="mt-8 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] backdrop-blur-xl shadow-2xl p-6 md:p-8">
              <h2 className="text-white font-bold text-[24px] md:text-[28px] mb-6">
                Les avantages
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    icon: Smartphone,
                    title: "Plateforme digitale",
                    description: "Une page dédiée à votre mosquée avec horaires de prière en temps réel"
                  },
                  {
                    icon: CreditCard,
                    title: "Dons en ligne",
                    description: "Recevez des dons directement via notre plateforme sécurisée"
                  },
                  {
                    icon: Globe,
                    title: "Visibilité accrue",
                    description: "Soyez visible auprès de milliers de fidèles à travers notre réseau"
                  },
                  {
                    icon: Users,
                    title: "Gestion simplifiée",
                    description: "Dashboard pour suivre vos donations et gérer votre communauté"
                  },
                  {
                    icon: Heart,
                    title: "Support 24/7",
                    description: "Notre équipe vous accompagne dans votre digitalisation"
                  },
                  {
                    icon: Check,
                    title: "Gratuit",
                    description: "Aucun frais d'inscription, nous prenons une petite commission sur les dons"
                  }
                ].map((avantage, idx) => (
                  <div key={idx} className="rounded-2xl bg-white/10 border border-white/10 p-5 hover:bg-white/15 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                        <avantage.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-[16px] mb-1">
                          {avantage.title}
                        </h3>
                        <p className="text-white/70 text-[14px] leading-relaxed">
                          {avantage.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Comment ça marche */}
          <ScrollReveal delay={200}>
            <div className="mt-8 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] backdrop-blur-xl shadow-2xl p-6 md:p-8">
              <h2 className="text-white font-bold text-[24px] md:text-[28px] mb-6">
                Comment ça marche ?
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Inscription",
                    description: "Remplissez le formulaire de contact ci-dessous avec les informations de votre mosquée"
                  },
                  {
                    step: "2",
                    title: "Configuration",
                    description: "Notre équipe configure votre page et votre dashboard personnalisé"
                  },
                  {
                    step: "3",
                    title: "Formation",
                    description: "Nous formons votre équipe à l'utilisation de la plateforme (en ligne ou sur place)"
                  },
                  {
                    step: "4",
                    title: "Lancement",
                    description: "Votre mosquée est en ligne ! Commencez à recevoir des dons et gérez votre communauté"
                  }
                ].map((etape) => (
                  <div key={etape.step} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-white font-bold text-[18px]">{etape.step}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-[17px] mb-1">
                        {etape.title}
                      </h3>
                      <p className="text-white/70 text-[15px] leading-relaxed">
                        {etape.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Formulaire de contact */}
          <ScrollReveal delay={300}>
            <div className="mt-8 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] backdrop-blur-xl shadow-2xl p-6 md:p-8">
              <h2 className="text-white font-bold text-[24px] md:text-[28px] mb-6">
                Intéressé ? Contactez-nous
              </h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-white/80 text-[14px] font-medium mb-2">
                    Nom de la mosquée *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                    placeholder="Ex: Mosquée Sahaba"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-[14px] font-medium mb-2">
                      Ville *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                      placeholder="Ex: Créteil"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-[14px] font-medium mb-2">
                      Code postal *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                      placeholder="Ex: 94000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-[14px] font-medium mb-2">
                    Nom du responsable *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                    placeholder="Prénom et nom"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-[14px] font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                    placeholder="contact@mosquee.fr"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-[14px] font-medium mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                    placeholder="06 12 34 56 78"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-[14px] font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all resize-none"
                    placeholder="Parlez-nous de votre mosquée et de vos attentes..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-white text-gray-900 font-bold text-[16px] shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                >
                  Envoyer la demande
                </button>
              </form>
            </div>
          </ScrollReveal>

        </main>
      </div>
    </>
  );
}





