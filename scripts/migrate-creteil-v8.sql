-- ============================================
-- MIGRATION DES DONNÉES DE CRÉTEIL V8
-- Script pour insérer la mosquée de Créteil depuis la page v8
-- ============================================

-- Insérer la mosquée de Créteil
INSERT INTO public.mosques (
  slug,
  name,
  email,
  content,
  metadata,
  configuration,
  assets,
  features,
  status,
  is_active
) VALUES (
  'mosquee-creteil',
  'Mosquée de Créteil',
  'creteil@neena.fr',
  
  -- Content (JSONB)
  '{
    "name": "Mosquée de Créteil",
    "display_name": "Créteil",
    "description": "La Mosquée de Créteil est un lieu de culte et de rassemblement pour la communauté musulmane de Créteil et ses environs. Nous proposons des services religieux, des cours d''arabe et de religion, ainsi que des activités communautaires.",
    "short_description": "Mosquée située à Créteil, Val-de-Marne",
    "volunteer_description": "Rejoignez l''équipe pour soutenir l''organisation des prières, Jumu''a et événements.",
    "history": "Fondée il y a plusieurs années, la Mosquée de Créteil sert la communauté musulmane locale avec dévouement."
  }'::jsonb,
  
  -- Metadata (JSONB)
  '{
    "address": "5 Rue Jean Gabin, 94000 Créteil",
    "city": "Créteil",
    "postal_code": "94000",
    "department": "94",
    "latitude": 48.7833,
    "longitude": 2.4667,
    "phone": "",
    "website": ""
  }'::jsonb,
  
  -- Configuration (JSONB)
  '{
    "mawaqit_slug": "mosquee-sahaba-creteil",
    "mawaqit_url": "",
    "prayer_provider": "mawaqit",
    "stripe_account_id": ""
  }'::jsonb,
  
  -- Assets (JSONB)
  '{
    "hero_images": ["/hero-creteil.png", "/hero-creteil-2.png"],
    "logo_url": "",
    "volunteer_image_url": ""
  }'::jsonb,
  
  -- Features (JSONB Array)
  '["parking", "women_space", "disabled_access", "arabic_courses", "religion_courses"]'::jsonb,
  
  -- Status
  'published',
  
  -- Is Active
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  content = EXCLUDED.content,
  metadata = EXCLUDED.metadata,
  configuration = EXCLUDED.configuration,
  assets = EXCLUDED.assets,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Récupérer l'ID de la mosquée de Créteil pour les horaires Jumua
DO $$
DECLARE
  mosque_id_var UUID;
BEGIN
  SELECT id INTO mosque_id_var FROM public.mosques WHERE slug = 'mosquee-creteil';
  
  -- Insérer les horaires Jumua (exemple)
  INSERT INTO public.mosque_jumua_times (
    mosque_id,
    khutba_time,
    salat_time,
    is_active
  ) VALUES (
    mosque_id_var,
    '13:30:00',
    '14:00:00',
    true
  )
  ON CONFLICT (mosque_id) DO UPDATE SET
    khutba_time = EXCLUDED.khutba_time,
    salat_time = EXCLUDED.salat_time,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();
END $$;

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Afficher la mosquée créée
SELECT 
  id,
  slug,
  name,
  status,
  created_at
FROM public.mosques
WHERE slug = 'mosquee-creteil';

-- Afficher les horaires Jumua
SELECT 
  jt.id,
  m.name as mosque_name,
  jt.khutba_time,
  jt.salat_time,
  jt.is_active
FROM public.mosque_jumua_times jt
JOIN public.mosques m ON m.id = jt.mosque_id
WHERE m.slug = 'mosquee-creteil';

-- ============================================
-- FIN DE LA MIGRATION
-- ============================================

