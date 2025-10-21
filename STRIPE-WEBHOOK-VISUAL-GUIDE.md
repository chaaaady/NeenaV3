# 🎨 Guide Visuel - Configuration Webhook Stripe

## 📍 Où Aller ?

### 1️⃣ Dashboard Stripe
```
https://dashboard.stripe.com/test/webhooks
```

### 2️⃣ Navigation
```
Dashboard Stripe
    └── Developers (menu gauche)
        └── Webhooks (sous-menu)
            └── + Add endpoint (bouton bleu)
```

---

## 🖼️ Interface Étape par Étape

### **Écran 1 : Liste des Webhooks**

```
┌─────────────────────────────────────────────────────────────┐
│ Stripe Dashboard                                [TEST MODE] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Developers > Webhooks                                        │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                         │  │
│  │  Webhooks                         [+ Add endpoint]     │  │
│  │                                                         │  │
│  │  No webhooks found                                      │  │
│  │                                                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘

👆 Cliquez sur "+ Add endpoint"
```

---

### **Écran 2 : Créer un Endpoint**

```
┌─────────────────────────────────────────────────────────────┐
│ Add endpoint                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Endpoint URL *                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ https://neena-v3.vercel.app/api/webhooks/stripe    │    │
│  └─────────────────────────────────────────────────────┘    │
│  ℹ️ This is the URL Stripe will POST events to              │
│                                                               │
│  Description (optional)                                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Webhook pour enregistrer les donations Supabase    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  Events to send                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ [Select events]                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│                                    [Cancel] [Add endpoint]   │
└─────────────────────────────────────────────────────────────┘

✍️ Remplissez:
1. Endpoint URL: https://votre-domaine.vercel.app/api/webhooks/stripe
2. Description: Webhook pour donations
3. Cliquez sur "Select events"
```

---

### **Écran 3 : Sélectionner les Événements**

```
┌─────────────────────────────────────────────────────────────┐
│ Select events to listen to                                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  🔍 Search events... [_________________]                     │
│                                                               │
│  ☐ Select all                                                │
│                                                               │
│  Payment intents                                              │
│  ├─ ☐ payment_intent.amount_capturable_updated              │
│  ├─ ☐ payment_intent.canceled                               │
│  ├─ ☐ payment_intent.created                                │
│  ├─ ☐ payment_intent.partially_funded                       │
│  ├─ ✅ payment_intent.payment_failed          👈 COCHER      │
│  ├─ ☐ payment_intent.processing                             │
│  ├─ ☐ payment_intent.requires_action                        │
│  ├─ ✅ payment_intent.succeeded               👈 COCHER      │
│  └─ ...                                                      │
│                                                               │
│  Charges                                                      │
│  ├─ ☐ charge.captured                                       │
│  ├─ ☐ charge.expired                                        │
│  ├─ ☐ charge.failed                                         │
│  ├─ ☐ charge.pending                                        │
│  ├─ ☐ charge.refunded                         (optionnel)   │
│  └─ ...                                                      │
│                                                               │
│                                    [Cancel] [Add events]     │
└─────────────────────────────────────────────────────────────┘

✅ Cochez AU MINIMUM:
   - payment_intent.succeeded
   - payment_intent.payment_failed (recommandé)

Puis cliquez sur "Add events"
```

---

### **Écran 4 : Finaliser**

```
┌─────────────────────────────────────────────────────────────┐
│ Add endpoint                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Endpoint URL *                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ https://neena-v3.vercel.app/api/webhooks/stripe    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  Description                                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Webhook pour enregistrer les donations Supabase    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  Events to send                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ • payment_intent.succeeded                          │    │
│  │ • payment_intent.payment_failed                     │    │
│  │   [Change events]                                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│                                    [Cancel] [Add endpoint]   │
└─────────────────────────────────────────────────────────────┘

👆 Cliquez sur "Add endpoint"
```

---

### **Écran 5 : Page de Détails du Webhook**

```
┌─────────────────────────────────────────────────────────────┐
│ Webhook details                                  [TEST MODE] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ✅ Enabled                                                  │
│                                                               │
│  Endpoint URL                                                 │
│  https://neena-v3.vercel.app/api/webhooks/stripe            │
│                                                               │
│  Events                                                       │
│  • payment_intent.succeeded                                  │
│  • payment_intent.payment_failed                             │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Signing secret                   🔒 Reveal          │    │
│  │                                                       │    │
│  │ The signing secret is used to verify that webhook   │    │
│  │ events sent to your endpoint are from Stripe.       │    │
│  │                                                       │    │
│  │ ⚠️  Keep this secret safe!                           │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  Recent events                                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ No events yet                                         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘

👆 Cliquez sur "🔒 Reveal" pour voir le Signing Secret
```

---

### **Écran 6 : Révéler le Signing Secret**

```
┌─────────────────────────────────────────────────────────────┐
│  Signing secret                   ✅ Revealed           │    │
│                                                               │
│  whsec_abc123def456ghi789jkl012mno345pqr678stu901vwx234    │
│  [Copy]                                                      │
│                                                               │
│  The signing secret is used to verify that webhook           │
│  events sent to your endpoint are from Stripe.               │
│                                                               │
│  ⚠️  Keep this secret safe!                                  │
└─────────────────────────────────────────────────────────────┘

👆 Cliquez sur "Copy" pour copier la clé
```

---

## 🔄 Configuration Complète

### **Dans votre Terminal (Local)**

```bash
# Ouvrir .env.local
nano .env.local

# Ajouter la ligne (ou remplacer):
STRIPE_WEBHOOK_SECRET=whsec_abc123def456ghi789jkl012mno345pqr678stu901vwx234

# Sauvegarder (Ctrl+O, Enter, Ctrl+X)
```

---

### **Sur Vercel (Production)**

```
┌─────────────────────────────────────────────────────────────┐
│ Vercel > Votre Projet > Settings                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Environment Variables                                        │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Name                                                  │    │
│  │ STRIPE_WEBHOOK_SECRET                                │    │
│  │                                                       │    │
│  │ Value                                                 │    │
│  │ whsec_abc123def456ghi789jkl012mno345pqr678stu901vwx│    │
│  │                                                       │    │
│  │ Environments:                                         │    │
│  │ ☑ Production  ☑ Preview  ☑ Development              │    │
│  │                                                       │    │
│  │                                            [Save]     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Vérification Visuelle

### **Logs Stripe (Après un Test)**

```
┌─────────────────────────────────────────────────────────────┐
│ Webhook details > Recent events                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────┬───────────────────────┬──────────┬─────────┐    │
│  │ Event │ Type                  │ Status   │ Time    │    │
│  ├───────┼───────────────────────┼──────────┼─────────┤    │
│  │ evt_1 │ payment_intent.       │ ✅ 200   │ 2 min   │    │
│  │       │ succeeded             │          │ ago     │    │
│  └───────┴───────────────────────┴──────────┴─────────┘    │
│                                                               │
│  Cliquez sur l'événement pour voir les détails               │
│                                                               │
└─────────────────────────────────────────────────────────────┘

✅ Status 200 = Webhook traité avec succès !
❌ Status 4xx/5xx = Erreur (voir les logs Vercel)
```

---

### **Supabase (Après un Test)**

```
┌─────────────────────────────────────────────────────────────┐
│ Supabase > Table Editor > donations                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────┬────────────────────┬────────┬──────┬───────────┐ │
│  │ id   │ stripe_payment_    │ amount │ moque│ created_at│ │
│  │      │ intent_id          │        │ _id  │           │ │
│  ├──────┼────────────────────┼────────┼──────┼───────────┤ │
│  │ 1    │ pi_3AbC123DeF45    │ 5.00   │ 2    │ Just now  │ │
│  │      │                    │        │      │           │ │
│  └──────┴────────────────────┴────────┴──────┴───────────┘ │
│                                                               │
│  ✅ Nouvelle donation enregistrée !                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Résumé Visuel du Flux

```
┌──────────────┐
│   Utilisateur │
│   fait un don │
└──────┬────────┘
       │
       │ 1. Paiement (4242 4242 4242 4242)
       ↓
┌──────────────┐
│    Stripe    │
│  (Payment    │
│   Intent)    │
└──────┬────────┘
       │
       │ 2. Événement: payment_intent.succeeded
       ↓
┌──────────────┐
│   Webhook    │
│   POST →     │
│   /api/      │
│   webhooks/  │
│   stripe     │
└──────┬────────┘
       │
       │ 3. Vérification signature (STRIPE_WEBHOOK_SECRET)
       ↓
┌──────────────┐
│   Vercel     │
│   Function   │
│   (route.ts) │
└──────┬────────┘
       │
       │ 4. INSERT INTO donations
       ↓
┌──────────────┐
│   Supabase   │
│   donations  │
│   table      │
└──────────────┘
       │
       │ 5. Lecture des données
       ↓
┌──────────────┐
│  Dashboard   │
│  Mosquée     │
└──────────────┘
```

---

## 🔍 Points de Contrôle

### ✅ Checklist Visuelle

```
Configuration:
☐ Webhook créé sur Stripe Dashboard
☐ URL correcte: https://votre-domaine.vercel.app/api/webhooks/stripe
☐ Événements sélectionnés: payment_intent.succeeded
☐ Signing Secret copié (commence par whsec_)
☐ Secret ajouté dans .env.local (local)
☐ Secret ajouté dans Vercel Variables (prod)
☐ Application redéployée

Test:
☐ Paiement test avec 4242 4242 4242 4242
☐ Webhook logs Stripe: Status 200 OK
☐ Donation apparaît dans Supabase
☐ Dashboard affiche la donation
☐ Montant, mosquée, donateur corrects
```

---

## 🎉 Validation Finale

Quand vous voyez ça, c'est bon ! ✅

```
Stripe Dashboard:
  Webhook Status: ✅ 200 OK

Supabase:
  donations table: ✅ 1 nouvelle ligne

Dashboard Mosquée:
  Statistiques: ✅ +5.00€
  Table donations: ✅ Affiche le don
```

---

## 📞 Besoin d'Aide ?

### Si le webhook ne fonctionne pas:

1. **Vérifier les logs Stripe**
   - https://dashboard.stripe.com/test/webhooks/WEBHOOK_ID/logs
   - Si Status 404: URL incorrecte
   - Si Status 401/403: Signing Secret incorrect
   - Si Status 500: Erreur serveur (voir Vercel logs)

2. **Vérifier les logs Vercel**
   - https://vercel.com/dashboard > Votre projet > Functions
   - Filtrer par `/api/webhooks/stripe`
   - Lire les erreurs affichées

3. **Vérifier Supabase**
   - Table `donations` existe ?
   - Table `mosques` contient des données ?
   - RLS configuré correctement ?

---

**Vous avez maintenant tout ce qu'il faut pour configurer votre webhook ! 🚀**

