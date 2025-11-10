"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DonationCardProps {
  id: string;
  isActive: boolean;
  isCollapsed: boolean;
  children: ReactNode;
  collapsedContent?: ReactNode;
  className?: string;
}

const CARD_GAP = 12;

export function DonationCard({ 
  id, 
  isActive, 
  isCollapsed, 
  children, 
  collapsedContent,
  className = ""
}: DonationCardProps) {
  
  const variants = {
    open: {
      y: 0,
      scale: 1,
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.38,
        ease: [0.2, 0.6, 0.18, 1]
      }
    },
    collapsed: {
      y: -24,
      scale: 0.96,
      opacity: 0.9,
      height: "auto",
      transition: {
        duration: 0.38,
        ease: [0.2, 0.6, 0.18, 1]
      }
    },
    entering: {
      y: 48,
      scale: 0.98,
      opacity: 0.85,
      transition: {
        duration: 0.38,
        ease: [0.2, 0.6, 0.18, 1]
      }
    }
  };

  const state = isCollapsed ? 'collapsed' : isActive ? 'open' : 'entering';

  return (
    <motion.div
      key={id}
      variants={variants}
      initial={state}
      animate={state}
      className={`w-full rounded-3xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl ${className}`}
      style={{
        marginBottom: CARD_GAP
      }}
    >
      {isCollapsed && collapsedContent ? (
        <div className="p-4">
          {collapsedContent}
        </div>
      ) : (
        <div className="p-6 md:p-8">
          {children}
        </div>
      )}
    </motion.div>
  );
}

