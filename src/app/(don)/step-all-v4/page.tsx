"use client";

import { useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { AppBar, Input, SideMenu, MosqueSelectorModal, SegmentedControl } from "@/components";
import { Switch } from "@/components/Switch";
import { DonationFormValues } from "@/lib/schema";
import { formatEuro } from "@/lib/currency";
import { CreditCard, Calendar, Shield, Apple } from "lucide-react";

const PRESET_AMOUNTS = [5, 10, 25, 50, 75, 100];

export default function StepAllV4Page() {
  const form = useFormContext<DonationFormValues>();
  const values = form.watch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const [otherAmountInput, setOtherAmountInput] = useState("");

  const isInvalidAmount = !!otherAmountInput && isNaN(parseFloat(otherAmountInput));

  const handlePresetClick = (amt: number) => {
    form.setValue("amount", amt, { shouldDirty: true });
    setOtherAmountInput("");
  };
  const handleOtherAmountChange = (value: string) => {
    setOtherAmountInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      form.setValue("amount", numValue, { shouldDirty: true });
    }
  };

  const amountSuffix = useMemo(() => {
    if (values.frequency === "Vendredi") return "/semaine";
    if (values.frequency === "Mensuel") return "/mois";
    return "";
  }, [values.frequency]);

  const handlePay = () => {
    console.warn("Paiement soumis:", values);
  };

  const totalAmount = useMemo(() => {
    const baseAmount = values.amount;
    const feesAmount = values.coverFees ? baseAmount * 0.015 : 0;
    return { amount: formatEuro(baseAmount + feesAmount), fees: feesAmount };
  }, [values.amount, values.coverFees]);

  const isActive = (amt: number) => values.amount === amt && otherAmountInput.trim() === "";

  return (
    <>
      <AppBar onMenu={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <MosqueSelectorModal
        isOpen={showMosqueSelector}
        onClose={() => setShowMosqueSelector(false)}
        currentMosque={values.mosqueName}
        onMosqueSelect={(mosque) => form.setValue("mosqueName", mosque, { shouldDirty: true })}
      />

      <div className="app-container">
        {/* Carte 1: Montant (V2 sans CTA) */}
        <div className="app-card">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="app-title">
                Quel montant souhaitez-vous donner à la {" "}
                <button onClick={() => setShowMosqueSelector(true)} className="mosque-title-link">mosquée de {values.mosqueName || "Sélectionner"}</button> ?
              </div>
            </div>

            <div className="space-y-5">
              <SegmentedControl
                options={["Unique", "Vendredi", "Mensuel"]}
                value={values.frequency}
                onChange={(v: string) => form.setValue("frequency", v as "Unique" | "Vendredi" | "Mensuel", { shouldDirty: true })}
              />

              <div className="amount-grid mt-5" role="group" aria-label="Sélection du montant">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    className={`segmented-option ${isActive(amt) ? "active" : ""}`}
                    aria-pressed={isActive(amt)}
                    onClick={() => handlePresetClick(amt)}
                    style={{ height: 44 }}
                  >
                    {amt} €
                  </button>
                ))}
                <div style={{ gridColumn: '1 / -1' }}>
                  <Input
                    value={otherAmountInput}
                    onChange={handleOtherAmountChange}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Autre montant"
                    rightAccessory="€"
                    ariaInvalid={isInvalidAmount}
                  />
                  {isInvalidAmount && (
                    <div className="text-[13px] text-red-600 mt-1">Veuillez entrer un nombre valide</div>
                  )}
                </div>
              </div>

              <SegmentedControl
                options={["Sadaqah", "Zakat"]}
                value={values.donationType}
                onChange={(v: string) => form.setValue("donationType", v as "Sadaqah" | "Zakat", { shouldDirty: true })}
              />

              <div className="amount-grid-footer text-[15px] text-[var(--text)] mt-2 leading-snug" aria-live="polite">
                Votre don de {formatEuro(values.amount)}{amountSuffix} ne vous coûtera que {" "}
                <span className="font-[700]">{formatEuro(values.amount * 0.34)}{amountSuffix}</span> après déduction fiscale.
              </div>
            </div>
          </div>
        </div>

        {/* Carte 2: Informations personnelles (V2 sans CTA) */}
        <div className="app-card mt-4">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="app-title">Informations personnelles</div>
            </div>

            <div className="space-y-5">
              <SegmentedControl
                options={["Personnel", "Entreprise"]}
                value={values.donorType === "Entreprise" ? "Entreprise" : "Personnel"}
                onChange={(v: string) => {
                  const mapped = v === "Entreprise" ? "Entreprise" : "Personnel";
                  form.setValue("donorType", mapped as "Personnel" | "Entreprise", { shouldDirty: true });
                }}
              />

              <div className="section-box space-y-3">
                {values.donorType === "Entreprise" ? (
                  <>
                    <Input
                      value={values.companyName}
                      onChange={(v: string) => form.setValue("companyName", v, { shouldDirty: true })}
                      placeholder="Raison sociale"
                    />
                    <Input
                      value={values.companySiret}
                      onChange={(v: string) => form.setValue("companySiret", v, { shouldDirty: true })}
                      placeholder="SIRET"
                      inputMode="numeric"
                    />
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={values.firstName}
                      onChange={(v: string) => form.setValue("firstName", v, { shouldDirty: true })}
                      placeholder="Prénom"
                    />
                    <Input
                      value={values.lastName}
                      onChange={(v: string) => form.setValue("lastName", v, { shouldDirty: true })}
                      placeholder="Nom"
                    />
                  </div>
                )}

                <Input
                  value={values.email}
                  onChange={(v: string) => form.setValue("email", v, { shouldDirty: true })}
                  placeholder="Email"
                  type="email"
                  autoComplete="email"
                />
                <Input
                  value={values.address || ""}
                  onChange={(v: string) => form.setValue("address", v, { shouldDirty: true })}
                  placeholder="Adresse"
                />
              </div>

              <div className="section-box">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex-1 text-[14px] leading-snug text-[var(--text)] font-[500]">Je souhaite recevoir un reçu fiscal</span>
                  <Switch
                    checked={values.wantsReceipt}
                    onChange={(v: boolean) => form.setValue("wantsReceipt", v, { shouldDirty: true })}
                    ariaLabel="Recevoir un reçu fiscal"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carte 3: Paiement (V2 avec CTA) */}
        <div className="app-card mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="app-title">Paiement sécurisé</div>
            </div>

            <div className="space-y-3">
              <div className="text-[12px] tracking-wide uppercase text-[var(--text)] text-center">Mosquée de {values.mosqueName}</div>
              <div className="text-center">
                <div className="text-[32px] font-[700] text-[var(--text)]">
                  {totalAmount.amount}
                  {values.frequency !== "Unique" && (
                    <span className="text-[16px] font-[500] text-[var(--text-muted)] ml-1">{amountSuffix}</span>
                  )}
                </div>
                {values.coverFees && (
                  <div className="mt-1 flex justify-center">
                    <span className="px-2 py-[1px] rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[11px] leading-none align-middle text-[var(--text-muted)]">
                      +{formatEuro(totalAmount.fees)} de frais
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="section-box space-y-2">
              <Input
                value={values.cardNumber}
                onChange={(v: string) => form.setValue("cardNumber", v, { shouldDirty: true })}
                autoComplete="cc-number"
                leftIcon={<CreditCard size={18} />}
                placeholder="Numéro de carte"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={values.cardExp}
                  onChange={(v: string) => form.setValue("cardExp", v, { shouldDirty: true })}
                  placeholder="MM/AA"
                  leftIcon={<Calendar size={18} />}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                <Input
                  value={values.cardCvc}
                  onChange={(v: string) => form.setValue("cardCvc", v, { shouldDirty: true })}
                  placeholder="CVC"
                  leftIcon={<Shield size={18} />}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>
            </div>

            <div className="section-box">
              <div className="flex items-center justify-between gap-3">
                <span className="flex-1 text-[14px] leading-snug text-[var(--text)] font-[500]">Je rajoute {formatEuro(values.amount * 0.015)} pour que 100% de mon don aille à la mosquée</span>
                <Switch
                  checked={values.coverFees}
                  onChange={(v: boolean) => form.setValue("coverFees", v, { shouldDirty: true })}
                  ariaLabel="Couvrir les frais"
                />
              </div>
            </div>

            <div className="pt-0">
              <button
                onClick={handlePay}
                data-variant="success"
                className="btn-primary pressable w-full text-[16px] font-[700] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 py-3"
                style={{ background: '#15803D' }}
              >
                <CreditCard size={18} />
                Valider
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-[13px] text-[var(--text-muted)] text-center">Ou payer avec</div>
              <div className="grid grid-cols-2 gap-3">
                <button className="w-full py-3 px-4 rounded-12 bg-white border border-[var(--border)] flex items-center justify-center gap-2 text-[14px] font-[500] text-[var(--text)] hover:bg-[var(--surface-1)] transition-colors">
                  <Apple size={18} />
                  <span>Apple Pay</span>
                </button>
                <button className="w-full py-3 px-4 rounded-12 bg-white border border-[var(--border)] flex items-center justify-center gap-2 text-[14px] font-[500] text-[var(--text)] hover:bg-[var(--surface-1)] transition-colors">
                  <span className="text-[#003087] font-[600]">PayPal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

