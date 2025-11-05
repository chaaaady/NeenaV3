# Configuration Stripe pour V18

## 📋 Variables d'Environnement Requises

### Frontend (Public)
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

### Backend (Secret)
```bash
STRIPE_SECRET_KEY=sk_...
```

---

## 🏠 Configuration Locale (Développement)

### 1. Créer le fichier `.env.local`

```bash
# À la racine du projet
touch .env.local
```

### 2. Ajouter les clés TEST

```bash
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_ici
STRIPE_SECRET_KEY=sk_test_votre_cle_ici
```

### 3. Obtenir les clés TEST

👉 https://dashboard.stripe.com/test/apikeys

### 4. Redémarrer le serveur

```bash
npm run dev
```

---

## 🚀 Configuration Vercel (Production)

### 1. Aller dans Vercel Dashboard

👉 https://vercel.com/[votre-projet]/settings/environment-variables

### 2. Ajouter les variables

| Nom | Valeur | Environnements |
|-----|--------|----------------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Production, Preview |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Production, Preview |

### 3. Obtenir les clés LIVE

👉 https://dashboard.stripe.com/apikeys

### 4. Redéployer

```bash
git push origin main
```

---

## ✅ Vérifications de Sécurité

### ✓ Le `.gitignore` contient `.env*`

```gitignore
# .gitignore (ligne 39)
.env*
```

**Résultat** : Les fichiers `.env.local` ne seront jamais pushés sur GitHub.

---

### ✓ Détection automatique des clés TEST/LIVE

Le code détecte automatiquement le type de clés :

```typescript
// StripeElements.tsx
const isTestKey = stripeKey?.startsWith('pk_test_');
const isLiveKey = stripeKey?.startsWith('pk_live_');
const isLocalhost = window.location.hostname === 'localhost';

// Avertissement si clés LIVE en local
if (isLiveKey && isLocalhost) {
  console.error("🚨 ATTENTION: Clés LIVE en développement !");
}
```

---

### ✓ Validation côté serveur

```typescript
// route.ts
const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  return NextResponse.json(
    { error: "Server missing STRIPE_SECRET_KEY" }, 
    { status: 500 }
  );
}
```

---

## 🧪 Tester la Configuration

### En Local (localhost:4000)

1. ✅ Ouvrir `localhost:4000/step-amount-v18`
2. ✅ Remplir le formulaire de don
3. ✅ Arriver sur la section Payment
4. ✅ Vérifier la console :
   - ✅ `"✅ Clés Stripe TEST détectées - OK pour localhost"`
   - ❌ Pas d'erreur `"STRIPE_PUBLISHABLE_KEY n'est pas définie"`
5. ✅ Tester avec une carte de test :
   - Numéro : `4242 4242 4242 4242`
   - Date : `12/34`
   - CVC : `123`
6. ✅ Le paiement doit réussir

---

### En Production (Vercel)

1. ✅ Ouvrir `https://votre-site.vercel.app/step-amount-v18`
2. ✅ Remplir le formulaire de don
3. ✅ Arriver sur la section Payment
4. ✅ Pas d'avertissement dans la console
5. ✅ Tester avec une **vraie carte** (mode LIVE)
6. ✅ Le paiement doit réussir

---

## 🐛 Dépannage

### Erreur : "Configuration Stripe manquante"

**Cause** : `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` n'est pas définie.

**Solution** :
1. Vérifier que le fichier `.env.local` existe
2. Vérifier que la variable est bien définie
3. Redémarrer le serveur : `npm run dev`

---

### Erreur : "Server missing STRIPE_SECRET_KEY"

**Cause** : `STRIPE_SECRET_KEY` n'est pas définie côté serveur.

**Solution** :
1. **Local** : Ajouter dans `.env.local`
2. **Vercel** : Ajouter dans Settings > Environment Variables
3. Redéployer si sur Vercel

---

### Avertissement : "Clés LIVE en développement"

**Cause** : Vous utilisez des clés LIVE (`pk_live_...`) sur localhost.

**Solution** :
1. Utiliser des clés TEST (`pk_test_...`) pour localhost
2. Les clés LIVE nécessitent HTTPS (disponible uniquement sur Vercel)

---

## 📚 Ressources

- **Dashboard Stripe TEST** : https://dashboard.stripe.com/test/apikeys
- **Dashboard Stripe LIVE** : https://dashboard.stripe.com/apikeys
- **Cartes de test** : https://stripe.com/docs/testing#cards
- **Documentation Stripe** : https://stripe.com/docs

---

## ✨ Résumé

| Environnement | Clés à utiliser | HTTPS requis ? | Configuration |
|---------------|-----------------|----------------|---------------|
| **Localhost** | TEST (`pk_test_`, `sk_test_`) | ❌ Non | `.env.local` |
| **Vercel** | LIVE (`pk_live_`, `sk_live_`) | ✅ Oui (auto) | Vercel Dashboard |

**🎉 Avec cette configuration, vous pouvez pousser sur GitHub sans exposer vos clés !**
