import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { ProjectData } from "@/types/project";

/**
 * Récupère tous les projets publiés
 */
export async function fetchPublishedProjects(): Promise<ProjectData[]> {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error fetching projects: ${error.message}`);
  }

  return data as ProjectData[];
}

/**
 * Récupère un projet par son slug
 */
export async function fetchProjectBySlug(slug: string): Promise<ProjectData | null> {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Aucun résultat trouvé
      return null;
    }
    throw new Error(`Error fetching project: ${error.message}`);
  }

  return data as ProjectData;
}

/**
 * Récupère un projet par son ID (pour l'admin)
 */
export async function fetchProjectById(id: string): Promise<ProjectData | null> {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Error fetching project: ${error.message}`);
  }

  return data as ProjectData;
}

/**
 * Récupère tous les projets (pour l'admin)
 */
export async function fetchAllProjects(): Promise<ProjectData[]> {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error fetching all projects: ${error.message}`);
  }

  return data as ProjectData[];
}

/**
 * Crée un nouveau projet
 */
export async function createProject(project: Omit<ProjectData, "id" | "created_at" | "updated_at">): Promise<ProjectData> {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from("projects")
    .insert(project)
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating project: ${error.message}`);
  }

  return data as ProjectData;
}

/**
 * Met à jour un projet
 */
export async function updateProject(id: string, updates: Partial<ProjectData>): Promise<ProjectData> {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating project: ${error.message}`);
  }

  return data as ProjectData;
}

/**
 * Supprime un projet
 */
export async function deleteProject(id: string): Promise<void> {
  const supabase = createClientComponentClient();
  
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Error deleting project: ${error.message}`);
  }
}

/**
 * Récupère tous les slugs de projets publiés (pour generateStaticParams)
 */
export async function fetchAllProjectSlugs(): Promise<string[]> {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from("projects")
    .select("slug")
    .eq("status", "published");

  if (error) {
    throw new Error(`Error fetching project slugs: ${error.message}`);
  }

  return data.map((p) => p.slug);
}

/**
 * Calcule le pourcentage de progression d'un projet
 */
export function calculateProjectProgress(project: ProjectData): number {
  if (!project.financials.target_amount || project.financials.target_amount === 0) {
    return 0;
  }
  
  const progress = (project.financials.current_amount / project.financials.target_amount) * 100;
  return Math.min(Math.round(progress), 100);
}

