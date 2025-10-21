import { createClient } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Client pour utilisation côté serveur (avec service role key)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Client pour utilisation côté client (avec anon key)
// Les variables d'environnement NEXT_PUBLIC_ sont remplacées au build time par Next.js
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Hook pour composants client avec auth
export const useSupabaseClient = () => {
  return createClientComponentClient();
};

// Types pour la base de données
export type Mosque = {
  id: string;
  slug: string;
  name: string;
  email: string;
  created_at: string;
  is_active: boolean;
};

export type Donation = {
  id: string;
  mosque_id: string;
  stripe_payment_intent_id: string;
  amount_base: number;
  amount_fees: number;
  amount_total: number;
  currency: string;
  status: string;
  frequency: string | null;
  donation_type: string | null;
  donor_email: string | null;
  donor_first_name: string | null;
  donor_last_name: string | null;
  donor_address: string | null;
  wants_receipt: boolean;
  cover_fees: boolean;
  metadata: Record<string, unknown> | null;
  stripe_created_at: string | null;
  created_at: string;
};

export type QRCode = {
  id: string;
  mosque_id: string;
  code: string;
  location: string | null;
  scan_count: number;
  created_at: string;
};

