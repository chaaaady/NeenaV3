import { z } from "zod";

/**
 * Schéma Zod pour le contenu d'un projet
 */
export const projectContentSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  display_name: z.string().min(2, "Le nom d'affichage doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  short_description: z.string().optional(),
  history: z.string().optional(),
});

/**
 * Schéma Zod pour les métadonnées d'un projet
 */
export const projectMetadataSchema = z.object({
  city: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  department: z.string().optional(),
  address: z.string().optional(),
  postal_code: z.string().regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres").optional().or(z.literal("")),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

/**
 * Schéma Zod pour les finances d'un projet
 */
export const projectFinancialsSchema = z.object({
  target_amount: z.number().min(0, "Le montant cible doit être positif"),
  current_amount: z.number().min(0, "Le montant actuel doit être positif").default(0),
  currency: z.string().default("EUR"),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

/**
 * Schéma Zod pour une phase du timeline
 */
export const projectTimelinePhaseSchema = z.object({
  phase: z.string().min(2, "Le nom de la phase doit contenir au moins 2 caractères"),
  status: z.enum(["planned", "in_progress", "completed", "delayed"]),
  date: z.string().optional(),
  description: z.string().optional(),
});

/**
 * Schéma Zod pour le timeline d'un projet
 */
export const projectTimelineSchema = z.array(projectTimelinePhaseSchema).default([]);

/**
 * Schéma Zod pour les assets d'un projet
 */
export const projectAssetsSchema = z.object({
  hero_image: z.string().optional(),
  gallery: z.array(z.string()).default([]),
  logo: z.string().optional(),
});

/**
 * Schéma Zod pour les features d'un projet
 */
export const projectFeaturesSchema = z.array(
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
    "community_hall",
    "sports_facilities",
  ])
).default([]);

/**
 * Schéma complet pour un projet
 */
export const projectSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string()
    .min(3, "Le slug doit contenir au moins 3 caractères")
    .regex(/^[a-z0-9-]+$/, "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets"),
  content: projectContentSchema,
  metadata: projectMetadataSchema,
  financials: projectFinancialsSchema,
  timeline: projectTimelineSchema,
  assets: projectAssetsSchema,
  features: projectFeaturesSchema,
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

/**
 * Schéma pour la création d'un projet (sans id, dates auto-générées)
 */
export const createProjectSchema = projectSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

/**
 * Schéma pour la mise à jour d'un projet (tous les champs optionnels sauf id)
 */
export const updateProjectSchema = projectSchema.partial().required({ id: true });

/**
 * Types TypeScript dérivés des schémas Zod
 */
export type ProjectContent = z.infer<typeof projectContentSchema>;
export type ProjectMetadata = z.infer<typeof projectMetadataSchema>;
export type ProjectFinancials = z.infer<typeof projectFinancialsSchema>;
export type ProjectTimelinePhase = z.infer<typeof projectTimelinePhaseSchema>;
export type ProjectTimeline = z.infer<typeof projectTimelineSchema>;
export type ProjectAssets = z.infer<typeof projectAssetsSchema>;
export type ProjectFeatures = z.infer<typeof projectFeaturesSchema>;
export type Project = z.infer<typeof projectSchema>;
export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;

/**
 * Labels pour les statuts de phase (pour l'affichage dans l'UI)
 */
export const PHASE_STATUS_LABELS: Record<ProjectTimelinePhase["status"], string> = {
  planned: "Planifié",
  in_progress: "En cours",
  completed: "Terminé",
  delayed: "Retardé",
};

/**
 * Labels pour les features (pour l'affichage dans l'UI)
 */
export const PROJECT_FEATURE_LABELS: Record<ProjectFeatures[number], string> = {
  parking: "Parking",
  women_space: "Espace femmes",
  disabled_access: "Accès handicapé",
  arabic_courses: "Cours d'arabe",
  religion_courses: "Cours de religion",
  wudu_facilities: "Ablutions",
  library: "Bibliothèque",
  bookstore: "Librairie",
  funeral_services: "Services funéraires",
  community_hall: "Salle communautaire",
  sports_facilities: "Installations sportives",
};

