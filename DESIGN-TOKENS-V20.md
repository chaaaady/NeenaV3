# Design Tokens - Step Amount V20

## 🎨 Rythmique Verticale Cohérente

Ce document définit tous les espacements pour garantir une cohérence visuelle parfaite entre toutes les cartes, qu'elles soient fermées, déployées ou en mode peek.

---

## 📏 Espacements Globaux

### Gaps entre cartes
```typescript
CARD_GAP = 8px              // Espacement entre toutes les cartes (repliées, déployées, peek)
```

### Hauteurs fixes
```typescript
CARD_COLLAPSED_HEIGHT = 72px  // Hauteur des cartes repliées
PEEK_HEIGHT = 72px            // Hauteur du peek
HEADER_HEIGHT = 64px          // Hauteur du header principal
```

---

## 📦 Espacements Internes des Cartes

### Padding des cartes
```typescript
Card Padding (horizontal) = 24px (1.5rem)  // Padding horizontal identique partout
Card Content Padding = 24px (p-6)          // Padding du contenu interne
```

### Espacements verticaux dans le contenu
```typescript
space-y-6 = 24px  // Espacement principal entre sections majeures
space-y-4 = 16px  // Espacement entre éléments d'une même section
space-y-3 = 12px  // Espacement entre sous-éléments (deprecated, remplacé par space-y-4)
```

---

## 🎯 Application par Carte

### Carte "Montant" (Amount)
```tsx
Container: space-y-6 (24px entre sections)
├─ Titre (h2)
├─ Segmented Control (Unique/Jumuaa/Mensuel)
├─ Bloc montants (rounded-2xl bg-white/5 p-4)
│  └─ space-y-4 (16px entre pills et input)
├─ Info déduction fiscale (rounded-xl bg-white/10 p-4)
│  └─ mt-2 (8px entre lignes de texte)
└─ Segmented Control (Sadaqah/Zakat)
```

### Carte "Informations" (Info)
```tsx
Container: space-y-6 (24px entre sections)
├─ Titre (h2)
├─ Segmented Control (Personnel/Entreprise)
├─ Formulaire
│  └─ space-y-4 (16px entre champs)
└─ Bloc reçu fiscal (rounded-xl bg-white/10 p-4)
   └─ mt-2 (8px entre toggle et texte)
```

### Carte "Paiement" (Payment)
```tsx
Container: space-y-6 (24px entre sections)
├─ Titre (h2)
├─ Bloc frais bancaires (rounded-xl bg-white/10 p-4)
│  └─ mt-2 (8px entre toggle et texte)
├─ Stripe Payment Element
└─ Bouton "Payer maintenant"
```

---

## 🔄 États des Cartes

### Carte Repliée (Collapsed)
```tsx
Height: 72px
Padding: 0 1.5rem (24px horizontal)
Display: flex items-center (centrage vertical)
Gap entre cartes: 8px
```

### Carte Déployée (Expanded)
```tsx
Top: topOffset + 8px (CARD_GAP après les cartes repliées)
Bottom: PEEK_HEIGHT + 8px (CARD_GAP avant le peek)
Padding interne: p-6 (24px)
Content: space-y-6 (24px entre sections)
```

### Peek (Bottom Sheet)
```tsx
Height: 72px
Bottom: 0px (collé en bas)
Padding: 0 1.5rem (24px horizontal)
Display: flex items-center (centrage vertical)
Gap avant le peek: 8px
```

---

## ✅ Règles de Cohérence

### 1. Espacements Verticaux Principaux
- **24px (space-y-6)** : Entre sections majeures d'une carte
- **16px (space-y-4)** : Entre éléments d'une même section
- **8px (mt-2)** : Entre lignes de texte ou sous-éléments

### 2. Espacements Entre Cartes
- **8px (CARD_GAP)** : Identique partout
  - Entre cartes repliées
  - Entre carte repliée et carte déployée
  - Entre carte déployée et peek

### 3. Padding Horizontal
- **24px (1.5rem)** : Identique pour toutes les cartes (repliées, déployées, peek)

### 4. Blocs d'Information
- **rounded-xl** : Border radius pour les blocs info
- **bg-white/10 border border-white/15** : Style uniforme
- **p-4** : Padding interne (16px)
- **mt-2** : Espacement entre label et texte explicatif

---

## 🎨 Hiérarchie Visuelle

```
Header (64px)
  ↓ [pas de gap si première carte]
Carte Repliée 1 (72px)
  ↓ 8px
Carte Repliée 2 (72px)
  ↓ 8px
Carte Déployée (hauteur variable)
  ↓ 8px
Peek (72px)
  ↓ 0px (collé en bas)
Bottom
```

---

## 🚀 Avantages

✅ **Cohérence** : Tous les espacements sont identiques entre états
✅ **Lisibilité** : Hiérarchie claire avec 3 niveaux d'espacement (24px, 16px, 8px)
✅ **Maintenabilité** : Tokens centralisés faciles à modifier
✅ **UX** : Rythmique visuelle fluide et prévisible

---

## 📝 Notes d'Implémentation

- Tous les `space-y-3` (12px) ont été remplacés par `space-y-4` (16px) pour uniformiser
- Les `mt-1` (4px) ont été remplacés par `mt-2` (8px) pour respecter la grille de 8px
- Le `CARD_GAP` de 8px est appliqué **systématiquement** entre tous les éléments empilés
- Le padding horizontal de 24px est **identique** pour toutes les cartes (collapsed, expanded, peek)

---

*Dernière mise à jour : 2025-01-21*

