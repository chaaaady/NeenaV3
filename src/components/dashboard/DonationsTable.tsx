"use client";

import { useMemo, useState } from "react";
import { Donation } from "@/lib/supabase";
import { GlassCard } from "@/components/ds";
import { Download } from "lucide-react";

type DonationsTableProps = {
  donations: Donation[];
  loading?: boolean;
};

export function DonationsTable({ donations, loading }: DonationsTableProps) {
  const [sortKey, setSortKey] = useState<keyof Donation>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortedDonations = useMemo(() => {
    return [...donations].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc" 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });
  }, [donations, sortKey, sortDirection]);

  const handleSort = (key: keyof Donation) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const exportToCSV = () => {
    const headers = ["Date", "Montant", "Fréquence", "Type", "Email", "Statut"];
    const rows = sortedDonations.map((d) => [
      new Date(d.created_at).toLocaleDateString("fr-FR"),
      `${d.amount_total} €`,
      d.frequency || "-",
      d.donation_type || "-",
      d.donor_email || "-",
      d.status,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <GlassCard className="border-white/20 bg-white/10">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-white/10 rounded" />
          ))}
        </div>
      </GlassCard>
    );
  }

  if (donations.length === 0) {
    return (
      <GlassCard className="border-white/20 bg-white/10">
        <div className="text-center py-12">
          <p className="text-white/70">Aucune donation pour le moment</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="border-white/20 bg-white/10">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-[17px] font-semibold text-white">
            Dernières donations ({donations.length})
          </h3>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-[13px] font-medium transition-all"
          >
            <Download size={14} />
            Exporter CSV
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th
                  className="text-left py-3 px-2 text-[12px] font-semibold text-white/70 cursor-pointer hover:text-white"
                  onClick={() => handleSort("created_at")}
                >
                  Date {sortKey === "created_at" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="text-right py-3 px-2 text-[12px] font-semibold text-white/70 cursor-pointer hover:text-white"
                  onClick={() => handleSort("amount_total")}
                >
                  Montant {sortKey === "amount_total" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th className="text-left py-3 px-2 text-[12px] font-semibold text-white/70">
                  Fréquence
                </th>
                <th className="text-left py-3 px-2 text-[12px] font-semibold text-white/70">
                  Email
                </th>
                <th className="text-left py-3 px-2 text-[12px] font-semibold text-white/70">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedDonations.slice(0, 50).map((donation) => (
                <tr
                  key={donation.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-2 text-[13px] text-white">
                    {new Date(donation.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-2 text-[14px] font-semibold text-white text-right tabular-nums">
                    {donation.amount_total.toFixed(2)} €
                  </td>
                  <td className="py-3 px-2 text-[13px] text-white/80">
                    {donation.frequency || "-"}
                  </td>
                  <td className="py-3 px-2 text-[13px] text-white/80 truncate max-w-[200px]">
                    {donation.donor_email || "Anonyme"}
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`inline-flex px-2 py-1 rounded-lg text-[11px] font-medium ${
                        donation.status === "succeeded"
                          ? "bg-emerald-500/20 text-emerald-200"
                          : "bg-red-500/20 text-red-200"
                      }`}
                    >
                      {donation.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {donations.length > 50 && (
          <div className="text-center text-[12px] text-white/50 pt-2">
            Affichage de 50 donations sur {donations.length}
          </div>
        )}
      </div>
    </GlassCard>
  );
}

