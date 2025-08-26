"use client";

import { useState, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { RotateCcw, CreditCard, Heart } from "lucide-react";
import { AppBar, Stepper, Input, Checkbox, PayPalButton, SideMenu, ProductHeader, MosqueSelectorModal } from "@/components/ui";
import { DonationFormValues } from "@/lib/schema";
import { Calendar, Shield } from "lucide-react";

export default function StepPaymentPage() {
  const form = useFormContext<DonationFormValues>();
  const router = useRouter();
  const values = form.watch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [overlayVars, setOverlayVars] = useState<{ cx: number; cy: number }>({ cx: 0, cy: 0 });
  const [overlayBg, setOverlayBg] = useState<string>("");
  const [isDuaaOpen, setIsDuaaOpen] = useState(false);
  const [duaaText, setDuaaText] = useState("");
  const donateBtnRef = useRef<HTMLButtonElement>(null);

  const summarySentence = useMemo(() => {
    const freqSuffix = values.frequency === "Weekly" ? "/week" : values.frequency === "Monthly" ? "/month" : "";
    const donorPhrase = values.donorType === "Company"
      ? (values.companyName ? `the company ${values.companyName}` : "a company")
      : (values.donorType === "In honor of"
          ? (values.tributeName ? `in honor of ${values.tributeName}` : "in honor of someone")
          : "");
    const donorPart = donorPhrase ? ` as ${donorPhrase}` : "";
    return `You have donated €${values.amount}${freqSuffix}${donorPart} to ${values.mosqueName} as ${values.donationType}. May Allah bless you and your family and reward your generosity.`;
  }, [values.amount, values.frequency, values.donorType, values.companyName, values.tributeName, values.mosqueName, values.donationType]);

  const handleSubmit = () => {
    const btn = donateBtnRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setOverlayVars({ cx, cy });
      try {
        const c = window.getComputedStyle(btn).backgroundColor;
        setOverlayBg(c || "var(--brand)");
      } catch {}
      setIsOverlayOpen(true);
    }
    console.log("Payment submitted", values);
  };



  return (
    <>
      {/* Donate overlay animation */}
      <div
        className={`donate-overlay ${isOverlayOpen ? "open" : ""}`}
        style={{
          "--cx": `${overlayVars.cx}px`,
          "--cy": `${overlayVars.cy}px`,
          background: overlayBg || undefined,
        } as React.CSSProperties}
        aria-hidden={!isOverlayOpen}
      >
        <div className="donate-overlay-content">
          <div className="text-[28px] font-[800] tracking-[-0.3px]">Thank you!</div>
          <div className="text-[15px] opacity-90 text-center max-w-sm">
            {summarySentence}
          </div>
          <div className="grid gap-2 w-full max-w-md mt-2">
            {values.wantsReceipt && (
              <button
                onClick={() => alert("Receipt download placeholder")}
                className="btn-secondary pressable w-full text-[15px] font-[700]"
              >
                Download receipt
              </button>
            )}
            <button
              onClick={async () => {
                try {
                  if (navigator.share) {
                    await navigator.share({ title: "Neena Donation", text: summarySentence, url: window.location.href });
                  } else {
                    await navigator.clipboard.writeText(`${summarySentence} ${window.location.href}`);
                    alert("Link copied to clipboard");
                  }
                } catch {}
              }}
              className="btn-secondary pressable w-full text-[15px] font-[700]"
            >
              Share as a gift
            </button>
            <button
              onClick={() => router.push("/how-it-helps")}
              className="btn-secondary pressable w-full text-[15px] font-[700]"
            >
              How is my donation used?
            </button>
            <button
              onClick={() => router.push("/contact")}
              className="btn-secondary pressable w-full text-[15px] font-[700]"
            >
              Ask a question
            </button>
            <button
              onClick={() => setIsDuaaOpen((v) => !v)}
              className="btn-secondary pressable w-full text-[15px] font-[700]"
            >
              Share a du’a
            </button>
            {isDuaaOpen && (
              <div className="space-y-2">
                <label className="block text-[14px] font-[700] opacity-90">Your du’a (optional)</label>
                <textarea
                  value={duaaText}
                  onChange={(e) => setDuaaText(e.target.value)}
                  rows={4}
                  placeholder="Write a short du’a to share"
                  className="app-input w-full"
                  style={{ height: 120 }}
                />
                <div className="text-[13px] opacity-80">Every du’a is anonymous.</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsDuaaOpen(false)}
                    className="btn-secondary pressable w-full text-[15px] font-[700]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const text = duaaText.trim();
                      const params = new URLSearchParams();
                      if (text.length > 0) params.set("text", text);
                      params.set("anon", "1");
                      const url = params.toString().length > 0 ? `/duaa?${params.toString()}` : "/duaa";
                      setIsOverlayOpen(false);
                      setTimeout(() => router.push(url), 50);
                    }}
                    className="btn-primary pressable w-full text-[15px] font-[700]"
                    disabled={duaaText.trim().length === 0}
                  >
                    Share du’a
                  </button>
                </div>
              </div>
            )}
            <button
              onClick={() => router.push("/")}
              className="btn-primary pressable w-full text-[15px] font-[700]"
            >
              Go to home
            </button>
          </div>
        </div>
      </div>
      <AppBar onMenu={() => setIsMenuOpen(true)} />
      <ProductHeader 
        currentMosque={values.mosqueName}
        onMosqueSelect={() => setShowMosqueSelector(true)}
        onInfoNavigation={() => window.open('https://neena.fr', '_blank')}
      />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <MosqueSelectorModal 
        isOpen={showMosqueSelector}
        onClose={() => setShowMosqueSelector(false)}
        currentMosque={values.mosqueName}
        onMosqueSelect={(mosque) => form.setValue("mosqueName", mosque, { shouldDirty: true })}
      />
      <Stepper activeStep={2} />
      <div className="app-container">
        {/* Mini summary card */}
        <div className="app-card">
          <div className="space-y-2">
            <div className="app-title">Summary</div>
            <div className="text-[14px] text-[var(--text-muted)]">
              {summarySentence}
            </div>
          </div>
        </div>

        {/* Carte principale Payment Method */}
        <div className="app-card">
          <div className="space-y-4">
            <div className="app-title line-clamp-2">Payment Method</div>
            
            <div className="space-y-3">
              <Input
                label="Card Number"
                value={values.cardNumber}
                onChange={(v: string) => form.setValue("cardNumber", v, { shouldDirty: true })}
                autoComplete="cc-number"
                leftIcon={<CreditCard size={18} />}
              />
              
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Expiry"
                  value={values.cardExp}
                  onChange={(v: string) => form.setValue("cardExp", v, { shouldDirty: true })}
                  placeholder="MM/YY"
                  leftIcon={<Calendar size={18} />}
                />
                <Input
                  label="CVC"
                  value={values.cardCvc}
                  onChange={(v: string) => form.setValue("cardCvc", v, { shouldDirty: true })}
                  placeholder="3 digits"
                  leftIcon={<Shield size={18} />}
                />
              </div>
              
              <div className="h-[1px] bg-[var(--border)]"></div>
              <div className="text-[13px] text-[var(--text-muted)]">Others</div>
              
              <PayPalButton label="Pay Pal" />
              
              <Checkbox
                label="I'd like to add €0.62 to cover the bank fees so 100% of my donation goes to the mosque."
                checked={values.coverFees}
                onChange={(v: boolean) => form.setValue("coverFees", v, { shouldDirty: true })}
              />
            </div>
          </div>
        </div>
      </div>
        
      <div className="docked-actions">
        <div className="container">
          <div className="grid gap-3">
            <button
              onClick={() => router.push("/step-personal")}
              className="btn-secondary pressable w-full text-[16px] font-[700] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Back
            </button>
            <button
              onClick={handleSubmit}
              data-variant="success"
              ref={donateBtnRef}
              className="btn-primary pressable w-full text-[16px] font-[700] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Donate €{values.amount}
              <Heart size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Espaceur pour la barre Safari */}
      <div className="safari-spacer"></div>
    </>
  );
}