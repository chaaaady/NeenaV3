"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useCallback, useEffect, useMemo, useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export type StripePaymentStatus = "idle" | "processing" | "succeeded" | "failed";

const appearance = {
  theme: "night" as const,
  variables: {
    colorPrimary: "#ffffff",
    colorBackground: "transparent",
    colorText: "#ffffff",
    colorTextPlaceholder: "#ffffff99",
    borderRadius: "16px",
  },
};

export function StripeElementsProvider({ clientSecret, children }: { clientSecret: string; children: React.ReactNode }) {
  const options = useMemo(() => ({ appearance, clientSecret }), [clientSecret]);
  return (
    <Elements key={clientSecret} stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}

type StripePaymentFormProps = {
  clientSecret: string;
  onReady?: (submit: (() => Promise<void>) | null) => void;
  onProcessingChange?: (processing: boolean) => void;
  onStatusChange?: (status: StripePaymentStatus) => void;
  onErrorChange?: (message: string | null) => void;
  showInternalButton?: boolean;
};

export function StripePaymentForm({ clientSecret, onReady, onProcessingChange, onStatusChange, onErrorChange, showInternalButton = true }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [debugData, setDebugData] = useState<Record<string, unknown> | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!stripe || !elements) return;
    setSubmitting(true);
    onProcessingChange?.(true);
    onStatusChange?.("processing");
    setErrorMessage(null);
    onErrorChange?.(null);
    setDebugData({ phase: "init", clientSecret });
    const numberEl = elements.getElement(CardNumberElement);
    if (!numberEl) {
      setSubmitting(false);
      onProcessingChange?.(false);
      onStatusChange?.("failed");
      const message = "Champs carte indisponibles. Merci de recharger la page.";
      setErrorMessage(message);
      onErrorChange?.(message);
      return;
    }

    const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
      type: "card",
      card: numberEl,
    });
    if (pmError || !paymentMethod) {
      const message = pmError?.message || "Impossible de préparer le paiement.";
      console.error("Stripe createPaymentMethod error", pmError);
      setErrorMessage(message);
      onErrorChange?.(message);
      onStatusChange?.("failed");
      setSubmitting(false);
      onProcessingChange?.(false);
      setDebugData({ phase: "createPaymentMethod", error: pmError?.message, code: pmError?.code });
      return;
    }

    try {
      const res = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientSecret, paymentMethodId: paymentMethod.id, returnUrl: (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000") + "/step-payment-ds" }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message = data?.error || "Paiement refusé. Merci de vérifier vos informations.";
        setErrorMessage(message);
        onErrorChange?.(message);
        onStatusChange?.("failed");
        setDebugData({ phase: "confirm", status: res.status, body: data });
        return;
      }

      const intent = data.paymentIntent;
      if (intent?.status === "succeeded") {
        setPaymentIntentId(intent.id);
        setErrorMessage(null);
        onErrorChange?.(null);
        onStatusChange?.("succeeded");
        setDebugData({ phase: "confirm", status: intent.status, id: intent.id, requestId: data.requestId });
      } else if (intent?.status === "processing" || intent?.status === "requires_action") {
        setPaymentIntentId(intent.id);
        onStatusChange?.("processing");
        setDebugData({ phase: "confirm", status: intent.status, id: intent.id, requestId: data.requestId });
      } else {
        const message = "Paiement en attente de confirmation.";
        setErrorMessage(message);
        onErrorChange?.(message);
        onStatusChange?.("failed");
        setDebugData({ phase: "confirm", status: intent?.status, id: intent?.id, requestId: data.requestId });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur réseau lors de la confirmation.";
      console.error("Confirm payment error", err);
      setErrorMessage(message);
      onErrorChange?.(message);
      onStatusChange?.("failed");
      setDebugData({ phase: "confirm-exception", error: err instanceof Error ? err.message : String(err) });
    } finally {
      setSubmitting(false);
      onProcessingChange?.(false);
    }
  }, [clientSecret, elements, onProcessingChange, onStatusChange, stripe, onErrorChange]);

  useEffect(() => {
    if (!stripe || !elements) {
      onReady?.(null);
      return;
    }
    onReady?.(handleSubmit);
    return () => onReady?.(null);
  }, [stripe, elements, handleSubmit, onReady]);

  return (
    <div className="space-y-3">
      <div className="space-y-2 rounded-2xl bg-white/10 p-3.5">
        <div className="text-white/80 text-[13px]">Numéro de carte</div>
        <div className="rounded-xl bg-black/20 px-3 py-2">
          <CardNumberElement
            options={{
              style: { base: { color: "#fff", fontSize: "16px", "::placeholder": { color: "#ffffff99" } } },
              showIcon: true,
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-white/80 text-[13px]">Expiration</div>
            <div className="rounded-xl bg-black/20 px-3 py-2">
              <CardExpiryElement
                options={{ style: { base: { color: "#fff", fontSize: "16px", "::placeholder": { color: "#ffffff99" } } } }}
              />
            </div>
          </div>
          <div>
            <div className="text-white/80 text-[13px]">CVC</div>
            <div className="rounded-xl bg-black/20 px-3 py-2">
              <CardCvcElement
                options={{ style: { base: { color: "#fff", fontSize: "16px", "::placeholder": { color: "#ffffff99" } } } }}
              />
            </div>
          </div>
        </div>
      </div>
      {errorMessage ? <div className="text-red-200 text-[13px] leading-snug">{errorMessage}</div> : null}
      {debugData ? (
        <pre className="whitespace-pre-wrap break-all rounded-2xl bg-black/30 p-3 text-[11px] text-white/70">
          {JSON.stringify(debugData, null, 2)}
        </pre>
      ) : null}
      {paymentIntentId ? (
        <div className="text-white/60 text-[12px]">Référence paiement : {paymentIntentId}</div>
      ) : null}
      {showInternalButton ? (
        <button
          disabled={!stripe || submitting}
          onClick={handleSubmit}
          className="w-full h-11 rounded-2xl px-6 bg-white text-black font-semibold shadow-xl ring-1 ring-white/70 disabled:opacity-40"
        >
          {submitting ? "Traitement…" : "Payer maintenant"}
        </button>
      ) : null}
    </div>
  );
}

