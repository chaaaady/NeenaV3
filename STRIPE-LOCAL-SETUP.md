# 🔧 Configuration Stripe pour le développement local

## ⚠️ Problème "must use https"

Ce problème apparaît quand vous utilisez des **clés Stripe LIVE** au lieu des **clés TEST**.

### ✅ Solution : Utiliser les clés de TEST

Les clés Stripe de test acceptent HTTP (localhost), tandis que les clés LIVE exigent HTTPS.

## 📝 Étapes de configuration

### 1. Créez un fichier `.env.local` à la racine du projet

```bash
touch .env.local
```

### 2. Ajoutez vos clés de TEST Stripe

```env
# Clé publique Stripe (TEST MODE)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique_ici

# Clé secrète Stripe (TEST MODE)
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_ici
```

### 3. Obtenez vos clés de test

1. Allez sur : https://dashboard.stripe.com/test/apikeys
2. Copiez la **clé publique** (commence par `pk_test_...`)
3. Copiez la **clé secrète** (commence par `sk_test_...`)
4. Collez-les dans votre fichier `.env.local`

## 🔑 Différence entre les clés

| Type | Format | HTTP autorisé | Utilisation |
|------|--------|---------------|-------------|
| **TEST** | `pk_test_...` / `sk_test_...` | ✅ Oui | Développement local |
| **LIVE** | `pk_live_...` / `sk_live_...` | ❌ Non (HTTPS requis) | Production |

## 🚀 Redémarrer le serveur

Après avoir créé le fichier `.env.local`, redémarrez votre serveur :

```bash
npm run dev
```

## ✨ Tester un paiement

Utilisez les cartes de test Stripe :

- **Succès** : `4242 4242 4242 4242`
- **Date d'expiration** : N'importe quelle date future (ex: 12/34)
- **CVC** : N'importe quel 3 chiffres (ex: 123)

## 📚 Documentation

- [Clés API Stripe](https://stripe.com/docs/keys)
- [Cartes de test](https://stripe.com/docs/testing)

