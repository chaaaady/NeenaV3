# 🔔 Configuration Webhook Stripe - Guide Complet

## 🎯 Objectif

Le webhook Stripe permet de recevoir automatiquement les notifications de paiement pour enregistrer les donations dans Supabase en temps réel.

---

## 📋 Étapes de Configuration

### **Étape 1 : Aller sur le Dashboard Stripe**

1. Connectez-vous sur : https://dashboard.stripe.com/
2. Assurez-vous d'être en **mode TEST** (bouton en haut à droite)
3. Allez dans : **Developers** > **Webhooks**
   - URL directe : https://dashboard.stripe.com/test/webhooks

---

### **Étape 2 : Créer un Nouveau Webhook**

1. Cliquez sur le bouton **"+ Add endpoint"** (ou "+ Ajouter un endpoint")

2. **Endpoint URL** : 
   ```
   https://votre-domaine.vercel.app/api/webhooks/stripe
   ```
   
   **⚠️ IMPORTANT** : 
   - Pour la **production**, utilisez votre vraie URL Vercel : `https://neena-v3.vercel.app/api/webhooks/stripe`
   - Pour le **développement local**, voir la section "Test en Local" ci-dessous

3. **Description** (optionnel) :
   ```
   Webhook pour enregistrer les donations dans Supabase
   ```

---

### **Étape 3 : Sélectionner les Événements**

Cliquez sur **"Select events"** et cochez les événements suivants :

#### ✅ **Événements Requis** :

- `payment_intent.succeeded` ✅
  - **Pourquoi** : Déclenché quand un paiement est confirmé et réussi
  - **Action** : Enregistre la donation dans Supabase

- `payment_intent.payment_failed` ✅
  - **Pourquoi** : Déclenché quand un paiement échoue
  - **Action** : Permet de logger les échecs

#### 📌 **Événements Optionnels** (recommandés) :

- `charge.refunded` (pour gérer les remboursements)
- `payment_intent.canceled` (pour gérer les annulations)

**Récapitulatif** : Sélectionnez au minimum `payment_intent.succeeded`

Cliquez sur **"Add events"**

---

### **Étape 4 : Créer le Webhook**

1. Cliquez sur **"Add endpoint"** pour finaliser
2. Vous serez redirigé vers la page de détails du webhook

---

### **Étape 5 : Copier le Signing Secret**

Sur la page de détails du webhook :

1. Localisez la section **"Signing secret"**
2. Cliquez sur **"Reveal"** (ou "Révéler")
3. Copiez la clé qui commence par `whsec_...`

   Exemple : `whsec_abcdef1234567890...`

---

### **Étape 6 : Mettre à Jour `.env.local`**

Ouvrez le fichier `.env.local` et remplacez :

```bash
# ❌ AVANT
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_will_go_here

# ✅ APRÈS (avec votre vraie clé)
STRIPE_WEBHOOK_SECRET=whsec_abcdef1234567890...
```

---

### **Étape 7 : Déployer sur Vercel**

Si votre application est déjà sur Vercel :

1. Allez sur : https://vercel.com/dashboard
2. Sélectionnez votre projet **NeenaV3**
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez la variable :
   - **Name** : `STRIPE_WEBHOOK_SECRET`
   - **Value** : `whsec_abcdef1234567890...` (votre clé)
   - **Environment** : Cochez **Production**, **Preview**, **Development**
5. Cliquez sur **Save**

⚠️ **Important** : Redéployez votre application pour que les changements prennent effet :
```bash
git commit -m "Update webhook config"
git push origin main
```

Ou depuis Vercel Dashboard : **Deployments** > **Redeploy**

---

## 🧪 Test en Local (Développement)

Pour tester le webhook en local (avant de déployer), utilisez **Stripe CLI** :

### **1. Installer Stripe CLI**

**macOS** :
```bash
brew install stripe/stripe-cli/stripe
```

**Windows** :
Téléchargez depuis : https://github.com/stripe/stripe-cli/releases

**Linux** :
```bash
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.0/stripe_1.19.0_linux_x86_64.tar.gz
tar -xvf stripe_1.19.0_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

### **2. Se Connecter à Stripe**

```bash
stripe login
```

Suivez les instructions pour autoriser l'accès.

### **3. Écouter les Webhooks en Local**

Dans un nouveau terminal, lancez :

```bash
stripe listen --forward-to localhost:4000/api/webhooks/stripe
```

Vous verrez un message comme :
```
> Ready! Your webhook signing secret is whsec_abc123... (^C to quit)
```

### **4. Copier le Secret Local**

Copiez le `whsec_...` affiché et mettez-le dans `.env.local` :

```bash
STRIPE_WEBHOOK_SECRET=whsec_abc123...
```

### **5. Tester un Paiement**

Dans un autre terminal, simulez un paiement :

```bash
stripe trigger payment_intent.succeeded
```

Vous devriez voir dans les logs :
- ✅ Webhook reçu
- ✅ Donation enregistrée dans Supabase

---

## ✅ Validation du Webhook

### **1. Vérifier que le Webhook est Actif**

Sur le dashboard Stripe : https://dashboard.stripe.com/test/webhooks

Vous devriez voir :
- ✅ **Status** : Enabled
- ✅ **Events** : `payment_intent.succeeded`
- ✅ **Endpoint URL** : `https://votre-domaine.vercel.app/api/webhooks/stripe`

### **2. Tester un Vrai Paiement**

1. Allez sur votre application : `https://neena-v3.vercel.app/step-amount-v2`
2. Faites un paiement de test avec :
   ```
   Carte : 4242 4242 4242 4242
   Date : 12/34
   CVC : 123
   ```
3. Une fois le paiement validé, vérifiez :

**Dans Stripe Dashboard** :
- Allez dans **Developers** > **Webhooks** > Votre webhook
- Cliquez sur **"View logs"**
- Vous devriez voir un événement `payment_intent.succeeded` avec **Status : 200 OK**

**Dans Supabase** :
- Allez sur : https://supabase.com/dashboard/project/YOUR_PROJECT/editor
- Ouvrez la table `donations`
- Vérifiez qu'une nouvelle ligne a été créée avec :
  - `stripe_payment_intent_id` = `pi_xxx...`
  - `status` = `succeeded`
  - `amount` = montant du test
  - `mosque_id` = ID de la mosquée sélectionnée

---

## 🐛 Dépannage

### **Erreur : "No signatures found matching the expected signature"**

**Cause** : Le `STRIPE_WEBHOOK_SECRET` est incorrect ou manquant

**Solution** :
1. Vérifiez que `STRIPE_WEBHOOK_SECRET` est bien dans `.env.local` (local) ou Vercel Variables (prod)
2. Vérifiez que la clé commence par `whsec_`
3. Redémarrez le serveur (local) ou redéployez (Vercel)

---

### **Erreur : Webhook Returns 404**

**Cause** : L'URL du webhook est incorrecte

**Solution** :
1. Vérifiez que l'URL est bien : `https://votre-domaine.vercel.app/api/webhooks/stripe`
2. Vérifiez que le fichier `src/app/api/webhooks/stripe/route.ts` existe
3. Testez manuellement : `curl https://votre-domaine.vercel.app/api/webhooks/stripe` (devrait retourner 405 Method Not Allowed, pas 404)

---

### **Erreur : Webhook Returns 500**

**Cause** : Erreur dans le code du webhook (souvent Supabase non configuré)

**Solution** :
1. Vérifiez les logs Vercel : https://vercel.com/dashboard > Votre projet > Functions
2. Vérifiez que Supabase est configuré (URL, clés dans Vercel Variables)
3. Vérifiez que la table `donations` existe dans Supabase

---

### **La Donation n'Apparaît pas dans Supabase**

**Vérifications** :
1. ✅ Le webhook a bien reçu l'événement (logs Stripe)
2. ✅ Le webhook a retourné 200 OK (logs Stripe)
3. ✅ Les variables Supabase sont configurées dans Vercel
4. ✅ La table `donations` existe et les RLS sont corrects
5. ✅ Le `mosque_id` dans les métadonnées Stripe correspond à un ID valide dans la table `mosques`

---

## 📊 Monitoring

### **Logs Stripe**

Consultez les logs de webhook :
https://dashboard.stripe.com/test/webhooks/WEBHOOK_ID/logs

Pour chaque événement, vous verrez :
- ✅ **200 OK** : Webhook traité avec succès
- ❌ **4xx/5xx** : Erreur (cliquez pour voir les détails)

### **Logs Vercel**

Consultez les logs de la fonction webhook :
https://vercel.com/dashboard > Votre projet > **Functions** > Filtrez par `/api/webhooks/stripe`

---

## 🔐 Sécurité

### ✅ Bonnes Pratiques

1. **Ne partagez JAMAIS votre `STRIPE_WEBHOOK_SECRET`**
   - Ne le committez pas dans Git
   - Gardez-le dans `.env.local` (local) et Vercel Variables (prod)

2. **Vérifiez toujours la signature**
   - Le code dans `route.ts` utilise `stripe.webhooks.constructEvent()` qui vérifie automatiquement la signature
   - Ne désactivez jamais cette vérification

3. **Utilisez HTTPS en production**
   - Vercel fournit HTTPS par défaut ✅
   - Stripe refuse les webhooks HTTP non sécurisés

4. **Webhook Secret différent pour TEST et PRODUCTION**
   - TEST : `whsec_...` (depuis dashboard TEST)
   - PROD : `whsec_...` (depuis dashboard LIVE - quand vous passerez en prod)

---

## 🎯 Checklist Finale

Avant de considérer le webhook comme configuré :

- [ ] Webhook créé sur Stripe Dashboard
- [ ] Événement `payment_intent.succeeded` sélectionné
- [ ] Signing Secret copié et ajouté dans `.env.local` et Vercel
- [ ] Application redéployée (si changements)
- [ ] Test de paiement effectué avec `4242 4242 4242 4242`
- [ ] Webhook a retourné **200 OK** dans les logs Stripe
- [ ] Donation apparaît dans la table `donations` de Supabase
- [ ] `mosque_id`, `amount`, `stripe_payment_intent_id` sont corrects

---

## ✅ Résumé Ultra-Rapide

```bash
# 1. Créer le webhook sur Stripe Dashboard
URL: https://neena-v3.vercel.app/api/webhooks/stripe
Événement: payment_intent.succeeded

# 2. Copier le Signing Secret (whsec_...)

# 3. Ajouter dans Vercel
Settings > Environment Variables
STRIPE_WEBHOOK_SECRET=whsec_...

# 4. Redéployer
git push origin main

# 5. Tester avec 4242 4242 4242 4242

# 6. Vérifier dans Supabase > donations
```

---

## 📚 Ressources

- [Stripe Webhooks Dashboard](https://dashboard.stripe.com/test/webhooks)
- [Documentation Webhooks Stripe](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Tester les Webhooks](https://stripe.com/docs/webhooks/test)

---

## 🎉 Validation Finale

Tout fonctionne si :

1. ✅ Paiement sur le site → Donation dans Supabase en **< 5 secondes**
2. ✅ Logs Stripe → **200 OK**
3. ✅ Dashboard mosquée → La donation s'affiche
4. ✅ Montant, donateur, mosquée → Tout est correct

**Bravo ! Votre système de donation est opérationnel ! 🚀**







