import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

type CreateIntentBody = {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
};

type CreateIntentResponse = { clientSecret: string } | { error: string };

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateIntentBody | null;
    const { amount, currency = "eur", metadata } = body || {};
    if (!amount || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error("[Stripe] Missing STRIPE_SECRET_KEY env variable");
      return NextResponse.json({ error: "Server missing STRIPE_SECRET_KEY" }, { status: 500 });
    }
    const stripe = new Stripe(secretKey, { apiVersion: "2025-08-27.basil" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: metadata ?? {},
      receipt_email: metadata?.email,
    });

    return NextResponse.json(
      { clientSecret: paymentIntent.client_secret ?? "" } satisfies CreateIntentResponse,
      { status: 200 }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

