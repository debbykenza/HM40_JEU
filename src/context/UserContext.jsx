// src/context/UserContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { quizService } from '../services/quizService';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    points: 0,
    badges: 0,
    totalQuizzes: 0,
    correctAnswers: 0,
    topics: {}
  });
  const [loading, setLoading] = useState(true);

  const loadUserData = async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      setUserData(null);
      setStats({ points: 0, badges: 0, totalQuizzes: 0, correctAnswers: 0, topics: {} });
      setLoading(false);
      return;
    }

    try {
      const result = await authService.getUserData(firebaseUser.uid);

      if (result.success && result.data) {
        setUser(firebaseUser);

        // Merge Firestore progress avec local (le local peut être plus récent si offline)
        const localData = JSON.parse(localStorage.getItem('hm40_user_progress') || '{}');
        const localProgress = localData[firebaseUser.uid]?.progress;
        const firestoreProgress = result.data.progress || {};
        const mergedProgress = { ...firestoreProgress };

        if (localProgress) {
          Object.entries(localProgress).forEach(([gt, topics]) => {
            if (!mergedProgress[gt]) mergedProgress[gt] = {};
            Object.entries(topics).forEach(([tid, prog]) => {
              const ex = mergedProgress[gt][tid];
              mergedProgress[gt][tid] = {
                completedLevels: ex
                  ? [...new Set([...(ex.completedLevels || []), ...(prog.completedLevels || [])])]
                  : (prog.completedLevels || []),
                currentLevel: Math.max(prog.currentLevel || 0, ex?.currentLevel || 0)
              };
            });
          });
        }

        setUserData({ ...result.data, progress: mergedProgress });

        const userStats = result.data.stats || {};
        setStats({
          points: userStats.totalQuizzes || 0,
          badges: Math.floor((userStats.correctAnswers || 0) / 10),
          totalQuizzes: userStats.totalQuizzes || 0,
          correctAnswers: userStats.correctAnswers || 0,
          topics: userStats.topics || {}
        });
      } else {
        setUser(firebaseUser);
        setUserData({ displayName: firebaseUser.displayName || null, progress: {} });
        await quizService.initializeUserStats(firebaseUser.uid);
        setStats({ points: 0, badges: 0, totalQuizzes: 0, correctAnswers: 0, topics: {} });
      }
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour les stats après un quiz (local-first via quizService)
  const updateStats = async (topic, score, total) => {
    if (!user) return;
    const result = await quizService.updateUserProgress(user.uid, topic, score, total);
    if (result.success) {
      await loadUserData(user);
    }
  };

  // Compléter un niveau : local immédiat + sync Firestore en arrière-plan
  const completeLevel = (gameType, topicId, levelIndex) => {
    if (!user || levelIndex === undefined || levelIndex === null || !gameType || !topicId) return;

    const LOCAL_KEY = 'hm40_user_progress';
    const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}');
    if (!local[user.uid]) local[user.uid] = {};
    if (!local[user.uid].progress) local[user.uid].progress = {};
    if (!local[user.uid].progress[gameType]) local[user.uid].progress[gameType] = {};

    const prev = local[user.uid].progress[gameType][topicId] || { completedLevels: [], currentLevel: 0 };
    const completedLevels = [...new Set([...(prev.completedLevels || []), levelIndex])];
    const nextLevel = levelIndex + 1;
    const currentLevel = nextLevel < 5
      ? Math.max(prev.currentLevel || 0, nextLevel)
      : (prev.currentLevel || levelIndex);

    const updated = { completedLevels, currentLevel };
    local[user.uid].progress[gameType][topicId] = updated;
    localStorage.setItem(LOCAL_KEY, JSON.stringify(local));

    // Mise à jour immédiate du state React (optimiste)
    setUserData(cur => ({
      ...(cur || {}),
      progress: {
        ...((cur || {}).progress || {}),
        [gameType]: {
          ...(((cur || {}).progress || {})[gameType] || {}),
          [topicId]: updated
        }
      }
    }));

    // Sync Firestore en arrière-plan (non-bloquant)
    quizService.saveLevelProgress(user.uid, gameType, topicId, updated);
  };

  const refreshUserData = async () => {
    const currentUser = authService.getCurrentUser();
    const userToUse = currentUser || user;
    if (userToUse) await loadUserData(userToUse);
  };

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        await loadUserData(firebaseUser);
      } else {
        setUser(null);
        setUserData(null);
        setStats({ points: 0, badges: 0, totalQuizzes: 0, correctAnswers: 0, topics: {} });
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userData,
    stats,
    loading,
    updateStats,
    completeLevel,
    refreshUserData
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser doit être utilisé dans un UserProvider');
  }
  return context;
}
