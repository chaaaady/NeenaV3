"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Donation, Mosque } from "@/lib/supabase";
import { HeaderPrimary } from "@/components/headers/HeaderPrimary";
import { SideMenu } from "@/components";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DonationsTable } from "@/components/dashboard/DonationsTable";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Euro, TrendingUp, Users, Building2, LogOut } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [mosques, setMosques] = useState<Mosque[]>([]);

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

  const loadData = async () => {
    try {
      setLoading(true);

      // Vérifier l'authentification
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth/login");
        return;
      }

      // Charger les mosquées
      const { data: mosquesData, error: mosquesError } = await supabase
        .from("mosques")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (mosquesError) throw mosquesError;
      setMosques(mosquesData || []);

      // Charger les donations
      const { data: donationsData, error: donationsError } = await supabase
        .from("donations")
        .select("*")
        .eq("status", "succeeded")
        .order("created_at", { ascending: false })
        .limit(100);

      if (donationsError) throw donationsError;
      setDonations(donationsData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  // Calculer les stats
  const totalAmount = donations.reduce((sum, d) => sum + d.amount_total, 0);
  const uniqueDonors = new Set(donations.map((d) => d.donor_email).filter(Boolean)).size;
  const averageDonation = donations.length > 0 ? totalAmount / donations.length : 0;

  // Stats du mois en cours
  const thisMonth = new Date().toISOString().slice(0, 7);
  const thisMonthDonations = donations.filter((d) => d.created_at.startsWith(thisMonth));
  const thisMonthAmount = thisMonthDonations.reduce((sum, d) => sum + d.amount_total, 0);

  return (
    <>
      <HeaderPrimary wide transparent overlay onMenuClick={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="min-h-[100svh] w-full bg-gradient-to-b from-[#5a8bb5] via-[#6b9ec7] to-[#5a8bb5]">
        <main className="px-4 pb-24 pt-[calc(var(--hdr-primary-h)+24px)] md:px-6">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[32px] font-bold text-white">Dashboard Admin</h1>
                <p className="text-[14px] text-white/70 mt-1">
                  Vue d&apos;ensemble de toutes les mosquées
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-[14px] font-medium transition-all"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total collecté"
                value={`${totalAmount.toFixed(2)}€`}
                subtitle="Tous les dons"
                icon={Euro}
                loading={loading}
              />
              <StatsCard
                title="Ce mois"
                value={`${thisMonthAmount.toFixed(2)}€`}
                subtitle={`${thisMonthDonations.length} donations`}
                icon={TrendingUp}
                loading={loading}
              />
              <StatsCard
                title="Donateurs uniques"
                value={uniqueDonors}
                subtitle="Personnes différentes"
                icon={Users}
                loading={loading}
              />
              <StatsCard
                title="Mosquées actives"
                value={mosques.length}
                subtitle={`Moyenne: ${averageDonation.toFixed(2)}€/don`}
                icon={Building2}
                loading={loading}
              />
            </div>

            {/* Revenue Chart */}
            <RevenueChart donations={donations} loading={loading} />

            {/* Mosquées Performance */}
            <div className="space-y-4">
              <h2 className="text-[24px] font-bold text-white">Performance par mosquée</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mosques.map((mosque) => {
                  const mosqueDonations = donations.filter((d) => d.mosque_id === mosque.id);
                  const mosqueTotal = mosqueDonations.reduce((sum, d) => sum + d.amount_total, 0);
                  
                  return (
                    <div
                      key={mosque.id}
                      className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-5 hover:bg-white/15 transition-all cursor-pointer"
                      onClick={() => router.push(`/mosque/${mosque.slug}/dashboard`)}
                    >
                      <div className="space-y-3">
                        <h3 className="text-[16px] font-semibold text-white">{mosque.name}</h3>
                        <div className="space-y-1">
                          <p className="text-[24px] font-bold text-white">
                            {mosqueTotal.toFixed(2)}€
                          </p>
                          <p className="text-[12px] text-white/60">
                            {mosqueDonations.length} donations
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Donations Table */}
            <div className="space-y-4">
              <h2 className="text-[24px] font-bold text-white">Dernières donations</h2>
              <DonationsTable donations={donations} loading={loading} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

