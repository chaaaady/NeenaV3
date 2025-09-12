"use client";

import { cn } from "@/lib/cn";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type CardDSProps = React.ComponentProps<typeof Card> & { shadow?: "card" | "elevated" };

export function CardDS({ className, shadow = "card", ...props }: CardDSProps) {
  return (
    <Card
      className={cn(
        "rounded-[16px] border border-[var(--border)]",
        shadow === "card" && "",
        shadow === "elevated" && "",
        className
      )}
      style={{ boxShadow: shadow === "elevated" ? "var(--shadow-elevated)" : "var(--shadow-card)" }}
      {...props}
    />
  );
}

export const CardDSHeader = CardHeader;
export const CardDSBody = CardContent;

