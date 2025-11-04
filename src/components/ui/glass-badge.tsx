import * as React from "react"
import { cn } from "@/lib/cn"

export interface GlassBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "info"
}

function GlassBadge({ 
  className, 
  variant = "default",
  ...props 
}: GlassBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        "backdrop-blur-md border transition-all",
        variant === "default" && "bg-white/10 border-white/20 text-white/90",
        variant === "success" && "bg-green-500/20 border-green-400/30 text-green-100",
        variant === "warning" && "bg-orange-500/20 border-orange-400/30 text-orange-100",
        variant === "info" && "bg-blue-500/20 border-blue-400/30 text-blue-100",
        className
      )}
      {...props}
    />
  )
}

export { GlassBadge }

