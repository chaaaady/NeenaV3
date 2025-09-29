"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StripeElementsProvider, StripePaymentForm, StripePaymentStatus } from "./StripeElements";

type MetadataPrimitive = string | number | boolean;
export type StripeMetadata = Record<string, MetadataPrimitive>;

type StripePaymentMountProps = {
  amount: number;
  email?: string;
  onReady?: (submit: (() => Promise<void>) | null) => void;
  onProcessingChange?: (processing: boolean) => void;
  onStatusChange?: (status: StripePaymentStatus) => void;
  onErrorChange?: (message: string | null) => void;
  metadata?: StripeMetadata;
};

export function StripePaymentMount({ amount, email, metadata, onReady, onProcessingChange, onStatusChange, onErrorChange }: StripePaymentMountProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const clientSecretRef = useRef<string | null>(null);
  const submitHandlerRef = useRef<(() => Promise<void>) | null>(null);
  const lastKeyRef = useRef<string | null>(null);
  const onReadyRef = useRef(onReady);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  const detachSubmit = useCallback(() => {
    submitHandlerRef.current = null;
    onReadyRef.current?.(null);
  }, []);

  const normalizedMetadata = useMemo<StripeMetadata>(() => {
    const base: StripeMetadata = {};
    if (metadata) {
      const entries = Object.entries(metadata).sort(([a], [b]) => a.localeCompare(b));
      for (const [key, value] of entries) {
        base[key] = value;
      }
    }
    if (email) {
      base.email = email;
    }
    return base;
  }, [email, metadata]);

  const requestKey = useMemo(() => {
    if (!amount || !Number.isFinite(amount) || amount <= 0) return null;
    return `${Math.round(amount * 100)}|${JSON.stringify(normalizedMetadata)}`;
  }, [amount, normalizedMetadata]);

  useEffect(() => {
    if (!requestKey) {
      setClientSecret(null);
      clientSecretRef.current = null;
      lastKeyRef.current = null;
      setError("Montant invalide pour le paiement");
      setLoading(false);
      detachSubmit();
      onErrorChange?.("Montant invalide pour le paiement");
      return;
    }

    if (lastKeyRef.current === requestKey && clientSecretRef.current) {
      setClientSecret(clientSecretRef.current);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    setLoading(true);
    setError(null);
    setClientSecret(null);
    clientSecretRef.current = null;
    detachSubmit();

    const fetchIntent = async () => {
      const serializedMetadata = Object.fromEntries(
        Object.entries(normalizedMetadata).map(([key, value]) => [key, String(value)])
      );
      try {
        const res = await fetch("/api/payments/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, currency: "eur", metadata: serializedMetadata }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text();
          if (!cancelled) {
            console.error("CreateIntent failed:", res.status, text);
            setError("Impossible de préparer le paiement. Merci de réessayer plus tard.");
            onErrorChange?.("Erreur serveur Stripe. Merci de réessayer.");
            lastKeyRef.current = null;
          }
          return;
        }

        const data = await res.json();
        if (!cancelled) {
          if (!data?.clientSecret) {
            setError("Réponse Stripe invalide. Merci de réessayer.");
            onErrorChange?.("Réponse Stripe invalide.");
            lastKeyRef.current = null;
            return;
          }
          setClientSecret(data.clientSecret);
          clientSecretRef.current = data.clientSecret;
          lastKeyRef.current = requestKey;
        }
      } catch (err: unknown) {
        if (cancelled) return;
        if (err instanceof Error && err.name === "AbortError") return;
        console.error("CreateIntent exception:", err);
        setError("Connexion Stripe indisponible. Merci de réessayer.");
        onErrorChange?.("Connexion Stripe indisponible. Merci de réessayer.");
        lastKeyRef.current = null;
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchIntent();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [amount, normalizedMetadata, requestKey, detachSubmit, onErrorChange]);

  const attachSubmit = useCallback((handler: (() => Promise<void>) | null) => {
    submitHandlerRef.current = handler;
    onReadyRef.current?.(handler);
  }, []);

  useEffect(() => () => detachSubmit(), [detachSubmit]);

  if (loading) return <div className="text-white/80 text-[14px]">Préparation du paiement…</div>;
  if (error) return <div className="text-red-200 text-[14px]">{error}</div>;
  const effectiveSecret = clientSecret ?? clientSecretRef.current;
  if (!effectiveSecret) return null;
  return (
    <StripeElementsProvider clientSecret={effectiveSecret}>
      <StripePaymentForm
        clientSecret={effectiveSecret}
        onReady={attachSubmit}
        onProcessingChange={onProcessingChange}
        onStatusChange={onStatusChange}
        onErrorChange={onErrorChange}
      />
    </StripeElementsProvider>
  );
}

