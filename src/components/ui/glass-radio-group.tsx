"use client"

import * as React from "react"
import { cn } from "@/lib/cn"

interface GlassRadioGroupProps {
  options: string[]
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export function GlassRadioGroup({ options, value, onValueChange, className }: GlassRadioGroupProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [sliderStyle, setSliderStyle] = React.useState<React.CSSProperties>({})

  React.useEffect(() => {
    if (!containerRef.current) return

    const activeIndex = options.findIndex((opt) => opt === value)
    if (activeIndex === -1) return

    const container = containerRef.current
    const buttons = Array.from(container.querySelectorAll("button"))
    const activeButton = buttons[activeIndex]

    if (activeButton) {
      const containerRect = container.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()

      // Account for gap between buttons (12px gap = 0.75rem)
      const gap = 12
      const totalGaps = options.length - 1
      const availableWidth = containerRect.width - totalGaps * gap
      const buttonWidth = availableWidth / options.length

      setSliderStyle({
        width: `${buttonWidth}px`,
        transform: `translateX(${activeIndex * (buttonWidth + gap)}px)`,
      })
    }
  }, [value, options])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative inline-flex items-center gap-3",
        "rounded-2xl bg-white/[0.08] backdrop-blur-md p-1.5",
        "border border-white/10",
        className
      )}
    >
      {/* Sliding background */}
      <div
        className="absolute rounded-xl bg-white/25 backdrop-blur-sm transition-all duration-200 ease-out"
        style={{
          ...sliderStyle,
          height: "calc(100% - 12px)",
          top: "6px",
          left: "6px",
        }}
      />

      {/* Buttons */}
      {options.map((option) => {
        const isActive = value === option
        return (
          <button
            key={option}
            type="button"
            onClick={() => onValueChange(option)}
            className={cn(
              "relative z-10 flex-1 whitespace-nowrap rounded-xl px-6 py-2.5",
              "text-[15px] font-medium transition-all duration-200 ease-out",
              isActive
                ? "text-white"
                : "text-white/70 hover:text-white/90"
            )}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

