import * as React from "react"
import { cn } from "@/lib/cn"

export type GlassInputProps = React.InputHTMLAttributes<HTMLInputElement>

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-2xl",
          "border border-white/10 bg-white/[0.08]",
          "backdrop-blur-md",
          "px-4 py-2 text-[15px] md:text-[16px]",
          "text-white placeholder:text-white/60",
          "ring-offset-background",
          "transition-all duration-200",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
GlassInput.displayName = "GlassInput"

export { GlassInput }

