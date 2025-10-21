# 🔑 Configuration Stripe - Guide Complet

## 🚨 Erreur Actuelle

```
Invalid API Key provided: sk_test_***********************here
```

**Cause** : La clé Stripe dans `.env.local` est un placeholder (exemple) et n'est pas valide.

---

## ✅ Solution : Obtenir vos vraies clés Stripe

### Étape 1 : Créer/Se connecter à votre compte Stripe

1. Allez sur : https://stripe.com/
2. Cliquez sur **"Sign in"** (ou **"Start now"** si nouveau compte)
3. Connectez-vous avec votre email

### Étape 2 : Accéder aux clés API

1. Une fois connecté, allez sur : https://dashboard.stripe.com/test/apikeys
2. Vous êtes dans l'onglet **"Developers" > "API keys"**
3. Assurez-vous d'être en mode **TEST** (bouton en haut à droite)

### Étape 3 : Copier les clés

Vous verrez 2 types de clés :

#### 📘 Publishable key (Clé publique)
```
pk_test_51Hxxx...
```
- **Visible par défaut**
- Utilisée côté client (frontend)
- Pas de risque si exposée publiquement

#### 🔒 Secret key (Clé secrète)
```
sk_test_51Hxxx...
```
- **Cachée par défaut** - Cliquez sur **"Reveal test key"** pour l'afficher
- Utilisée côté serveur (backend)
- ⚠️ **NE JAMAIS LA PARTAGER OU LA COMMITTER**

### Étape 4 : Mettre à jour `.env.local`

Ouvrez le fichier `.env.local` à la racine du projet et remplacez :

```bash
# ❌ AVANT (Placeholder)
STRIPE_SECRET_KEY=sk_test_put_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_put_your_key_here

# ✅ APRÈS (Vos vraies clés)
STRIPE_SECRET_KEY=sk_test_51XXXXXXXXXX (votre clé de test)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51XXXXXXXXXX (votre clé de test)
```

### Étape 5 : Redémarrer le serveur

Le serveur Next.js doit être redémarré pour charger les nouvelles variables :

```bash
# Arrêter le serveur actuel
lsof -ti:4000 | xargs kill -9 2>/dev/null

# Redémarrer
npm run dev -- -p 4000
```

**Important** : Le message doit afficher :
```
- Environments: .env.local
```

---

## 🧪 Test de Configuration

### 1. Vérifier que les clés sont chargées

Dans le terminal du serveur, vous ne devriez **PAS** voir :
```
❌ Invalid API Key provided
```

### 2. Tester un paiement

1. Allez sur : http://localhost:4000/step-amount-v2
2. Sélectionnez un montant (ex: 5€)
3. Remplissez les informations personnelles
4. À l'étape paiement, utilisez une **carte de test Stripe** :

**Carte qui fonctionne** :
```
Numéro : 4242 4242 4242 4242
Date : n'importe quelle date future (ex: 12/34)
CVC : n'importe quel 3 chiffres (ex: 123)
```

**Autres cartes de test** :
- ❌ Carte déclinée : `4000 0000 0000 0002`
- 🔒 Requiert 3D Secure : `4000 0027 6000 3184`

### 3. Vérifier le webhook (optionnel)

Pour tester les webhooks en local, utilisez Stripe CLI :

```bash
# Installer Stripe CLI : https://stripe.com/docs/stripe-cli
stripe login

# Écouter les webhooks
stripe listen --forward-to localhost:4000/api/webhooks/stripe
```

Copiez le **webhook signing secret** affiché (commence par `whsec_...`) et ajoutez-le dans `.env.local` :

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📝 Checklist Complète

- [ ] Compte Stripe créé/connecté
- [ ] Mode TEST activé sur le dashboard
- [ ] `STRIPE_SECRET_KEY` copié et collé dans `.env.local`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` copié et collé dans `.env.local`
- [ ] Serveur redémarré
- [ ] Test de paiement avec `4242 4242 4242 4242` réussi
- [ ] (Optionnel) Webhook configuré avec Stripe CLI

---

## 🛡️ Sécurité

### ✅ Bonnes Pratiques

1. **Ne committez JAMAIS `.env.local`**
   - Déjà dans `.gitignore` ✅
   - Vérifiez : `git status` ne doit pas le lister

2. **Utilisez les clés de TEST en développement**
   - Préfixe : `sk_test_...` et `pk_test_...`
   - Pas de vrais paiements

3. **Clés de PRODUCTION sur Vercel**
   - Allez sur : Vercel > Project > Settings > Environment Variables
   - Ajoutez `STRIPE_SECRET_KEY` (secret key de production : `sk_live_...`)
   - Ajoutez `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (publishable key : `pk_live_...`)

### ❌ À NE JAMAIS FAIRE

- ❌ Exposer `STRIPE_SECRET_KEY` dans le code frontend
- ❌ Committer `.env.local` dans Git
- ❌ Partager vos clés secrètes publiquement
- ❌ Utiliser les clés de production en développement

---

## 🔍 Dépannage

### Erreur : "Invalid API Key provided"

**Cause** : Clé incorrecte ou placeholder

**Solution** :
1. Vérifiez que la clé dans `.env.local` commence par `sk_test_51`
2. Vérifiez qu'il n'y a pas d'espaces avant/après la clé
3. Redémarrez le serveur

### Erreur : "No such customer"

**Cause** : Vous utilisez une clé de test avec des données de production (ou inverse)

**Solution** : Utilisez les bonnes clés pour le bon environnement

### Le paiement ne fonctionne pas

**Vérifications** :
1. Mode TEST activé sur Stripe dashboard
2. Carte de test utilisée (`4242 4242 4242 4242`)
3. Pas d'erreur dans la console navigateur (F12)
4. Pas d'erreur dans les logs serveur

---

## 📚 Ressources

- [Stripe API Keys](https://dashboard.stripe.com/test/apikeys)
- [Cartes de test Stripe](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Webhooks Stripe](https://dashboard.stripe.com/test/webhooks)

---

## ✅ Validation Finale

Une fois configuré correctement, vous devriez pouvoir :

1. ✅ Accéder à la page de paiement sans erreur
2. ✅ Voir le formulaire de carte bancaire Stripe
3. ✅ Payer avec `4242 4242 4242 4242` avec succès
4. ✅ Être redirigé vers `/merci`
5. ✅ Voir le webhook enregistrer la donation dans Supabase (si configuré)

**Tout fonctionne ?** → Vous êtes prêt ! 🎉

