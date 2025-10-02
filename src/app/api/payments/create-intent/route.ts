import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const log = (...args: unknown[]) => console.warn("[Stripe][create-intent]", ...args);
const logError = (...args: unknown[]) => console.error("[Stripe][create-intent][error]", ...args);

type CreateIntentBody = {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
};

type CreateIntentResponse = { clientSecret: string } | { error: string };

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  const idempotencyKey = req.headers.get("Idempotency-Key") || undefined;
  
  try {
    const raw = await req.text();
    if (!raw || raw.trim().length === 0) {
      logError("empty-body", { requestId, idempotencyKey });
      return NextResponse.json({ error: "Empty request body", requestId }, { status: 400 });
    }

    let body: CreateIntentBody | null = null;
    try {
      body = JSON.parse(raw) as CreateIntentBody | null;
    } catch (parseError) {
      logError("invalid-json", { requestId, idempotencyKey, raw, parseError });
      return NextResponse.json({ error: "Invalid JSON payload", requestId }, { status: 400 });
    }

    const { amount, currency = "eur", metadata } = body || {};
    log("request", { requestId, idempotencyKey, amount, currency, metadata });
    if (!amount || !Number.isFinite(amount) || amount <= 0) {
      log("invalid-amount", { requestId, idempotencyKey, amount });
      return NextResponse.json({ error: "Invalid amount", requestId }, { status: 400 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      logError("missing-secret-key", { requestId, idempotencyKey });
      return NextResponse.json({ error: "Server missing STRIPE_SECRET_KEY", requestId }, { status: 500 });
    }
    const stripe = new Stripe(secretKey, { apiVersion: "2025-08-27.basil" });

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: Math.round(amount * 100),
        currency,
        automatic_payment_methods: { enabled: true },
        metadata: metadata ?? {},
        receipt_email: metadata?.email,
      },
      idempotencyKey ? { idempotencyKey } : undefined
    );

    log("success", { requestId, idempotencyKey, intentId: paymentIntent.id, status: paymentIntent.status });

    return NextResponse.json(
      { clientSecret: paymentIntent.client_secret ?? "", requestId } satisfies CreateIntentResponse,
      { status: 200 }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    logError("exception", { requestId, idempotencyKey, message, raw: e });
    return NextResponse.json({ error: message, requestId }, { status: 500 });
  }
}

