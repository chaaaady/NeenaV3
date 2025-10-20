# Architecture du système Dashboard Neena

## 🏗️ Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                         UTILISATEURS                             │
└─────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴──────────────┐
                    │                            │
            ┌───────▼────────┐          ┌───────▼────────┐
            │  Admin Neena   │          │    Mosquées    │
            │  (role:admin)  │          │ (email linked) │
            └───────┬────────┘          └───────┬────────┘
                    │                            │
                    └─────────────┬──────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │   Next.js Application      │
                    │   (Vercel)                 │
                    └─────────────┬──────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
┌───────▼────────┐      ┌────────▼─────────┐    ┌─────────▼────────┐
│   Supabase     │      │  Stripe Payment  │    │  Frontend Pages  │
│   Database     │      │     Intent       │    │   (Dashboard)    │
└───────┬────────┘      └────────┬─────────┘    └──────────────────┘
        │                        │
        │                        │
        │                ┌───────▼─────────┐
        │                │ Stripe Webhook  │
        │                │ (auto capture)  │
        │                └───────┬─────────┘
        │                        │
        └────────────────────────┘
```

## 📊 Flow de données

### 1. Création d'une donation

```
Donateur
   │
   │ [Remplit formulaire]
   ▼
/step-amount-v2 → /step-personal-ds → /step-payment-ds
   │                                        │
   │                                        │ [Métadonnées]
   │                                        ▼
   │                                  Stripe Payment
   │                                  Intent créé
   │                                        │
   │                                        │ [payment_intent.succeeded]
   │                                        ▼
   │                                  Webhook → /api/webhooks/stripe
   │                                        │
   │                                        │ [Parse metadata]
   │                                        ▼
   │                                  Supabase INSERT
   │                                  → table donations
   │                                        │
   │                                        ▼
   └─────────────────────────────────→ /merci (success)

Mosquée/Admin
   │
   │ [Se connecte]
   ▼
/auth/login → Supabase Auth → Dashboard
   │                              │
   │                              │ [Query avec RLS]
   │                              ▼
   │                         Supabase SELECT
   │                              │
   │                              ▼
   └──────────────────────→ Affichage stats + dons
```

## 🔐 Sécurité - Row Level Security

### Mosquée (creteil@neena.fr)

```sql
SELECT * FROM donations WHERE mosque_id = [UUID de la mosquée]
```
✅ Voit **uniquement** ses propres donations

### Admin (admin@neena.fr avec role=admin)

```sql
SELECT * FROM donations
```
✅ Voit **toutes** les donations de toutes les mosquées

### Non authentifié

```
Redirection → /auth/login
```
❌ Aucun accès aux données

## 🎯 Métadonnées Stripe → Supabase

Quand un paiement réussit, ces métadonnées sont capturées :

```typescript
Payment Intent Metadata {
  mosque: "mosquee-sahaba-creteil"     → mosque_id (via lookup)
  amountBase: "50"                     → amount_base
  amountTotal: "50.75"                 → amount_total
  coverFees: "true"                    → cover_fees + amount_fees
  frequency: "Mensuel"                 → frequency
  donationType: "Général"              → donation_type
  email: "donateur@email.fr"           → donor_email
  firstName: "Ahmed"                   → donor_first_name
  lastName: "Ben"                      → donor_last_name
  address: "1 rue..."                  → donor_address
  wantsReceipt: "true"                 → wants_receipt
}
```

## 🔄 Workflow complet

### Donation réussie

1. **Frontend** : Utilisateur complète le formulaire
2. **Stripe** : PaymentIntent créé avec métadonnées
3. **Stripe** : Paiement confirmé → événement `payment_intent.succeeded`
4. **Webhook** : `/api/webhooks/stripe` reçoit l'événement
5. **Backend** : Parse les métadonnées
6. **Backend** : Lookup de la mosquée par slug
7. **Supabase** : INSERT dans table `donations`
8. **Dashboard** : Rafraîchissement → nouvelle donation visible

### Consultation dashboard

1. **Utilisateur** : Se connecte sur `/auth/login`
2. **Supabase Auth** : Vérifie email + password
3. **Middleware** : Vérifie session avant d'accéder au dashboard
4. **Dashboard** : Query Supabase avec RLS
5. **RLS** : Filtre automatiquement selon l'utilisateur
6. **Dashboard** : Affiche les stats + graphiques

## 📁 Structure des fichiers

```
NeenaV3-1/
├── supabase-migrations.sql              # SQL à exécuter dans Supabase
├── DASHBOARD-SETUP.md                   # Guide complet
├── QUICK-START-DASHBOARD.md             # Guide rapide
├── CHECKLIST-CONFIGURATION.md           # Checklist
│
├── src/
│   ├── lib/
│   │   └── supabase.ts                  # Clients Supabase + types
│   │
│   ├── middleware.ts                    # Protection routes dashboard
│   │
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/page.tsx           # Page connexion
│   │   │   └── callback/route.ts        # Callback Supabase
│   │   │
│   │   ├── admin/
│   │   │   └── dashboard/page.tsx       # Dashboard admin (bleu)
│   │   │
│   │   ├── mosque/
│   │   │   └── [slug]/
│   │   │       └── dashboard/page.tsx   # Dashboard mosquée (vert)
│   │   │
│   │   └── api/
│   │       ├── webhooks/
│   │       │   └── stripe/route.ts      # Webhook Stripe
│   │       └── admin/
│   │           └── import-stripe/route.ts # Import historique
│   │
│   ├── components/
│   │   └── dashboard/
│   │       ├── StatsCard.tsx            # Cartes stats
│   │       ├── DonationsTable.tsx       # Tableau avec export CSV
│   │       └── RevenueChart.tsx         # Graphique Recharts
│   │
│   └── scripts/
│       └── import-stripe-history.ts     # Script import CLI
│
└── .env.local                           # Variables (à créer)
    SUPABASE_SERVICE_ROLE_KEY=xxx
    STRIPE_WEBHOOK_SECRET=xxx
    ...
```

## 🎨 Design System

### Dashboard Admin (Neena)
- **Gradient** : `from-[#5a8bb5] via-[#6b9ec7] to-[#5a8bb5]` (bleu pastel)
- **Theme color** : `#5a8bb5`
- **Vision** : Vue globale de toutes les mosquées
- **Accès** : Compte avec `user_metadata.role = "admin"`

### Dashboard Mosquée
- **Gradient** : `from-[#0a5c4a] via-[#2a7557] to-[#0a5c4a]` (vert)
- **Theme color** : `#0a5c4a`
- **Vision** : Uniquement ses propres données
- **Accès** : Compte lié à une mosquée (via email)

### Composants communs
- **GlassCard** : `border-white/20 bg-white/10 backdrop-blur-xl`
- **Typography** : Helvetica Neue, weights 400-700
- **Icons** : Lucide React
- **Charts** : Recharts avec style glassmorphisme

## 🔒 Sécurité en profondeur

### Niveau 1 : Middleware (Next.js)
```typescript
if (!session) redirect("/auth/login")
```

### Niveau 2 : Supabase Auth
```typescript
const { session } = await supabase.auth.getSession()
```

### Niveau 3 : Row Level Security (Postgres)
```sql
USING (auth.uid() = mosque_id)
-- Ou --
USING (auth.jwt() ->> 'role' = 'admin')
```

### Niveau 4 : Stripe Webhook Signature
```typescript
stripe.webhooks.constructEvent(body, signature, secret)
```

## 📈 Scalabilité

Le système est conçu pour évoluer :

- **Pagination** : Prête pour des milliers de donations
- **Index SQL** : Optimisation des requêtes
- **Cache** : Peut être ajouté sur les stats agrégées
- **CDN** : Vercel Edge pour distribution mondiale
- **Webhooks** : Gestion asynchrone des événements

## 🔮 Évolutions futures possibles

1. **QR Codes tracking** (tables déjà créées)
2. **Reçus fiscaux automatiques** (PDF)
3. **Notifications email** (Resend ou SendGrid)
4. **Export Excel** avancé
5. **Graphiques supplémentaires** (par type de don, par jour de la semaine)
6. **API publique** pour les mosquées (avec clés API)
7. **Webhooks sortants** vers les mosquées
8. **Multi-tenant** complet avec domaines personnalisés

## 💾 Modèle de données

### Table: mosques
```
id (uuid, PK)
slug (text, unique)          → "mosquee-sahaba-creteil"
name (text)                  → "Mosquée Sahaba Créteil"
email (text, unique)         → "creteil@neena.fr"
created_at (timestamptz)
is_active (boolean)
```

### Table: donations
```
id (uuid, PK)
mosque_id (uuid, FK)
stripe_payment_intent_id (text, unique)
amount_base (numeric)        → 50.00
amount_fees (numeric)        → 0.75
amount_total (numeric)       → 50.75
status (text)                → "succeeded"
frequency (text)             → "Mensuel"
donation_type (text)         → "Général"
donor_email (text)
donor_first_name (text)
donor_last_name (text)
donor_address (text)
wants_receipt (boolean)
cover_fees (boolean)
metadata (jsonb)             → Toutes les métadonnées Stripe
stripe_created_at (timestamptz)
created_at (timestamptz)
```

### Table: qr_codes (future)
```
id (uuid, PK)
mosque_id (uuid, FK)
code (text, unique)          → "QR-CRETEIL-ENTRANCE-001"
location (text)              → "Entrée principale"
scan_count (integer)
created_at (timestamptz)
```

## 🎓 Technologies utilisées

- **Next.js 15** : Framework React avec App Router
- **Supabase** : Backend as a Service (Postgres + Auth)
- **Stripe** : Paiements avec webhooks
- **Recharts** : Bibliothèque de graphiques
- **Tailwind CSS** : Styling avec glassmorphisme
- **TypeScript** : Typage fort
- **Vercel** : Hébergement et déploiement

