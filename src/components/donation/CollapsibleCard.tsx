"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface CollapsibleCardProps {
  id: string;
  isActive: boolean;
  isCollapsed: boolean;
  header: ReactNode;
  content: ReactNode;
  onExpand?: () => void;
}

export function CollapsibleCard({ 
  id, 
  isActive, 
  isCollapsed, 
  header,
  content,
  onExpand
}: CollapsibleCardProps) {
  
  return (
    <motion.div
      key={id}
      layout
      className={`w-full rounded-3xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden ${
        isCollapsed ? 'sticky top-0 z-50' : ''
      }`}
      style={{
        marginBottom: isCollapsed ? 12 : 0
      }}
      initial={false}
      animate={{
        opacity: isActive || isCollapsed ? 1 : 0.85,
      }}
      transition={{
        duration: 0.38,
        ease: [0.2, 0.6, 0.18, 1]
      }}
    >
      {/* Header - Always visible */}
      <motion.div 
        layout="position"
        className="p-4 md:p-6"
        onClick={isCollapsed ? onExpand : undefined}
        style={{ cursor: isCollapsed ? 'pointer' : 'default' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {header}
          </div>
          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-white/60" />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Content - Collapsible */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: {
                duration: 0.38,
                ease: [0.2, 0.6, 0.18, 1]
              },
              opacity: {
                duration: 0.25,
                ease: "easeOut"
              }
            }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 md:px-6 pb-4 md:pb-6">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

