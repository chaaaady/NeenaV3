"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatEuro } from "@/lib/currency";
import { HandHeart, User } from "lucide-react";

interface SummaryItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

interface SummaryBarProps {
  items: SummaryItem[];
}

export function SummaryBar({ items }: SummaryBarProps) {
  if (items.length === 0) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-40 pt-safe-top"
      style={{
        paddingTop: "calc(env(safe-area-inset-top) + 0.5rem)"
      }}
    >
      <div className="px-5 space-y-2">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.35,
                ease: [0.2, 0.6, 0.18, 1],
                delay: index * 0.05
              }}
              className="w-full rounded-3xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <div className="text-left">
                    <p className="text-white text-[17px] font-semibold">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-white/70 text-[13px]">{item.subtitle}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Helper to create summary items
export function createAmountSummary(amount: number, frequency: string): SummaryItem {
  return {
    id: 'amount',
    icon: <HandHeart className="w-5 h-5 text-white" />,
    title: formatEuro(amount),
    subtitle: frequency
  };
}

export function createInfoSummary(name: string): SummaryItem {
  return {
    id: 'info',
    icon: <User className="w-5 h-5 text-white" />,
    title: name,
  };
}

