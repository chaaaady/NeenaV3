"use client";

import { GlassCard } from "@/components/ds";
import { LucideIcon } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  loading?: boolean;
};

export function StatsCard({ title, value, subtitle, icon: Icon, trend, loading }: StatsCardProps) {
  if (loading) {
    return (
      <GlassCard className="border-white/20 bg-white/10">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-white/20 rounded w-1/2" />
          <div className="h-8 bg-white/20 rounded w-3/4" />
          <div className="h-3 bg-white/20 rounded w-1/3" />
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="border-white/20 bg-white/10">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Icon size={16} className="text-white/70" />
            <p className="text-[13px] font-medium text-white/70">{title}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-[28px] font-bold text-white leading-none">{value}</p>
            {subtitle && (
              <p className="text-[12px] text-white/60">{subtitle}</p>
            )}
          </div>

          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={`text-[12px] font-medium ${
                  trend.isPositive ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {trend.isPositive ? "↑" : "↓"} {trend.value}
              </span>
              <span className="text-[12px] text-white/50">vs mois précédent</span>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

