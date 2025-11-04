/**
 * Mapping entre les slugs (utilisés dans l'API/DB) et les noms affichés
 */

export type MosqueInfo = {
  slug: string;
  name: string;
  displayName: string;
};

export const MOSQUES: MosqueInfo[] = [
  { 
    slug: "Créteil", 
    name: "Mosquée Sahaba Créteil",
    displayName: "Créteil"
  },
  { 
    slug: "Paris-11", 
    name: "Mosquée de Paris 11ème",
    displayName: "Paris 11ème"
  },
  { 
    slug: "Paris-19", 
    name: "Mosquée de Paris 19ème",
    displayName: "Paris 19ème"
  },
  { 
    slug: "Boulogne-Billancourt", 
    name: "Mosquée de Boulogne-Billancourt",
    displayName: "Boulogne-Billancourt"
  },
  { 
    slug: "Nanterre", 
    name: "Mosquée de Nanterre",
    displayName: "Nanterre"
  },
  { 
    slug: "Saint-Denis", 
    name: "Mosquée de Saint-Denis",
    displayName: "Saint-Denis"
  },
  { 
    slug: "Aubervilliers", 
    name: "Mosquée d'Aubervilliers",
    displayName: "Aubervilliers"
  },
  { 
    slug: "Bobigny", 
    name: "Mosquée de Bobigny",
    displayName: "Bobigny"
  },
  { 
    slug: "Montreuil", 
    name: "Mosquée de Montreuil",
    displayName: "Montreuil"
  },
  { 
    slug: "Villejuif", 
    name: "Mosquée de Villejuif",
    displayName: "Villejuif"
  },
];

/**
 * Récupère le nom d'affichage à partir du slug
 */
export function getMosqueDisplayName(slug: string | undefined): string {
  if (!slug) return "Sélectionner";
  const mosque = MOSQUES.find((m) => m.slug === slug);
  return mosque?.displayName || slug;
}

/**
 * Récupère le nom complet à partir du slug
 */
export function getMosqueName(slug: string | undefined): string {
  if (!slug) return "";
  const mosque = MOSQUES.find((m) => m.slug === slug);
  return mosque?.name || slug;
}

/**
 * Récupère le slug à partir du nom d'affichage
 */
export function getMosqueSlug(displayName: string): string | undefined {
  const mosque = MOSQUES.find((m) => m.displayName === displayName);
  return mosque?.slug;
}







