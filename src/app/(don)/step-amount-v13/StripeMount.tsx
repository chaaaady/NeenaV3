"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StripeElementsProvider, StripePaymentForm, StripePaymentStatus } from "./StripeElements";
import { generateUUID, hashString } from "@/lib/uuid";

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
  // Generate a unique session ID to prevent reusing confirmed PaymentIntents
  const sessionIdRef = useRef<string>(generateUUID());
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const clientSecretRef = useRef<string | null>(null);
  const submitHandlerRef = useRef<(() => Promise<void>) | null>(null);
  const lastKeyRef = useRef<string | null>(null);
  const onReadyRef = useRef(onReady);
  const onErrorChangeRef = useRef(onErrorChange);
  const isCreatingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    onErrorChangeRef.current = onErrorChange;
  }, [onErrorChange]);

  const detachSubmit = useCallback(() => {
    submitHandlerRef.current = null;
    onReadyRef.current?.(null);
  }, []);

  // Stabilize metadata with JSON serialization to avoid re-renders on object reference changes
  const metadataJson = useMemo(() => {
    if (!metadata && !email) return "{}";
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
    return JSON.stringify(base);
  }, [email, metadata]);

  const requestKey = useMemo(() => {
    if (!amount || !Number.isFinite(amount) || amount <= 0) return null;
    // Include sessionId to ensure each payment session gets a unique PaymentIntent
    return `${sessionIdRef.current}|${Math.round(amount * 100)}|${metadataJson}`;
  }, [amount, metadataJson]);

  useEffect(() => {
    // Cancel any in-flight request when dependencies change
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (!requestKey) {
      setClientSecret(null);
      clientSecretRef.current = null;
      lastKeyRef.current = null;
      setError("Montant invalide pour le paiement");
      setLoading(false);
      detachSubmit();
      onErrorChangeRef.current?.("Montant invalide pour le paiement");
      isCreatingRef.current = false;
      return;
    }

    // Use cached clientSecret if available
    if (lastKeyRef.current === requestKey && clientSecretRef.current) {
      setClientSecret(clientSecretRef.current);
      setError(null);
      setLoading(false);
      isCreatingRef.current = false;
      return;
    }

    // Prevent parallel requests for the same requestKey
    if (isCreatingRef.current) {
      return;
    }

    let cancelled = false;
    isCreatingRef.current = true;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    setClientSecret(null);
    clientSecretRef.current = null;
    detachSubmit();

    const fetchIntent = async () => {
      const parsedMetadata = JSON.parse(metadataJson) as StripeMetadata;
      const serializedMetadata = Object.fromEntries(
        Object.entries(parsedMetadata).map(([key, value]) => [key, String(value)])
      );
      // Use hash to keep idempotency key under 255 chars
      const hashHex = await hashString(requestKey);
      const idempotencyKey = `pi_${hashHex}`;

      try {
        const res = await fetch("/api/payments/create-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": idempotencyKey,
          },
          body: JSON.stringify({ amount, currency: "eur", metadata: serializedMetadata }),
          signal: controller.signal,
        });

        if (!res.ok) {
          if (!cancelled) {
            setError("Impossible de préparer le paiement. Merci de réessayer plus tard.");
            onErrorChangeRef.current?.("Erreur serveur Stripe. Merci de réessayer.");
            lastKeyRef.current = null;
          }
          return;
        }

        const data = await res.json();
        if (!cancelled) {
          if (!data?.clientSecret) {
            setError("Réponse Stripe invalide. Merci de réessayer.");
            onErrorChangeRef.current?.("Réponse Stripe invalide.");
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
        setError("Connexion Stripe indisponible. Merci de réessayer.");
        onErrorChangeRef.current?.("Connexion Stripe indisponible. Merci de réessayer.");
        lastKeyRef.current = null;
      } finally {
        if (!cancelled) {
          setLoading(false);
          isCreatingRef.current = false;
        }
      }
    };

    fetchIntent();

    return () => {
      cancelled = true;
      controller.abort();
      isCreatingRef.current = false;
    };
  }, [amount, metadataJson, requestKey, detachSubmit]);

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
