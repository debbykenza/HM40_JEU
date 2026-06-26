# Rapport Technique — HM40 Jeu de Quiz Educatif

**Projet :** Mini-projet IHM (Interface Homme-Machine)
**Cours :** HM40
**Date :** Juin 2026
**Stack :** React 18 · Vite 8 · Firebase 12 · CSS vanilla

---

## 1. Vue d'ensemble

HM40 est une application web SPA (Single Page Application) de quiz educatif destinee aux enfants. Elle propose :
- 6 themes de connaissance
- 3 modes de jeu (Quiz, Rapid, Enigme)
- 5 niveaux par theme avec deblocage progressif
- Une synchronisation locale/distante des statistiques (local-first)
- Une authentification Firebase (email/mot de passe + Google)

---

## 2. Architecture generale

### 2.1 Routage par etat

L'application n'utilise pas de bibliotheque de routage (pas de React Router). La navigation est geree par un unique etat `view` dans `App.jsx` :

```
intro → login/register → home → topics → game → game-mode → quiz
                                                            ↓
                                                          home
```

Chaque "page" est un composant React rendu conditionnellement selon la valeur de `view`. Cette approche convient aux SPAs simples avec un flux lineaire et evite la complexite de la gestion d'URL.

**Etats complementaires dans App.jsx :**
- `selectedGame` — objet jeu selectionne `{ id, name, icon, ... }`
- `selectedTopic` — objet topic selectionne `{ id, title, color, ... }`
- `selectedLevel` — index 0-based du niveau en cours (alimenté par GamePage via `onNext(i)`)

### 2.2 Arbre de composants

```
App
└── UserProvider (contexte global)
    └── AppContent
        ├── IntroPage
        ├── LoginPage
        ├── RegisterPage
        ├── HomePage
        ├── TopicsPage
        ├── GamePage         ← lit userData.progress (dynamique)
        ├── GameModePage
        └── QuizPage         ← lit completeLevel, updateStats
```

---

## 3. Gestion de l'etat global — UserContext

`src/context/UserContext.jsx` est le seul store de l'application. Il expose via `useUser()` :

| Valeur | Type | Description |
|---|---|---|
| `user` | `FirebaseUser \| null` | Utilisateur Firebase Auth |
| `userData` | `object \| null` | Document Firestore de l'utilisateur (inclut `progress`) |
| `stats` | `object` | Stats normalisees (points, badges, topics) |
| `loading` | `boolean` | Etat de chargement initial |
| `updateStats(topic, score, total)` | `async fn` | Sauvegarde les stats apres un quiz |
| `completeLevel(gameType, topicId, level)` | `fn` | Marque un niveau comme termine, debloque le suivant |
| `refreshUserData()` | `async fn` | Force le rechargement depuis Firestore |

### Ecoute de l'authentification

L'abonnement utilise `onIdTokenChanged` (via `authService.onAuthStateChange`) plutot que `onAuthStateChanged`. Ce choix est delibere : `onIdTokenChanged` se redeclenche apres un `updateProfile()`, ce qui evite une condition de course ou le `displayName` serait `null` au moment du premier rendu apres inscription.

---

## 4. Couche de service

### 4.1 authService.js

Encapsule toutes les operations Firebase Auth :
- `loginWithEmail(email, password)` — connexion + creation du profil Firestore si absent
- `loginWithGoogle()` — popup Google + meme logique
- `registerWithEmail(email, password, displayName)` — inscription + `updateProfile` + creation profil
- `createUserProfile(user, displayName)` — idempotent : cree ou met a jour le document Firestore
- `getUserData(uid)` — lecture du document utilisateur
- `logout()` — deconnexion Firebase
- `onAuthStateChange(callback)` — abonnement `onIdTokenChanged`
- `getCurrentUser()` — `auth.currentUser`

**Priorite du displayName a la creation :**
`param displayName > displayName Firestore existant > user.displayName Firebase Auth > 'Joueur'`

### 4.2 quizService.js — Strategie local-first

Toutes les ecritures suivent le principe **local-first** :
1. Ecriture synchrone dans `localStorage` (toujours reussit, fonctionne hors ligne)
2. Tentative d'ecriture dans Firestore (asynchrone, non-bloquante, silencieusement ignoree en cas d'echec)

**Cle localStorage :** `hm40_user_progress`

**Structure :**
```js
{
  [uid]: {
    stats: {
      topics: {
        [topicId]: { score: number, completed: number, lastPlayed: string }
      }
    },
    progress: {
      [gameType]: {
        [topicId]: { completedLevels: number[], currentLevel: number }
      }
    }
  }
}
```

**Fonctions principales :**
- `updateUserProgress(uid, topic, score, total)` — local puis Firestore
- `saveLevelProgress(uid, gameType, topicId, progress)` — uniquement Firestore (le local est fait par `completeLevel` dans UserContext)
- `mergeLocalWithFirestore(uid)` — appelee a la connexion, fusionne les donnees locales (offline) dans Firestore puis vide le localStorage
- `initializeUserStats(uid)` — creation du document Firestore si absent

**Fusion de progression (`mergeLocalWithFirestore`) :**
La fusion des `completedLevels` utilise un Set pour deduplication, et prend le `Math.max` des `currentLevel` pour garantir que la progression la plus avancee l'emporte.

---

## 5. Systeme de progression par niveaux

### 5.1 Structure de donnees

Chaque combinaison `(gameType, topicId)` possede un objet de progression :
```js
{
  completedLevels: number[],  // ex: [0, 1, 2]
  currentLevel: number        // prochain niveau a jouer, ex: 3
}
```

- **completed** : le niveau est dans `completedLevels`
- **active** : `index === currentLevel` et pas dans `completedLevels`
- **locked** : tous les autres

Etat initial (aucune progression) : niveau 0 actif, niveaux 1-4 verrouilles.

### 5.2 Flux de deblocage

```
GamePage (onNext(i)) → App (selectedLevel = i) → GameModePage → QuizPage
                                                                    ↓
                                               score final calculé
                                                    ↓
                                          successPercent >= 70% ?
                                          ├── OUI → completeLevel(gameType, topicId, i)
                                          │         ├─ localStorage mis a jour
                                          │         ├─ setUserData (optimiste)
                                          │         └─ Firestore sync (background)
                                          └── NON → niveau reste "active" (rejouable)
```

### 5.3 Mise a jour optimiste

`completeLevel` met a jour `userData` dans le contexte React immediatement (avant la reponse Firestore). Ainsi, si l'utilisateur revient sur `GamePage` sans recharger, les statuts de niveaux sont deja a jour sans attendre le reseau.

### 5.4 Regles de calcul du niveau suivant

```
nextLevel = levelIndex + 1
if nextLevel < 5:
  currentLevel = max(prev.currentLevel, nextLevel)
else:
  currentLevel = prev.currentLevel  # dernier niveau, pas de deblocage
```

---

## 6. Donnees de quiz — quizData.js

### 6.1 Organisation

```js
gameQuizData = {
  Quiz:   { geographie: [...], sciences: [...], ... },
  Rapid:  { geographie: [...], sciences: [...], ... },
  Enigme: { geographie: [...], sciences: [...], ... }
}
```

Chaque question a la forme :
```js
{
  question: string,
  tip: string,          // anecdote educative affichee apres reponse
  answers: [
    { id: 'A'|'B'|'C'|'D', label: string, image: string (data URI SVG), isCorrect: boolean }
  ]
}
```

Les images sont des SVG generes en base64 via une fonction `img(icon, accent, label)`, evitant toute dependance a des ressources externes.

### 6.2 Fallback

Si un mode de jeu n'a pas de banque pour un topic, `getQuestions()` replie sur la banque Quiz du meme topic, puis sur un tableau vide.

### 6.3 Topics

| id | Titre | Couleur CSS |
|---|---|---|
| `geographie` | Geographie | `green` |
| `sciences` | Sciences | `darkgreen` |
| `histoire` | Histoire | `amber` |
| `culture-generale` | Culture Generale | `coral` |
| `arts` | Arts | `red` |
| `musique` | Musique | `emerald` |

---

## 7. Architecture CSS

### 7.1 Philosophie

- CSS vanilla, pas de framework (Tailwind, Bootstrap, etc.)
- Chaque page a son propre fichier `.css` importe directement dans le `.jsx` (Vite gere l'injection)
- `style.css` contient uniquement les styles globaux (reset, variables, composants partages)
- Les classes BEM-like suivent la convention `[composant]__[element]--[modificateur]`

### 7.2 Palette de couleurs principale

| Variable / Valeur | Usage |
|---|---|
| `#3dbf6e` | Vert principal (boutons, accents, progress) |
| `#f4f6f5` | Fond de page global |
| `#ffffff` | Fond des cartes et contenu |
| `#1f2937` | Texte principal |
| `#6b7280` | Texte secondaire |

### 7.3 Classes de couleur des topics

Definies exclusivement dans `TopicsPage.css`. Chaque topic a sa propre classe modificatrice :

| Classe | Fond | Bordure | Texte | Icone |
|---|---|---|---|---|
| `--green` | `#edfdf4` | `#bbf7d0` | `#065f46` | `#34d399` |
| `--darkgreen` | `#ede9fe` | `#c4b5fd` | `#3730a3` | `#818cf8` |
| `--amber` | `#fffbeb` | `#fde68a` | `#92400e` | `#f59e0b` |
| `--coral` | `#fff1f2` | `#fecdd3` | `#9f1239` | `#fb7185` |
| `--red` | `#fff1f0` | `#fecaca` | `#991b1b` | `#f87171` |
| `--emerald` | `#f0fdfa` | `#99f6e4` | `#0f766e` | `#2dd4bf` |

**Piege connu :** Ne jamais definir ces classes dans `style.css`. L'ordre d'injection CSS par Vite fait que `style.css` (charge en premier depuis `main.jsx`) peut etre ecrase par `TopicsPage.css` ou l'inverse selon la version du bundler. La separation claire evite tout conflit de cascade.

---

## 8. Flux d'authentification

```
Inscription (email)
  └── createUserWithEmailAndPassword
       ├── updateProfile({ displayName })   // Auth profile
       └── createUserProfile(user, name)    // Firestore document
            └── setDoc('users/uid', { ... })

Connexion (email)
  └── signInWithEmailAndPassword
       ├── createUserProfile(user)          // idempotent, corrige si absent
       └── mergeLocalWithFirestore(uid)     // sync donnees offline

Connexion (Google)
  └── signInWithPopup
       ├── createUserProfile(user)
       └── mergeLocalWithFirestore(uid)

onIdTokenChanged (UserContext)
  └── loadUserData(firebaseUser)
       ├── getUserData(uid) → Firestore
       ├── merge avec localStorage (progress)
       └── setUserData / setStats
```

---

## 9. Composants notables

### GamePage.jsx

Affiche les 5 niveaux sous forme de chemin (path) avec noeuds alternant gauche/droite. Les statuts (completed / active / locked) sont calcules dynamiquement depuis `userData.progress` a chaque render, sans etat local. L'index 0-based du niveau actif est passe via `onNext(i)` vers App.

### QuizPage.jsx

- Gere son propre etat local (index question, reponse selectionnee, score, finished)
- `handleSelect` incremente le score et affiche le feedback
- `handleNext` sur la derniere question : sauvegarde les stats + verifie le seuil 70% + appelle `completeLevel`
- Affiche une banniere "Niveau suivant debloque !" si `levelUnlocked` est vrai

### UserContext.jsx — point critique

Le fichier doit imperativement contenir `const UserContext = createContext()` avant `UserProvider`. Cette ligne avait ete absente, rendant `UserContext.Provider` indefini et crashant l'application silencieusement.

---

## 10. Points d'attention et decisions techniques

| Decision | Raison |
|---|---|
| `onIdTokenChanged` plutot que `onAuthStateChanged` | Se redeclenche apres `updateProfile`, evitant le displayName `null` au premier rendu apres inscription |
| Local-first pour toutes les ecritures | L'application reste fonctionnelle sans connexion ; Firestore est une cible de sync, pas une dependance bloquante |
| Fusion locale/distante a la connexion | Evite la perte de progression jouee hors ligne |
| Mise a jour optimiste de `userData` dans `completeLevel` | Evite un flash/delay visuel lors du retour sur GamePage |
| Pas de React Router | Flux lineaire, un seul niveau de profondeur de navigation — la complexite de React Router n'est pas justifiee |
| Images de reponses en SVG data URI | Zero dependance externe, generation programmable, pas de requetes reseau |
| CSS vanilla sans framework | Controle total des styles, pas de surcharge de specifite, bundle minimal |

---

## 11. Ameliorations possibles

- **Persistance hors-ligne complete** : utiliser Firebase Persistence (`enableIndexedDbPersistence`) pour que Firestore fonctionne offline nativement
- **Rejouer un niveau termine** : actuellement seul le niveau "active" est jouable ; ajouter un bouton "Rejouer" sur les niveaux "completed"
- **Animations de transition** entre les pages (CSS transitions sur `view` change)
- **PWA** : ajouter un Service Worker pour installation sur mobile
- **Tests** : aucun test unitaire ou d'integration n'est present ; ajouter Vitest + React Testing Library
- **Contenu** : etendre la banque de questions (actuellement 3 questions par mode par topic, insuffisant pour 5 niveaux distincts)
- **XP et badges** : le systeme de points est calcule mais non affiche de maniere persistante ; implementer un vrai systeme de recompenses
