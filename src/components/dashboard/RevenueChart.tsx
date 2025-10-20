"use client";

import { useMemo } from "react";
import { GlassCard } from "@/components/ds";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Donation } from "@/lib/supabase";

type RevenueChartProps = {
  donations: Donation[];
  loading?: boolean;
};

export function RevenueChart({ donations, loading }: RevenueChartProps) {
  const chartData = useMemo(() => {
    // Grouper les donations par mois
    const monthlyData: Record<string, number> = {};
    
    donations.forEach((donation) => {
      const date = new Date(donation.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey] += donation.amount_total;
    });

    // Convertir en tableau et trier
    return Object.entries(monthlyData)
      .map(([month, amount]) => ({
        month,
        amount: Math.round(amount * 100) / 100,
        formatted: new Date(month + "-01").toLocaleDateString("fr-FR", {
          month: "short",
          year: "numeric",
        }),
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Derniers 12 mois
  }, [donations]);

  if (loading) {
    return (
      <GlassCard className="border-white/20 bg-white/10">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/20 rounded w-1/3" />
          <div className="h-64 bg-white/10 rounded" />
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="border-white/20 bg-white/10">
      <div className="space-y-4">
        <h3 className="text-[17px] font-semibold text-white">Évolution des dons</h3>
        
        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-white/60">Pas encore de données</p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="formatted"
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: "12px" }}
                  tickFormatter={(value) => `${value}€`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "12px",
                    color: "white",
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)}€`, "Montant"]}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#ffffff"
                  strokeWidth={2}
                  dot={{ fill: "#ffffff", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

