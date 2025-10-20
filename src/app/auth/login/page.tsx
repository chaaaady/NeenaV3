"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import { GlassCard } from "@/components/ds";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set theme-color for iPhone notch
  useEffect(() => {
    const themeColor = "#5a8bb5";
    let meta = document.querySelector('meta[name="theme-color"]');
    
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    
    const previousColor = meta.getAttribute("content");
    meta.setAttribute("content", themeColor);
    
    return () => {
      if (previousColor) {
        meta?.setAttribute("content", previousColor);
      } else {
        meta?.remove();
      }
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.session) {
        // Vérifier le rôle de l'utilisateur pour rediriger vers le bon dashboard
        const { data: mosqueData } = await supabaseClient
          .from("mosques")
          .select("slug")
          .eq("id", data.user.id)
          .single();

        if (mosqueData) {
          router.push(`/mosque/${mosqueData.slug}/dashboard`);
        } else {
          // Si pas de mosquée trouvée, c'est peut-être un admin
          router.push("/admin/dashboard");
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur de connexion";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100svh] w-full bg-gradient-to-b from-[#5a8bb5] via-[#6b9ec7] to-[#5a8bb5]">
      <div className="flex items-center justify-center min-h-[100svh] px-4">
        <div className="w-full max-w-md">
          <GlassCard className="border-white/20 bg-white/12 text-white">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-[28px] font-semibold">Connexion</h1>
                <p className="text-[14px] text-white/70">
                  Accédez à votre tableau de bord Neena
                </p>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[13px] font-medium text-white/80">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Mail size={18} className="text-white/60" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all"
                      placeholder="votre@email.fr"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-[13px] font-medium text-white/80">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Lock size={18} className="text-white/60" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/30">
                    <p className="text-[13px] text-red-100">{error}</p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-2xl bg-white hover:bg-white/90 text-[#5a8bb5] font-semibold text-[16px] shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Connexion..." : "Se connecter"}
                </button>
              </form>

              {/* Footer */}
              <div className="text-center">
                <p className="text-[12px] text-white/60">
                  Besoin d&apos;aide ? Contactez{" "}
                  <a href="mailto:support@neena.fr" className="text-white underline">
                    support@neena.fr
                  </a>
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

