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

// Vérification de la clé Stripe avec détection TEST/LIVE
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const isTestKey = stripeKey?.startsWith('pk_test_');
const isLiveKey = stripeKey?.startsWith('pk_live_');
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Vérifications de sécurité
if (!stripeKey) {
  console.error("❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY n'est pas définie");
  console.error("👉 Créez un fichier .env.local avec: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...");
} else if (isLiveKey && isLocalhost) {
  console.error("🚨 ATTENTION: Vous utilisez des clés LIVE en développement local!");
  console.error("👉 Les clés LIVE (pk_live_...) exigent HTTPS");
  console.error("👉 Utilisez des clés TEST (pk_test_...) pour le développement local");
} else if (isTestKey) {
  console.log("✅ Clés Stripe TEST détectées - OK pour localhost");
}

const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

export type StripePaymentStatus = "idle" | "processing" | "succeeded" | "failed";

export function StripeElementsProvider({ clientSecret, children }: { clientSecret: string; children: React.ReactNode }) {
  // Vérification de la clé avant de charger Stripe
  if (!stripePromise) {
    return (
      <div className="text-red-200 text-[14px] p-4 rounded-xl bg-red-500/10 border border-red-500/20">
        <div className="font-semibold mb-2">⚠️ Configuration Stripe manquante</div>
        <div className="text-[12px] space-y-1">
          <div>1. Créez un fichier <code className="bg-black/20 px-1 py-0.5 rounded">.env.local</code> à la racine</div>
          <div>2. Ajoutez: <code className="bg-black/20 px-1 py-0.5 rounded">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...</code></div>
          <div>3. Redémarrez le serveur avec <code className="bg-black/20 px-1 py-0.5 rounded">npm run dev</code></div>
        </div>
      </div>
    );
  }
  
  // Avertissement si clés LIVE en localhost
  if (isLiveKey && isLocalhost) {
    return (
      <div className="text-orange-200 text-[14px] p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
        <div className="font-semibold mb-2">🚨 Clés LIVE détectées en développement</div>
        <div className="text-[12px] space-y-1">
          <div>❌ Les clés LIVE (pk_live_...) exigent HTTPS</div>
          <div>✅ Utilisez des clés TEST (pk_test_...) pour localhost</div>
          <div className="mt-2 pt-2 border-t border-orange-500/20">
            <div>Obtenez vos clés TEST sur:</div>
            <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" rel="noopener noreferrer" className="underline">
              https://dashboard.stripe.com/test/apikeys
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  const options = useMemo(() => ({ 
    clientSecret,
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#ffffff',
        colorBackground: 'transparent',
        colorText: '#ffffff',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }
    }
  }), [clientSecret]);
  
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

  const handleSubmit = useCallback(async () => {
    if (!stripe || !elements) return;
    setSubmitting(true);
    onProcessingChange?.(true);
    onStatusChange?.("processing");
    setErrorMessage(null);
    onErrorChange?.(null);
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
      setErrorMessage(message);
      onErrorChange?.(message);
      onStatusChange?.("failed");
      setSubmitting(false);
      onProcessingChange?.(false);
      return;
    }

    try {
      // Use window.location.origin to automatically detect the correct protocol (http/https)
      const returnUrl = typeof window !== "undefined" ? `${window.location.origin}/step-payment-ds` : undefined;
      const res = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientSecret, paymentMethodId: paymentMethod.id, returnUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message = data?.error || "Paiement refusé. Merci de vérifier vos informations.";
        setErrorMessage(message);
        onErrorChange?.(message);
        onStatusChange?.("failed");
        return;
      }

      const intent = data.paymentIntent;
      if (intent?.status === "succeeded") {
        setPaymentIntentId(intent.id);
        setErrorMessage(null);
        onErrorChange?.(null);
        onStatusChange?.("succeeded");
      } else if (intent?.status === "processing" || intent?.status === "requires_action") {
        setPaymentIntentId(intent.id);
        onStatusChange?.("processing");
      } else {
        const message = "Paiement en attente de confirmation.";
        setErrorMessage(message);
        onErrorChange?.(message);
        onStatusChange?.("failed");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur réseau lors de la confirmation.";
      setErrorMessage(message);
      onErrorChange?.(message);
      onStatusChange?.("failed");
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

  const cardElementOptions = {
    style: {
      base: {
        color: '#ffffff',
        fontSize: '15px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      invalid: {
        color: '#ff6b6b',
        iconColor: '#ff6b6b',
      },
    },
  };

  return (
    <div className="space-y-4">
      {/* Numéro de carte */}
      <div>
        <label className="block text-white/80 text-[13px] mb-1.5">
          Numéro de carte
        </label>
        <div className="w-full h-11 rounded-2xl px-4 ring-1 ring-white/12 backdrop-blur-md flex items-center bg-transparent">
          <CardNumberElement
            options={{
              ...cardElementOptions,
              showIcon: true,
            }}
            className="w-full"
          />
        </div>
      </div>

      {/* Expiration et CVC */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-white/80 text-[13px] mb-1.5">
            Expiration
          </label>
          <div className="w-full h-11 rounded-2xl px-4 ring-1 ring-white/12 backdrop-blur-md flex items-center bg-transparent">
            <CardExpiryElement
              options={cardElementOptions}
              className="w-full"
            />
          </div>
        </div>
        <div>
          <label className="block text-white/80 text-[13px] mb-1.5">
            CVC
          </label>
          <div className="w-full h-11 rounded-2xl px-4 ring-1 ring-white/12 backdrop-blur-md flex items-center bg-transparent">
            <CardCvcElement
              options={cardElementOptions}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Messages d'erreur */}
      {errorMessage && (
        <div className="text-red-200 text-[13px] leading-snug p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          {errorMessage}
        </div>
      )}
      
      {/* Référence paiement */}
      {paymentIntentId && (
        <div className="text-white/60 text-[12px]">
          Référence: {paymentIntentId}
        </div>
      )}

      {/* Bouton interne (optionnel) */}
      {showInternalButton && (
        <button
          disabled={!stripe || submitting}
          onClick={handleSubmit}
          className="w-full h-11 rounded-2xl px-6 bg-white text-black font-semibold shadow-xl ring-1 ring-white/70 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-2xl"
        >
          {submitting ? "Traitement…" : "Payer maintenant"}
        </button>
      )}
    </div>
  );
}

