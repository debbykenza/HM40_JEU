# Analyse du projet HM40_JEU

> Document vivant — mis à jour au fil du développement.
> Dernière mise à jour : 2026-06-26

---

## 1. Etat Git

| Branche | Commits | Divergence avec `main` |
|---------|---------|------------------------|
| `Belva` | 2 | Identique |
| `fafa`  | 2 | Identique |
| `main`  | 2 | — |

Les trois branches partagent exactement les mêmes 2 commits.

---

## 2. Stack technique

| Outil | Version |
|-------|---------|
| React | 18.3.1 |
| Vite  | 8.1.0  |
| TypeScript | ~6.0.2 |
| Firebase | 12.15.0 |
| React Router | non installé |

Navigation gérée par un `useState` dans `App.jsx` — pas de React Router.

---

## 3. Architecture du backend

```
Auth Flow:
LoginPage → authService.loginWithEmail() → Firebase Auth → Firestore user profile

Quiz Flow:
QuizPage → quizService.updateUserProgress() → Firestore → localStorage (fallback)
QuizPage → quizService.getUserProgress() → Firestore → localStorage (fallback)

Sync Flow:
Login → mergeLocalWithFirestore() synchronise les données locales avec le cloud
```

---

## 4. Etat des pages

| Page | Fichier | Etat | Notes |
|------|---------|------|-------|
| Intro | `IntroPage.jsx` | Fonctionnel | Ecran d'accueil minimal |
| Login | `LoginPage.jsx` | Fonctionnel | Authentification Firebase + Google |
| Register | `RegisterPage.jsx` | Fonctionnel | Inscription avec profil Firestore |
| Home | `HomePage.jsx` | Fonctionnel | Grille de 10 jeux, navigation vers GamePage OK |
| Game | `GamePage.jsx` | Mockup | Progression hardcodée (5 étapes statiques) |
| Topics | `TopicsPage.jsx` | Fonctionnel | Sujet sélectionné transmis au quiz |
| GameMode | `GameModePage.jsx` | Fonctionnel | Mode de jeu transmis au quiz |
| Quiz | `QuizPage.jsx` | Fonctionnel | Questions dynamiques par thème, score sauvegardé |

---

## 5. Corrections apportées

### Critiques (Résolu)
- [x] `TopicsPage` — Le sujet est maintenant correctement transmis au quiz
- [x] Questions dans `QuizPage` — Dynamiques selon le thème choisi
- [x] Données importées dans `TopicsPage` depuis `src/data/quizData.js`

### Fichiers dupliqués (Résolu)
- [x] Supprimé `src/App.tsx`
- [x] Supprimé `src/main.ts`
- [x] Supprimé `src/main.tsx`
- [x] Supprimé `src/counter.ts`

### Persistance multi-plateforme (Implémenté)
- [x] `quizService.js` — Fallback localStorage pour mode hors ligne
- [x] `quizService.mergeLocalWithFirestore()` — Synchronisation à la reconnexion
- [x] `authService.js` — Trigger synchronisation au login

---

## 6. Structure des données

### Collection `users` (Firestore)
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  createdAt: timestamp,
  lastActive: timestamp,
  stats: {
    totalQuizzes: number,
    correctAnswers: number,
    topics: {
      geographie: { score: number, completed: number, lastPlayed: timestamp },
      sciences: { score: number, completed: number, lastPlayed: timestamp },
      histoire: { score: number, completed: number, lastPlayed: timestamp }
    }
  },
  unlockedGames: string[]
}
```

### LocalStorage (Fallback)
```javascript
// Clé: hm40_user_progress
{
  [userId]: {
    stats: {
      topics: {
        [topicId]: { score: number, completed: number, lastPlayed: string }
      }
    },
    unlockedGames: string[]
  }
}
```

---

## 7. Priorités restantes

1. Implémenter un second mini-jeu (Memory en priorité)
2. Adapter le comportement du quiz selon le mode (apprentissage vs challenge)
3. Ajouter des tests unitaires pour les services
4. Optimiser la taille du bundle (>500kb warning)

---

## 8. Historique des modifications

| Date | Auteur | Description |
|------|--------|-------------|
| 2026-06-25 | Debby Kenza | First commit (README) |
| 2026-06-26 | Kilo | Correction .env, import authService, quizData.js, persistance locale |
| 2026-06-26 | Kilo | Nettoyage fichiers dupliqués, synchronisation multi-plateforme |