import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification (admin only)
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Créer le client Supabase admin à la demande
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

    // Créer le client Stripe à la demande
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-08-27.basil",
    });

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    // Récupérer toutes les mosquées
    const { data: mosques, error: mosquesError } = await supabaseAdmin
      .from("mosques")
      .select("id, slug");

    if (mosquesError || !mosques) {
      throw new Error("Failed to load mosques");
    }

    const mosqueMap = new Map(mosques.map((m) => [m.slug, m.id]));

    // Récupérer les PaymentIntents de Stripe
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
    });

    for (const intent of paymentIntents.data) {
      try {
        if (intent.status !== "succeeded") {
          skipped++;
          continue;
        }

        const metadata = intent.metadata;
        if (!metadata.mosque) {
          skipped++;
          continue;
        }

        const mosqueId = mosqueMap.get(metadata.mosque);
        if (!mosqueId) {
          skipped++;
          continue;
        }

        // Vérifier si existe déjà
        const { data: existing } = await supabaseAdmin
          .from("donations")
          .select("id")
          .eq("stripe_payment_intent_id", intent.id)
          .single();

        if (existing) {
          skipped++;
          continue;
        }

        // Insérer
        const amountBase = parseFloat(metadata.amountBase || "0");
        const coverFees = metadata.coverFees === "true";
        const amountFees = coverFees ? amountBase * 0.015 : 0;
        const amountTotal = parseFloat(metadata.amountTotal || String(amountBase));

        const { error: insertError } = await supabaseAdmin.from("donations").insert({
          mosque_id: mosqueId,
          stripe_payment_intent_id: intent.id,
          amount_base: amountBase,
          amount_fees: amountFees,
          amount_total: amountTotal,
          currency: intent.currency,
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
          stripe_created_at: new Date(intent.created * 1000).toISOString(),
        });

        if (insertError) throw insertError;

        imported++;
      } catch (error) {
        console.error(`Error importing ${intent.id}:`, error);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      skipped,
      errors,
      total: paymentIntents.data.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

