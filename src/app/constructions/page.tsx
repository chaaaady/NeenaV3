"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { SideMenu } from "@/components";
import { Search, Filter, Menu } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  // Extract unique departments
  const departments = useMemo(() => {
    const depts = Array.from(new Set(PROJECTS.map(p => p.department))).sort();
    return depts;
  }, []);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(project => {
      const matchesSearch = searchQuery === "" ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment = selectedDepartment === null || project.department === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [searchQuery, selectedDepartment]);

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
          <Link href="/qui-sommes-nous" className="text-white font-bold text-[17px] hover:opacity-80 transition-opacity">
            Neena
          </Link>
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

        <main className="relative px-4 pb-24 pt-20 md:px-6 max-w-5xl mx-auto">
          
          {/* Initial Header - visible at top */}
          <div className="absolute top-0 left-0 right-0 z-30 px-4">
            <div className="h-14 flex items-center justify-between">
              <Link href="/qui-sommes-nous" className="text-white font-bold text-[17px] hover:opacity-80 transition-opacity">
                Neena
              </Link>
              <button
                onClick={() => setIsMenuOpen(true)}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-all rounded-lg"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Hero Section with Image */}
          <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Hero Image */}
            <div className="relative h-[280px] w-full">
              <Image
                src="/hero-creteil-2.png"
                alt="Projets de construction"
                fill
                className="object-cover"
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
              
              {/* Hero Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 space-y-3">
                <h1 className="text-white font-[800] text-[36px] md:text-[44px] leading-tight tracking-tight drop-shadow-2xl">
                  Projets de construction
                </h1>
                <p className="text-white/90 text-[15px] md:text-[16px] leading-relaxed max-w-xl font-medium drop-shadow-lg">
                  Participez à la construction de nouvelles mosquées
                </p>
              </div>
            </div>

            {/* Search Bar inside hero card */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    placeholder="Rechercher un projet..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 pl-12 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all text-[14px] font-medium"
                  />
                </div>

                {/* Filter Button */}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex-shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
                    selectedDepartment !== null
                      ? "border-white/30 bg-white/20"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <Filter className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Filter Dropdown */}
              {isFilterOpen && (
                <div className="mt-3 p-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
                  <div className="text-[12px] font-semibold text-white/60 mb-2 uppercase tracking-wide">Département</div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedDepartment(null)}
                      className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                        selectedDepartment === null
                          ? "bg-white text-zinc-900"
                          : "bg-white/10 text-white/80 hover:bg-white/15"
                      }`}
                    >
                      Tous
                    </button>
                    {departments.map(dept => (
                      <button
                        key={dept}
                        onClick={() => setSelectedDepartment(dept)}
                        className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                          selectedDepartment === dept
                            ? "bg-white text-zinc-900"
                            : "bg-white/10 text-white/80 hover:bg-white/15"
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-white/60 text-[13px] font-medium">
            {filteredProjects.length} projet{filteredProjects.length > 1 ? "s" : ""}
          </div>

          {/* Projects Simple List */}
          <div className="mt-4 rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.15] to-white/[0.10] backdrop-blur-xl shadow-xl overflow-hidden">
            {filteredProjects.map((project, index) => (
              <Link key={project.id} href={project.slug}>
                <div className={`flex items-center justify-between p-4 hover:bg-white/10 transition-all cursor-pointer group ${
                  index !== filteredProjects.length - 1 ? "border-b border-white/10" : ""
                }`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-[700] text-[16px] leading-tight group-hover:text-white/90 transition-colors">
                        {project.name}
                      </h3>
                    </div>
                    <p className="text-white/60 text-[13px] font-medium mb-1">
                      {project.city} • Département {project.department}
                    </p>
                    <div className="flex items-center gap-3 text-[12px]">
                      <span className="text-white/50">{project.progress}% • {formatAmount(project.currentAmount)} / {formatAmount(project.targetAmount)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden md:inline-block text-white text-[13px] font-semibold">
                      Découvrir
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-all">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="mt-8 rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.15] to-white/[0.10] backdrop-blur-xl shadow-xl p-8 text-center">
              <p className="text-white/60 text-[14px] font-medium">
                Aucun projet ne correspond à votre recherche.
              </p>
            </div>
          )}

        </main>
      </div>
    </>
  );
}





