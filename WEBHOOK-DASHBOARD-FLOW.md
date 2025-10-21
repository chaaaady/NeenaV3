# 🔄 Flux Complet : Don → Webhook → Dashboard

## 📋 Vue d'ensemble

Ce document explique comment les donations sont enregistrées dans Supabase via les webhooks Stripe et affichées dans les dashboards.

---

## 🔄 Flux de Données

### 1️⃣ **Frontend : Création du don**
**Fichier** : `src/app/(don)/step-payment-ds/page.tsx`

1. L'utilisateur remplit le formulaire de don
2. Le frontend appelle `/api/payments/create-intent` avec :
   ```typescript
   {
     amount: 25,
     currency: "eur",
     metadata: {
       mosque: "Créteil",              // ⚠️ Slug de la mosquée
       amountBase: "25",
       amountTotal: "25",
       frequency: "Unique",
       donationType: "Sadaqah",
       firstName: "Jean",
       lastName: "Dupont",
       email: "jean@example.com",
       address: "...",
       coverFees: "false",
       wantsReceipt: "false"
     }
   }
   ```

3. Stripe crée un `PaymentIntent` avec ces métadonnées
4. L'utilisateur valide le paiement avec sa carte

---

### 2️⃣ **Stripe Webhook : Enregistrement dans Supabase**
**Fichier** : `src/app/api/webhooks/stripe/route.ts`

1. **Événement** : `payment_intent.succeeded`
2. **Extraction des données** :
   ```typescript
   const paymentIntent = event.data.object;
   const metadata = paymentIntent.metadata;
   const mosqueSlug = metadata.mosque; // "Créteil"
   ```

3. **Recherche de la mosquée** :
   ```sql
   SELECT id FROM mosques WHERE slug = 'Créteil';
   ```

4. **Insertion de la donation** :
   ```sql
   INSERT INTO donations (
     mosque_id,
     stripe_payment_intent_id,
     amount_base,
     amount_fees,
     amount_total,
     currency,
     status,
     frequency,
     donation_type,
     donor_email,
     donor_first_name,
     donor_last_name,
     donor_address,
     wants_receipt,
     cover_fees,
     metadata,
     stripe_created_at
   ) VALUES (...);
   ```

5. **Logs** :
   ```
   ✅ [Stripe Webhook] donation-recorded: { 
     donationId: "uuid...", 
     intentId: "pi_...", 
     amount: 25 
   }
   ```

---

### 3️⃣ **Dashboard : Affichage des données**
**Fichiers** :
- `src/app/mosque/[slug]/dashboard/page.tsx` (Dashboard mosquée)
- `src/app/admin/dashboard/page.tsx` (Dashboard admin)

1. **Chargement des donations** :
   ```sql
   SELECT * FROM donations 
   WHERE mosque_id = 'uuid-de-la-mosquée'
   AND status = 'succeeded'
   ORDER BY created_at DESC;
   ```

2. **Calcul des statistiques** :
   - Total collecté
   - Dons ce mois
   - Donateurs uniques
   - Moyenne par don

3. **Affichage en temps réel** :
   - Tableau des donations
   - Graphique d'évolution
   - Statistiques agrégées

---

## ⚙️ Configuration Requise

### 1. **Variables d'environnement** (`.env.local`)

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 2. **Table `mosques` dans Supabase**

```sql
-- Exemple de données requises
INSERT INTO mosques (slug, name, email, is_active) VALUES
('Créteil', 'Mosquée Sahaba Créteil', 'contact@mosquee-creteil.fr', true),
('admin-neena', 'Neena Admin', 'admin@neena.fr', true);
```

⚠️ **IMPORTANT** : Le `slug` dans la table DOIT correspondre exactement à `metadata.mosque` envoyé par le frontend.

### 3. **Configuration du webhook Stripe**

1. Allez sur https://dashboard.stripe.com/webhooks
2. Cliquez sur "Add endpoint"
3. URL du webhook :
   - **Local** : Utilisez Stripe CLI : `stripe listen --forward-to localhost:4000/api/webhooks/stripe`
   - **Production** : `https://votre-domaine.vercel.app/api/webhooks/stripe`
4. Événements à écouter :
   - `payment_intent.succeeded` ✅
   - `payment_intent.payment_failed` (optionnel)
5. Copiez le `Webhook signing secret` dans `.env.local` comme `STRIPE_WEBHOOK_SECRET`

---

## 🧪 Test du Flux Complet

### Étape 1 : Vérifier la configuration Supabase

```sql
-- Vérifier les mosquées existantes
SELECT id, slug, name FROM mosques;

-- Vérifier les donations (devrait être vide au début)
SELECT * FROM donations;
```

### Étape 2 : Faire un don de test

1. Allez sur `http://localhost:4000/step-amount-v2`
2. Choisissez un montant (ex: 5€)
3. Remplissez les informations personnelles
4. Utilisez une **carte de test Stripe** :
   - **Succès** : `4242 4242 4242 4242`
   - **Décliné** : `4000 0000 0000 0002`
   - Date : n'importe quelle date future
   - CVC : n'importe quel 3 chiffres

### Étape 3 : Vérifier le webhook (logs serveur)

Dans le terminal, vous devriez voir :

```
✅ [Stripe Webhook] event-received: { type: "payment_intent.succeeded" }
✅ [Stripe Webhook] donation-recorded: { 
  donationId: "...", 
  intentId: "pi_...", 
  amount: 5 
}
```

### Étape 4 : Vérifier dans Supabase

```sql
SELECT 
  d.id,
  m.name as mosque_name,
  d.amount_total,
  d.donor_email,
  d.created_at
FROM donations d
JOIN mosques m ON d.mosque_id = m.id
ORDER BY d.created_at DESC;
```

### Étape 5 : Vérifier dans le dashboard

1. Connectez-vous : `http://localhost:4000/auth/login`
2. Allez sur le dashboard de la mosquée
3. Vous devriez voir :
   - ✅ Le montant dans "Total collecté"
   - ✅ La donation dans le tableau
   - ✅ Le graphique mis à jour

---

## 🐛 Dépannage

### Problème : Le webhook ne reçoit rien

**Solution** :
1. Vérifiez que `STRIPE_WEBHOOK_SECRET` est défini
2. En local, utilisez Stripe CLI :
   ```bash
   stripe listen --forward-to localhost:4000/api/webhooks/stripe
   ```

### Problème : "Mosque not found" dans les logs webhook

**Causes possibles** :
1. Le `slug` dans la table ne correspond pas à `metadata.mosque`
2. La mosquée n'existe pas dans Supabase

**Solution** :
```sql
-- Vérifier le slug
SELECT slug FROM mosques WHERE slug = 'Créteil';

-- Si vide, créer la mosquée
INSERT INTO mosques (slug, name, email) 
VALUES ('Créteil', 'Mosquée Sahaba Créteil', 'contact@mosquee.fr');
```

### Problème : Les donations n'apparaissent pas dans le dashboard

**Vérifications** :
1. ✅ Le webhook a bien enregistré la donation (logs serveur)
2. ✅ La donation existe dans Supabase (SQL query)
3. ✅ Le `mosque_id` de la donation correspond à l'ID de la mosquée du dashboard
4. ✅ Le `status` de la donation est `"succeeded"`

---

## 📊 Exemple Complet

### Donation dans Supabase (après webhook)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "mosque_id": "123e4567-e89b-12d3-a456-426614174000",
  "stripe_payment_intent_id": "pi_3P1234567890",
  "amount_base": 25.00,
  "amount_fees": 0.00,
  "amount_total": 25.00,
  "currency": "eur",
  "status": "succeeded",
  "frequency": "Unique",
  "donation_type": "Sadaqah",
  "donor_email": "jean@example.com",
  "donor_first_name": "Jean",
  "donor_last_name": "Dupont",
  "donor_address": "123 Rue de Paris, 75001 Paris",
  "wants_receipt": false,
  "cover_fees": false,
  "metadata": { ... },
  "stripe_created_at": "2025-10-21T10:30:00Z",
  "created_at": "2025-10-21T10:30:05Z"
}
```

### Affichage dans le Dashboard

```
┌─────────────────────────────────────┐
│ Dashboard Mosquée Sahaba Créteil    │
├─────────────────────────────────────┤
│                                     │
│ Total collecté:      25,00€         │
│ Dons ce mois:        25,00€         │
│ Donateurs uniques:   1              │
│ Total donations:     1              │
│                                     │
│ Historique des donations            │
│ ┌───────────────────────────────┐   │
│ │ 21/10/2025 • 25,00€ • Unique │   │
│ │ jean@example.com              │   │
│ └───────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## ✅ Checklist de Déploiement

- [ ] Variables d'environnement configurées (`.env.local`)
- [ ] Tables Supabase créées (`mosques`, `donations`)
- [ ] Mosquées ajoutées dans Supabase avec les bons `slug`
- [ ] Webhook Stripe configuré sur le dashboard
- [ ] `STRIPE_WEBHOOK_SECRET` ajouté dans `.env.local`
- [ ] Test de paiement effectué avec succès
- [ ] Webhook reçu et donation enregistrée
- [ ] Dashboard affiche les données correctement

---

## 🚀 Résumé

**Le flux fonctionne si** :

1. ✅ Le frontend envoie `metadata.mosque = "Créteil"`
2. ✅ La table `mosques` contient une ligne avec `slug = "Créteil"`
3. ✅ Le webhook Stripe est configuré et reçoit les événements
4. ✅ Le `STRIPE_WEBHOOK_SECRET` est correct
5. ✅ Le dashboard lit les donations depuis Supabase

**Tout est maintenant en place pour que ça fonctionne !** 🎉

