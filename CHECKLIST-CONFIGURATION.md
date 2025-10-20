# ✅ Checklist de configuration Dashboard

Suivez ces étapes dans l'ordre pour activer le système de dashboard.

## 📝 Prérequis

- [ ] Compte Supabase actif avec le projet configuré
- [ ] Compte Stripe actif avec clés API
- [ ] Stripe CLI installé (optionnel pour tests locaux)

---

## 1️⃣ Configuration Supabase (5 minutes)

### A. Exécuter les migrations SQL

- [ ] Ouvrir https://supabase.com/dashboard
- [ ] Sélectionner votre projet Neena
- [ ] Aller dans **SQL Editor** (panneau de gauche)
- [ ] Créer un nouveau snippet ou coller directement
- [ ] Copier **TOUT** le contenu du fichier `supabase-migrations.sql`
- [ ] Coller dans l'éditeur SQL
- [ ] Cliquer sur **Run** (ou Ctrl+Enter)
- [ ] ✅ Vérifier qu'il n'y a pas d'erreur (bannière verte "Success")

### B. Récupérer la clé Service Role

- [ ] Aller dans **Settings > API**
- [ ] Scroller jusqu'à la section **Service role**
- [ ] Cliquer sur **Reveal** à côté de "service_role"
- [ ] Copier la clé (commence par `eyJ...`)
- [ ] ⚠️ **NE PAS PARTAGER cette clé** - elle donne un accès complet à votre base

### C. Vérifier que les tables sont créées

Dans **Table Editor**, vous devriez voir :
- [ ] Table `mosques` ✓
- [ ] Table `donations` ✓
- [ ] Table `qr_codes` ✓
- [ ] Table `qr_scans` ✓

---

## 2️⃣ Variables d'environnement (3 minutes)

### Créer le fichier `.env.local`

À la racine du projet, créez `.env.local` avec :

```bash
# ===== STRIPE =====
STRIPE_SECRET_KEY=sk_test_xxx  # Déjà configuré
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx  # Déjà configuré
STRIPE_WEBHOOK_SECRET=whsec_xxx  # À ajouter après l'étape 4

# ===== SUPABASE =====
NEXT_PUBLIC_SUPABASE_URL=https://ucdbihrugbwubqdbzlzc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjZGJpaHJ1Z2J3dWJxZGJ6bHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MzczNDEsImV4cCI6MjA3NjIxMzM0MX0.43Q_fzkKqaQlcL_GNvoj7LeWi92atLtPdzUOIDJhaIk
SUPABASE_SERVICE_ROLE_KEY=eyJxxx  # Clé copiée à l'étape 1.B
```

**Checklist:**
- [ ] Fichier `.env.local` créé à la racine
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ajoutée
- [ ] Vérifier que `.env.local` est dans `.gitignore` ✅

---

## 3️⃣ Créer les comptes utilisateurs (5 minutes)

### A. Créer la mosquée de Créteil

Dans **SQL Editor**, exécutez :

```sql
INSERT INTO public.mosques (slug, name, email, is_active)
VALUES ('mosquee-sahaba-creteil', 'Mosquée Sahaba Créteil', 'creteil@neena.fr', true)
RETURNING *;
```

- [ ] Mosquée créée ✓
- [ ] Notez l'`id` retourné (un UUID)

### B. Créer le compte utilisateur mosquée

- [ ] Aller dans **Authentication > Users**
- [ ] Cliquer sur **Add user** > **Create new user**
- [ ] Email: `creteil@neena.fr` (⚠️ **exactement le même** que dans la table mosques)
- [ ] Password: Générez un mot de passe fort (ex: `MosqueeCreteil2025!`)
- [ ] ✅ Cocher **Auto Confirm User**
- [ ] Cliquer sur **Create user**
- [ ] 📝 **Noter le mot de passe** pour le donner à la mosquée

### C. Créer le compte admin Neena

**Option 1 : Compte admin dédié (recommandé)**

```sql
INSERT INTO public.mosques (slug, name, email, is_active)
VALUES ('admin-neena', 'Admin Neena', 'admin@neena.fr', true)
RETURNING *;
```

Puis créer l'utilisateur :
- [ ] Email: `admin@neena.fr`
- [ ] Password: Générez un mot de passe très fort
- [ ] ✅ Auto Confirm User
- [ ] Après création, cliquer sur l'utilisateur
- [ ] Dans **Raw user meta data**, cliquer sur **Edit**
- [ ] Remplacer par :
  ```json
  {
    "role": "admin"
  }
  ```
- [ ] Sauvegarder

**Option 2 : Utiliser votre compte personnel**

Ajoutez simplement `"role": "admin"` dans vos métadonnées utilisateur.

---

## 4️⃣ Configuration Stripe Webhook (5 minutes)

### En LOCAL (pour développement)

```bash
# Terminal 1 : Installer Stripe CLI (une seule fois)
brew install stripe/stripe-cli/stripe

# Se connecter
stripe login
# → Suivre les instructions, se connecter dans le navigateur

# Démarrer l'écoute
stripe listen --forward-to localhost:4000/api/webhooks/stripe
# → Copier le "webhook signing secret" (whsec_xxx)
```

- [ ] Stripe CLI installé
- [ ] Authentifié avec `stripe login`
- [ ] Webhook secret copié dans `.env.local` comme `STRIPE_WEBHOOK_SECRET`

### En PRODUCTION (Vercel)

- [ ] Aller sur https://dashboard.stripe.com/webhooks
- [ ] Cliquer **Add endpoint**
- [ ] URL: `https://neena-v3.vercel.app/api/webhooks/stripe`
- [ ] Événements à sélectionner:
  - [ ] `payment_intent.succeeded` ✓
  - [ ] `payment_intent.payment_failed` ✓
- [ ] Cliquer **Add endpoint**
- [ ] Copier le **Signing secret**
- [ ] Ajouter dans **Vercel > Settings > Environment Variables**:
  - `STRIPE_WEBHOOK_SECRET` = `whsec_xxx`
  - `SUPABASE_SERVICE_ROLE_KEY` = votre clé service

---

## 5️⃣ Test complet (10 minutes)

### Test 1 : Build et démarrage

```bash
npm run build
# ✅ Doit passer sans erreur (32 pages)

npm run dev -- -p 4000
# ✅ Serveur démarre sur http://localhost:4000
```

- [ ] Build réussi ✓
- [ ] Serveur local lancé ✓

### Test 2 : Connexion

- [ ] Ouvrir http://localhost:4000/auth/login
- [ ] Se connecter avec `creteil@neena.fr` / `VotreMotDePasse`
- [ ] ✅ Redirection vers `/mosque/mosquee-sahaba-creteil/dashboard`
- [ ] Le dashboard s'affiche (peut être vide au début)

### Test 3 : Webhook Stripe

**Terminal 1 : Stripe CLI**
```bash
stripe listen --forward-to localhost:4000/api/webhooks/stripe
```

**Terminal 2 : Test**
```bash
stripe trigger payment_intent.succeeded
```

- [ ] Webhook reçu dans Terminal 1
- [ ] Logs affichés dans Terminal 2 (serveur Next.js)
- [ ] Aucune erreur

### Test 4 : Don complet

- [ ] Ouvrir http://localhost:4000/step-amount-v2
- [ ] Montant: 25€
- [ ] Remplir les infos (email, nom, etc.)
- [ ] Carte test: `4242 4242 4242 4242`
- [ ] Date: `12/30`, CVC: `123`
- [ ] Valider le paiement
- [ ] ✅ Redirection vers `/merci`

### Test 5 : Vérification dashboard

- [ ] Retourner sur `/mosque/mosquee-sahaba-creteil/dashboard`
- [ ] Rafraîchir la page
- [ ] ✅ Le don de 25€ apparaît dans le tableau !
- [ ] ✅ Les stats sont à jour (Total collecté, Ce mois, etc.)

### Test 6 : Dashboard admin

- [ ] Se déconnecter
- [ ] Se connecter avec `admin@neena.fr`
- [ ] Aller sur `/admin/dashboard`
- [ ] ✅ Voir toutes les mosquées
- [ ] ✅ Voir tous les dons
- [ ] ✅ Graphique d'évolution

---

## 6️⃣ Déploiement Vercel (5 minutes)

### Ajouter les variables d'environnement

Dans **Vercel Dashboard > votre-projet > Settings > Environment Variables** :

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ⚠️
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Redéployer

```bash
git push origin main
# Ou dans Vercel : Deployments > Redeploy
```

- [ ] Variables ajoutées dans Vercel ✓
- [ ] Déploiement réussi ✓
- [ ] Webhook Stripe configuré avec l'URL production ✓

---

## ✅ Validation finale

Après avoir complété toutes les étapes :

- [ ] ✅ SQL migrations exécutées dans Supabase
- [ ] ✅ Tables créées et RLS activé
- [ ] ✅ Service Role Key récupérée et configurée
- [ ] ✅ Compte mosquée créé (creteil@neena.fr)
- [ ] ✅ Compte admin créé avec metadata role=admin
- [ ] ✅ Stripe webhook configuré (local ET production)
- [ ] ✅ Don test réalisé et visible dans dashboard
- [ ] ✅ Déployé sur Vercel avec toutes les variables
- [ ] ✅ Webhook production configuré dans Stripe

---

## 🎯 Résultat attendu

Vous devez pouvoir :
1. ✅ Vous connecter sur `/auth/login`
2. ✅ Voir le dashboard admin sur `/admin/dashboard`
3. ✅ Voir le dashboard mosquée sur `/mosque/mosquee-sahaba-creteil/dashboard`
4. ✅ Faire un don et le voir apparaître instantanément dans les dashboards
5. ✅ Exporter les données en CSV
6. ✅ Voir les graphiques d'évolution

---

## 🆘 Aide

Si vous rencontrez un problème :
1. Consultez la section "Résolution de problèmes" dans `DASHBOARD-SETUP.md`
2. Vérifiez les logs Vercel : `vercel logs --follow`
3. Vérifiez les logs Stripe webhook : Dashboard > Webhooks > Endpoint
4. Contactez le développeur avec les logs d'erreur

---

## 📞 Support

- **Email** : support@neena.fr
- **Documentation** : DASHBOARD-SETUP.md
- **Guide rapide** : QUICK-START-DASHBOARD.md

