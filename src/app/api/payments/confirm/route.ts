import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { clientSecret, paymentMethodId, returnUrl } = await req.json();
    if (!clientSecret || !paymentMethodId) {
      return NextResponse.json({ error: "Missing clientSecret or paymentMethodId" }, { status: 400 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error("[Stripe] Missing STRIPE_SECRET_KEY env variable");
      return NextResponse.json({ error: "Server missing STRIPE_SECRET_KEY" }, { status: 500 });
    }

    const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });

    const intent = await stripe.paymentIntents.confirm(clientSecret.split("_secret")[0]!, {
      payment_method: paymentMethodId,
      return_url: returnUrl,
    });

    return NextResponse.json({ paymentIntent: intent }, { status: 200 });
  } catch (error: any) {
    console.error("[Stripe] Confirm error", error);
    return NextResponse.json({ error: error?.message || "Stripe confirmation error" }, { status: 500 });
  }
}


