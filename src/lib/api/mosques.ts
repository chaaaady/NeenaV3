import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { MosqueData, JumuaTime } from "@/types/mosque";

/**
 * Récupère toutes les mosquées publiées
 */
export async function fetchPublishedMosques(): Promise<MosqueData[]> {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from("mosques")
    .select("*")
    .eq("status", "published")
    .eq("is_active", true)
    .order("name");

  if (error) {
    throw new Error(`Error fetching mosques: ${error.message}`);
  }

  return data as MosqueData[];
}

/**
 * Récupère une mosquée par son slug
 */
export async function fetchMosqueBySlug(slug: string): Promise<MosqueData | null> {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from("mosques")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Aucun résultat trouvé
      return null;
    }
    throw new Error(`Error fetching mosque: ${error.message}`);
  }

  return data as MosqueData;
}

/**
 * Récupère une mosquée par son ID (pour l'admin)
 */
export async function fetchMosqueById(id: string): Promise<MosqueData | null> {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from("mosques")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Error fetching mosque: ${error.message}`);
  }

  return data as MosqueData;
}

/**
 * Récupère toutes les mosquées (pour l'admin)
 */
export async function fetchAllMosques(): Promise<MosqueData[]> {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from("mosques")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error fetching all mosques: ${error.message}`);
  }

  return data as MosqueData[];
}

/**
 * Crée une nouvelle mosquée
 */
export async function createMosque(mosque: Omit<MosqueData, "id" | "created_at" | "updated_at">): Promise<MosqueData> {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from("mosques")
    .insert(mosque)
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating mosque: ${error.message}`);
  }

  return data as MosqueData;
}

/**
 * Met à jour une mosquée
 */
export async function updateMosque(id: string, updates: Partial<MosqueData>): Promise<MosqueData> {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from("mosques")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating mosque: ${error.message}`);
  }

  return data as MosqueData;
}

/**
 * Supprime une mosquée
 */
export async function deleteMosque(id: string): Promise<void> {
  const supabase = createClientComponentClient();
  
  const { error } = await supabase
    .from("mosques")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Error deleting mosque: ${error.message}`);
  }
}

/**
 * Récupère les horaires Jumua d'une mosquée
 */
export async function fetchJumuaTimes(mosqueId: string): Promise<JumuaTime | null> {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from("mosque_jumua_times")
    .select("*")
    .eq("mosque_id", mosqueId)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Error fetching jumua times: ${error.message}`);
  }

  return data as JumuaTime;
}

/**
 * Crée ou met à jour les horaires Jumua d'une mosquée
 */
export async function upsertJumuaTimes(mosqueId: string, khutbaTime: string, salatTime: string): Promise<JumuaTime> {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from("mosque_jumua_times")
    .upsert({
      mosque_id: mosqueId,
      khutba_time: khutbaTime,
      salat_time: salatTime,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error upserting jumua times: ${error.message}`);
  }

  return data as JumuaTime;
}

/**
 * Récupère tous les slugs de mosquées publiées (pour generateStaticParams)
 */
export async function fetchAllMosqueSlugs(): Promise<string[]> {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from("mosques")
    .select("slug")
    .eq("status", "published")
    .eq("is_active", true);

  if (error) {
    throw new Error(`Error fetching mosque slugs: ${error.message}`);
  }

  return data.map((m) => m.slug);
}

