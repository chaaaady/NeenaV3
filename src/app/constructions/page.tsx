"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { SideMenu } from "@/components";
import { ScrollReveal } from "@/components/ScrollReveal";
import { MapPin, TrendingUp, Building, Clock, Target, Menu } from "lucide-react";
import { useCurrentPrayer } from "@/hooks";

type ConstructionProject = {
  id: string;
  name: string;
  city: string;
  department: string;
  address: string;
  image: string;
  slug: string;
  targetAmount: number;
  currentAmount: number;
  progress: number;
  description: string;
  startDate: string;
  estimatedCompletion: string;
  status: "En cours" | "Planifié" | "Bientôt";
};

const PROJECTS: ConstructionProject[] = [
  {
    id: "1",
    name: "Grande Mosquée d'Ivry",
    city: "Ivry-sur-Seine",
    department: "94",
    address: "Avenue de la République, 94200 Ivry-sur-Seine",
    image: "/hero-creteil.png",
    slug: "/mosquee/creteil/v9",
    targetAmount: 2000000,
    currentAmount: 850000,
    progress: 42.5,
    description: "Un projet ambitieux pour construire une mosquée moderne de 1200m² avec école coranique, salle de prière pour femmes et parking.",
    startDate: "Janvier 2025",
    estimatedCompletion: "Décembre 2026",
    status: "En cours"
  },
  {
    id: "2",
    name: "Mosquée Al-Baraka",
    city: "Montreuil",
    department: "93",
    address: "Rue de Paris, 93100 Montreuil",
    image: "/hero-creteil-2.png",
    slug: "#",
    targetAmount: 1500000,
    currentAmount: 450000,
    progress: 30,
    description: "Extension et rénovation d'une mosquée existante pour accueillir 800 fidèles.",
    startDate: "Mars 2025",
    estimatedCompletion: "Septembre 2026",
    status: "Planifié"
  },
  {
    id: "3",
    name: "Centre Islamique de Bobigny",
    city: "Bobigny",
    department: "93",
    address: "Avenue Henri Barbusse, 93000 Bobigny",
    image: "/hero-creteil.png",
    slug: "#",
    targetAmount: 3000000,
    currentAmount: 120000,
    progress: 4,
    description: "Construction d'un centre islamique comprenant mosquée, bibliothèque et espaces communautaires.",
    startDate: "Juin 2025",
    estimatedCompletion: "Juin 2027",
    status: "Bientôt"
  }
];

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Prayer backgrounds configuration
const PRAYER_BACKGROUNDS = [
  {
    id: "fajr",
    name: "Fajr",
    image: "/prayer-fajr.jpg",
    statusBarColor: "#062951",
    flip: false,
  },
  {
    id: "dhuhr",
    name: "Dhuhr",
    image: "/prayers/dhuhr.jpg",
    statusBarColor: "#2d74b2",
    flip: false,
  },
  {
    id: "asr",
    name: "Asr",
    image: "/prayer-asr.jpg",
    statusBarColor: "#4d5375",
    flip: false,
  },
  {
    id: "maghrib",
    name: "Maghrib",
    image: "/prayers/maghrib.jpg",
    statusBarColor: "#313759",
    flip: false,
  },
  {
    id: "isha",
    name: "Isha",
    image: "/prayers/isha.jpg",
    statusBarColor: "#2f3d5a",
    flip: true,
  },
];

export default function ConstructionsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Get current prayer for dynamic background
  const currentPrayerId = useCurrentPrayer("mosquee-sahaba-creteil");
  const currentBackground = useMemo(() => 
    PRAYER_BACKGROUNDS.find(bg => bg.id === currentPrayerId) || PRAYER_BACKGROUNDS[0],
    [currentPrayerId]
  );

  // Handle scroll for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set theme-color for iPhone notch based on current prayer
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

  return (
    <>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      {/* Sticky Header - appears on scroll */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ${
          scrolled ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="h-14 px-4 flex items-center justify-between border-b border-white/15 bg-white/10 backdrop-blur-xl">
          <div className="text-white font-bold text-[17px]">Neena</div>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-all rounded-lg"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      </header>

      <div className="relative w-full min-h-[100svh] overflow-hidden">
        {/* Dynamic Background Image */}
        <div 
          className="fixed inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${currentBackground.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: currentBackground.flip ? 'scaleY(-1)' : 'none',
          }}
        />

        {/* Overlay */}
        <div className="fixed inset-0 bg-black/40" />

        {/* Initial Header - visible at top */}
        <div className="absolute top-0 left-0 right-0 z-30 px-4">
          <div className="h-14 flex items-center justify-between">
            <div className="text-white font-bold text-[17px]">Neena</div>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-all rounded-lg"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <main className="relative px-4 pb-24 pt-20 md:px-6 max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <ScrollReveal delay={0}>
            <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] backdrop-blur-xl shadow-2xl p-6 md:p-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-md mb-2">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-white font-bold text-[28px] md:text-[36px] leading-tight">
                Projets de construction de mosquées
              </h1>
              <p className="text-white/80 text-[15px] md:text-[16px] leading-relaxed max-w-2xl mx-auto">
                Participez à la construction de nouvelles mosquées et centres islamiques à travers la France. Chaque don compte pour bâtir des lieux de culte pour les générations futures.
              </p>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal delay={100}>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] backdrop-blur-xl shadow-xl p-5 text-center">
                <p className="text-white/70 text-[13px] font-medium mb-1">Projets actifs</p>
                <p className="text-white text-[32px] font-bold">{PROJECTS.length}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] backdrop-blur-xl shadow-xl p-5 text-center">
                <p className="text-white/70 text-[13px] font-medium mb-1">Montant collecté</p>
                <p className="text-white text-[28px] font-bold">
                  {formatAmount(PROJECTS.reduce((acc, p) => acc + p.currentAmount, 0))}
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] backdrop-blur-xl shadow-xl p-5 text-center">
                <p className="text-white/70 text-[13px] font-medium mb-1">Objectif total</p>
                <p className="text-white text-[28px] font-bold">
                  {formatAmount(PROJECTS.reduce((acc, p) => acc + p.targetAmount, 0))}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Projects Grid */}
          <div className="mt-8">
            <div className="mb-4 text-white/70 text-[14px]">
              {PROJECTS.length} projet{PROJECTS.length > 1 ? "s" : ""} en cours
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {PROJECTS.map((project, idx) => (
                <ScrollReveal key={project.id} delay={idx * 100}>
                  <Link href={project.slug}>
                    <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] backdrop-blur-xl shadow-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
                      {/* Image */}
                      <div className="relative h-[200px] w-full">
                        <Image
                          src={project.image}
                          alt={project.name}
                          fill
                          className="object-cover"
                        />
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-semibold backdrop-blur-md ${
                            project.status === "En cours" 
                              ? "bg-emerald-500/90 text-white" 
                              : project.status === "Planifié"
                              ? "bg-blue-500/90 text-white"
                              : "bg-amber-500/90 text-white"
                          }`}>
                            {project.status}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="text-white font-bold text-[20px] leading-tight mb-1 group-hover:text-white/90 transition-colors">
                            {project.name}
                          </h3>
                          <div className="flex items-center gap-2 text-white/70 text-[13px]">
                            <MapPin className="w-4 h-4" />
                            <span>{project.city}, {project.department}</span>
                          </div>
                        </div>

                        <p className="text-white/80 text-[14px] leading-relaxed">
                          {project.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[13px]">
                            <span className="text-white/70">Progression</span>
                            <span className="text-white font-semibold">{project.progress}%</span>
                          </div>
                          <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[13px]">
                            <span className="text-white/70">{formatAmount(project.currentAmount)} collectés</span>
                            <span className="text-white font-semibold">sur {formatAmount(project.targetAmount)}</span>
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="rounded-xl bg-white/10 p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-white/60" />
                              <p className="text-white/60 text-[11px] font-medium uppercase">Début</p>
                            </div>
                            <p className="text-white text-[13px] font-semibold">{project.startDate}</p>
                          </div>
                          <div className="rounded-xl bg-white/10 p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Target className="w-4 h-4 text-white/60" />
                              <p className="text-white/60 text-[11px] font-medium uppercase">Fin prévue</p>
                            </div>
                            <p className="text-white text-[13px] font-semibold">{project.estimatedCompletion}</p>
                          </div>
                        </div>

                        {/* CTA */}
                        <button className="w-full mt-4 px-6 py-3 rounded-xl bg-white/90 hover:bg-white text-zinc-900 font-semibold text-[14px] shadow-lg transition-all flex items-center justify-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Découvrir le projet
                        </button>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>

        </main>
      </div>
    </>
  );
}





