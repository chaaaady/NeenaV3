# Configuration du Dashboard Neena

Ce guide vous aidera à configurer le système de dashboard backend avec Supabase et Stripe webhooks.

## 📋 Prérequis

- Compte Supabase actif
- Compte Stripe actif
- Node.js et npm installés
- Application Next.js déployée

## 🗄️ Configuration Supabase

### Étape 1 : Exécuter les migrations SQL

1. Connectez-vous à votre dashboard Supabase
2. Allez dans **SQL Editor**
3. Copiez et exécutez le contenu du fichier `supabase-migrations.sql`
4. Vérifiez que toutes les tables sont créées : `mosques`, `donations`, `qr_codes`, `qr_scans`

### Étape 2 : Récupérer les clés API

1. Allez dans **Settings > API**
2. Copiez :
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **Secret - Ne jamais exposer côté client!**

## 💳 Configuration Stripe

### Étape 1 : Créer un webhook

1. Allez dans **Stripe Dashboard > Developers > Webhooks**
2. Cliquez sur **Add endpoint**
3. URL de l'endpoint :
   - **Production** : `https://votre-domaine.vercel.app/api/webhooks/stripe`
   - **Local** : Utilisez Stripe CLI (voir ci-dessous)
4. Sélectionnez les événements :
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copiez le **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### Étape 2 : Tester localement avec Stripe CLI

```bash
# Installer Stripe CLI
brew install stripe/stripe-cli/stripe

# Se connecter
stripe login

# Écouter les webhooks
stripe listen --forward-to localhost:4000/api/webhooks/stripe

# Dans un autre terminal, tester
stripe trigger payment_intent.succeeded
```

## 🔐 Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ucdbihrugbwubqdbzlzc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # ⚠️ Secret!
```

## 👥 Créer les comptes mosquées

### Méthode 1 : Via Supabase Dashboard (Recommandé)

1. **Insérer la mosquée** dans la table `mosques` :

```sql
INSERT INTO public.mosques (slug, name, email, is_active)
VALUES ('mosquee-sahaba-creteil', 'Mosquée Sahaba Créteil', 'creteil@neena.fr', true);
```

2. **Créer l'utilisateur** dans **Authentication > Users** :
   - Email : `creteil@neena.fr` (même email que dans `mosques`)
   - Password : Générer un mot de passe sécurisé
   - Cocher "Auto confirm user"

3. L'utilisateur sera automatiquement lié à la mosquée via le trigger `on_auth_user_created`

### Méthode 2 : Créer un compte admin

Pour créer un compte admin Neena :

1. Créer l'utilisateur dans **Authentication > Users**
2. Dans la table **auth.users**, ajouter un champ `user_metadata` :

```json
{
  "role": "admin"
}
```

## 🚀 Déploiement sur Vercel

### Étape 1 : Ajouter les variables d'environnement

Dans **Vercel Dashboard > Settings > Environment Variables**, ajoutez :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Étape 2 : Redéployer

```bash
git push origin main
```

### Étape 3 : Configurer le webhook Stripe en production

1. Retournez dans **Stripe Dashboard > Webhooks**
2. Mettez à jour l'URL avec votre domaine Vercel
3. Testez avec un vrai paiement

## 📊 Accès aux dashboards

### Dashboard Admin (Neena)
- URL : `https://votre-domaine.vercel.app/admin/dashboard`
- Connexion : Compte avec `role: admin` dans les métadonnées

### Dashboard Mosquée
- URL : `https://votre-domaine.vercel.app/mosque/[slug]/dashboard`
- Exemple : `https://votre-domaine.vercel.app/mosque/mosquee-sahaba-creteil/dashboard`
- Connexion : Compte lié à une mosquée

## 🧪 Tester le système

### 1. Créer un don test

1. Allez sur votre formulaire de don
2. Utilisez une carte de test Stripe : `4242 4242 4242 4242`
3. Complétez le paiement

### 2. Vérifier le webhook

1. Consultez les logs Stripe : **Developers > Webhooks > Votre endpoint > Events**
2. Vérifiez que l'événement `payment_intent.succeeded` a été reçu avec succès (200 OK)

### 3. Vérifier dans Supabase

```sql
SELECT * FROM public.donations ORDER BY created_at DESC LIMIT 10;
```

Vous devriez voir votre don test dans la table.

### 4. Accéder au dashboard

Connectez-vous avec les credentials de la mosquée et vérifiez que le don apparaît.

## 🔧 Import des données historiques

Si vous avez déjà des donations dans Stripe, vous pouvez les importer :

```bash
# TODO: Script d'import à créer
npm run import-stripe-history
```

## 🐛 Dépannage

### Le webhook ne reçoit pas les événements

1. Vérifiez l'URL du webhook dans Stripe
2. Consultez les logs Vercel : `vercel logs`
3. Testez localement avec Stripe CLI

### Les donations n'apparaissent pas dans le dashboard

1. Vérifiez que la mosquée existe dans Supabase avec le bon `slug`
2. Vérifiez les logs du webhook : `console.log` dans `/api/webhooks/stripe/route.ts`
3. Vérifiez que les RLS policies sont correctes

### Erreur d'authentification

1. Vérifiez que les variables `NEXT_PUBLIC_SUPABASE_*` sont bien configurées
2. Vérifiez que le middleware est actif : `src/middleware.ts`
3. Testez en mode incognito pour éviter les problèmes de cache

## 📝 Notes de sécurité

- ✅ RLS (Row Level Security) est activé sur toutes les tables
- ✅ Service Role Key utilisée uniquement côté serveur
- ✅ Anon Key utilisée côté client avec protection RLS
- ✅ Middleware protège les routes sensibles
- ⚠️ Ne jamais commiter les fichiers `.env.local`
- ⚠️ Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` côté client

## 🎨 Personnalisation

### Changer les couleurs du dashboard

- **Admin** : Modifier le gradient dans `/admin/dashboard/page.tsx`
  ```tsx
  from-[#5a8bb5] via-[#6b9ec7] to-[#5a8bb5]
  ```

- **Mosquée** : Modifier le gradient dans `/mosque/[slug]/dashboard/page.tsx`
  ```tsx
  from-[#0a5c4a] via-[#2a7557] to-[#0a5c4a]
  ```

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Documentation Next.js](https://nextjs.org/docs)

