# 🐛 Correction du Problème de Connexion Dashboard

## 🎯 Problèmes Identifiés

### 1. **Variables d'environnement Supabase (✅ CORRIGÉ)**
- **Problème** : `supabaseClient` dans `src/lib/supabase.ts` utilisait `process.env` avec des valeurs par défaut (`placeholder.supabase.co`)
- **Solution** : Utilisation des variables `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` avec l'opérateur `!` pour forcer TypeScript à reconnaître qu'elles existent
- **Statut** : ✅ Corrigé automatiquement

### 2. **Utilisateur admin non associé à une mosquée (❌ À FAIRE MANUELLEMENT)**
- **Problème** : L'utilisateur `admin@neena.fr` existe dans Supabase Auth mais n'a pas d'entrée correspondante dans la table `mosques`
- **Conséquence** : La connexion réussit mais la redirection échoue car le code ne trouve pas de mosquée associée
- **Solution** : Ajouter une entrée dans la table `mosques` avec le même UUID que l'utilisateur

---

## 🔧 Étapes de Correction Manuelle (À FAIRE)

### **Étape 1 : Récupérer l'UUID de l'utilisateur admin**

1. Connectez-vous à [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet : `ucdbihrugbwubqdbzlzc`
3. Allez dans **Authentication** → **Users**
4. Trouvez l'utilisateur `admin@neena.fr`
5. **Copiez son UUID** (format : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

---

### **Étape 2 : Insérer la mosquée dans la base de données**

1. Dans Supabase Dashboard, allez dans **SQL Editor**
2. Cliquez sur **New Query**
3. Collez ce SQL (en remplaçant `USER_UUID_HERE` par l'UUID copié) :

```sql
-- ⚠️ IMPORTANT: Remplacez USER_UUID_HERE par l'UUID de votre utilisateur admin@neena.fr

INSERT INTO public.mosques (id, slug, name, email, is_active)
VALUES (
  'USER_UUID_HERE',  -- ⚠️ REMPLACEZ CETTE VALEUR
  'admin-neena',
  'Administration Neena',
  'admin@neena.fr',
  true
)
ON CONFLICT (id) DO UPDATE
SET 
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  is_active = EXCLUDED.is_active;
```

4. Cliquez sur **Run** (ou appuyez sur `Ctrl+Enter` / `Cmd+Enter`)
5. Vérifiez que le message `Success. No rows returned` s'affiche

---

### **Étape 3 : Vérifier l'insertion**

Exécutez cette requête pour vérifier que l'entrée a bien été créée :

```sql
SELECT * FROM public.mosques WHERE email = 'admin@neena.fr';
```

Vous devriez voir une ligne avec :
- `id` : UUID de votre utilisateur
- `slug` : `admin-neena`
- `name` : `Administration Neena`
- `email` : `admin@neena.fr`
- `is_active` : `true`

---

## ✅ Test de Connexion

Une fois les corrections effectuées :

1. **Ouvrez** http://localhost:4000/auth/login
2. **Connectez-vous** avec :
   - Email : `admin@neena.fr`
   - Password : [votre mot de passe]
3. **Vérifiez** que vous êtes redirigé vers : http://localhost:4000/mosque/admin-neena/dashboard

---

## 🔍 En cas de problème persistant

### **Erreur : "Invalid login credentials"**
- Vérifiez que vous utilisez le bon mot de passe
- Réinitialisez le mot de passe dans Supabase si nécessaire

### **Erreur : Redirection vers une mauvaise URL**
- Vérifiez que le `slug` dans la table `mosques` est bien `admin-neena`
- Vérifiez que l'`id` dans la table `mosques` correspond bien à l'UUID de l'utilisateur

### **Erreur : "Mosque not found" ou 404**
- Vérifiez que la route `/mosque/[slug]/dashboard` existe bien
- Vérifiez les logs du serveur dans le terminal

### **Console Browser (F12) : Erreurs Supabase**
- Ouvrez la console du navigateur (F12)
- Regardez s'il y a des erreurs rouges liées à Supabase
- Vérifiez que `process.env.NEXT_PUBLIC_SUPABASE_URL` n'est pas `undefined`

---

## 📊 Architecture de la Solution

```
┌─────────────────────────────────────────────────────────────┐
│                     Page de Connexion                        │
│                  /auth/login/page.tsx                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Authentification Supabase                       │
│   supabaseClient.auth.signInWithPassword()                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼ Session créée ✅
┌─────────────────────────────────────────────────────────────┐
│         Recherche de la mosquée associée                     │
│   SELECT slug FROM mosques WHERE id = user.id               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                ┌───────┴───────┐
                │               │
        Mosquée trouvée ✅   Mosquée non trouvée ❌
                │               │
                ▼               ▼
    /mosque/{slug}/dashboard  /admin/dashboard
```

---

## 🎯 Prochaines Étapes Recommandées

1. **Créer une vraie mosquée de test** :
   ```sql
   INSERT INTO public.mosques (slug, name, email, is_active)
   VALUES (
     'mosquee-sahaba-creteil',
     'Mosquée Sahaba - Créteil',
     'contact@mosquee-creteil.fr',
     true
   );
   ```

2. **Créer un utilisateur pour cette mosquée** dans Supabase Auth avec `contact@mosquee-creteil.fr`

3. **Tester la connexion avec les deux comptes** :
   - Admin : `admin@neena.fr` → `/mosque/admin-neena/dashboard`
   - Mosquée : `contact@mosquee-creteil.fr` → `/mosque/mosquee-sahaba-creteil/dashboard`

---

## 📝 Notes Techniques

### Variables d'environnement Next.js
- Les variables **`NEXT_PUBLIC_*`** sont **injectées au build time**
- Elles sont accessibles via `process.env.NEXT_PUBLIC_*` côté client ET serveur
- Elles sont **remplacées statiquement** dans le code JavaScript final

### Supabase Auth Helpers
- `createClientComponentClient()` : Pour les composants client avec auth
- `createClient()` : Pour une utilisation générale (client ou serveur)
- `createMiddlewareClient()` : Pour le middleware Next.js

### Relations Base de Données
La table `mosques` utilise l'`id` de l'utilisateur Supabase Auth comme clé primaire :
- ✅ **Avantage** : Lien direct entre utilisateur et mosquée
- ⚠️ **Inconvénient** : Nécessite de créer manuellement l'entrée après création du user
- 💡 **Solution future** : Trigger Supabase pour créer automatiquement l'entrée

---

**Dernière mise à jour** : 21 octobre 2024  
**Auteur** : AI Assistant (Claude Sonnet 4.5)

