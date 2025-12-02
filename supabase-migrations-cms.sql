-- ============================================
-- NEENA CMS - MIGRATION SQL
-- Architecture flexible avec JSONB pour mosquées et projets
-- ============================================

-- ============================================
-- 1. EXTENSION DES TABLES EXISTANTES
-- ============================================

-- Modifier la table mosques existante pour ajouter les colonnes JSONB
ALTER TABLE public.mosques
  ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS configuration JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS assets JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Ajouter un trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_mosques_updated_at
    BEFORE UPDATE ON public.mosques
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Ajouter une contrainte pour le statut
ALTER TABLE public.mosques
  ADD CONSTRAINT mosques_status_check 
  CHECK (status IN ('draft', 'published', 'archived'));

-- Créer un index sur le statut pour les requêtes de filtrage
CREATE INDEX IF NOT EXISTS idx_mosques_status ON public.mosques(status);
CREATE INDEX IF NOT EXISTS idx_mosques_slug ON public.mosques(slug);

-- ============================================
-- 2. CRÉATION DE LA TABLE PROJECTS
-- ============================================

CREATE TABLE IF NOT EXISTS public.projects (
  -- Identifiants
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  
  -- Contenu flexible (JSONB)
  content JSONB DEFAULT '{}',
  -- Structure attendue:
  -- {
  --   "name": "Mosquée de Bobigny",
  --   "display_name": "Bobigny",
  --   "description": "Description longue...",
  --   "short_description": "Description courte...",
  --   "history": "Histoire du projet..."
  -- }
  
  metadata JSONB DEFAULT '{}',
  -- Structure attendue:
  -- {
  --   "city": "Bobigny",
  --   "department": "93",
  --   "address": "1 Rue...",
  --   "postal_code": "93000",
  --   "latitude": 48.9,
  --   "longitude": 2.4
  -- }
  
  financials JSONB DEFAULT '{}',
  -- Structure attendue:
  -- {
  --   "target_amount": 1000000,
  --   "current_amount": 250000,
  --   "currency": "EUR",
  --   "start_date": "2024-01-01",
  --   "end_date": "2025-12-31"
  -- }
  
  timeline JSONB DEFAULT '[]',
  -- Structure attendue:
  -- [
  --   {"phase": "Fondations", "status": "completed", "date": "2024-03-01"},
  --   {"phase": "Gros œuvre", "status": "in_progress", "date": "2024-06-01"}
  -- ]
  
  assets JSONB DEFAULT '{}',
  -- Structure attendue:
  -- {
  --   "hero_image": "projects/bobigny/hero.jpg",
  --   "gallery": ["projects/bobigny/1.jpg", "projects/bobigny/2.jpg"],
  --   "logo": "projects/bobigny/logo.png"
  -- }
  
  features JSONB DEFAULT '[]',
  -- Structure attendue: ["parking", "women_space", "disabled_access"]
  
  -- Statut
  status TEXT DEFAULT 'draft',
  
  -- Métadonnées système
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contrainte sur le statut
ALTER TABLE public.projects
  ADD CONSTRAINT projects_status_check 
  CHECK (status IN ('draft', 'published', 'archived'));

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);

-- Trigger pour updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. TABLE POUR LES HORAIRES JUMUA
-- ============================================

CREATE TABLE IF NOT EXISTS public.mosque_jumua_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mosque_id UUID REFERENCES public.mosques(id) ON DELETE CASCADE,
  khutba_time TIME NOT NULL,
  salat_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_jumua_mosque_id ON public.mosque_jumua_times(mosque_id);

-- Trigger pour updated_at
CREATE TRIGGER update_jumua_updated_at
    BEFORE UPDATE ON public.mosque_jumua_times
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. COMMENTAIRES SUR LES COLONNES
-- ============================================

COMMENT ON COLUMN public.mosques.content IS 'Contenu textuel: name, display_name, description, history, legal_info';
COMMENT ON COLUMN public.mosques.metadata IS 'Métadonnées: address, city, postal_code, department, latitude, longitude, phone, website';
COMMENT ON COLUMN public.mosques.configuration IS 'Configuration technique: mawaqit_slug, mawaqit_url, prayer_provider, stripe_account_id';
COMMENT ON COLUMN public.mosques.assets IS 'Ressources média: hero_images (array), logo_url, volunteer_image_url';
COMMENT ON COLUMN public.mosques.features IS 'Services disponibles: ["parking", "women_space", "disabled_access", "arabic_courses", "religion_courses"]';
COMMENT ON COLUMN public.mosques.status IS 'Statut de publication: draft, published, archived';

COMMENT ON COLUMN public.projects.content IS 'Contenu textuel du projet';
COMMENT ON COLUMN public.projects.metadata IS 'Métadonnées de localisation';
COMMENT ON COLUMN public.projects.financials IS 'Informations financières et objectifs';
COMMENT ON COLUMN public.projects.timeline IS 'Phases du projet et leur avancement';
COMMENT ON COLUMN public.projects.assets IS 'Images et médias du projet';
COMMENT ON COLUMN public.projects.features IS 'Caractéristiques prévues pour la mosquée';

-- ============================================
-- 5. DONNÉES D'EXEMPLE (OPTIONNEL)
-- ============================================

-- Exemple de structure pour une mosquée
-- INSERT INTO public.mosques (slug, name, email, content, metadata, configuration, assets, features, status) VALUES (
--   'mosquee-creteil',
--   'Mosquée de Créteil',
--   'creteil@neena.fr',
--   '{"name": "Mosquée de Créteil", "display_name": "Créteil", "description": "Description complète...", "short_description": "Mosquée située à Créteil", "volunteer_description": "Rejoignez notre équipe..."}'::jsonb,
--   '{"address": "5 Rue Jean Gabin, 94000 Créteil", "city": "Créteil", "postal_code": "94000", "department": "94", "latitude": 48.7833, "longitude": 2.4667, "phone": "+33 1 23 45 67 89", "website": "https://mosquee-creteil.fr"}'::jsonb,
--   '{"mawaqit_slug": "mosquee-sahaba-creteil", "prayer_provider": "mawaqit", "stripe_account_id": "acct_xxx"}'::jsonb,
--   '{"hero_images": ["/hero-creteil.png", "/hero-creteil-2.png"], "logo_url": "/logos/creteil.png", "volunteer_image_url": "/volunteer-creteil.jpg"}'::jsonb,
--   '["parking", "women_space", "disabled_access", "arabic_courses", "religion_courses"]'::jsonb,
--   'published'
-- );

-- ============================================
-- 6. VUES UTILES (OPTIONNEL)
-- ============================================

-- Vue pour les mosquées publiées avec données formatées
CREATE OR REPLACE VIEW public.mosques_published AS
SELECT 
  id,
  slug,
  name,
  email,
  content,
  metadata,
  configuration,
  assets,
  features,
  created_at,
  updated_at
FROM public.mosques
WHERE status = 'published' AND is_active = true;

-- Vue pour les projets publiés
CREATE OR REPLACE VIEW public.projects_published AS
SELECT 
  id,
  slug,
  content,
  metadata,
  financials,
  timeline,
  assets,
  features,
  created_at,
  updated_at
FROM public.projects
WHERE status = 'published';

-- ============================================
-- FIN DE LA MIGRATION
-- ============================================

