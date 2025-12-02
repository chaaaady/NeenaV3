import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { MosqueTemplate } from "@/components/templates/MosqueTemplate";
import type { MosqueData, JumuaTime } from "@/types/mosque";
import type { Metadata } from "next";

interface MosquePageProps {
  params: {
    slug: string;
  };
}

/**
 * Generate static params for all published mosques
 * This enables ISR (Incremental Static Regeneration)
 */
export async function generateStaticParams() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: mosques } = await supabase
    .from("mosques")
    .select("slug")
    .eq("status", "published")
    .eq("is_active", true);

  if (!mosques) return [];

  return mosques.map((mosque) => ({
    slug: mosque.slug,
  }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: MosquePageProps): Promise<Metadata> {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: mosque } = await supabase
    .from("mosques")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .eq("is_active", true)
    .single();

  if (!mosque) {
    return {
      title: "Mosquée non trouvée | Neena",
    };
  }

  const mosqueData = mosque as MosqueData;

  return {
    title: `${mosqueData.content.name} | Neena`,
    description: mosqueData.content.short_description || mosqueData.content.description || `Découvrez ${mosqueData.content.name} sur Neena`,
    openGraph: {
      title: mosqueData.content.name,
      description: mosqueData.content.short_description || mosqueData.content.description,
      images: mosqueData.assets.hero_images.length > 0 ? [mosqueData.assets.hero_images[0]] : [],
    },
  };
}

/**
 * Mosque page component with ISR
 * Revalidate every 60 seconds
 */
export const revalidate = 60;

export default async function MosquePage({ params }: MosquePageProps) {
  const supabase = createServerComponentClient({ cookies });
  
  // Fetch mosque data
  const { data: mosque, error: mosqueError } = await supabase
    .from("mosques")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .eq("is_active", true)
    .single();

  if (mosqueError || !mosque) {
    notFound();
  }

  const mosqueData = mosque as MosqueData;

  // Fetch Jumua times
  const { data: jumuaTimes } = await supabase
    .from("mosque_jumua_times")
    .select("*")
    .eq("mosque_id", mosqueData.id)
    .eq("is_active", true)
    .single();

  return <MosqueTemplate data={mosqueData} jumuaTimes={jumuaTimes as JumuaTime | null} />;
}

