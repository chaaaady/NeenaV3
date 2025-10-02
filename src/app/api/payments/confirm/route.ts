import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const log = (...args: unknown[]) => console.warn("[Stripe][confirm]", ...args);
const logError = (...args: unknown[]) => console.error("[Stripe][confirm][error]", ...args);

type ConfirmIntentBody = {
  clientSecret: string;
  paymentMethodId: string;
  returnUrl?: string;
};

type ConfirmIntentResponse = { paymentIntent: Stripe.PaymentIntent } | { error: string };

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  try {
    const { clientSecret, paymentMethodId, returnUrl }: ConfirmIntentBody = await req.json();
    log("request", { requestId, clientSecret, paymentMethodId, returnUrl });
    if (!clientSecret || !paymentMethodId) {
      log("missing-fields", { requestId });
      return NextResponse.json({ error: "Missing clientSecret or paymentMethodId", requestId }, { status: 400 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      logError("missing-secret-key", { requestId });
      return NextResponse.json({ error: "Server missing STRIPE_SECRET_KEY", requestId }, { status: 500 });
    }

    const stripe = new Stripe(secretKey, { apiVersion: "2025-08-27.basil" });

    const intentId = clientSecret.split("_secret")[0] ?? clientSecret;
    const intent = await stripe.paymentIntents.confirm(intentId, {
      payment_method: paymentMethodId,
      return_url: returnUrl,
    });

    log("success", { requestId, intentId: intent.id, status: intent.status });

    return NextResponse.json({ paymentIntent: intent, requestId } satisfies ConfirmIntentResponse, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe confirmation error";
    logError("exception", { requestId, message, raw: error });
    return NextResponse.json({ error: message, requestId }, { status: 500 });
  }
}


