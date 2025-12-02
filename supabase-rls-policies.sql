-- ============================================
-- NEENA CMS - ROW LEVEL SECURITY (RLS)
-- Politiques de sécurité pour mosquées et projets
-- ============================================

-- ============================================
-- 1. ACTIVATION DE RLS
-- ============================================

ALTER TABLE public.mosques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mosque_jumua_times ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. POLITIQUES POUR LA TABLE MOSQUES
-- ============================================

-- Lecture publique : Tout le monde peut voir les mosquées publiées
CREATE POLICY "Public can view published mosques"
ON public.mosques
FOR SELECT
USING (status = 'published' AND is_active = true);

-- Lecture admin : Les admins peuvent voir toutes les mosquées
CREATE POLICY "Admins can view all mosques"
ON public.mosques
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Création admin : Seuls les admins peuvent créer des mosquées
CREATE POLICY "Admins can insert mosques"
ON public.mosques
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Mise à jour admin : Seuls les admins peuvent modifier des mosquées
CREATE POLICY "Admins can update mosques"
ON public.mosques
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Suppression admin : Seuls les admins peuvent supprimer des mosquées
CREATE POLICY "Admins can delete mosques"
ON public.mosques
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- ============================================
-- 3. POLITIQUES POUR LA TABLE PROJECTS
-- ============================================

-- Lecture publique : Tout le monde peut voir les projets publiés
CREATE POLICY "Public can view published projects"
ON public.projects
FOR SELECT
USING (status = 'published');

-- Lecture admin : Les admins peuvent voir tous les projets
CREATE POLICY "Admins can view all projects"
ON public.projects
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Création admin : Seuls les admins peuvent créer des projets
CREATE POLICY "Admins can insert projects"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Mise à jour admin : Seuls les admins peuvent modifier des projets
CREATE POLICY "Admins can update projects"
ON public.projects
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Suppression admin : Seuls les admins peuvent supprimer des projets
CREATE POLICY "Admins can delete projects"
ON public.projects
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- ============================================
-- 4. POLITIQUES POUR MOSQUE_JUMUA_TIMES
-- ============================================

-- Lecture publique : Tout le monde peut voir les horaires Jumua des mosquées actives
CREATE POLICY "Public can view jumua times"
ON public.mosque_jumua_times
FOR SELECT
USING (
  is_active = true
  AND EXISTS (
    SELECT 1 FROM public.mosques
    WHERE mosques.id = mosque_jumua_times.mosque_id
    AND mosques.status = 'published'
    AND mosques.is_active = true
  )
);

-- Gestion admin : Les admins peuvent tout faire sur les horaires Jumua
CREATE POLICY "Admins can manage jumua times"
ON public.mosque_jumua_times
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- ============================================
-- 5. FONCTION HELPER POUR VÉRIFIER LE RÔLE ADMIN
-- ============================================

-- Fonction pour simplifier les vérifications de rôle
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. STORAGE BUCKETS (À EXÉCUTER DANS L'INTERFACE SUPABASE)
-- ============================================

-- Ces commandes doivent être exécutées via l'interface Supabase Storage ou via l'API
-- car les buckets ne sont pas gérés via SQL standard

-- Bucket pour les images de mosquées
-- Nom: mosques-images
-- Public: true
-- Allowed MIME types: image/jpeg, image/png, image/webp
-- Max file size: 5MB

-- Bucket pour les images de projets
-- Nom: projects-images
-- Public: true
-- Allowed MIME types: image/jpeg, image/png, image/webp
-- Max file size: 5MB

-- ============================================
-- 7. POLITIQUES STORAGE (RLS pour les buckets)
-- ============================================

-- Note: Ces politiques doivent être créées via l'interface Supabase Storage
-- ou via l'API Supabase Management

-- Pour mosques-images:
-- - SELECT (lecture): Public
-- - INSERT (upload): Authenticated + Admin role
-- - UPDATE: Authenticated + Admin role
-- - DELETE: Authenticated + Admin role

-- Pour projects-images:
-- - SELECT (lecture): Public
-- - INSERT (upload): Authenticated + Admin role
-- - UPDATE: Authenticated + Admin role
-- - DELETE: Authenticated + Admin role

-- ============================================
-- 8. INSTRUCTIONS POUR CRÉER LES BUCKETS
-- ============================================

-- Via l'interface Supabase:
-- 1. Aller dans Storage
-- 2. Créer un nouveau bucket "mosques-images"
--    - Public: true
--    - File size limit: 5242880 (5MB)
-- 3. Créer un nouveau bucket "projects-images"
--    - Public: true
--    - File size limit: 5242880 (5MB)
-- 4. Pour chaque bucket, ajouter les politiques:
--    - SELECT: true (public)
--    - INSERT: (bucket_id = 'mosques-images' AND auth.role() = 'authenticated' AND public.is_admin())
--    - UPDATE: (bucket_id = 'mosques-images' AND auth.role() = 'authenticated' AND public.is_admin())
--    - DELETE: (bucket_id = 'mosques-images' AND auth.role() = 'authenticated' AND public.is_admin())

-- ============================================
-- FIN DES POLITIQUES RLS
-- ============================================

