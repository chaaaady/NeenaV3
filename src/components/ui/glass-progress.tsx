"use client"

import * as React from "react"
import { cn } from "@/lib/cn"

interface GlassProgressProps {
  value: number // 0-100
  className?: string
  showLabel?: boolean
}

export function GlassProgress({ value, className, showLabel = true }: GlassProgressProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/80 font-medium">Progression</span>
          <span className="text-white font-semibold">{Math.round(value)}%</span>
        </div>
      )}
      <div className="relative h-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-500 ease-out"
          style={{ width: `${value}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

