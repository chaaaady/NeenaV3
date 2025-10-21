import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Vérifier si les variables d'environnement Supabase sont disponibles
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Si pas de configuration Supabase, laisser passer toutes les requêtes
    return res;
  }
  
  const supabase = createMiddlewareClient({ req, res });
  
  // Rafraîchir la session pour s'assurer d'avoir la dernière version
  // C'est crucial après une connexion
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protéger les routes admin et dashboard
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = req.nextUrl.pathname.includes("/dashboard");
  
  if (isAdminRoute || isDashboardRoute) {
    if (!session) {
      // Rediriger vers la page de connexion
      const redirectUrl = new URL("/auth/login", req.url);
      redirectUrl.searchParams.set("redirect", req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // IMPORTANT: Retourner la réponse qui contient les cookies mis à jour
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/mosque/:path*/dashboard/:path*"],
};

