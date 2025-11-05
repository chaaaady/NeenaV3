# 🚀 Déploiement Vercel - Guide Complet

## Étape 1 : Configurer les Variables d'Environnement sur Vercel

### 1.1 Accéder aux Paramètres

1. Aller sur https://vercel.com/dashboard
2. Sélectionner votre projet
3. Cliquer sur **Settings** (⚙️)
4. Cliquer sur **Environment Variables** dans le menu latéral

### 1.2 Ajouter les Variables Stripe

Ajouter ces 2 variables **obligatoires** :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Clé publique Stripe (frontend) |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Clé secrète Stripe (backend) |

**Important** :
- ✅ Cochez **Production** ET **Preview**
- ✅ Utilisez les clés **LIVE** (`pk_live_...` et `sk_live_...`)
- ❌ Ne mettez JAMAIS les clés TEST en production

### 1.3 Obtenir les Clés LIVE

1. Aller sur https://dashboard.stripe.com/apikeys
2. Copier **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Copier **Secret key** → `STRIPE_SECRET_KEY`

---

## Étape 2 : Pusher sur GitHub

### 2.1 Vérifier le `.gitignore`

Assurez-vous que `.gitignore` contient :

```gitignore
.env*
```

**Résultat** : Vos clés locales (`.env.local`) ne seront jamais pushées.

### 2.2 Pusher les Changements

```bash
# Ajouter tous les fichiers
git add .

# Commit
git commit -m "feat: Add V18 with Stripe integration"

# Push vers GitHub
git push origin main
```

---

## Étape 3 : Vérifier le Déploiement

### 3.1 Vercel Déploie Automatiquement

Vercel détecte automatiquement le push et commence le build.

### 3.2 Vérifier les Logs de Build

1. Aller dans l'onglet **Deployments**
2. Cliquer sur le dernier déploiement
3. Vérifier qu'il n'y a pas d'erreurs

### 3.3 Erreurs Courantes

#### Erreur : "STRIPE_SECRET_KEY is undefined"

**Solution** : Les variables d'environnement ne sont pas configurées.
1. Aller dans Settings > Environment Variables
2. Ajouter `STRIPE_SECRET_KEY=sk_live_...`
3. Redéployer : **Deployments > ... > Redeploy**

#### Erreur : "Build failed"

**Solution** : Erreur de lint ou de TypeScript.
1. Vérifier les logs de build
2. Corriger l'erreur localement
3. Pusher à nouveau

---

## Étape 4 : Tester en Production

### 4.1 Accéder au Site

1. Cliquer sur **Visit** dans le dashboard Vercel
2. Ou ouvrir `https://votre-site.vercel.app`

### 4.2 Tester le Flux de Don

1. ✅ Aller sur `/step-amount-v18`
2. ✅ Remplir le formulaire :
   - Montant : 25€
   - Fréquence : Unique
   - Type : Sadaqah
3. ✅ Remplir les informations personnelles
4. ✅ Arriver sur la section Payment
5. ✅ Tester avec une **vraie carte bancaire**

**Attention** : En mode LIVE, les paiements sont **réels** !

### 4.3 Tester avec Mode Test

Si vous voulez tester sans vraies transactions :

1. Utiliser les clés TEST sur Vercel :
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`
   - `STRIPE_SECRET_KEY=sk_test_...`
2. Redéployer
3. Tester avec une carte de test :
   - Numéro : `4242 4242 4242 4242`
   - Date : `12/34`
   - CVC : `123`

---

## Étape 5 : Surveiller les Paiements

### 5.1 Dashboard Stripe

👉 https://dashboard.stripe.com/payments

Vous verrez tous les paiements en temps réel.

### 5.2 Webhooks (Optionnel)

Si vous utilisez des webhooks Stripe :

1. Aller sur https://dashboard.stripe.com/webhooks
2. Ajouter un endpoint :
   - URL : `https://votre-site.vercel.app/api/webhooks/stripe`
   - Événements : `payment_intent.succeeded`, `payment_intent.payment_failed`
3. Copier le **Signing secret** (`whsec_...`)
4. Ajouter sur Vercel :
   - Variable : `STRIPE_WEBHOOK_SECRET`
   - Valeur : `whsec_...`

---

## ✅ Checklist de Déploiement

- [ ] Variables Stripe ajoutées sur Vercel (LIVE keys)
- [ ] `.gitignore` contient `.env*`
- [ ] Code pushé sur GitHub
- [ ] Build Vercel réussi (pas d'erreurs)
- [ ] Site accessible sur `https://votre-site.vercel.app`
- [ ] Page V18 fonctionne : `/step-amount-v18`
- [ ] Formulaire se remplit correctement
- [ ] Section Payment s'affiche (pas d'erreur Stripe)
- [ ] Test de paiement réussi
- [ ] Paiement visible dans Dashboard Stripe

---

## 🐛 Dépannage Avancé

### Problème : "HTTPS required"

**Cause** : Vous utilisez des clés LIVE mais le site n'est pas en HTTPS.

**Solution** : Vercel fournit automatiquement HTTPS, rien à faire.

### Problème : "Webhook signature verification failed"

**Cause** : Le `STRIPE_WEBHOOK_SECRET` est incorrect ou manquant.

**Solution** :
1. Vérifier sur https://dashboard.stripe.com/webhooks
2. Copier le bon **Signing secret**
3. Mettre à jour sur Vercel
4. Redéployer

### Problème : "Payment method declined"

**Cause** : La carte est refusée.

**Solution** :
1. Vérifier dans Dashboard Stripe la raison
2. Tester avec une autre carte
3. Vérifier que le compte Stripe est bien activé

---

## 📚 Ressources

- **Vercel Dashboard** : https://vercel.com/dashboard
- **Stripe Dashboard** : https://dashboard.stripe.com
- **Stripe API Keys** : https://dashboard.stripe.com/apikeys
- **Stripe Webhooks** : https://dashboard.stripe.com/webhooks
- **Stripe Testing** : https://stripe.com/docs/testing

---

## 🎉 C'est Tout !

Une fois ces étapes complétées, votre application V18 est **100% opérationnelle en production** avec Stripe intégré ! 🚀

