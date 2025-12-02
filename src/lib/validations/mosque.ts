import { z } from "zod";

/**
 * Schéma Zod pour le contenu d'une mosquée
 */
export const mosqueContentSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  display_name: z.string().min(2, "Le nom d'affichage doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  short_description: z.string().optional(),
  history: z.string().optional(),
  volunteer_description: z.string().optional(),
  legal_info: z.string().optional(),
});

/**
 * Schéma Zod pour les métadonnées d'une mosquée
 */
export const mosqueMetadataSchema = z.object({
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  city: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  postal_code: z.string().regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres"),
  department: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  phone: z.string().optional(),
  website: z.string().url("L'URL du site web n'est pas valide").optional().or(z.literal("")),
});

/**
 * Schéma Zod pour la configuration d'une mosquée
 */
export const mosqueConfigurationSchema = z.object({
  mawaqit_slug: z.string().optional(),
  mawaqit_url: z.string().url("L'URL Mawaqit n'est pas valide").optional().or(z.literal("")),
  prayer_provider: z.enum(["mawaqit", "manual", "api"]).default("mawaqit"),
  stripe_account_id: z.string().optional(),
});

/**
 * Schéma Zod pour les assets d'une mosquée
 */
export const mosqueAssetsSchema = z.object({
  hero_images: z.array(z.string()).default([]),
  logo_url: z.string().optional(),
  volunteer_image_url: z.string().optional(),
});

/**
 * Schéma Zod pour les features d'une mosquée
 */
export const mosqueFeaturesSchema = z.array(
  z.enum([
    "parking",
    "women_space",
    "disabled_access",
    "arabic_courses",
    "religion_courses",
    "wudu_facilities",
    "library",
    "bookstore",
    "funeral_services",
  ])
).default([]);

/**
 * Schéma complet pour une mosquée
 */
export const mosqueSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string()
    .min(3, "Le slug doit contenir au moins 3 caractères")
    .regex(/^[a-z0-9-]+$/, "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets"),
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  email: z.string().email("L'email n'est pas valide"),
  content: mosqueContentSchema,
  metadata: mosqueMetadataSchema,
  configuration: mosqueConfigurationSchema,
  assets: mosqueAssetsSchema,
  features: mosqueFeaturesSchema,
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  is_active: z.boolean().default(true),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

/**
 * Schéma pour la création d'une mosquée (sans id, dates auto-générées)
 */
export const createMosqueSchema = mosqueSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

/**
 * Schéma pour la mise à jour d'une mosquée (tous les champs optionnels sauf id)
 */
export const updateMosqueSchema = mosqueSchema.partial().required({ id: true });

/**
 * Types TypeScript dérivés des schémas Zod
 */
export type MosqueContent = z.infer<typeof mosqueContentSchema>;
export type MosqueMetadata = z.infer<typeof mosqueMetadataSchema>;
export type MosqueConfiguration = z.infer<typeof mosqueConfigurationSchema>;
export type MosqueAssets = z.infer<typeof mosqueAssetsSchema>;
export type MosqueFeatures = z.infer<typeof mosqueFeaturesSchema>;
export type Mosque = z.infer<typeof mosqueSchema>;
export type CreateMosque = z.infer<typeof createMosqueSchema>;
export type UpdateMosque = z.infer<typeof updateMosqueSchema>;

/**
 * Labels pour les features (pour l'affichage dans l'UI)
 */
export const FEATURE_LABELS: Record<MosqueFeatures[number], string> = {
  parking: "Parking",
  women_space: "Espace femmes",
  disabled_access: "Accès handicapé",
  arabic_courses: "Cours d'arabe",
  religion_courses: "Cours de religion",
  wudu_facilities: "Ablutions",
  library: "Bibliothèque",
  bookstore: "Librairie",
  funeral_services: "Services funéraires",
};

