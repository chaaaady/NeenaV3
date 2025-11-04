# 🔍 AUDIT COMPLET - Test de Paiement Réel

**Date**: 21 octobre 2025  
**Flux testé**: Stripe → Webhook → Supabase → Dashboard

---

## ✅ RÉSULTATS DE L'AUDIT

### 1️⃣ Configuration .env.local

| Variable | Statut | Valeur |
|----------|--------|--------|
| `STRIPE_SECRET_KEY` | ✅ Configuré | `sk_live_51Ohvz...` (PRODUCTION) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ Configuré | `pk_live_51Ohvz...` (PRODUCTION) |
| `STRIPE_WEBHOOK_SECRET` | ✅ Configuré | `whsec_YOiCB...` (LIVE) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Configuré | `https://ucdbihrugbwubqdbzlzc.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Configuré | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ **À CONFIGURER** | Placeholder détecté |

**⚠️ ACTION REQUISE**: Le `SUPABASE_SERVICE_ROLE_KEY` doit être configuré pour que le webhook puisse écrire dans Supabase.

---

### 2️⃣ Code Webhook Stripe

**Fichier**: `src/app/api/webhooks/stripe/route.ts`

| Aspect | Statut | Détails |
|--------|--------|---------|
| Vérification signature | ✅ OK | Ligne 44-48 : `stripe.webhooks.constructEvent()` |
| Gestion `payment_intent.succeeded` | ✅ OK | Ligne 58 : Événement correctement géré |
| Recherche mosquée par slug | ✅ OK | Ligne 76-80 : Requête `.eq("slug", metadata.mosque)` |
| Insertion donation | ✅ OK | Ligne 100-122 : Toutes les métadonnées mappées |
| Gestion duplications | ✅ OK | Ligne 126 : Code erreur `23505` détecté |
| Logs détaillés | ✅ OK | `console.warn` et `console.error` |

**✅ CONCLUSION**: Le webhook est correctement implémenté.

---

### 3️⃣ Configuration Mosquées

**Fichier**: `src/lib/mosques.ts`

**Mosquées configurées**:
1. `Créteil` - Mosquée Sahaba Créteil
2. `Paris-11` - Mosquée de Paris 11ème
3. `Paris-19` - Mosquée de Paris 19ème
4. `Boulogne-Billancourt` - Mosquée de Boulogne-Billancourt
5. `Nanterre` - Mosquée de Nanterre
6. `Saint-Denis` - Mosquée de Saint-Denis
7. `Aubervilliers` - Mosquée d'Aubervilliers
8. `Bobigny` - Mosquée de Bobigny
9. `Montreuil` - Mosquée de Montreuil
10. `Villejuif` - Mosquée de Villejuif

**✅ CONCLUSION**: 10 mosquées configurées avec slugs cohérents.

**⚠️ IMPORTANT**: Les slugs dans `mosques.ts` doivent correspondre **EXACTEMENT** aux slugs dans la table Supabase `mosques`.

---

### 4️⃣ Création PaymentIntent et Métadonnées

**Flux complet**:

1. **Frontend** (`step-payment-ds/page.tsx`, ligne 202):
   ```typescript
   metadata: {
     mosque: mosqueName,  // ✅ Slug de la mosquée
     frequency,
     donationType,
     // ... autres métadonnées
   }
   ```

2. **Modal sélection** (`MosqueSelectorModal.tsx`, ligne 72):
   ```typescript
   onMosqueSelect(mosque.slug);  // ✅ Envoie le slug, pas le nom
   ```

3. **API create-intent** (`api/payments/create-intent/route.ts`, ligne 55):
   ```typescript
   metadata: metadata ?? {},  // ✅ Métadonnées transmises à Stripe
   ```

**✅ CONCLUSION**: Le slug est correctement transmis de bout en bout.

---

### 5️⃣ Dashboards

**Fichier**: `src/app/mosque/[slug]/dashboard/page.tsx`

| Aspect | Statut | Détails |
|--------|--------|---------|
| Authentification | ✅ OK | Ligne 54 : Vérification session |
| Recherche mosquée | ✅ OK | Ligne 64 : `.eq("slug", slug)` |
| Récupération donations | ✅ OK | Ligne 74 : `.eq("mosque_id", mosqueData.id)` |
| Client Supabase | ✅ OK | Ligne 19 : `createClientComponentClient()` |
| Composants | ✅ OK | StatsCard, DonationsTable, RevenueChart |

**✅ CONCLUSION**: Les dashboards sont fonctionnels.

---

## 🔴 POINTS CRITIQUES IDENTIFIÉS

### 1. SUPABASE_SERVICE_ROLE_KEY manquant ❌

**Impact**: Le webhook ne pourra **PAS écrire** dans Supabase sans cette clé.

**Solution**:
1. Aller sur : https://supabase.com/dashboard
2. Votre projet > Settings > API
3. Section "service_role" → Cliquer sur "Reveal"
4. Copier la clé (commence par `eyJ...`)
5. L'ajouter dans `.env.local` :
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
   ```

### 2. Clés STRIPE LIVE configurées ⚠️

**Impact**: Vous acceptez de **VRAIS paiements** avec de **VRAIES cartes**.

**Recommandation**:
- Pour le **développement local**, utilisez les clés **TEST** :
  ```bash
  STRIPE_SECRET_KEY=sk_test_51OhvzZ...
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51OhvzZ...
  ```
- Pour la **production Vercel**, utilisez les clés **LIVE** (déjà configurées).

### 3. Cohérence slugs Supabase ⚠️

**Vérification requise**: Les slugs dans `mosques.ts` doivent exister dans la table Supabase `mosques`.

**SQL à exécuter dans Supabase** :

```sql
-- Vérifier quels slugs existent
SELECT slug, name FROM public.mosques ORDER BY name;

-- Si les mosquées n'existent pas, les créer :
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

---

## 📋 CHECKLIST DE TEST RÉEL

### Avant le Test

- [ ] **SUPABASE_SERVICE_ROLE_KEY configuré** dans `.env.local`
- [ ] Serveur redémarré après modification `.env.local`
- [ ] Mosquées créées dans Supabase (SQL ci-dessus)
- [ ] Webhook Stripe créé sur : https://dashboard.stripe.com/webhooks
  - URL : `https://neena-v3.vercel.app/api/webhooks/stripe`
  - Événements : `payment_intent.succeeded`, `payment_intent.payment_failed`
  - Signing Secret copié dans `.env.local` et Vercel Variables
- [ ] Variables Vercel configurées (Production uniquement) :
  - `STRIPE_SECRET_KEY` (LIVE)
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (LIVE)
  - `STRIPE_WEBHOOK_SECRET` (LIVE)
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Déployé sur Vercel (dernière version)

---

### Pendant le Test

#### Étape 1 : Effectuer un don

- [ ] Aller sur : `https://neena-v3.vercel.app/step-amount-v2`
- [ ] Sélectionner une mosquée : **Créteil**
- [ ] Sélectionner un montant : **5€**
- [ ] Sélectionner fréquence : **Unique**
- [ ] Sélectionner type : **Urgences & Solidarité**
- [ ] Cliquer sur **"Continuer"**
- [ ] Remplir les informations personnelles :
  - Prénom : **Test**
  - Nom : **Audit**
  - Email : **test@neena.fr**
  - Adresse : **1 Rue de la Paix, 75001 Paris**
- [ ] Cliquer sur **"Continuer"**
- [ ] Entrer les informations de carte :
  - **⚠️ AVEC CLÉS LIVE** : Utiliser une **vraie carte bancaire**
  - **⚠️ Le paiement sera RÉEL** - Vous pouvez le rembourser après
- [ ] Cliquer sur **"Payer 5,00€"**
- [ ] Attendre la confirmation
- [ ] ✅ Vous devriez être redirigé vers `/merci`

#### Étape 2 : Vérifier Stripe

- [ ] Aller sur : https://dashboard.stripe.com/payments
- [ ] Vérifier qu'un paiement de **5,00 EUR** est enregistré
- [ ] Cliquer sur le paiement
- [ ] Vérifier les métadonnées :
  - `mosque` : `Créteil` ✅
  - `frequency` : `Unique` ✅
  - `donationType` : `Urgences & Solidarité` ✅
  - `firstName` : `Test` ✅
  - `lastName` : `Audit` ✅
  - `email` : `test@neena.fr` ✅
  - `amountBase` : `5` ✅
  - `amountTotal` : `5` ou `5.08` (si frais couverts) ✅

#### Étape 3 : Vérifier le Webhook

- [ ] Aller sur : https://dashboard.stripe.com/webhooks
- [ ] Sélectionner votre webhook
- [ ] Cliquer sur **"View logs"** ou **"Events"**
- [ ] Trouver l'événement `payment_intent.succeeded` (dernières secondes)
- [ ] Vérifier le statut :
  - ✅ **200 OK** : Le webhook a fonctionné
  - ❌ **4xx/5xx** : Erreur (voir les détails)
- [ ] Si erreur, cliquer sur l'événement pour voir :
  - Request body
  - Response body
  - Error message

#### Étape 4 : Vérifier Supabase

- [ ] Aller sur : https://supabase.com/dashboard
- [ ] Votre projet > **Table Editor**
- [ ] Ouvrir la table **`donations`**
- [ ] Vérifier qu'une nouvelle ligne existe avec :
  - `stripe_payment_intent_id` : `pi_xxx...` ✅
  - `mosque_id` : ID correspondant à Créteil ✅
  - `amount_total` : `5` ou `5.08` ✅
  - `status` : `succeeded` ✅
  - `donor_email` : `test@neena.fr` ✅
  - `donor_first_name` : `Test` ✅
  - `donor_last_name` : `Audit` ✅
  - `created_at` : Date/heure récente ✅

#### Étape 5 : Vérifier le Dashboard

- [ ] Aller sur : `https://neena-v3.vercel.app/auth/login`
- [ ] Se connecter avec un compte admin ou mosquée
- [ ] Aller sur le dashboard de la mosquée **Créteil** :
  - `https://neena-v3.vercel.app/mosque/Créteil/dashboard`
- [ ] Vérifier que :
  - Le **montant total** a augmenté de **5,00 €**
  - Le **nombre de donations** a augmenté de **1**
  - La donation apparaît dans le **tableau des donations**
  - Les détails sont corrects (nom, email, montant, date)

#### Étape 6 : Rembourser le Paiement (si test)

- [ ] Aller sur : https://dashboard.stripe.com/payments
- [ ] Sélectionner le paiement de test
- [ ] Cliquer sur **"Refund"**
- [ ] Confirmer le remboursement
- [ ] ✅ Le paiement sera remboursé sur la carte sous 5-10 jours

---

## 🐛 DÉPANNAGE

### Problème 1 : Webhook retourne 500

**Cause probable** : `SUPABASE_SERVICE_ROLE_KEY` manquant ou incorrect

**Solution** :
1. Vérifier que la clé est dans `.env.local` (local) et Vercel Variables (prod)
2. Vérifier que la clé commence par `eyJ...`
3. Redémarrer le serveur (local) ou redéployer (Vercel)

---

### Problème 2 : Mosquée non trouvée (Webhook Warning)

**Cause** : Le slug dans Stripe metadata ne correspond pas à un slug dans la table `mosques`

**Solution** :
1. Vérifier les logs du webhook (Stripe Dashboard)
2. Vérifier le `metadata.mosque` dans le PaymentIntent
3. Exécuter le SQL pour créer les mosquées (voir section 3 ci-dessus)

**Exemple de log d'erreur** :
```json
{
  "requestId": "abc-123",
  "slug": "Créteil",
  "error": "No rows found"
}
```

---

### Problème 3 : Donation n'apparaît pas dans Supabase

**Vérifications** :
1. ✅ Webhook a bien retourné **200 OK** dans les logs Stripe
2. ✅ `SUPABASE_SERVICE_ROLE_KEY` est configuré
3. ✅ Le slug de la mosquée existe dans la table `mosques`
4. ✅ Les RLS (Row Level Security) sont corrects :
   ```sql
   -- Vérifier les RLS
   SELECT * FROM pg_policies WHERE tablename = 'donations';
   ```

**Si les RLS bloquent l'insertion** :
```sql
-- Créer une policy pour permettre l'insertion via service_role
CREATE POLICY "Allow service_role to insert donations"
ON public.donations
FOR INSERT
TO authenticated
WITH CHECK (true);
```

---

### Problème 4 : Donation n'apparaît pas dans le Dashboard

**Vérifications** :
1. ✅ La donation existe bien dans Supabase (Table Editor)
2. ✅ Le `mosque_id` correspond à l'ID de la mosquée sélectionnée
3. ✅ Le statut est `succeeded` (pas `pending` ou `failed`)
4. ✅ L'utilisateur connecté a accès à cette mosquée

**Solution** : Rafraîchir la page du dashboard ou vider le cache du navigateur.

---

### Problème 5 : Erreur "Invalid signature" dans le Webhook

**Cause** : Le `STRIPE_WEBHOOK_SECRET` est incorrect

**Solution** :
1. Aller sur : https://dashboard.stripe.com/webhooks
2. Sélectionner votre webhook
3. Cliquer sur **"Reveal"** pour voir le Signing Secret
4. Copier la clé (`whsec_...`)
5. Remplacer dans `.env.local` (local) et Vercel Variables (prod)
6. Redémarrer le serveur (local) ou redéployer (Vercel)

---

## ✅ VALIDATION FINALE

Le système fonctionne correctement si :

1. ✅ **Paiement réussi** sur le site
2. ✅ **PaymentIntent créé** dans Stripe avec métadonnées correctes
3. ✅ **Webhook retourne 200 OK** dans les logs Stripe
4. ✅ **Donation enregistrée** dans Supabase (`donations` table)
5. ✅ **Dashboard affiche** la nouvelle donation
6. ✅ **Statistiques mises à jour** (montant total, nombre de donations)

---

## 📊 LOGS À SURVEILLER

### Logs Vercel (Production)

**URL** : https://vercel.com/dashboard > Votre projet > **Functions**

Filtrer par : `/api/webhooks/stripe`

**Logs attendus** :
```
[Stripe Webhook] event-received: { type: "payment_intent.succeeded", id: "evt_xxx" }
[Stripe Webhook] payment-succeeded: { intentId: "pi_xxx", amount: 500 }
[Stripe Webhook] mosque-found: { mosqueId: 1, slug: "Créteil" }
[Stripe Webhook] donation-recorded: { donationId: 123, amount: 5 }
```

### Logs Stripe

**URL** : https://dashboard.stripe.com/webhooks > Votre webhook > **View logs**

**Événements attendus** :
- `payment_intent.succeeded` → **200 OK**

---

## 🎯 RÉSUMÉ ACTIONS REQUISES

### Avant de Tester

1. **Configurer `SUPABASE_SERVICE_ROLE_KEY`** dans `.env.local`
2. **Créer les mosquées** dans Supabase (SQL fourni)
3. **Vérifier le webhook** Stripe est créé et actif
4. **Configurer les variables** Vercel (Production)
5. **Déployer** la dernière version

### Pendant le Test

1. Faire un **don de 5€** sur Créteil
2. Vérifier **Stripe** (paiement + métadonnées)
3. Vérifier **Webhook** (200 OK)
4. Vérifier **Supabase** (donation enregistrée)
5. Vérifier **Dashboard** (donation affichée)

### Après le Test

1. **Rembourser** le paiement de test (si nécessaire)
2. **Vérifier les logs** pour identifier d'éventuels problèmes
3. **Documenter** les résultats

---

## 🔗 LIENS UTILES

- **Stripe Dashboard** : https://dashboard.stripe.com/
- **Stripe Webhooks** : https://dashboard.stripe.com/webhooks
- **Stripe Payments** : https://dashboard.stripe.com/payments
- **Supabase Dashboard** : https://supabase.com/dashboard
- **Vercel Dashboard** : https://vercel.com/dashboard
- **Application** : https://neena-v3.vercel.app/

---

**Audit réalisé le** : 21 octobre 2025  
**Version** : 1.0  
**Statut** : ⚠️ Action requise - SUPABASE_SERVICE_ROLE_KEY à configurer







