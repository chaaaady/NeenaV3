import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = "eur", metadata } = body || {};
    if (!amount || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error("[Stripe] Missing STRIPE_SECRET_KEY env variable");
      return NextResponse.json({ error: "Server missing STRIPE_SECRET_KEY" }, { status: 500 });
    }
    const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: metadata || {},
      receipt_email: typeof metadata?.email === "string" ? metadata.email : undefined,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

