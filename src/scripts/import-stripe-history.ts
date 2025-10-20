/**
 * Script d'import des donations historiques depuis Stripe vers Supabase
 * 
 * Usage:
 * 1. Configurer les variables d'environnement dans .env.local
 * 2. Exécuter: npx ts-node src/scripts/import-stripe-history.ts
 */

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function importStripeHistory() {
  console.warn("🚀 Début de l'import des donations Stripe...\n");

  let totalImported = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  try {
    // Récupérer toutes les mosquées de Supabase
    const { data: mosques, error: mosquesError } = await supabase
      .from("mosques")
      .select("id, slug");

    if (mosquesError || !mosques) {
      throw new Error("Impossible de charger les mosquées depuis Supabase");
    }

    const mosqueMap = new Map(mosques.map((m) => [m.slug, m.id]));
    console.warn(`✅ ${mosques.length} mosquées trouvées dans Supabase\n`);

    // Récupérer tous les PaymentIntents réussis depuis Stripe
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
      expand: ["data.charges"],
    });

    console.warn(`📊 ${paymentIntents.data.length} PaymentIntents trouvés dans Stripe\n`);

    for (const intent of paymentIntents.data) {
      try {
        // Skip si pas réussi
        if (intent.status !== "succeeded") {
          totalSkipped++;
          continue;
        }

        const metadata = intent.metadata;

        // Skip si pas de métadonnées mosquée
        if (!metadata.mosque) {
          console.warn(`⚠️  PaymentIntent ${intent.id} sans métadonnée 'mosque' - ignoré`);
          totalSkipped++;
          continue;
        }

        // Trouver l'ID de la mosquée
        const mosqueId = mosqueMap.get(metadata.mosque);
        if (!mosqueId) {
          console.warn(`⚠️  Mosquée '${metadata.mosque}' non trouvée - ignoré`);
          totalSkipped++;
          continue;
        }

        // Vérifier si la donation existe déjà
        const { data: existing } = await supabase
          .from("donations")
          .select("id")
          .eq("stripe_payment_intent_id", intent.id)
          .single();

        if (existing) {
          console.warn(`ℹ️  Donation ${intent.id} déjà importée - ignoré`);
          totalSkipped++;
          continue;
        }

        // Calculer les montants
        const amountBase = parseFloat(metadata.amountBase || "0");
        const coverFees = metadata.coverFees === "true";
        const amountFees = coverFees ? amountBase * 0.015 : 0;
        const amountTotal = parseFloat(metadata.amountTotal || String(amountBase));

        // Insérer la donation
        const { error: insertError } = await supabase.from("donations").insert({
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

        if (insertError) {
          throw insertError;
        }

        console.warn(`✅ Importé: ${intent.id} - ${amountTotal}€ - ${metadata.mosque}`);
        totalImported++;
      } catch (error) {
        console.error(`❌ Erreur pour ${intent.id}:`, error);
        totalErrors++;
      }
    }

    console.warn("\n" + "=".repeat(50));
    console.warn("📊 RÉSUMÉ DE L'IMPORT");
    console.warn("=".repeat(50));
    console.warn(`✅ Importés: ${totalImported}`);
    console.warn(`ℹ️  Ignorés: ${totalSkipped}`);
    console.warn(`❌ Erreurs: ${totalErrors}`);
    console.warn("=".repeat(50) + "\n");
  } catch (error) {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  }
}

// Exécuter le script
importStripeHistory()
  .then(() => {
    console.warn("✅ Import terminé avec succès");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Import échoué:", error);
    process.exit(1);
  });

