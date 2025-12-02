"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import type { MosqueData } from "@/types/mosque";
import { createMosqueSchema, type CreateMosque, FEATURE_LABELS } from "@/lib/validations/mosque";

export default function AdminMosqueEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isNew = params.id === "new";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateMosque>({
    resolver: zodResolver(createMosqueSchema),
    defaultValues: {
      slug: "",
      name: "",
      email: "",
      content: {
        name: "",
        display_name: "",
        description: "",
        short_description: "",
      },
      metadata: {
        address: "",
        city: "",
        postal_code: "",
        department: "",
      },
      configuration: {
        mawaqit_slug: "",
        prayer_provider: "mawaqit",
      },
      assets: {
        hero_images: [],
      },
      features: [],
      status: "draft",
      is_active: true,
    },
  });

  useEffect(() => {
    checkAuth();
    if (!isNew) {
      loadMosque();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/auth/login");
    }
  };

  const loadMosque = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("mosques")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;

      const mosque = data as MosqueData;
      
      // Populate form with existing data
      setValue("slug", mosque.slug);
      setValue("name", mosque.name);
      setValue("email", mosque.email);
      setValue("content", mosque.content);
      setValue("metadata", mosque.metadata);
      setValue("configuration", mosque.configuration);
      setValue("assets", mosque.assets);
      setValue("features", mosque.features);
      setValue("status", mosque.status);
      setValue("is_active", mosque.is_active);
    } catch (error) {
      console.error("Error loading mosque:", error);
      alert("Erreur lors du chargement de la mosquée");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CreateMosque) => {
    try {
      setSaving(true);

      if (isNew) {
        const { error } = await supabase
          .from("mosques")
          .insert(data);

        if (error) throw error;
        alert("Mosquée créée avec succès !");
      } else {
        const { error } = await supabase
          .from("mosques")
          .update(data)
          .eq("id", params.id);

        if (error) throw error;
        alert("Mosquée mise à jour avec succès !");
      }

      router.push("/admin/mosques");
    } catch (error) {
      console.error("Error saving mosque:", error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const features = watch("features") || [];

  const toggleFeature = (feature: string) => {
    const currentFeatures = features;
    if (currentFeatures.includes(feature as any)) {
      setValue("features", currentFeatures.filter(f => f !== feature) as any);
    } else {
      setValue("features", [...currentFeatures, feature] as any);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/mosques"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Retour à la liste</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isNew ? "Nouvelle mosquée" : "Éditer la mosquée"}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informations de base */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations de base</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  {...register("name")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mosquée de Créteil"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom d'affichage *
                </label>
                <input
                  {...register("content.display_name")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Créteil"
                />
                {errors.content?.display_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.content.display_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL) *
                </label>
                <input
                  {...register("slug")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="mosquee-creteil"
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contact@mosquee.fr"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description courte
                </label>
                <textarea
                  {...register("content.short_description")}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Une brève description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description complète
                </label>
                <textarea
                  {...register("content.description")}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description détaillée de la mosquée..."
                />
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Adresse</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse complète *
                </label>
                <input
                  {...register("metadata.address")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5 Rue Jean Gabin"
                />
                {errors.metadata?.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.metadata.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville *
                  </label>
                  <input
                    {...register("metadata.city")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Créteil"
                  />
                  {errors.metadata?.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.metadata.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal *
                  </label>
                  <input
                    {...register("metadata.postal_code")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="94000"
                  />
                  {errors.metadata?.postal_code && (
                    <p className="mt-1 text-sm text-red-600">{errors.metadata.postal_code.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Département
                </label>
                <input
                  {...register("metadata.department")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="94"
                />
              </div>
            </div>
          </div>

          {/* Configuration Mawaqit */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Horaires de prière (Mawaqit)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug Mawaqit
                </label>
                <input
                  {...register("configuration.mawaqit_slug")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="mosquee-sahaba-creteil"
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Services disponibles</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(FEATURE_LABELS).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={features.includes(key as any)}
                    onChange={() => toggleFeature(key)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Publication */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Publication</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  {...register("status")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                  <option value="archived">Archivé</option>
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("is_active")}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Mosquée active</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/admin/mosques"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              <span>{saving ? "Enregistrement..." : "Enregistrer"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

