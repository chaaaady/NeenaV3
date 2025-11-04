"use client"

import * as React from "react"
import { cn } from "@/lib/cn"

interface GlassAmountGridProps {
  amounts: number[]
  value?: number
  onValueChange: (value: number) => void
  formatAmount?: (amount: number) => string
  className?: string
}

export function GlassAmountGrid({
  amounts,
  value,
  onValueChange,
  formatAmount = (amt) => `${amt} €`,
  className,
}: GlassAmountGridProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [sliderStyle, setSliderStyle] = React.useState<React.CSSProperties>({ display: "none" })

  React.useEffect(() => {
    if (!containerRef.current || value === undefined) {
      setSliderStyle({ display: "none" })
      return
    }

    const activeIndex = amounts.findIndex((amt) => amt === value)
    if (activeIndex === -1) {
      setSliderStyle({ display: "none" })
      return
    }

    const container = containerRef.current
    const buttons = Array.from(container.querySelectorAll("button"))
    const activeButton = buttons[activeIndex]

    if (activeButton) {
      const buttonRect = activeButton.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      // Calculate position within grid (2 columns)
      const col = activeIndex % 2
      const row = Math.floor(activeIndex / 2)

      // Gap values
      const gap = 12 // 0.75rem
      const containerPadding = 0

      // Calculate available width for each column
      const availableWidth = containerRect.width - gap - containerPadding * 2
      const colWidth = availableWidth / 2

      setSliderStyle({
        width: `${colWidth}px`,
        height: `${buttonRect.height}px`,
        transform: `translate(${col * (colWidth + gap)}px, ${row * (buttonRect.height + gap)}px)`,
        display: "block",
      })
    }
  }, [value, amounts])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative grid grid-cols-2 gap-3",
        className
      )}
    >
      {/* Sliding background */}
      <div
        className="absolute rounded-xl bg-white/20 backdrop-blur-sm shadow-lg transition-all duration-200 ease-out pointer-events-none"
        style={sliderStyle}
      />

      {/* Amount buttons */}
      {amounts.map((amount) => {
        const isActive = value === amount
        return (
          <button
            key={amount}
            type="button"
            onClick={() => onValueChange(amount)}
            className={cn(
              "relative z-10 h-11 rounded-xl",
              "text-[16px] font-semibold transition-all duration-200 ease-out",
              "border",
              isActive
                ? "text-white border-white/20 scale-[1.02]"
                : "text-white/80 border-white/10 hover:text-white hover:border-white/20 hover:scale-[1.01]"
            )}
          >
            {formatAmount(amount)}
          </button>
        )
      })}
    </div>
  )
}

