"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import type { MosqueData } from "@/types/mosque";

export default function AdminMosquesPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [mosques, setMosques] = useState<MosqueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadMosques();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/auth/login");
    }
  };

  const loadMosques = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("mosques")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMosques(data as MosqueData[]);
    } catch (error) {
      console.error("Error loading mosques:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (mosque: MosqueData) => {
    try {
      const newStatus = mosque.status === "published" ? "draft" : "published";
      const { error } = await supabase
        .from("mosques")
        .update({ status: newStatus })
        .eq("id", mosque.id);

      if (error) throw error;
      loadMosques();
    } catch (error) {
      console.error("Error toggling publish:", error);
      alert("Erreur lors de la modification du statut");
    }
  };

  const deleteMosque = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette mosquée ?")) return;

    try {
      const { error } = await supabase
        .from("mosques")
        .delete()
        .eq("id", id);

      if (error) throw error;
      loadMosques();
    } catch (error) {
      console.error("Error deleting mosque:", error);
      alert("Erreur lors de la suppression");
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mosquées</h1>
              <p className="mt-1 text-sm text-gray-600">
                Gérez les mosquées partenaires
              </p>
            </div>
            <Link
              href="/admin/mosques/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>Nouvelle mosquée</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Total</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{mosques.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Publiées</div>
            <div className="mt-2 text-3xl font-bold text-emerald-600">
              {mosques.filter(m => m.status === "published").length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Brouillons</div>
            <div className="mt-2 text-3xl font-bold text-gray-600">
              {mosques.filter(m => m.status === "draft").length}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mosquée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ville
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de création
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mosques.map((mosque) => (
                <tr key={mosque.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {mosque.content.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {mosque.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{mosque.metadata.city}</div>
                    <div className="text-sm text-gray-500">{mosque.metadata.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      mosque.status === "published" 
                        ? "bg-emerald-100 text-emerald-800"
                        : mosque.status === "draft"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {mosque.status === "published" ? "Publiée" : 
                       mosque.status === "draft" ? "Brouillon" : "Archivée"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(mosque.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => togglePublish(mosque)}
                        className="text-gray-600 hover:text-gray-900"
                        title={mosque.status === "published" ? "Dépublier" : "Publier"}
                      >
                        {mosque.status === "published" ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <Link
                        href={`/admin/mosques/${mosque.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Éditer"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => deleteMosque(mosque.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {mosques.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune mosquée pour le moment</p>
              <Link
                href="/admin/mosques/new"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                <span>Créer la première mosquée</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

