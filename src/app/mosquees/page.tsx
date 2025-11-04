"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { SideMenu } from "@/components";
import { ScrollReveal } from "@/components/ScrollReveal";
import { HeaderPrimary } from "@/components/headers/HeaderPrimary";
import { Search, Filter, MapPin } from "lucide-react";

type Mosque = {
  id: string;
  name: string;
  city: string;
  department: string;
  address: string;
  image: string;
  slug: string;
};

const MOSQUEES: Mosque[] = [
  {
    id: "1",
    name: "Mosquée de Créteil",
    city: "Créteil",
    department: "94",
    address: "5 Rue Jean Gabin, 94000 Créteil",
    image: "/hero-creteil.png",
    slug: "/mosquee/creteil/v8",
  },
  {
    id: "2",
    name: "Mosquée Sahaba",
    city: "Créteil",
    department: "94",
    address: "Avenue du Général de Gaulle, 94000 Créteil",
    image: "/hero-creteil-2.png",
    slug: "/mosquee/creteil/v8",
  },
  {
    id: "3",
    name: "Grande Mosquée de Paris",
    city: "Paris",
    department: "75",
    address: "2bis Place du Puits de l'Ermite, 75005 Paris",
    image: "/hero-creteil.png",
    slug: "/mosquee/creteil/v8",
  },
  {
    id: "4",
    name: "Mosquée d'Argenteuil",
    city: "Argenteuil",
    department: "95",
    address: "12 Rue de la Liberté, 95100 Argenteuil",
    image: "/hero-creteil-2.png",
    slug: "/mosquee/creteil/v8",
  },
  {
    id: "5",
    name: "Mosquée de Nanterre",
    city: "Nanterre",
    department: "92",
    address: "45 Avenue Pablo Picasso, 92000 Nanterre",
    image: "/hero-creteil.png",
    slug: "/mosquee/creteil/v8",
  },
  {
    id: "6",
    name: "Mosquée de Vitry-sur-Seine",
    city: "Vitry-sur-Seine",
    department: "94",
    address: "23 Rue Eugène Pelletan, 94400 Vitry-sur-Seine",
    image: "/hero-creteil-2.png",
    slug: "/mosquee/creteil/v8",
  },
];

export default function MosqueesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  // Extract unique departments
  const departments = useMemo(() => {
    const depts = Array.from(new Set(MOSQUEES.map(m => m.department))).sort();
    return depts;
  }, []);

  // Filter mosquees
  const filteredMosquees = useMemo(() => {
    return MOSQUEES.filter(mosque => {
      const matchesSearch = searchQuery === "" || 
        mosque.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mosque.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mosque.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDepartment = selectedDepartment === null || mosque.department === selectedDepartment;
      
      return matchesSearch && matchesDepartment;
    });
  }, [searchQuery, selectedDepartment]);

  return (
    <>
      <HeaderPrimary wide transparent overlay onMenuClick={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <div className="relative w-full min-h-[100svh] bg-gradient-to-b from-[#5a8bb5] via-[#6b9ec7] to-[#5a8bb5]">
        <main className="relative px-4 pb-24 pt-[calc(var(--hdr-primary-h)+24px)] md:px-6 max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <ScrollReveal delay={0}>
            <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] backdrop-blur-xl shadow-2xl p-6 md:p-8 text-center space-y-4">
              <h1 className="text-white font-bold text-[28px] md:text-[36px] leading-tight">
                Mosquées partenaires
              </h1>
              <p className="text-white/80 text-[15px] md:text-[16px] leading-relaxed max-w-2xl mx-auto">
                Découvrez les mosquées digitalisées avec Neena. Accédez aux horaires de prière, événements et faites vos dons en ligne.
              </p>
            </div>
          </ScrollReveal>

          {/* Search & Filter Bar */}
          <ScrollReveal delay={100}>
            <div className="mt-6 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] backdrop-blur-xl shadow-2xl p-4">
              <div className="flex items-center gap-3">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    placeholder="Rechercher une mosquée..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-[15px]"
                  />
                </div>

                {/* Filter Button */}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex-shrink-0 w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${
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
                <div className="mt-3 p-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                  <div className="text-[13px] font-semibold text-white/70 mb-2">Filtrer par département</div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedDepartment(null)}
                      className={`px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all ${
                        selectedDepartment === null
                          ? "bg-white/90 text-zinc-900"
                          : "bg-white/10 text-white hover:bg-white/15"
                      }`}
                    >
                      Tous
                    </button>
                    {departments.map(dept => (
                      <button
                        key={dept}
                        onClick={() => setSelectedDepartment(dept)}
                        className={`px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all ${
                          selectedDepartment === dept
                            ? "bg-white/90 text-zinc-900"
                            : "bg-white/10 text-white hover:bg-white/15"
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Results Count */}
          <div className="mt-4 text-white/70 text-[14px]">
            {filteredMosquees.length} mosquée{filteredMosquees.length > 1 ? "s" : ""} trouvée{filteredMosquees.length > 1 ? "s" : ""}
          </div>

          {/* Mosquees Grid */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMosquees.map((mosque, idx) => (
              <ScrollReveal key={mosque.id} delay={idx * 50}>
                <Link href={mosque.slug}>
                  <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] backdrop-blur-xl shadow-2xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer">
                    {/* Image */}
                    <div className="relative h-[180px] w-full">
                      <Image
                        src={mosque.image}
                        alt={mosque.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-white font-bold text-[16px] leading-tight">
                          {mosque.name}
                        </h3>
                        <p className="text-white/70 text-[13px] mt-1">
                          {mosque.city}
                        </p>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-white/60 flex-shrink-0 mt-0.5" />
                        <p className="text-white/60 text-[12px] leading-relaxed">
                          {mosque.address}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[12px] font-medium">
                          Département {mosque.department}
                        </span>
                        <button className="px-4 py-2 rounded-xl bg-white/90 hover:bg-white text-zinc-900 font-semibold text-[13px] shadow-lg transition-all">
                          Découvrir
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          {/* Empty State */}
          {filteredMosquees.length === 0 && (
            <ScrollReveal delay={200}>
              <div className="mt-8 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.18] to-white/[0.12] backdrop-blur-xl shadow-2xl p-8 text-center">
                <p className="text-white/70 text-[15px]">
                  Aucune mosquée ne correspond à votre recherche.
                </p>
              </div>
            </ScrollReveal>
          )}

        </main>
      </div>
    </>
  );
}

