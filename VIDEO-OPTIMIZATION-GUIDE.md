# 🎬 Guide d'Optimisation Vidéo pour Neena

## 📊 Pourquoi optimiser ?

Sans optimisation, une vidéo de fond peut peser **5-20 MB** et ralentir considérablement le chargement de la page.
Avec optimisation, on peut réduire à **500 KB - 1 MB** tout en gardant une qualité visuelle excellente.

**Impact :**
- ✅ Temps de chargement : -80%
- ✅ Consommation data mobile : -80%
- ✅ Performance Lighthouse : +20-30 points
- ✅ Expérience utilisateur : Instantanée

---

## 🚀 Scénario B : Version Ultra-Rapide (Recommandé)

### Étape 1️⃣ : Convertir et Optimiser la Vidéo

#### Option A : Avec ffmpeg (Ligne de commande)

```bash
# Installer ffmpeg
brew install ffmpeg  # macOS
# ou apt-get install ffmpeg  # Linux
# ou télécharger depuis https://ffmpeg.org/download.html

# Optimiser pour .mp4 (1280x720, 500 kb/s)
ffmpeg -i bg-video-new.mp4 \
  -vf "scale=1280:-2" \
  -r 30 \
  -c:v libx264 \
  -b:v 500k \
  -preset fast \
  -movflags +faststart \
  -an \
  public/bg-video-new-optimized.mp4

# Convertir en .webm (format encore plus léger)
ffmpeg -i bg-video-new.mp4 \
  -vf "scale=1280:-2" \
  -r 30 \
  -c:v libvpx-vp9 \
  -b:v 400k \
  -an \
  public/bg-video-new.webm

# Créer l'image poster (première frame)
ffmpeg -i bg-video-new.mp4 \
  -vf "scale=1280:-2" \
  -vframes 1 \
  -q:v 2 \
  public/bg-video-poster.jpg
```

#### Option B : Avec un outil en ligne (Plus simple)

1. **CloudConvert** : https://cloudconvert.com/mp4-converter
   - Upload ta vidéo
   - Paramètres :
     - Format : MP4 (H.264)
     - Résolution : 1280x720
     - Bitrate : 500 kbps
   - Télécharge le fichier optimisé

2. **Convertir en WebM** : https://cloudconvert.com/mp4-to-webm
   - Upload la vidéo optimisée
   - Bitrate : 400 kbps
   - Télécharge le .webm

3. **Créer le poster** :
   - Ouvre la vidéo dans VLC ou QuickTime
   - Capture une frame (Screenshot)
   - Sauvegarde en JPG
   - Compresse avec TinyJPG : https://tinyjpg.com

---

### Étape 2️⃣ : Remplacer les Fichiers

```bash
# Remplacer les vidéos actuelles par les versions optimisées
mv public/bg-video-new-optimized.mp4 public/bg-video-new.mp4
mv public/bg-video-new.webm public/bg-video-new.webm

# Ajouter l'image poster
# (déjà créée à l'étape 1)
```

---

### Étape 3️⃣ : Faire de même pour la V14

```bash
# Optimiser bg-video.mp4 (vidéo bleue originale)
ffmpeg -i public/bg-video.mp4 \
  -vf "scale=1280:-2" \
  -r 30 \
  -c:v libx264 \
  -b:v 500k \
  -preset fast \
  -movflags +faststart \
  -an \
  public/bg-video-optimized.mp4

# Convertir en .webm
ffmpeg -i public/bg-video.mp4 \
  -vf "scale=1280:-2" \
  -r 30 \
  -c:v libvpx-vp9 \
  -b:v 400k \
  -an \
  public/bg-video.webm

# Créer le poster V14
ffmpeg -i public/bg-video.mp4 \
  -vf "scale=1280:-2" \
  -vframes 1 \
  -q:v 2 \
  public/bg-video-poster-v14.jpg

# Remplacer les fichiers
mv public/bg-video-optimized.mp4 public/bg-video.mp4
```

---

## ✅ Ce qui a déjà été fait dans le code

### V13 (`step-amount-v13/page.tsx`)

```tsx
<video
  autoPlay
  loop
  muted
  playsInline           // ✅ Démarrage automatique mobile
  preload="none"        // ✅ Lazy-load : ne charge pas avant d'être visible
  poster="/bg-video-poster.jpg"  // ✅ Image de préchargement
  className="absolute inset-0 w-full h-full object-cover"
  ref={(video) => {
    if (video) {
      video.playbackRate = 1.25;
    }
  }}
>
  <source src="/bg-video-new.mp4" type="video/mp4" />    // ✅ Format MP4
  <source src="/bg-video-new.webm" type="video/webm" />  // ✅ Format WebM (fallback)
</video>
```

### V14 (`step-amount-v14/page.tsx`)

```tsx
<video
  autoPlay
  loop
  muted
  playsInline
  preload="none"
  poster="/bg-video-poster-v14.jpg"
  className="absolute inset-0 w-full h-full object-cover"
  ref={(video) => {
    if (video) {
      video.playbackRate = 0.9;
    }
  }}
>
  <source src="/bg-video.mp4" type="video/mp4" />
  <source src="/bg-video.webm" type="video/webm" />
</video>
```

---

## 📈 Résultats Attendus

| Métrique | Avant | Après | Gain |
|----------|-------|-------|------|
| Poids vidéo V13 | ~8 MB | ~800 KB | -90% |
| Poids vidéo V14 | ~12 MB | ~1 MB | -92% |
| Temps de chargement (4G) | 4-6s | 0.5-1s | -80% |
| Performance Lighthouse | 50-60 | 85-95 | +40% |
| First Contentful Paint | 2-3s | 0.8-1.2s | -60% |

---

## 🎯 Checklist Finale

- [ ] Vidéos converties en MP4 (1280x720, 500 kb/s)
- [ ] Vidéos converties en WebM (1280x720, 400 kb/s)
- [ ] Images poster créées (JPG, compressées)
- [ ] Fichiers remplacés dans `/public/`
- [ ] Code mis à jour (✅ déjà fait)
- [ ] Test sur mobile (Safari iOS, Chrome Android)
- [ ] Test de performance (Lighthouse)

---

## 🔍 Pour aller plus loin

### Lazy-Load Avancé (Optionnel)

Si vous voulez un contrôle encore plus fin, vous pouvez utiliser Intersection Observer :

```tsx
const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoadVideo(true);
      }
    },
    { threshold: 0.1 }
  );

  const videoContainer = document.getElementById('video-bg');
  if (videoContainer) observer.observe(videoContainer);

  return () => observer.disconnect();
}, []);

// Dans le render
{shouldLoadVideo && (
  <video autoPlay loop muted playsInline>
    <source src="/bg-video-new.mp4" type="video/mp4" />
  </video>
)}
```

### CDN (Recommandé pour Production)

Pour une performance optimale en production, hébergez vos vidéos sur un CDN :

- **Vercel Blob Storage** : https://vercel.com/docs/storage/vercel-blob
- **Cloudflare R2** : https://www.cloudflare.com/products/r2/
- **AWS S3 + CloudFront** : Distribution mondiale

---

## 🆘 Besoin d'aide ?

Si ffmpeg ne fonctionne pas ou si vous préférez une solution visuelle :
1. **HandBrake** (gratuit, interface graphique) : https://handbrake.fr
   - Preset : "Web" → "Gmail Medium 5 Minutes 720p30"
   - Bitrate : 500 kbps
2. **Adobe Media Encoder** (si vous avez Creative Cloud)
3. **CloudConvert** (en ligne, gratuit) : https://cloudconvert.com

---

✅ **Une fois les vidéos optimisées et remplacées, commit et push les nouveaux fichiers !**

