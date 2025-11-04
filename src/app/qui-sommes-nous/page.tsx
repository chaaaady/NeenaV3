"use client";

import { useState, useEffect } from "react";
import { SideMenu } from "@/components";
import { ScrollReveal } from "@/components/ScrollReveal";
import { HeaderPrimary } from "@/components/headers/HeaderPrimary";
import { Check, Smartphone, Globe, CreditCard, QrCode, Zap, Heart } from "lucide-react";

export default function QuiSommesNousPage() {
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

  const features = [
    {
      icon: <Globe className="w-6 h-6 text-white" />,
      title: "Site web professionnel",
      description: "Un site moderne et responsive pour votre mosquée, créé sur mesure"
    },
    {
      icon: <Smartphone className="w-6 h-6 text-white" />,
      title: "Hébergement gratuit",
      description: "Nous hébergeons votre site gratuitement avec une infrastructure sécurisée"
    },
    {
      icon: <Heart className="w-6 h-6 text-white" />,
      title: "Formulaires de don",
      description: "Collectez des dons en ligne facilement avec nos formulaires optimisés"
    },
    {
      icon: <CreditCard className="w-6 h-6 text-white" />,
      title: "Connexion Stripe",
      description: "Intégration complète avec Stripe pour des paiements sécurisés"
    },
    {
      icon: <QrCode className="w-6 h-6 text-white" />,
      title: "QR Codes physiques",
      description: "Augmentez la portée de collecte avec des QR codes à afficher dans votre mosquée"
    },
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Sans commission",
      description: "100% de vos dons vont à votre mosquée, sans aucune commission de notre part"
    }
  ];

  return (
    <>
      <HeaderPrimary wide transparent overlay onMenuClick={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <div className="relative w-full min-h-[100svh] bg-gradient-to-b from-[#5a8bb5] via-[#6b9ec7] to-[#5a8bb5]">
        <main className="relative px-4 pb-24 pt-[calc(var(--hdr-primary-h)+24px)] md:px-6 max-w-4xl mx-auto">
          
          {/* Hero Section */}
          <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] backdrop-blur-xl shadow-2xl p-8 md:p-10 text-center space-y-6">
            <h1 className="text-white font-bold text-[32px] md:text-[42px] leading-tight">
              Digitalisez votre mosquée avec <span className="text-white">Neena</span>
            </h1>
            <p className="text-white/80 text-[16px] md:text-[18px] leading-relaxed max-w-2xl mx-auto">
              Nous aidons les mosquées à moderniser leur présence en ligne et à optimiser leurs collectes de dons, 
              <span className="text-white font-semibold"> gratuitement et sans commission</span>.
            </p>
            
            <button 
              onClick={() => window.location.href = 'mailto:contact@neena.fr?subject=Rejoindre%20Neena'}
              className="mt-6 px-8 py-4 bg-white/15 hover:bg-white/25 border border-white/25 backdrop-blur-md text-white font-semibold text-[16px] rounded-2xl shadow-lg transition-all transform hover:scale-105"
            >
              Rejoindre Neena
            </button>
          </div>

          {/* Notre Mission */}
          <ScrollReveal delay={0}>
            <div className="mt-8 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] backdrop-blur-xl shadow-2xl p-8 md:p-10">
              <h2 className="text-white font-bold text-[24px] md:text-[28px] mb-4">Notre mission</h2>
              <p className="text-white/80 text-[15px] md:text-[16px] leading-relaxed">
                Neena est une plateforme dédiée à la digitalisation des mosquées en France. 
                Notre objectif est de faciliter la gestion en ligne des mosquées et d&apos;augmenter leurs capacités de collecte 
                grâce à des outils modernes, tout en garantissant une transparence totale et sans aucune commission.
              </p>
            </div>
          </ScrollReveal>

          {/* Ce que nous offrons */}
          <ScrollReveal delay={100}>
            <div className="mt-8 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] backdrop-blur-xl shadow-2xl p-8 md:p-10">
              <h2 className="text-white font-bold text-[24px] md:text-[28px] mb-6 text-center">Ce que nous offrons</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-[16px] mb-1">{feature.title}</h3>
                    <p className="text-white/70 text-[14px] leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </ScrollReveal>

          {/* Avantages */}
          <ScrollReveal delay={200}>
            <div className="mt-8 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] backdrop-blur-xl shadow-2xl p-8 md:p-10">
              <h2 className="text-white font-bold text-[24px] md:text-[28px] mb-6">Pourquoi choisir Neena ?</h2>
            
            <div className="space-y-4">
              {[
                "Aucun frais d'installation ou de maintenance",
                "Aucune commission sur les dons collectés",
                "Hébergement et sécurité pris en charge",
                "Support technique gratuit et réactif",
                "Conformité RGPD et sécurité des paiements",
                "QR codes physiques fournis gratuitement"
              ].map((avantage, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border border-white/30 bg-white/15 backdrop-blur-md flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-white text-[15px]">{avantage}</p>
                </div>
              ))}
            </div>
          </div>
          </ScrollReveal>

          {/* CTA Final */}
          <ScrollReveal delay={300}>
            <div className="mt-8 rounded-3xl border border-white/20 bg-gradient-to-br from-white/[0.22] to-white/[0.15] backdrop-blur-xl shadow-2xl p-8 md:p-10 text-center">
            <h2 className="text-white font-bold text-[24px] md:text-[28px] mb-4">
              Prêt à moderniser votre mosquée ?
            </h2>
            <p className="text-white/80 text-[15px] md:text-[16px] leading-relaxed mb-6 max-w-2xl mx-auto">
              Rejoignez les mosquées qui ont déjà fait confiance à Neena pour digitaliser leur présence 
              et augmenter leurs collectes de manière transparente et efficace.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => window.location.href = 'mailto:contact@neena.fr?subject=Rejoindre%20Neena'}
                className="px-8 py-4 bg-white/15 hover:bg-white/25 border border-white/25 backdrop-blur-md text-white font-semibold text-[16px] rounded-2xl shadow-lg transition-all transform hover:scale-105"
              >
                Nous contacter
              </button>
              <button 
                onClick={() => window.location.href = '/mosquee/creteil/v8'}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-[16px] rounded-2xl border border-white/20 backdrop-blur-md transition-all"
              >
                Voir un exemple
              </button>
            </div>
          </div>
          </ScrollReveal>

        </main>
      </div>
    </>
  );
}

