/**
 * Types TypeScript pour les mosquées
 * Ces types sont utilisés dans toute l'application
 */

export type MosqueContent = {
  name: string;
  display_name: string;
  description?: string;
  short_description?: string;
  history?: string;
  volunteer_description?: string;
  legal_info?: string;
};

export type MosqueMetadata = {
  address: string;
  city: string;
  postal_code: string;
  department?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  website?: string;
};

export type MosqueConfiguration = {
  mawaqit_slug?: string;
  mawaqit_url?: string;
  prayer_provider?: "mawaqit" | "manual" | "api";
  stripe_account_id?: string;
};

export type MosqueAssets = {
  hero_images: string[];
  logo_url?: string;
  volunteer_image_url?: string;
};

export type MosqueFeature =
  | "parking"
  | "women_space"
  | "disabled_access"
  | "arabic_courses"
  | "religion_courses"
  | "wudu_facilities"
  | "library"
  | "bookstore"
  | "funeral_services";

export type MosqueStatus = "draft" | "published" | "archived";

export type MosqueData = {
  id: string;
  slug: string;
  name: string;
  email: string;
  content: MosqueContent;
  metadata: MosqueMetadata;
  configuration: MosqueConfiguration;
  assets: MosqueAssets;
  features: MosqueFeature[];
  status: MosqueStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type JumuaTime = {
  id: string;
  mosque_id: string;
  khutba_time: string;
  salat_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

