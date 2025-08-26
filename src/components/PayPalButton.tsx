"use client";

export function PayPalButton({ label }: { label: string }) {
  return (
    <button className="paypal-btn pressable w-full text-[16px] font-[700]">
      {label}
    </button>
  );
}

