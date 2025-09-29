"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { DonationFormValues } from "@/lib/schema";
import { HeaderPrimary } from "@/components/headers/HeaderPrimary";
import { SideMenu, MosqueSelectorModal } from "@/components";
import { GlassCard, GlassSection, GlassInput, ToggleSwitch } from "@/components/ds";
import { GlassSegmented } from "@/components/ui/GlassSegmented";
import { GlassAmountPills } from "@/components/ui/GlassAmountPills";
import { formatEuro } from "@/lib/currency";

const PRESET_AMOUNTS = [5, 10, 25, 50, 75, 100];

export default function StepsDSPage() {
  const form = useFormContext<DonationFormValues>();
  const values = form.watch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const [otherAmountInput, setOtherAmountInput] = useState("");

  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  const heroImageSrc = "/hero-creteil.png";

  const isPresetActive = typeof values.amount === "number" && PRESET_AMOUNTS.includes(values.amount) && otherAmountInput.trim() === "";
  const otherAmountDisplay = useMemo(() => {
    const n = parseFloat(otherAmountInput);
    if (!isNaN(n) && n > 0 && !PRESET_AMOUNTS.includes(n)) return `${n} €`;
    return "";
  }, [otherAmountInput]);

  const handlePresetClick = (amt: number) => {
    form.setValue("amount", amt as any, { shouldDirty: true });
    setOtherAmountInput("");
  };
  const handleOtherAmountChange = (v: string) => {
    setOtherAmountInput(v);
    const num = parseFloat(v);
    if (!isNaN(num) && num > 0) {
      if (PRESET_AMOUNTS.includes(num)) {
        form.setValue("amount", num as any, { shouldDirty: true });
        setOtherAmountInput("");
        return;
      }
      form.setValue("amount", num as any, { shouldDirty: true });
    }
  };

  const totalWithFees = useMemo(() => {
    const base = Number(values.amount) || 0;
    const fees = Boolean((values as any).coverFees) ? Math.round(base * 0.012 * 100) / 100 : 0;
    const total = base + fees;
    if (total <= 0) return "—";
    return Number.isInteger(total) ? `${total} €` : `${total.toFixed(2)} €`;
  }, [values.amount, (values as any).coverFees]);

  const feeLabel = useMemo(() => {
    const base = Number(values.amount) || 0;
    const feeAmt = Math.round(base * 0.012 * 100) / 100;
    return Number.isInteger(feeAmt) ? `${feeAmt} €` : `${feeAmt.toFixed(2)} €`;
  }, [values.amount]);

  return (
    <>
      <HeaderPrimary wide transparent overlay onMenuClick={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <MosqueSelectorModal
        isOpen={showMosqueSelector}
        onClose={() => setShowMosqueSelector(false)}
        currentMosque={values.mosqueName}
        onMosqueSelect={(mosque) => form.setValue("mosqueName", mosque, { shouldDirty: true })}
      />

      <div className="relative w-full" style={{ height: "100svh", overflow: "hidden" }}>
        <div className="absolute inset-0">
          <Image src={heroImageSrc} alt={values.mosqueName || "Mosquée"} fill sizes="100vw" className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6 pt-3 md:pt-0 md:min-h-[calc(100svh-var(--hdr-primary-h))] md:flex md:items-center md:justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {/* Montant */}
            <GlassCard className="p-6 md:p-8">
              <h2 className="text-center text-white font-semibold tracking-tight text-[18px] leading-snug">Montant</h2>
              <div className="mt-4 space-y-6">
                <GlassSegmented
                  options={["Unique", "Vendredi", "Mensuel"]}
                  value={values.frequency}
                  onChange={(v) => form.setValue("frequency", v as any, { shouldDirty: true })}
                  variant="light"
                />
                <GlassSection>
                  {otherAmountDisplay ? (
                    <div className="h-11 flex items-center justify-center text-[18px] font-semibold text-white">{otherAmountDisplay}</div>
                  ) : (
                    <GlassAmountPills
                      amounts={PRESET_AMOUNTS}
                      activeAmount={isPresetActive ? (values.amount as number) : undefined}
                      onSelect={(amt) => handlePresetClick(amt)}
                    />
                  )}
                  <div className="mt-3">
                    <div className="relative">
                      <input
                        value={otherAmountInput}
                        onChange={(e) => {
                          if (isPresetActive) form.setValue("amount", NaN as any, { shouldDirty: true });
                          handleOtherAmountChange(e.target.value);
                        }}
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Autre montant"
                        className={"w-full h-11 rounded-2xl px-4 pr-10 ring-1 ring-white/12 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/35 " + (otherAmountDisplay ? "bg-transparent text-transparent caret-white placeholder-white/60" : "bg-black/25 text-white placeholder-white/60")}
                        onKeyDown={(e) => { if (e.key === "Enter") (e.currentTarget as HTMLInputElement).blur(); }}
                        onBlur={() => { const num = parseFloat(otherAmountInput); if (isNaN(num)) setOtherAmountInput(""); }}
                      />
                      {!otherAmountDisplay && (
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/75">€</span>
                      )}
                    </div>
                  </div>
                  <p className="mt-3 pl-1 pr-1 text-left text-[15px] text-white leading-relaxed">
                    Votre don de {formatEuro(values.amount)}
                    {values.frequency !== "Unique" ? (values.frequency === "Vendredi" ? "/Vendredi" : "/mois") : ""} ne vous coûtera que <strong className="font-semibold text-white">{formatEuro((values.amount as any) * 0.34)}
                    {values.frequency !== "Unique" ? (values.frequency === "Vendredi" ? "/Vendredi" : "/mois") : ""}</strong> après déduction fiscale.
                  </p>
                </GlassSection>
              </div>
            </GlassCard>

            {/* Information */}
            <GlassCard className="p-6 md:p-8">
              <h2 className="text-center text-white font-semibold tracking-tight text-[18px] leading-snug">Informations</h2>
              <div className="mt-4 space-y-6">
                <GlassSegmented
                  options={["Personnel", "Entreprise"]}
                  value={(values as any).identityType || "Personnel"}
                  onChange={(v) => form.setValue("identityType" as any, v, { shouldDirty: true })}
                  variant="light"
                />

                {((values as any).identityType || "Personnel") === "Entreprise" ? (
                  <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                    <GlassInput placeholder="Raison sociale" value={(values as any).companyName || ""} onChange={(e) => form.setValue("companyName" as any, e.target.value, { shouldDirty: true })} />
                    <GlassInput placeholder="SIRET" value={(values as any).siret || ""} onChange={(e) => form.setValue("siret" as any, e.target.value, { shouldDirty: true })} />
                    <div className="col-span-2">
                      <GlassInput placeholder="Email" type="email" value={values.email || ""} onChange={(e) => form.setValue("email", e.target.value, { shouldDirty: true })} />
                    </div>
                    <div className="col-span-2">
                      <GlassInput placeholder="Adresse" value={(values as any).address || ""} onChange={(e) => form.setValue("address" as any, e.target.value, { shouldDirty: true })} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                    <GlassInput placeholder="Prénom" value={values.firstName || ""} onChange={(e) => form.setValue("firstName", e.target.value, { shouldDirty: true })} />
                    <GlassInput placeholder="Nom" value={values.lastName || ""} onChange={(e) => form.setValue("lastName", e.target.value, { shouldDirty: true })} />
                    <div className="col-span-2">
                      <GlassInput placeholder="Email" type="email" value={values.email || ""} onChange={(e) => form.setValue("email", e.target.value, { shouldDirty: true })} />
                    </div>
                    <div className="col-span-2">
                      <GlassInput placeholder="Adresse" value={(values as any).address || ""} onChange={(e) => form.setValue("address" as any, e.target.value, { shouldDirty: true })} />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-white/90 text-[14px]">Recevoir un reçu fiscal</span>
                  <ToggleSwitch checked={Boolean((values as any).wantReceipt)} onChange={(c) => form.setValue("wantReceipt" as any, c, { shouldDirty: true })} ariaLabel="Recevoir un reçu fiscal" />
                </div>
              </div>
            </GlassCard>

            {/* Paiement */}
            <GlassCard className="p-6 md:p-8">
              <h2 className="text-center text-white font-semibold tracking-tight text-[18px] leading-snug">Paiement</h2>
              <div className="mt-4 space-y-6">
                <GlassSection>
                  <div className="flex flex-col items-center justify-center text-white">
                    <div className="text-[26px] font-semibold leading-none">{totalWithFees}</div>
                    {Boolean(values.frequency) && (
                      <div className="mt-1 text-white/80 text-[13px]">{values.frequency}</div>
                    )}
                    {(() => {
                      const idType = (values as any)?.identityType;
                      const company = (values as any)?.companyName;
                      const first = (values as any)?.firstName;
                      const last = (values as any)?.lastName;
                      const label = idType === "Entreprise" ? company : [first, last].filter(Boolean).join(" ");
                      return label ? (
                        <div className="mt-1 text-white/70 text-[13px] text-center">{label}</div>
                      ) : null;
                    })()}
                  </div>
                </GlassSection>
                <GlassSection>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 text-white/90 text-[14px] leading-relaxed text-left">
                      {(() => {
                        const mosque = (values as any)?.mosqueName ? `la mosquée de ${(values as any).mosqueName}` : "la mosquée";
                        return (
                          <span>
                            Je rajoute <span className="text-white font-semibold">{feeLabel}</span> pour que 100% de mon don aille à {mosque}.
                          </span>
                        );
                      })()}
                    </div>
                    <ToggleSwitch checked={Boolean((values as any).coverFees)} onChange={(c) => form.setValue("coverFees" as any, c, { shouldDirty: true })} ariaLabel="Activer l'ajout pour couvrir" />
                  </div>
                </GlassSection>
                <GlassSection>
                  <div className="text-white text-[15px] mb-2">Paiement sécurisé</div>
                  <div className="rounded-xl border border-white/15 bg-black/20 backdrop-blur-md h-28 flex items-center justify-center text-white/70">Iframe Stripe (Card Element)</div>
                </GlassSection>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </>
  );
}

