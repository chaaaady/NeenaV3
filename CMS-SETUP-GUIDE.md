# Guide de Configuration du CMS Neena

Ce guide explique comment configurer et utiliser le nouveau système CMS pour gérer les mosquées et projets de construction.

## 📋 Prérequis

- Compte Supabase configuré
- Variables d'environnement configurées dans `.env.local`
- Accès admin à la base de données Supabase

## 🚀 Installation

### Étape 1 : Migrations SQL

Exécutez les scripts SQL dans l'ordre suivant via le SQL Editor de Supabase :

1. **Schema de base** (si pas déjà fait) :
   ```bash
   # Exécuter supabase-migrations.sql
   ```

2. **Extensions CMS** :
   ```bash
   # Exécuter supabase-migrations-cms.sql
   ```

3. **Politiques de sécurité** :
   ```bash
   # Exécuter supabase-rls-policies.sql
   ```

4. **Migration des données Créteil** :
   ```bash
   # Exécuter scripts/migrate-creteil-v8.sql
   ```

### Étape 2 : Configuration Storage

1. Aller dans **Storage** dans Supabase
2. Créer deux buckets publics :
   - `mosques-images` (5MB max, images uniquement)
   - `projects-images` (5MB max, images uniquement)

3. Pour chaque bucket, configurer les politiques :
   - **SELECT** : Public (tout le monde peut lire)
   - **INSERT/UPDATE/DELETE** : Admin uniquement

### Étape 3 : Créer un utilisateur admin

1. Aller dans **Authentication** > **Users**
2. Créer un nouvel utilisateur
3. Dans **User Metadata**, ajouter :
   ```json
   {
     "role": "admin"
   }
   ```

## 📖 Utilisation

### Accéder au Dashboard Admin

1. Se connecter sur `/auth/login`
2. Accéder à `/admin/mosques` pour gérer les mosquées
3. Accéder à `/admin/projects` pour gérer les projets (à venir)

### Créer une nouvelle mosquée

1. Aller sur `/admin/mosques`
2. Cliquer sur "Nouvelle mosquée"
3. Remplir le formulaire :
   - **Informations de base** : Nom, slug, email
   - **Adresse** : Adresse complète, ville, code postal
   - **Configuration Mawaqit** : Slug Mawaqit pour les horaires
   - **Services** : Cocher les services disponibles
   - **Publication** : Choisir le statut (brouillon/publié)
4. Cliquer sur "Enregistrer"

### Accéder à une mosquée

Une fois publiée, la mosquée est accessible sur :
```
https://votre-domaine.com/mosquee/[slug]
```

Exemple : `/mosquee/mosquee-creteil`

## 🏗️ Architecture

### Structure des données

Les mosquées utilisent une structure JSONB flexible :

```typescript
{
  slug: "mosquee-creteil",
  name: "Mosquée de Créteil",
  email: "contact@mosquee.fr",
  content: {
    name: "Mosquée de Créteil",
    display_name: "Créteil",
    description: "...",
    short_description: "...",
  },
  metadata: {
    address: "...",
    city: "...",
    postal_code: "...",
  },
  configuration: {
    mawaqit_slug: "...",
    prayer_provider: "mawaqit",
  },
  assets: {
    hero_images: ["image1.jpg", "image2.jpg"],
  },
  features: ["parking", "women_space"],
  status: "published",
}
```

### Routes dynamiques

- **Mosquées** : `/mosquee/[slug]` → Utilise `MosqueTemplate`
- **Projets** : `/constructions/[slug]` → Utilise `ProjectTemplate`

### ISR (Incremental Static Regeneration)

Les pages sont générées statiquement au build et se régénèrent toutes les 60 secondes :

```typescript
export const revalidate = 60;
```

## 🔒 Sécurité

### Row Level Security (RLS)

- **Lecture publique** : Tout le monde peut voir les mosquées/projets publiés
- **Écriture admin** : Seuls les utilisateurs avec `role: "admin"` peuvent créer/modifier
- **Isolation** : Chaque mosquée ne voit que ses propres données (donations, etc.)

### Vérification du rôle admin

```typescript
const isAdmin = user?.user_metadata?.role === 'admin';
```

## 📝 Checklist de déploiement

- [ ] Migrations SQL exécutées
- [ ] Buckets Storage créés et configurés
- [ ] Utilisateur admin créé
- [ ] Mosquée de Créteil migrée et testée
- [ ] Route `/mosquee/mosquee-creteil` accessible
- [ ] Dashboard admin accessible
- [ ] Création d'une nouvelle mosquée testée
- [ ] Publication/dépublication testée

## 🐛 Dépannage

### La mosquée n'apparaît pas

1. Vérifier que `status = 'published'`
2. Vérifier que `is_active = true`
3. Vérifier les politiques RLS dans Supabase

### Erreur "Not authorized"

1. Vérifier que l'utilisateur est connecté
2. Vérifier que `user_metadata.role = 'admin'`
3. Vérifier les politiques RLS

### Images ne s'affichent pas

1. Vérifier que les buckets Storage sont publics
2. Vérifier les URLs des images dans `assets.hero_images`
3. Vérifier les politiques Storage (SELECT public)

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Next.js ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Zod Validation](https://zod.dev/)

## 🔄 Prochaines étapes

1. Ajouter l'upload d'images dans le formulaire
2. Créer le dashboard pour les projets de construction
3. Ajouter la gestion des horaires Jumua dans le formulaire
4. Implémenter la prévisualisation avant publication
5. Ajouter l'export/import de mosquées

---

**Dernière mise à jour** : 2 décembre 2025

