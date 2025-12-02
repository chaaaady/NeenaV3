import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ProjectTemplate } from "@/components/templates/ProjectTemplate";
import type { ProjectData } from "@/types/project";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

/**
 * Generate static params for all published projects
 * This enables ISR (Incremental Static Regeneration)
 */
export async function generateStaticParams() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: projects } = await supabase
    .from("projects")
    .select("slug")
    .eq("status", "published");

  if (!projects) return [];

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!project) {
    return {
      title: "Projet non trouvé | Neena",
    };
  }

  const projectData = project as ProjectData;

  return {
    title: `${projectData.content.name} | Neena`,
    description: projectData.content.short_description || projectData.content.description || `Découvrez le projet ${projectData.content.name} sur Neena`,
    openGraph: {
      title: projectData.content.name,
      description: projectData.content.short_description || projectData.content.description,
      images: projectData.assets.hero_image ? [projectData.assets.hero_image] : [],
    },
  };
}

/**
 * Project page component with ISR
 * Revalidate every 60 seconds
 */
export const revalidate = 60;

export default async function ProjectPage({ params }: ProjectPageProps) {
  const supabase = createServerComponentClient({ cookies });
  
  // Fetch project data
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (projectError || !project) {
    notFound();
  }

  const projectData = project as ProjectData;

  return <ProjectTemplate data={projectData} />;
}

