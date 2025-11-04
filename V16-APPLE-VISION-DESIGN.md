# 🍎 V16 "Apple Vision" - Design System Documentation

## 🎨 Philosophy de Design (Inspiré Apple)

Cette refonte complète applique les principes de design d'Apple pour créer une expérience **premium, épurée et émotionnelle**.

---

## ✨ Innovations Majeures

### 1. **Hero Section Interactive**

```
┌──────────────────────────────────────┐
│  [✨ Don sécurisé et transparent]   │
│                                      │
│     Soutenez la Mosquée de          │
│     [Créteil →]                     │  ← Interactive
│                                      │
│  Chaque contribution aide à         │
│  maintenir un lieu de culte...      │
└──────────────────────────────────────┘
```

**Détails** :
- Badge animé avec icône ✨
- Titre géant (42px) en bold 900
- Sélecteur de mosquée cliquable avec flèche
- Sous-titre engageant
- Spacing généreux (space-y-6)

### 2. **Live Summary Card (Sticky)** 🔥

```
┌─────────────────────────────────────┐
│  💚  Votre contribution             │
│      75 €                           │  ← Reste visible
│                          ✅ Mensuel │     en scrollant
│      Déduction fiscale : 49.50 €   │
└─────────────────────────────────────┘
```

**Détails** :
- Position `sticky top-24`
- Affichage en temps réel du montant
- Badge de fréquence
- Icône Heart avec gradient
- Calcul automatique de la déduction fiscale

### 3. **Step Indicators Élégants**

```
[1] Choisissez votre montant
[2] Vos informations
[3] Paiement sécurisé
```

**Détails** :
- Cercles numérotés glassmorphism
- Titres en 2xl-3xl font-bold
- Hiérarchie visuelle claire

### 4. **Enhanced Amount Selection**

```
┌───────────────────────────────┐
│  Fréquence de don             │
│  [Recommandé : Mensuel] ← Badge
│                               │
│  [Unique][Vendredi][Mensuel]  │
│                               │
│  ┌─────────────────────────┐  │
│  │  [5€][10€][25€]        │  │
│  │  [50€][75€][100€]      │  │  ← Grid 2x3
│  │                         │  │
│  │  [Autre montant _____ €]│  │
│  └─────────────────────────┘  │
└───────────────────────────────┘
```

**Détails** :
- Label avec badge "Recommandé"
- Grid d'amount avec sliding selector
- Input custom montant avec € à droite
- Display géant (text-5xl) quand montant personnalisé

### 5. **Tax Benefit Highlight** 💚

```
┌────────────────────────────────────┐
│  ✅  Avantage fiscal : 49.50 €     │
│                                    │  ← Gradient
│      Votre don de 75 € ne vous    │     emerald
│      coûtera que 25.50 € après    │
│      déduction fiscale de 66%     │
└────────────────────────────────────┘
```

**Détails** :
- Background gradient emerald/green
- Border emerald
- Check icon dans un cercle
- Breakdown clair et engageant

### 6. **Personal Info Section**

```
┌──────────────────────────────────┐
│  [Personnel][Entreprise]         │
│                                  │
│  [Prénom]        [Nom]          │  ← Grid 2 cols
│  [Email_____________]           │  ← Full width
│  [Adresse___________]           │
│                                  │
│  🛡️ Reçu fiscal        [ON]     │  ← Shield icon
│     Recevez automatiquement...  │
└──────────────────────────────────┘
```

**Détails** :
- Inputs plus grands (h-14)
- Grid responsive (1 col mobile, 2 cols desktop)
- Toggle reçu fiscal avec Shield icon
- Explication sous le toggle

### 7. **Payment Section Premium**

**Avant d'être prêt** :
```
┌─────────────────────────────┐
│        🔒                   │
│                             │
│  Complétez les étapes       │  ← État vide
│  précédentes pour           │     élégant
│  accéder au paiement        │
└─────────────────────────────┘
```

**Quand prêt** :
```
┌─────────────────────────────────┐
│  Couvrir les frais (0.90 €) [ON]│
│  Assurez-vous que 100%...       │
│  ─────────────────────────────  │
│                                  │
│  Total            75.90 €       │  ← Huge
│                   Chaque mois   │
│                                  │
│  [Stripe Payment Form]          │
└─────────────────────────────────┘
```

**Détails** :
- Fee toggle avec explication claire
- Total affiché en text-4xl
- Stripe integration seamless
- Trust indicators en bas (🛡️ ✅)

### 8. **Trust Indicators Footer**

```
    🛡️ Paiement sécurisé    ✅ 100% transparent
```

**Détails** :
- Icônes + texte
- Couleur white/60 (subtile)
- Centré en bas de page

---

## 🎨 Design Tokens

### Spacing
```
Section spacing:     space-y-12  (3rem)
Card padding:        p-8, p-10   (2rem, 2.5rem)
Element spacing:     space-y-6, space-y-8
Grid gap:            gap-4, gap-6
```

### Typography
```
Hero title:          text-[42px] font-[900]
Section title:       text-2xl/3xl font-bold
Body large:          text-lg
Body regular:        text-base
Small text:          text-sm
Tiny text:           text-xs
```

### Colors (Glassmorphism)
```
Card background:     bg-white/[0.20] via white/[0.15] to white/[0.10]
Card border:         border-white/20
Input background:    bg-white/[0.08]
Input border:        border-white/10
Hover states:        bg-white/10, border-white/20
```

### Border Radius
```
Cards:               rounded-3xl  (24px)
Inputs:              rounded-2xl  (16px)
Badges:              rounded-full
Buttons:             rounded-xl   (12px)
```

### Shadows
```
Cards:               shadow-2xl
Elevated elements:   shadow-lg
Sticky elements:     shadow-xl
```

---

## 🎬 Animations

### Page Load
```tsx
animate-in fade-in slide-in-from-bottom-4 duration-700
```

**Staggered delays** :
- Hero : `duration-700` (instant)
- Section 1 : `delay-100` (100ms)
- Section 2 : `delay-200` (200ms)
- Section 3 : `delay-300` (300ms)

### Interactions
- Hover : `transition-all duration-200`
- Button press : `scale-[1.02]` (active)
- Toggle switch : `transition-transform`

---

## 🧩 Components Library

### Glass Components Created

1. **GlassCard** - Card avec glassmorphism
2. **GlassInput** - Input glassmorphism (h-11 ou h-14)
3. **GlassRadioGroup** - Toggle/slider pour choix
4. **GlassAmountGrid** - Grid 2x3 avec sliding selector
5. **GlassSwitch** - Toggle switch glassmorphism
6. **GlassBadge** - Badge avec variants (default, success, warning, info)

### Icons Used (Lucide React)

- `Sparkles` - Hero badge
- `Heart` - Summary card
- `Check` - Success states
- `Shield` - Security indicators
- `ArrowRight` - Navigation

---

## 📱 Responsive Behavior

### Mobile (< 768px)
- Single column layout
- Full-width cards
- Padding reduced (p-6 instead of p-10)
- Text sizes adjusted (text-[32px] instead of text-[42px])
- Grid becomes 1 column for inputs

### Desktop (≥ 768px)
- Max width: `max-w-2xl` (672px)
- Two-column grids for inputs
- Larger text sizes
- More generous padding

---

## 🎯 UX Improvements vs V13-V15

| Feature | V13-V15 | V16 Apple Vision |
|---------|---------|------------------|
| **Hero Section** | ❌ Absent | ✅ Large, engaging |
| **Live Summary** | ❌ Absent | ✅ Sticky, real-time |
| **Step Numbers** | ❌ Absent | ✅ Clear indicators |
| **Tax Benefit** | Simple text | ✅ Gradient card avec icon |
| **Amount Display** | Normal | ✅ Huge (text-5xl) |
| **Input Height** | h-11 | ✅ h-14 (plus accessible) |
| **Card Padding** | p-6 | ✅ p-8 to p-10 |
| **Spacing** | space-y-8 | ✅ space-y-12 |
| **Typography** | text-[20px] | ✅ text-[42px] hero |
| **Animations** | Basic | ✅ Staggered, fluid |
| **Trust Elements** | ❌ Absent | ✅ Footer indicators |
| **Empty States** | Generic | ✅ Icon + message |
| **Badges** | ❌ Absent | ✅ Multiple variants |

---

## 🚀 Performance

Toutes les optimisations de V13-V15 sont conservées :
- ✅ Video lazy-load (`preload="none"`)
- ✅ Poster image
- ✅ WebM fallback
- ✅ Playback speed (1.25x)
- ✅ iOS safe areas
- ✅ Theme color matching

---

## 🔄 Migration Path

Pour appliquer ce design aux autres pages :

1. **Utiliser les composants Glass** de `src/components/ui/glass-*`
2. **Suivre les spacing guidelines** (space-y-12, p-8/p-10)
3. **Ajouter les animations** avec `animate-in fade-in`
4. **Implémenter la hero section** pour chaque page
5. **Utiliser GlassBadge** pour les highlights
6. **Ajouter des step indicators** pour les flows multi-étapes

---

## 📊 A/B Testing Recommendations

Éléments à tester :
1. **Hero section** : avec vs sans
2. **Live summary card** : sticky vs static
3. **Tax benefit card** : gradient vs simple
4. **Step indicators** : numérotés vs bullet points
5. **Input height** : h-11 vs h-14
6. **Card padding** : p-6 vs p-8 vs p-10

---

## 🎨 Color Palette Used

```css
/* Primary - Blues */
--theme-primary: #3b5a8f;
--video-overlay: rgba(0,0,0,0.3);
--gradient-blue: rgba(59,130,246,0.2) to rgba(37,99,235,0.3);

/* Success - Emerald/Green */
--success-bg: from-emerald-500/20 to-green-500/20;
--success-border: emerald-400/30;
--success-text: emerald-100;

/* Glass - White with opacity */
--glass-card: white/[0.20] to white/[0.10];
--glass-border: white/20;
--glass-input: white/[0.08];
--glass-hover: white/10;

/* Text */
--text-primary: white;
--text-secondary: white/80;
--text-muted: white/60;
```

---

## ✅ Accessibility

- ✅ Labels clairs pour tous les inputs
- ✅ ARIA labels pour les toggles
- ✅ Contraste suffisant (AA minimum)
- ✅ Focus visible sur tous les éléments
- ✅ Keyboard navigation
- ✅ Screen reader friendly

---

## 🎉 Result

**V16 Apple Vision** offre :
- 🍎 Design premium et épuré
- ✨ Expérience émotionnelle
- 🎯 Conversion optimisée
- 💡 Clarté maximale
- 🚀 Performance maintenue
- 📱 Mobile-first

**Test sur** : `localhost:4000/step-amount-v16`

---

**Made with 🤍 by AI Product Designer**

