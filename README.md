# 🌿 ChillSpot — Find places to breathe.

> Community anonima per scoprire, condividere e salvare luoghi tranquilli, panoramici e nascosti.

---

## 🗺️ Cos'è ChillSpot

ChillSpot è una piattaforma web dove gli utenti possono:
- **Scoprire** luoghi panoramici, tranquilli, urbani, naturali sulla mappa
- **Condividere** i propri spot preferiti in modo completamente anonimo
- **Salvare** i preferiti nella propria mappa segreta
- **Valutare** tranquillità, panorama e sicurezza con il sistema **Chill Score**

---

## 🚀 Stack tecnico

| Layer | Tecnologia |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Auth | Firebase Authentication (Google + Email/Password) |
| Database | Cloud Firestore |
| Storage | Firebase Storage |
| Mappe | React Leaflet + OpenStreetMap |
| Hosting | Firebase Hosting / Vercel |
| Routing | React Router v6 |
| Toast | react-hot-toast |
| Compressione immagini | browser-image-compression |

---

## 📁 Struttura del progetto

```
chillspot/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Navigazione desktop
│   │   ├── BottomNav.jsx        # Navigazione mobile
│   │   ├── SpotCard.jsx         # Card spot (con skeleton)
│   │   ├── SpotMap.jsx          # Mappa Leaflet interattiva
│   │   ├── FilterBar.jsx        # Filtri + ricerca + ordinamento
│   │   ├── ImageUploader.jsx    # Upload foto drag & drop
│   │   ├── RatingBadge.jsx      # Badge e input rating stelline
│   │   └── ProtectedRoute.jsx   # Protezione route private
│   ├── context/
│   │   └── AuthContext.jsx      # Context globale autenticazione
│   ├── pages/
│   │   ├── LandingPage.jsx      # Homepage pubblica
│   │   ├── LoginPage.jsx        # Auth (Google + email/password)
│   │   ├── Dashboard.jsx        # Feed + mappa + filtri
│   │   ├── AddSpotPage.jsx      # Wizard 3 step per aggiungere spot
│   │   ├── SpotDetail.jsx       # Dettaglio spot + like + commenti
│   │   └── ProfilePage.jsx      # Profilo anonimo + spot salvati
│   ├── utils/
│   │   ├── anonymousUtils.js    # Generazione nickname, avatar, badge, chill score
│   │   ├── firestoreUtils.js    # CRUD Firestore
│   │   └── imageUtils.js        # Upload + compressione immagini
│   ├── firebase.js              # Configurazione Firebase
│   ├── App.jsx                  # Routing principale
│   ├── main.jsx                 # Entry point React
│   └── index.css                # Stili globali + Tailwind
├── firestore.rules              # Regole sicurezza Firestore
├── firestore.indexes.json       # Indici Firestore
├── storage.rules                # Regole sicurezza Storage
├── firebase.json                # Config Firebase Hosting
├── tailwind.config.js
├── vite.config.js
├── package.json
├── .env.example
└── .gitignore
```

---

## ⚙️ Setup Firebase

### 1. Crea il progetto Firebase

1. Vai su [console.firebase.google.com](https://console.firebase.google.com)
2. Clicca **"Aggiungi progetto"**
3. Dai un nome (es. `chillspot-prod`)
4. Abilita Google Analytics (opzionale)

### 2. Abilita Authentication

1. Vai su **Authentication → Sign-in method**
2. Abilita **Email/Password**
3. Abilita **Google**
4. In Google, imposta il tuo **email di supporto**

### 3. Crea il database Firestore

1. Vai su **Firestore Database → Crea database**
2. Scegli **"Inizia in modalità produzione"**
3. Scegli la region più vicina (es. `europe-west1`)

### 4. Configura Firebase Storage

1. Vai su **Storage → Inizia**
2. Accetta le regole di sicurezza predefinite (le sovrascriveremo)
3. Scegli la stessa region di Firestore

### 5. Ottieni le credenziali

1. Vai su **Impostazioni progetto → Le tue app**
2. Clicca **"Aggiungi app" → Web**
3. Registra l'app con un nickname
4. Copia il `firebaseConfig` mostrato

### 6. Configura le variabili d'ambiente

```bash
cp .env.example .env
```

Apri `.env` e incolla i valori dal tuo `firebaseConfig`:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=chillspot-xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=chillspot-xxx
VITE_FIREBASE_STORAGE_BUCKET=chillspot-xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXX
```

### 7. Deploy delle regole Firestore e Storage

```bash
# Installa Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Collega il progetto
firebase use --add
# Seleziona il tuo progetto e dai un alias (es. "default")

# Deploy solo le regole
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage
```

---

## 🛠️ Avvio in locale

```bash
# Clona il repo
git clone https://github.com/tuonome/chillspot.git
cd chillspot

# Installa le dipendenze
npm install

# Configura le variabili d'ambiente
cp .env.example .env
# → Modifica .env con le tue credenziali Firebase

# Avvia il server di sviluppo
npm run dev
```

Apri [http://localhost:5173](http://localhost:5173)

---

## 📦 Build per produzione

```bash
npm run build
```

La cartella `dist/` contiene il sito ottimizzato per il deploy.

---

## 🚀 Deploy

### Opzione A — Firebase Hosting

```bash
# Build
npm run build

# Deploy completo
firebase deploy
```

### Opzione B — Vercel (consigliato per semplicità)

1. Fai push del progetto su GitHub
2. Vai su [vercel.com](https://vercel.com) → Importa il repo
3. Aggiungi le **variabili d'ambiente** dal pannello Vercel
4. Clicca **Deploy**

> ⚠️ Se usi Vercel, aggiungi il dominio Vercel come **authorized domain** in Firebase Auth:
> Firebase Console → Authentication → Settings → Authorized domains → Add domain

---

## 🔥 Struttura Firestore

### `users/{uid}`
```js
{
  uid: string,
  anonymousName: string,        // "QuietFox_482"
  avatarStyle: {
    gradient: [string, string], // colori CSS
    emoji: string               // "🌿"
  },
  createdAt: Timestamp,
  savedSpots: string[],         // array di spotId
  totalSpots: number,
  reputationScore: number
}
```

### `spots/{spotId}`
```js
{
  title: string,
  description: string,
  category: string,             // "panoramico" | "silenzioso" | ...
  vibe: string,
  tags: string[],
  imageUrls: string[],
  location: {
    lat: number,
    lng: number,
    isApproximate: boolean,
    radius: number              // metri se approssimato
  },
  createdBy: string,            // uid
  createdByName: string,        // nickname anonimo
  createdAt: Timestamp,
  likesCount: number,
  likedBy: string[],            // array di uid
  savedCount: number,
  reportCount: number,
  calmRating: number,           // 1-5
  viewRating: number,           // 1-5
  safetyRating: number,         // 1-5
  bestTime: string,
  accessibility: string,        // "facile" | "media" | "difficile"
  status: string                // "active" | "hidden" | "reported"
}
```

### `reports/{reportId}`
```js
{
  spotId: string,
  userId: string,
  reason: string,
  createdAt: Timestamp
}
```

### `comments/{commentId}`
```js
{
  spotId: string,
  userId: string,
  anonymousName: string,
  text: string,
  createdAt: Timestamp
}
```

---

## 🎨 Palette colori

| Colore | Uso | Hex |
|--------|-----|-----|
| Sage | Azioni primarie, accenti | `#5c8a5c` |
| Night | Elementi secondari | `#476da0` |
| Warm | Badge, dettagli | `#bb9660` |
| Dark 900 | Background principale | `#0d1117` |
| Dark 800 | Card, superfici | `#141b24` |
| Dark 700 | Inputs, bordi | `#1c2633` |

---

## ✨ Feature principali

- **🎭 Anonimato completo** — Nickname generati tipo `QuietFox_219`, nessun dato personale visibile
- **🗺️ Mappa interattiva** — Pin personalizzati per categoria, popup con anteprima
- **📊 Chill Score** — Punteggio da 0 a 10 calcolato da tranquillità + panorama + sicurezza
- **💎 Badge automatici** — Hidden Gem, Sunset Spot, Night Chill, Peaceful, Urban Escape
- **🎲 Random spot** — Pulsante per scoprire uno spot casuale
- **📍 Near Me** — Ordina gli spot per distanza (con rispetto della privacy)
- **🌫️ Privacy posizione** — Toggle per nascondere la posizione esatta entro ~500m
- **📷 Upload multi-foto** — Compressione automatica, drag & drop, preview
- **⚑ Sistema report** — Auto-hide degli spot dopo 5 segnalazioni
- **💬 Commenti anonimi** — Con nickname generato, senza email visibile
- **🔖 Spot salvati** — Ogni utente ha la sua mappa segreta personale
- **🔍 Filtri avanzati** — Per categoria, vibe, ordinamento, ricerca testuale

---

## 🔐 Sicurezza

- Regole Firestore che limitano lettura/scrittura per utenti autenticati
- Validazione server-side dei campi (lunghezza, tipo)
- Storage rules che limitano upload al solo proprietario
- Auto-hiding degli spot eccessivamente segnalati
- Disclaimer obbligatorio su luoghi legali e sicuri
- Compressione immagini lato client per ridurre abusi
- Nessun dato personale esposto (solo nickname anonimo)

---

## 🚧 Roadmap futura

- [ ] Filtro per distanza con slider km
- [ ] Upload avatar personalizzato
- [ ] Notifiche in-app (like, commenti)
- [ ] Dark/Light mode toggle UI
- [ ] Moderazione admin dashboard
- [ ] Clustering dei marker sulla mappa
- [ ] PWA con installazione mobile
- [ ] Condivisione spot via link diretto
- [ ] Integrazione Google Maps (opzionale)
- [ ] Ricerca per città/regione

---

## 📄 Licenza

MIT — Usa, modifica e distribuisci liberamente.

---

> *"Questo posto sembra perfetto per respirare un attimo."* 🌿
