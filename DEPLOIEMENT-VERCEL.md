# 🚀 Déploiement sur Vercel - Guide Complet

## 🎯 Problème Actuel

Le webhook Stripe appelle **Vercel (production)**, pas votre serveur local.

**Flux actuel** :
```
Paiement → Stripe → Webhook vers Vercel → ❌ Code ancien / Variables manquantes
```

**Solution** : Déployer le code actuel avec les bonnes variables.

---

## ✅ ÉTAPE 1 : Configurer les Variables Vercel (5 minutes)

### 1.1 Aller sur Vercel Dashboard

1. Allez sur : https://vercel.com/dashboard
2. Sélectionnez votre projet **NeenaV3** (ou le nom de votre projet)
3. Cliquez sur **Settings** (en haut)
4. Dans le menu de gauche, cliquez sur **Environment Variables**

---

### 1.2 Ajouter les Variables

Cliquez sur **"Add New"** pour chaque variable suivante :

#### **Variable 1 : STRIPE_SECRET_KEY**
```
Name: STRIPE_SECRET_KEY
Value: sk_live_51XXXXXXXXXX (votre clé Stripe LIVE - Secret Key)
Environment: ☑ Production (uniquement)
```
**Important** : Ne cochez QUE "Production", pas "Preview" ou "Development"

---

#### **Variable 2 : NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**
```
Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_live_51XXXXXXXXXX (votre clé Stripe LIVE - Publishable Key)
Environment: ☑ Production (uniquement)
```

---

#### **Variable 3 : STRIPE_WEBHOOK_SECRET**
```
Name: STRIPE_WEBHOOK_SECRET
Value: whsec_XXXXXXXXXX (votre Webhook Signing Secret)
Environment: ☑ Production (uniquement)
```

---

#### **Variable 4 : NEXT_PUBLIC_SUPABASE_URL**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://ucdbihrugbwubqdbzlzc.supabase.co
Environment: ☑ Production ☑ Preview ☑ Development
```
**Note** : Cette variable peut être utilisée partout

---

#### **Variable 5 : NEXT_PUBLIC_SUPABASE_ANON_KEY**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjZGJpaHJ1Z2J3dWJxZGJ6bHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MzczNDEsImV4cCI6MjA3NjIxMzM0MX0.43Q_fzkKqaQlcL_GNvoj7LeWi92atLtPdzUOIDJhaIk
Environment: ☑ Production ☑ Preview ☑ Development
```

---

#### **Variable 6 : SUPABASE_SERVICE_ROLE_KEY** ⚠️ **CRITIQUE**
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: [VOTRE CLÉ ICI - À OBTENIR]
Environment: ☑ Production (uniquement)
```

**⚠️ CETTE CLÉ EST OBLIGATOIRE** pour que le webhook fonctionne !

**Comment l'obtenir** :
1. https://supabase.com/dashboard
2. Votre projet > **Settings** > **API**
3. Scrollez jusqu'à **"service_role"**
4. Cliquez sur **"Reveal"**
5. Copiez la clé (commence par `eyJ...`)
6. Collez-la dans Vercel

---

### 1.3 Vérifier

Une fois toutes les variables ajoutées, vous devriez voir :

```
✅ STRIPE_SECRET_KEY (Production)
✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (Production)
✅ STRIPE_WEBHOOK_SECRET (Production)
✅ NEXT_PUBLIC_SUPABASE_URL (All)
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY (All)
✅ SUPABASE_SERVICE_ROLE_KEY (Production)
```

---

## ✅ ÉTAPE 2 : Créer les Mosquées dans Supabase (2 minutes)

### 2.1 Aller sur Supabase

1. https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Cliquez sur **SQL Editor** (menu de gauche)

### 2.2 Exécuter le SQL

Copiez et exécutez ce SQL :

```sql
-- Créer les mosquées avec les slugs corrects
INSERT INTO public.mosques (slug, name, email, is_active)
VALUES 
  ('Créteil', 'Mosquée Sahaba Créteil', 'creteil@neena.fr', true),
  ('Paris-11', 'Mosquée de Paris 11ème', 'paris11@neena.fr', true),
  ('Paris-19', 'Mosquée de Paris 19ème', 'paris19@neena.fr', true),
  ('Boulogne-Billancourt', 'Mosquée de Boulogne-Billancourt', 'boulogne@neena.fr', true),
  ('Nanterre', 'Mosquée de Nanterre', 'nanterre@neena.fr', true),
  ('Saint-Denis', 'Mosquée de Saint-Denis', 'saintdenis@neena.fr', true),
  ('Aubervilliers', 'Mosquée d''Aubervilliers', 'aubervilliers@neena.fr', true),
  ('Bobigny', 'Mosquée de Bobigny', 'bobigny@neena.fr', true),
  ('Montreuil', 'Mosquée de Montreuil', 'montreuil@neena.fr', true),
  ('Villejuif', 'Mosquée de Villejuif', 'villejuif@neena.fr', true)
ON CONFLICT (slug) DO NOTHING;
```

Cliquez sur **"Run"** (ou Ctrl+Enter)

### 2.3 Vérifier

Dans **Table Editor** > **mosques**, vous devriez voir 10 lignes.

---

## ✅ ÉTAPE 3 : Déployer sur Vercel (3 minutes)

### Option A : Via Git (Recommandé)

```bash
# 1. Ajouter tous les fichiers
git add .

# 2. Committer
git commit -m "feat: webhook Stripe + dashboard Supabase + configuration mosquées"

# 3. Pousser vers GitHub/GitLab
git push origin main
```

Vercel déploiera automatiquement en quelques minutes.

---

### Option B : Via Vercel CLI

```bash
# 1. Installer Vercel CLI (si pas déjà fait)
npm install -g vercel

# 2. Se connecter
vercel login

# 3. Déployer
vercel --prod
```

---

### Option C : Via Vercel Dashboard

1. Allez sur : https://vercel.com/dashboard
2. Votre projet > **Deployments**
3. Cliquez sur **"Redeploy"** sur le dernier déploiement
4. Cochez **"Use existing Build Cache"** → **Décochez** (pour forcer un rebuild)
5. Cliquez sur **"Redeploy"**

---

## ✅ ÉTAPE 4 : Vérifier le Déploiement (1 minute)

### 4.1 Attendre la fin du déploiement

Sur Vercel Dashboard, attendez que le statut passe à **"Ready"** (vert).

### 4.2 Vérifier l'URL du webhook

Testez manuellement l'URL :

```bash
curl https://neena-v3.vercel.app/api/webhooks/stripe
```

**Résultat attendu** :
```json
{"error":"Missing signature"}
```

✅ Si vous voyez ce message, l'API fonctionne !  
❌ Si vous voyez une erreur 404 ou 500, le déploiement a échoué.

---

## ✅ ÉTAPE 5 : Tester un Paiement Réel (5 minutes)

### 5.1 Effectuer un don

1. Allez sur : https://neena-v3.vercel.app/step-amount-v2
2. Sélectionnez **Créteil**
3. Montant : **5€**
4. Remplissez vos informations
5. Payez avec une **vraie carte** (clés LIVE configurées)
6. Attendez la confirmation

---

### 5.2 Vérifier Stripe

1. https://dashboard.stripe.com/webhooks
2. Votre webhook > **View logs**
3. Cherchez l'événement `payment_intent.succeeded` récent
4. Vérifiez le statut : **✅ 200 OK**

---

### 5.3 Vérifier Supabase

1. https://supabase.com/dashboard
2. **Table Editor** > **donations**
3. Vérifiez qu'une nouvelle ligne existe avec :
   - `mosque_id` : ID de Créteil
   - `amount_total` : 5
   - `status` : succeeded
   - `donor_email` : Votre email
   - Date récente

---

### 5.4 Vérifier le Dashboard

1. Connectez-vous : https://neena-v3.vercel.app/auth/login
2. Allez sur : https://neena-v3.vercel.app/mosque/Créteil/dashboard
3. Vérifiez que :
   - Le montant total a augmenté
   - La donation apparaît dans la liste
   - Les détails sont corrects

---

## 🐛 Dépannage

### Problème 1 : Webhook retourne 500

**Cause** : `SUPABASE_SERVICE_ROLE_KEY` manquant ou incorrect

**Solution** :
1. Vérifiez que la variable existe dans Vercel
2. Vérifiez qu'elle commence par `eyJ`
3. Redéployez après l'avoir ajoutée

---

### Problème 2 : Mosquée non trouvée

**Cause** : Les mosquées n'existent pas dans Supabase

**Solution** :
Exécutez le SQL de l'étape 2.2

---

### Problème 3 : Déploiement échoué

**Vérifications** :
1. Logs Vercel : https://vercel.com/dashboard > Deployments > Cliquez sur le déploiement
2. Vérifiez les erreurs de build
3. Si erreurs TypeScript/ESLint, résolvez-les avant de redéployer

---

## 📋 Checklist Complète

### Avant le déploiement

- [ ] 6 variables configurées dans Vercel
- [ ] `SUPABASE_SERVICE_ROLE_KEY` obtenu et ajouté
- [ ] Mosquées créées dans Supabase (SQL exécuté)
- [ ] Webhook Stripe actif et pointant vers Vercel

### Déploiement

- [ ] Code committé et poussé sur Git
- [ ] Vercel a déployé automatiquement
- [ ] Statut "Ready" sur Vercel Dashboard
- [ ] API webhook répond (curl test)

### Test

- [ ] Paiement effectué avec succès
- [ ] Webhook Stripe : 200 OK
- [ ] Donation dans Supabase
- [ ] Donation visible dans Dashboard

---

## 🎯 Résumé Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUX COMPLET                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Utilisateur fait un don                                  │
│     ↓                                                         │
│  2. Frontend (Vercel) → Stripe API                           │
│     ↓                                                         │
│  3. Stripe crée PaymentIntent avec metadata                  │
│     ↓                                                         │
│  4. Stripe envoie webhook → Vercel API                       │
│     ↓                                                         │
│  5. Vercel API vérifie signature                             │
│     ↓                                                         │
│  6. Vercel API cherche mosquée dans Supabase                 │
│     ↓                                                         │
│  7. Vercel API insère donation dans Supabase                 │
│     ↓                                                         │
│  8. Dashboard lit donations depuis Supabase                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Validation Finale

Une fois tout configuré et déployé :

```
✅ Variables Vercel configurées (6/6)
✅ Mosquées créées dans Supabase
✅ Code déployé sur Vercel
✅ Webhook Stripe actif
✅ Test de paiement réussi
✅ Donation enregistrée dans Supabase
✅ Dashboard affiche la donation
```

**Votre système de paiement est opérationnel ! 🎉**

---

## 🔗 Liens Rapides

- **Vercel Dashboard** : https://vercel.com/dashboard
- **Vercel Variables** : https://vercel.com/dashboard > Projet > Settings > Environment Variables
- **Stripe Webhooks** : https://dashboard.stripe.com/webhooks
- **Supabase Dashboard** : https://supabase.com/dashboard
- **Application** : https://neena-v3.vercel.app/

---

**Date** : 21 octobre 2025  
**Version** : 1.0

