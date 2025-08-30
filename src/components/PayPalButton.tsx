"use client";

export function PayPalButton({ label, variant = "default" }: { label: string; variant?: "default" | "brand" }) {
  return (
    <button 
      className="paypal-btn pressable w-full text-[16px] font-[700]"
      data-brand={variant === "brand" ? "paypal" : undefined}
    >
      {label}
    </button>
  );
}

