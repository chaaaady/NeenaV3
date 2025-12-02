/**
 * Types TypeScript pour les projets de construction
 * Ces types sont utilisés dans toute l'application
 */

export type ProjectContent = {
  name: string;
  display_name: string;
  description?: string;
  short_description?: string;
  history?: string;
};

export type ProjectMetadata = {
  city: string;
  department?: string;
  address?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
};

export type ProjectFinancials = {
  target_amount: number;
  current_amount: number;
  currency: string;
  start_date?: string;
  end_date?: string;
};

export type ProjectPhaseStatus = "planned" | "in_progress" | "completed" | "delayed";

export type ProjectTimelinePhase = {
  phase: string;
  status: ProjectPhaseStatus;
  date?: string;
  description?: string;
};

export type ProjectAssets = {
  hero_image?: string;
  gallery: string[];
  logo?: string;
};

export type ProjectFeature =
  | "parking"
  | "women_space"
  | "disabled_access"
  | "arabic_courses"
  | "religion_courses"
  | "wudu_facilities"
  | "library"
  | "bookstore"
  | "funeral_services"
  | "community_hall"
  | "sports_facilities";

export type ProjectStatus = "draft" | "published" | "archived";

export type ProjectData = {
  id: string;
  slug: string;
  content: ProjectContent;
  metadata: ProjectMetadata;
  financials: ProjectFinancials;
  timeline: ProjectTimelinePhase[];
  assets: ProjectAssets;
  features: ProjectFeature[];
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
};

