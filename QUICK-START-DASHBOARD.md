# Guide de démarrage rapide - Dashboard Neena

## 🚀 Installation en 5 étapes

### Étape 1 : Exécuter les migrations Supabase (2 min)

1. Ouvrez [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor**
4. Copiez-collez tout le contenu du fichier `supabase-migrations.sql`
5. Cliquez sur **Run** (▶️)
6. Vérifiez que toutes les tables sont créées sans erreur

### Étape 2 : Récupérer la clé Service Role (1 min)

1. Dans Supabase, allez dans **Settings > API**
2. Copiez la clé **`service_role`** (section "Service role")
   - ⚠️ **Cette clé est secrète, ne jamais la partager ou la commiter**

### Étape 3 : Configurer les variables d'environnement (2 min)

Créez un fichier `.env.local` à la racine du projet :

```bash
# Stripe (déjà configuré)
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx  # À récupérer à l'étape 5

# Supabase (nouvelles variables)
NEXT_PUBLIC_SUPABASE_URL=https://ucdbihrugbwubqdbzlzc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjZGJpaHJ1Z2J3dWJxZGJ6bHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MzczNDEsImV4cCI6MjA3NjIxMzM0MX0.43Q_fzkKqaQlcL_GNvoj7LeWi92atLtPdzUOIDJhaIk
SUPABASE_SERVICE_ROLE_KEY=eyJxxx  # Clé copiée à l'étape 2
```

### Étape 4 : Créer le compte admin et une mosquée test (3 min)

**4.1 Créer la mosquée dans Supabase**

Dans **SQL Editor**, exécutez :

```sql
INSERT INTO public.mosques (slug, name, email, is_active)
VALUES 
  ('mosquee-sahaba-creteil', 'Mosquée Sahaba Créteil', 'creteil@neena.fr', true),
  ('admin-neena', 'Admin Neena', 'admin@neena.fr', true)
RETURNING *;
```

**4.2 Créer les comptes utilisateurs**

1. Dans Supabase, allez dans **Authentication > Users**
2. Cliquez sur **Add user** > **Create new user**

**Compte mosquée:**
- Email: `creteil@neena.fr`
- Password: `MotDePasseSecurise123!`
- Cochez ✅ **Auto Confirm User**

**Compte admin:**
- Email: `admin@neena.fr`
- Password: `AdminNeena2025!`
- Cochez ✅ **Auto Confirm User**
- Après création, cliquez sur l'utilisateur
- Dans **User Metadata**, ajoutez :
  ```json
  {
    "role": "admin"
  }
  ```

### Étape 5 : Configurer le webhook Stripe (3 min)

**En local (pour tester) :**

```bash
# Installer Stripe CLI (une seule fois)
brew install stripe/stripe-cli/stripe

# Se connecter à votre compte Stripe
stripe login

# Écouter les webhooks (terminal 1)
stripe listen --forward-to localhost:4000/api/webhooks/stripe

# Copier le webhook signing secret affiché (commence par whsec_)
# L'ajouter dans .env.local : STRIPE_WEBHOOK_SECRET=whsec_xxx

# Tester (terminal 2)
stripe trigger payment_intent.succeeded
```

**En production (Vercel) :**

1. Dans [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Cliquez sur **Add endpoint**
3. URL: `https://neena-v3.vercel.app/api/webhooks/stripe`
4. Événements: Sélectionnez `payment_intent.succeeded` et `payment_intent.payment_failed`
5. Copiez le **Signing secret**
6. Ajoutez-le dans **Vercel > Settings > Environment Variables**

## ✅ Test du système

### Test 1 : Connexion mosquée

1. Allez sur `http://localhost:4000/auth/login`
2. Connectez-vous avec `creteil@neena.fr` / `MotDePasseSecurise123!`
3. Vous devriez être redirigé vers `/mosque/mosquee-sahaba-creteil/dashboard`

### Test 2 : Connexion admin

1. Déconnectez-vous
2. Connectez-vous avec `admin@neena.fr` / `AdminNeena2025!`
3. Vous devriez être redirigé vers `/admin/dashboard`

### Test 3 : Créer un don test

1. Allez sur `http://localhost:4000/step-amount-v2`
2. Complétez le formulaire avec :
   - Montant: 50€
   - Mosquée: Créteil
   - Carte test: `4242 4242 4242 4242`
   - Date: `12/25`
   - CVC: `123`
3. Validez le paiement

### Test 4 : Vérifier dans le dashboard

1. Dans un terminal, vérifiez les logs du webhook :
   ```
   [Stripe Webhook] event-received: ...
   [Stripe Webhook] payment-succeeded: ...
   [Stripe Webhook] donation-recorded: ...
   ```

2. Rafraîchissez `/admin/dashboard` ou `/mosque/mosquee-sahaba-creteil/dashboard`
3. Votre don test devrait apparaître ! 🎉

## 📊 Vérification dans Supabase

```sql
-- Voir toutes les mosquées
SELECT * FROM public.mosques;

-- Voir toutes les donations
SELECT 
  d.amount_total,
  d.frequency,
  d.donor_email,
  m.name as mosque_name,
  d.created_at
FROM public.donations d
LEFT JOIN public.mosques m ON d.mosque_id = m.id
ORDER BY d.created_at DESC
LIMIT 10;

-- Statistiques globales
SELECT 
  m.name,
  COUNT(d.id) as total_donations,
  SUM(d.amount_total) as total_amount
FROM public.mosques m
LEFT JOIN public.donations d ON m.id = d.mosque_id
GROUP BY m.id, m.name
ORDER BY total_amount DESC;
```

## 🔐 Sécurité - Checklist

- ✅ RLS activé sur toutes les tables
- ✅ Policies créées pour admin et mosquées
- ✅ Service Role Key utilisée uniquement côté serveur
- ✅ Middleware protège `/admin` et `/dashboard`
- ✅ Webhook Stripe avec signature verification
- ⚠️ `.env.local` dans `.gitignore` (ne jamais commiter)

## 🐛 Résolution de problèmes

### Le webhook ne reçoit rien

```bash
# Vérifier que Stripe CLI écoute
stripe listen --forward-to localhost:4000/api/webhooks/stripe

# Tester manuellement
stripe trigger payment_intent.succeeded
```

### Erreur "Unauthorized" dans le dashboard

1. Vérifiez que vous êtes connecté : ouvrez la console navigateur
   ```js
   supabaseClient.auth.getSession()
   ```
2. Reconnectez-vous via `/auth/login`

### Les donations n'apparaissent pas

1. Vérifiez dans Supabase Table Editor : **donations**
2. Consultez les logs Vercel : `vercel logs --follow`
3. Vérifiez les logs du webhook Stripe

### Build error sur Vercel

Si vous avez l'erreur "supabaseUrl is required" :
- Vérifiez que **toutes** les variables d'environnement sont configurées dans Vercel
- Redéployez après avoir ajouté les variables

## 📝 Prochaines étapes

### Importer les donations historiques

Si vous avez déjà des donations dans Stripe :

```bash
# Exécuter le script d'import
npx ts-node src/scripts/import-stripe-history.ts
```

Ou via le dashboard admin (bouton à ajouter).

### Créer plus de mosquées

```sql
INSERT INTO public.mosques (slug, name, email, is_active)
VALUES ('mosquee-exemple', 'Mosquée Exemple', 'exemple@neena.fr', true);
```

Puis créer le compte utilisateur dans **Authentication > Users**.

### Personnaliser les dashboards

- Modifier les couleurs dans les fichiers de page
- Ajouter des graphiques supplémentaires
- Créer des exports PDF pour les reçus fiscaux

## 🎯 URLs importantes

- **Login** : `/auth/login`
- **Dashboard Admin** : `/admin/dashboard`
- **Dashboard Mosquée** : `/mosque/[slug]/dashboard`
- **Webhook Stripe** : `/api/webhooks/stripe`

## 💡 Conseils

1. **Testez toujours en local** avant de déployer
2. **Utilisez Stripe en mode test** jusqu'à être sûr que tout fonctionne
3. **Sauvegardez régulièrement** votre base Supabase
4. **Documentez les credentials** des mosquées dans un endroit sécurisé

