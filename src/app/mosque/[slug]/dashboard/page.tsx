"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabaseClient, Donation, Mosque } from "@/lib/supabase";
import { HeaderPrimary } from "@/components/headers/HeaderPrimary";
import { SideMenu } from "@/components";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DonationsTable } from "@/components/dashboard/DonationsTable";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { GlassCard } from "@/components/ds";
import { Euro, TrendingUp, Users, Calendar, LogOut, PieChart } from "lucide-react";

export default function MosqueDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [mosque, setMosque] = useState<Mosque | null>(null);

  // Set theme-color for iPhone notch
  useEffect(() => {
    const themeColor = "#0a5c4a";
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
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        router.push("/auth/login");
        return;
      }

      // Charger la mosquée
      const { data: mosqueData, error: mosqueError } = await supabaseClient
        .from("mosques")
        .select("*")
        .eq("slug", slug)
        .single();

      if (mosqueError) throw mosqueError;
      setMosque(mosqueData);

      // Charger les donations de cette mosquée
      const { data: donationsData, error: donationsError } = await supabaseClient
        .from("donations")
        .select("*")
        .eq("mosque_id", mosqueData.id)
        .eq("status", "succeeded")
        .order("created_at", { ascending: false });

      if (donationsError) throw donationsError;
      setDonations(donationsData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      loadData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
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

  // Répartition par fréquence
  const frequencyStats = donations.reduce((acc, d) => {
    const freq = d.frequency || "Unique";
    acc[freq] = (acc[freq] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <HeaderPrimary wide transparent overlay onMenuClick={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="min-h-[100svh] w-full bg-gradient-to-b from-[#0a5c4a] via-[#2a7557] to-[#0a5c4a]">
        <main className="px-4 pb-24 pt-[calc(var(--hdr-primary-h)+24px)] md:px-6">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[32px] font-bold text-white">
                  {mosque?.name || "Chargement..."}
                </h1>
                <p className="text-[14px] text-white/70 mt-1">
                  Tableau de bord des donations
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
                subtitle="Depuis le début"
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
                subtitle={`Moyenne: ${averageDonation.toFixed(2)}€`}
                icon={Users}
                loading={loading}
              />
              <StatsCard
                title="Total donations"
                value={donations.length}
                subtitle="Transactions réussies"
                icon={Calendar}
                loading={loading}
              />
            </div>

            {/* Revenue Chart */}
            <RevenueChart donations={donations} loading={loading} />

            {/* Répartition par fréquence */}
            <GlassCard className="border-white/20 bg-white/10">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <PieChart size={20} className="text-white/70" />
                  <h3 className="text-[17px] font-semibold text-white">
                    Répartition par fréquence
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(frequencyStats).map(([freq, count]) => {
                    const percentage = donations.length > 0 
                      ? ((count / donations.length) * 100).toFixed(1) 
                      : "0";
                    
                    return (
                      <div
                        key={freq}
                        className="rounded-2xl bg-white/10 p-4 border border-white/10"
                      >
                        <div className="space-y-2">
                          <p className="text-[13px] text-white/70">{freq}</p>
                          <p className="text-[24px] font-bold text-white">{count}</p>
                          <p className="text-[12px] text-white/60">{percentage}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </GlassCard>

            {/* Donations Table */}
            <div className="space-y-4">
              <h2 className="text-[24px] font-bold text-white">Historique des donations</h2>
              <DonationsTable donations={donations} loading={loading} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

