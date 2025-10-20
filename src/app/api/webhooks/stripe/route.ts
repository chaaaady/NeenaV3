import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

function log(event: string, data: Record<string, unknown>) {
  console.warn(`[Stripe Webhook] ${event}:`, JSON.stringify(data, null, 2));
}

function logError(event: string, data: Record<string, unknown>) {
  console.error(`[Stripe Webhook Error] ${event}:`, JSON.stringify(data, null, 2));
}

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  
  try {
    // Créer les clients à la demande (évite les erreurs au build)
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-08-27.basil",
    });

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      logError("missing-signature", { requestId });
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid signature";
      logError("signature-verification-failed", { requestId, message });
      return NextResponse.json({ error: message }, { status: 400 });
    }

    log("event-received", { requestId, type: event.type, id: event.id });

    // Gérer les événements de paiement réussis
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const metadata = paymentIntent.metadata;

      log("payment-succeeded", {
        requestId,
        intentId: paymentIntent.id,
        amount: paymentIntent.amount,
        metadata,
      });

      // Vérifier que les métadonnées nécessaires sont présentes
      if (!metadata.mosque) {
        logError("missing-mosque-metadata", { requestId, intentId: paymentIntent.id });
        return NextResponse.json({ received: true, warning: "Missing mosque metadata" });
      }

      // Trouver la mosquée par slug
      const { data: mosque, error: mosqueError } = await supabaseAdmin
        .from("mosques")
        .select("id")
        .eq("slug", metadata.mosque)
        .single();

      if (mosqueError || !mosque) {
        logError("mosque-not-found", {
          requestId,
          slug: metadata.mosque,
          error: mosqueError,
        });
        return NextResponse.json({ received: true, warning: "Mosque not found" });
      }

      log("mosque-found", { requestId, mosqueId: mosque.id, slug: metadata.mosque });

      // Calculer les montants
      const amountBase = parseFloat(metadata.amountBase || "0");
      const coverFees = metadata.coverFees === "true";
      const amountFees = coverFees ? amountBase * 0.015 : 0;
      const amountTotal = parseFloat(metadata.amountTotal || String(amountBase));

      // Insérer la donation
      const { data: donation, error: donationError } = await supabaseAdmin
        .from("donations")
        .insert({
          mosque_id: mosque.id,
          stripe_payment_intent_id: paymentIntent.id,
          amount_base: amountBase,
          amount_fees: amountFees,
          amount_total: amountTotal,
          currency: paymentIntent.currency,
          status: "succeeded",
          frequency: metadata.frequency || null,
          donation_type: metadata.donationType || null,
          donor_email: metadata.email || null,
          donor_first_name: metadata.firstName || null,
          donor_last_name: metadata.lastName || null,
          donor_address: metadata.address || null,
          wants_receipt: metadata.wantsReceipt === "true",
          cover_fees: coverFees,
          metadata: metadata as Record<string, unknown>,
          stripe_created_at: new Date(paymentIntent.created * 1000).toISOString(),
        })
        .select()
        .single();

      if (donationError) {
        // Vérifier si c'est une duplication (donation déjà enregistrée)
        if (donationError.code === "23505") {
          log("donation-already-exists", {
            requestId,
            intentId: paymentIntent.id,
          });
          return NextResponse.json({ received: true, warning: "Donation already recorded" });
        }

        logError("donation-insert-failed", {
          requestId,
          error: donationError,
          intentId: paymentIntent.id,
        });
        return NextResponse.json(
          { error: "Failed to insert donation", requestId },
          { status: 500 }
        );
      }

      log("donation-recorded", {
        requestId,
        donationId: donation.id,
        intentId: paymentIntent.id,
        amount: amountTotal,
      });
    }

    // Gérer les événements de paiement échoués
    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const metadata = paymentIntent.metadata;

      log("payment-failed", {
        requestId,
        intentId: paymentIntent.id,
        metadata,
      });

      // Optionnel: Enregistrer les échecs dans une table séparée ou avec status 'failed'
    }

    return NextResponse.json({ received: true, requestId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logError("exception", { requestId, message, error });
    return NextResponse.json({ error: message, requestId }, { status: 500 });
  }
}

