"use client";

export function ApplePayButton({ label = " Pay" }: { label?: string }) {
  return (
    <button className="paypal-btn pressable w-full text-[16px] font-[700]" style={{ background: '#000', color: '#fff' }}>
      {label}
    </button>
  );
}

