# 📱 V18 "Collapsible Cards" - iOS-Inspired Design

## 💡 Concept

Une **UX révolutionnaire** inspirée des notifications iOS où les cartes se **rétractent automatiquement** quand vous scrollez, créant un récapitulatif toujours visible en haut de page.

**Philosophy** : Les cartes complétées deviennent des "notifications" sticky, libérant l'espace pour la prochaine étape.

---

## 🎨 Visual Flow

### État Initial (Scroll = 0)

```
┌──────────────────────────┐
│ HEADER                   │
├──────────────────────────┤
│                          │
│ 💰 CARD 1: MONTANT      │
│ [Expanded - Full form]  │
│                          │
├──────────────────────────┤
│                          │
│ 👤 CARD 2: INFO         │
│ [Expanded - Full form]  │
│                          │
├──────────────────────────┤
│                          │
│ 💳 CARD 3: PAIEMENT     │
│ [Expanded - Full form]  │
│                          │
└──────────────────────────┘
```

### Après Scroll (Card 1 Complétée)

```
┌──────────────────────────┐
│ HEADER                   │
├──────────────────────────┤
│ Hero Section             │
├──────────────────────────┤
│ 💰 25€ • Mensuel • Zakat │ ← Collapsed (In-place)
├──────────────────────────┤
│                          │
│ 👤 CARD 2: INFO         │
│ [Expanded - Full form]  │
│                          │
├──────────────────────────┤
│                          │
│ 💳 CARD 3: PAIEMENT     │
│ [Expanded - Full form]  │
│                          │
└──────────────────────────┘
```

### Scroll Final (Cards 1 & 2 Complétées)

```
┌──────────────────────────┐
│ HEADER                   │
├──────────────────────────┤
│ Hero Section             │
├──────────────────────────┤
│ 💰 25€ • Mensuel • Zakat │ ← Collapsed (In-place)
├──────────────────────────┤
│ 👤 Jean Dupont           │ ← Collapsed (In-place)
│    jean@email.com        │
├──────────────────────────┤
│                          │
│ 💳 CARD 3: PAIEMENT     │
│ [Expanded - Full form]  │
│                          │
│ • Fee toggle             │
│ • Total display          │
│ • Stripe form            │
│                          │
└──────────────────────────┘
```

---

## ✨ Key Features

### 1. 📱 **iOS Notification Style**

Les cartes rétractées ressemblent aux notifications iOS :

```tsx
┌────────────────────────────────────┐
│ 💰  25€                            │
│     Mensuel • Zakat                │  ← Tappable
└────────────────────────────────────┘
```

**Design** :
- Rounded corners (`rounded-2xl`)
- Glassmorphism effect
- Icon sur la gauche (emoji ou Lucide)
- Texte principal en gras
- Texte secondaire en smaller/lighter
- Chevron down pour indiquer "expand"
- Hover effect (brightness increase)

### 2. 🔄 **Auto-Collapse on Scroll**

```typescript
useEffect(() => {
  const handleScroll = () => {
    const amountRect = amountCardRef.current.getBoundingClientRect();
    
    // Collapse when scrolled past (bottom < 100px from top)
    if (isAmountValid && amountRect.bottom < 100) {
      setIsAmountCollapsed(true);
    }
    
    // Expand when scrolled back up (top > 50px from top)
    else if (amountRect.top > 50) {
      setIsAmountCollapsed(false);
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [isAmountValid]);
```

**Behavior** :
- Détecte quand la carte sort du viewport
- Collapse uniquement si la section est complète/valide
- Expand automatiquement si on scroll back up
- Smooth transitions

### 3. 🖱️ **Tap to Expand**

```tsx
<button onClick={handleExpandAmount}>
  <div className="collapsed-card">
    <div className="content">
      <div className="icon">💰</div>
      <div className="text">
        <p className="title">25€</p>
        <p className="subtitle">Mensuel • Zakat</p>
      </div>
    </div>
    <ChevronDown />
  </div>
</button>
```

**Behavior** :
- Click sur collapsed card
- Scroll smooth vers la carte expanded
- Card se déploie automatiquement
- User peut modifier ses infos

### 4. 📍 **In-Place Collapse**

```css
.card {
  transition: all 500ms ease-in-out;
  overflow: hidden;
}

.card.collapsed {
  padding: 1rem; /* Smaller padding */
}

.card.expanded {
  padding: 1.5rem 2rem; /* Larger padding */
}
```

**Features** :
- Reste à sa position d'origine
- Transition smooth (500ms)
- Padding dynamique
- Overflow hidden pour animation propre
- Pas de sticky/fixed (reste dans le flow)

---

## 🎯 Collapse Logic

### Card 1: Amount

**Triggers Collapse** :
1. ✅ Amount is valid (`isAmountValid`)
2. ✅ Card scrolled past viewport (`amountRect.bottom < 100`)

**Collapsed Display** :
```
💰  25€
    Mensuel • Zakat
```

**Data Shown** :
- Amount (`formatEuro(baseAmount)`)
- Frequency (`values.frequency`)
- Donation type (`values.donationType`)

### Card 2: Personal Info

**Triggers Collapse** :
1. ✅ Personal info complete (`isPersonalInfoComplete`)
2. ✅ Card scrolled past viewport (`infoRect.bottom < 200`)

**Collapsed Display** :

**Personnel** :
```
👤  Jean Dupont
    jean@email.com
```

**Entreprise** :
```
👤  Ma Société SARL
    contact@societe.com
```

**Data Shown** :
- Identity (`firstName + lastName` or `companyName`)
- Email (`values.email`)

### Card 3: Payment

**Never Collapses** :
- Toujours expanded
- C'est la destination finale
- Contient le form Stripe actif

---

## 🎨 Animation Details

### Collapse Animation

```css
/* Expanded → Collapsed */
.card-expand-to-collapse {
  animation: shrinkAndMove 300ms ease-out;
}

@keyframes shrinkAndMove {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  100% {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
}
```

### Collapsed Card Entrance

```tsx
<div className="animate-in slide-in-from-top-2 duration-300">
  {/* Collapsed card content */}
</div>
```

**Effect** :
- Slide from top (2 units)
- 300ms duration
- Appears when card collapses

### Expand Animation

```tsx
const handleExpandAmount = () => {
  setIsAmountCollapsed(false);
  amountCardRef.current?.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'start' 
  });
};
```

**Effect** :
- Smooth scroll to card
- Card fades in
- User can edit

---

## 📱 Mobile vs Desktop

### Mobile (< 768px)

```
┌──────────────┐
│ HEADER       │
├──────────────┤
│ 💰 Collapsed │
│ 👤 Collapsed │
├──────────────┤
│              │
│ CARD 3       │
│ (Full width) │
│              │
└──────────────┘
```

**Adjustments** :
- Full width cards
- Smaller padding
- Stacked layout
- Touch-friendly tap targets

### Desktop (≥ 768px)

```
┌─────────────────────────────┐
│ HEADER                      │
├─────────────────────────────┤
│  💰 Collapsed  👤 Collapsed │  ← Centered, max-width
├─────────────────────────────┤
│                             │
│     CARD 3 (Max 672px)      │
│                             │
└─────────────────────────────┘
```

**Adjustments** :
- Max-width: 672px (2xl)
- Centered layout
- More padding
- Hover states

---

## 🧩 Component Structure

### Collapsed Card Component

```tsx
interface CollapsedCardProps {
  icon: string; // Emoji or component
  title: string;
  subtitle: string;
  onClick: () => void;
}

function CollapsedCard({ icon, title, subtitle, onClick }: CollapsedCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full max-w-md mx-auto block"
    >
      <div className="rounded-2xl bg-gradient-to-br from-white/25 to-white/15 backdrop-blur-xl border border-white/20 shadow-xl p-4 hover:from-white/30 hover:to-white/20 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-xl">{icon}</span>
            </div>
            <div className="text-left">
              <p className="text-white text-sm font-semibold">{title}</p>
              <p className="text-white/70 text-xs">{subtitle}</p>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-white/60" />
        </div>
      </div>
    </button>
  );
}
```

### Expanded Card Component

```tsx
interface ExpandedCardProps {
  isCollapsed: boolean;
  cardRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}

function ExpandedCard({ isCollapsed, cardRef, children }: ExpandedCardProps) {
  return (
    <div 
      ref={cardRef}
      className={`transition-all duration-500 ${
        isCollapsed 
          ? 'opacity-0 pointer-events-none h-0 overflow-hidden' 
          : 'opacity-100'
      }`}
    >
      <div className="rounded-3xl bg-gradient-to-br from-white/[0.20] via-white/[0.15] to-white/[0.10] backdrop-blur-xl border border-white/20 shadow-2xl p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
```

---

## 🎯 UX Benefits

### 1. **Context Always Visible**
- ✅ User voit toujours ce qu'ils ont saisi
- ✅ Pas besoin de scroller back pour vérifier
- ✅ Récapitulatif naturel et intégré

### 2. **Reduced Cognitive Load**
- ✅ Une seule carte expanded à la fois
- ✅ Focus sur l'étape actuelle
- ✅ Progression claire

### 3. **Space Efficiency**
- ✅ Moins de scroll nécessaire
- ✅ Plus d'espace pour la carte active
- ✅ Mobile-friendly

### 4. **Familiar Pattern**
- ✅ iOS notification style (familier)
- ✅ Tap to expand (intuitif)
- ✅ Smooth animations

### 5. **Easy Editing**
- ✅ Click pour réouvrir
- ✅ Modifications possibles
- ✅ Pas de navigation complexe

---

## 🆚 Comparison with Other Versions

| Feature | V13-V15 | V16 | V17 | V18 |
|---------|---------|-----|-----|-----|
| **Navigation** | Scroll | Scroll | Tabs | Scroll |
| **Summary** | Bottom | Sticky top | Sidebar | Collapsed cards |
| **Space** | Fixed height | Fixed height | 2 columns | Dynamic |
| **Context** | Lost on scroll | Visible (top) | Visible (side) | **Always (sticky)** |
| **Edit** | Scroll back | Scroll back | Click tab | **Tap card** |
| **Mobile** | OK | OK | Good | **Excellent** |
| **Innovation** | Low | Medium | High | **Very High** |

---

## 🎨 Design Tokens

### Collapsed Cards

```css
/* Container */
--collapsed-bg: linear-gradient(to-br, white/25, white/15);
--collapsed-border: white/20;
--collapsed-shadow: 0 10px 25px rgba(0,0,0,0.2);
--collapsed-backdrop: blur(12px);

/* Hover */
--collapsed-hover-bg: linear-gradient(to-br, white/30, white/20);

/* Icon Circle */
--icon-bg: white/20;
--icon-size: 40px;

/* Text */
--title-color: white;
--title-size: 14px;
--title-weight: 600;

--subtitle-color: white/70;
--subtitle-size: 12px;
--subtitle-weight: 400;

/* Spacing */
--collapsed-padding: 16px;
--collapsed-gap: 12px;
--cards-spacing: 8px;
```

### Animations

```css
--collapse-duration: 500ms;
--collapse-easing: ease-out;

--appear-duration: 300ms;
--appear-easing: ease-out;

--scroll-behavior: smooth;
```

---

## 🔄 State Machine

```
┌─────────────┐
│   Initial   │
│  (Nothing)  │
└──────┬──────┘
       │
       │ User fills amount
       ↓
┌─────────────┐
│  Expanded   │
│   Card 1    │
└──────┬──────┘
       │
       │ User scrolls down
       ↓
┌─────────────┐
│  Collapsed  │  ← Sticky at top
│   Card 1    │
└──────┬──────┘
       │
       │ User fills info
       ↓
┌─────────────┐
│  Collapsed  │  ← Both sticky
│   Card 1    │
│   Card 2    │
└──────┬──────┘
       │
       │ User at payment
       ↓
┌─────────────┐
│  Collapsed  │  ← Summary
│   Card 1    │
│   Card 2    │
│             │
│  Expanded   │  ← Active
│   Card 3    │
└─────────────┘
```

---

## 🧪 Testing Checklist

- [ ] Collapse triggers at right scroll position
- [ ] Expand triggers when scroll back up
- [ ] Tap on collapsed card expands it
- [ ] Smooth scroll to expanded card
- [ ] Collapsed cards stay sticky
- [ ] Z-index correct (above content, below header)
- [ ] Mobile responsive
- [ ] Touch targets adequate (min 44px)
- [ ] Animations smooth (60fps)
- [ ] Data updates in collapsed cards
- [ ] Multiple collapsed cards stack correctly

---

## 📊 Performance

### Optimization

```typescript
// Passive event listener for scroll
window.addEventListener('scroll', handleScroll, { passive: true });

// Debounce scroll handler (optional)
const debouncedScroll = debounce(handleScroll, 16); // ~60fps

// Use transform instead of position for animations
.collapsed-card {
  transform: translateY(0);
  transition: transform 300ms;
}

// Will-change for animated properties
.collapsed-card {
  will-change: transform, opacity;
}
```

---

## 💡 Future Enhancements

1. **Drag to Reorder** - Collapsed cards draggable
2. **Swipe to Dismiss** - iOS-style dismiss
3. **Long Press** - Quick actions menu
4. **Haptic Feedback** - On collapse/expand
5. **Sound Effects** - Subtle audio feedback
6. **Custom Icons** - Instead of emojis
7. **Multi-line Summary** - More info in collapsed
8. **Edit Mode** - Inline editing in collapsed card

---

## 🎯 Use Cases

### Ideal For

- ✅ Mobile-first applications
- ✅ Long multi-step forms
- ✅ Users who scroll a lot
- ✅ iOS-centric audience
- ✅ Context-sensitive flows
- ✅ Space-constrained designs

### Not Ideal For

- ❌ Simple 1-2 step forms
- ❌ Users who prefer tabs
- ❌ Desktop-only apps
- ❌ Traditional workflows
- ❌ Accessibility-first (keyboard nav harder)

---

## ✅ Summary

**V18 "Collapsible Cards"** offers:

- 📱 **iOS-inspired** notification-style cards
- 🔄 **Auto-collapse** on scroll
- 📍 **Sticky summary** always visible
- 🖱️ **Tap to expand** for editing
- 🎨 **Smooth animations** and transitions
- 📱 **Mobile-optimized** UX
- 💡 **Innovative** pattern

**Perfect for** : Mobile users, long forms, iOS audience

**Test on** : `localhost:4000/step-amount-v18`

---

**Made with 🤍 by AI Product Designer**

