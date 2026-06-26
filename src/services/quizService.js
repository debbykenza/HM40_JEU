import { doc, updateDoc, increment, getDoc, setDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const LOCAL_KEY = 'hm40_user_progress';

// ── Helpers localStorage ───────────────────────────────────────────────────────

const readLocal = () => JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}');

const writeLocal = (data) => localStorage.setItem(LOCAL_KEY, JSON.stringify(data));

const saveStatsToLocal = (userId, topic, score, total) => {
  try {
    const data = readLocal();
    if (!data[userId]) data[userId] = { stats: { topics: {} } };
    if (!data[userId].stats) data[userId].stats = { topics: {} };
    if (!data[userId].stats.topics) data[userId].stats.topics = {};
    if (!data[userId].stats.topics[topic]) {
      data[userId].stats.topics[topic] = { score: 0, completed: 0 };
    }
    data[userId].stats.topics[topic].score += score;
    data[userId].stats.topics[topic].completed += 1;
    data[userId].stats.topics[topic].lastPlayed = new Date().toISOString();
    writeLocal(data);
    return true;
  } catch {
    return false;
  }
};

const saveLevelToLocal = (userId, gameType, topicId, progress) => {
  try {
    const data = readLocal();
    if (!data[userId]) data[userId] = {};
    if (!data[userId].progress) data[userId].progress = {};
    if (!data[userId].progress[gameType]) data[userId].progress[gameType] = {};
    data[userId].progress[gameType][topicId] = progress;
    writeLocal(data);
    return true;
  } catch {
    return false;
  }
};

// ── Service ────────────────────────────────────────────────────────────────────

export const quizService = {
  // Local-first : on sauvegarde d'abord en local, puis on tente Firestore
  updateUserProgress: async (userId, topic, score, total) => {
    // 1. Sauvegarde locale immédiate (toujours réussit)
    saveStatsToLocal(userId, topic, score, total);

    // 2. Sync Firestore en background
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return { success: true };

      const topicStats = userSnap.data()?.stats?.topics?.[topic] || { score: 0, completed: 0 };

      await updateDoc(userRef, {
        'stats.totalQuizzes': increment(1),
        'stats.correctAnswers': increment(score),
        [`stats.topics.${topic}`]: {
          score: (topicStats.score || 0) + score,
          completed: (topicStats.completed || 0) + 1,
          lastPlayed: serverTimestamp()
        },
        lastActive: serverTimestamp()
      });
    } catch (error) {
      console.warn('Firestore stats sync différée (données sauvées localement)', error.message);
    }

    return { success: true };
  },

  // Sauvegarder la progression d'un niveau (local déjà fait dans UserContext)
  saveLevelProgress: async (userId, gameType, topicId, progress) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        [`progress.${gameType}.${topicId}`]: progress,
        lastActive: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.warn('Firestore level sync différée', error.message);
      return { success: false, error: error.message };
    }
  },

  // Récupérer la progression de niveau depuis le local
  getLocalLevelProgress: (userId, gameType, topicId) => {
    try {
      const data = readLocal();
      return data[userId]?.progress?.[gameType]?.[topicId] || null;
    } catch {
      return null;
    }
  },

  getUserProgress: async (userId) => {
    try {
      if (!userId) return { success: false, data: null, error: 'userId manquant' };

      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return { success: true, data: userSnap.data().stats || {}, userData: userSnap.data() };
      }

      const local = readLocal();
      if (local[userId]?.stats) {
        return { success: true, data: local[userId].stats, userData: local[userId] };
      }

      return { success: false, data: null, error: 'Utilisateur non trouvé' };
    } catch (error) {
      const local = readLocal();
      if (local[userId]?.stats) {
        return { success: true, data: local[userId].stats, userData: local[userId] };
      }
      return { success: false, data: null, error: error.message };
    }
  },

  unlockGame: async (userId, gameId) => {
    try {
      if (!userId || !gameId) return { success: false, error: 'Paramètres manquants' };
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { unlockedGames: arrayUnion(gameId) });

      const local = readLocal();
      if (local[userId]) {
        if (!local[userId].unlockedGames) local[userId].unlockedGames = [];
        if (!local[userId].unlockedGames.includes(gameId)) local[userId].unlockedGames.push(gameId);
        writeLocal(local);
      }
      return { success: true };
    } catch (error) {
      const local = readLocal();
      if (local[userId]) {
        if (!local[userId].unlockedGames) local[userId].unlockedGames = [];
        if (!local[userId].unlockedGames.includes(gameId)) local[userId].unlockedGames.push(gameId);
        writeLocal(local);
        return { success: true };
      }
      return { success: false, error: error.message };
    }
  },

  getUnlockedGames: async (userId) => {
    try {
      if (!userId) return { success: false, data: [], error: 'userId manquant' };
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return { success: true, data: userSnap.data().unlockedGames || [] };
      }
      const local = readLocal();
      return { success: true, data: local[userId]?.unlockedGames || [] };
    } catch (error) {
      const local = readLocal();
      return { success: true, data: local[userId]?.unlockedGames || [] };
    }
  },

  initializeUserStats: async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: userId,
          createdAt: serverTimestamp(),
          lastActive: serverTimestamp(),
          stats: {
            totalQuizzes: 0,
            correctAnswers: 0,
            topics: {
              geographie: { score: 0, completed: 0 },
              sciences: { score: 0, completed: 0 },
              histoire: { score: 0, completed: 0 }
            }
          },
          progress: {},
          unlockedGames: []
        });
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Fusionne le local (stats + progression de niveaux) avec Firestore
  mergeLocalWithFirestore: async (userId) => {
    try {
      const local = readLocal();
      const localUser = local[userId];
      if (!localUser) return { success: true };

      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return { success: false, error: 'User not found' };

      const firestoreData = userSnap.data();
      const updates = { lastActive: serverTimestamp() };

      // Merge stats
      const localStats = localUser.stats;
      if (localStats?.topics) {
        const firestoreTopics = firestoreData.stats?.topics || {};
        const mergedTopics = { ...firestoreTopics };
        Object.keys(localStats.topics).forEach(topic => {
          if (!mergedTopics[topic]) mergedTopics[topic] = { score: 0, completed: 0 };
          mergedTopics[topic].score += localStats.topics[topic].score || 0;
          mergedTopics[topic].completed += localStats.topics[topic].completed || 0;
        });
        updates['stats.topics'] = mergedTopics;
      }

      // Merge progression de niveaux
      const localProgress = localUser.progress;
      if (localProgress) {
        const firestoreProgress = firestoreData.progress || {};
        Object.entries(localProgress).forEach(([gameType, topics]) => {
          Object.entries(topics).forEach(([topicId, prog]) => {
            const existing = firestoreProgress[gameType]?.[topicId];
            const mergedCompleted = existing
              ? [...new Set([...(existing.completedLevels || []), ...(prog.completedLevels || [])])]
              : (prog.completedLevels || []);
            const mergedCurrent = Math.max(prog.currentLevel || 0, existing?.currentLevel || 0);
            updates[`progress.${gameType}.${topicId}`] = {
              completedLevels: mergedCompleted,
              currentLevel: mergedCurrent
            };
          });
        });
      }

      await updateDoc(userRef, updates);
      localStorage.removeItem(LOCAL_KEY);
      return { success: true };
    } catch (error) {
      console.error('Erreur synchronisation:', error);
      return { success: false, error: error.message };
    }
  }
};
