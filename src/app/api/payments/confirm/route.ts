import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

type ConfirmIntentBody = {
  clientSecret: string;
  paymentMethodId: string;
  returnUrl?: string;
};

type ConfirmIntentResponse = { paymentIntent: Stripe.PaymentIntent } | { error: string };

export async function POST(req: NextRequest) {
  try {
    const { clientSecret, paymentMethodId, returnUrl }: ConfirmIntentBody = await req.json();
    if (!clientSecret || !paymentMethodId) {
      return NextResponse.json({ error: "Missing clientSecret or paymentMethodId" }, { status: 400 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error("[Stripe] Missing STRIPE_SECRET_KEY env variable");
      return NextResponse.json({ error: "Server missing STRIPE_SECRET_KEY" }, { status: 500 });
    }

    const stripe = new Stripe(secretKey, { apiVersion: "2025-08-27.basil" });

    const intentId = clientSecret.split("_secret")[0] ?? clientSecret;
    const intent = await stripe.paymentIntents.confirm(intentId, {
      payment_method: paymentMethodId,
      return_url: returnUrl,
    });

    return NextResponse.json({ paymentIntent: intent } satisfies ConfirmIntentResponse, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe confirmation error";
    console.error("[Stripe] Confirm error", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


