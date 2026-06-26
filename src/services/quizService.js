// src/services/quizService.js
import { doc, updateDoc, increment, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

export const quizService = {
  // Mettre à jour la progression de l'utilisateur
  updateUserProgress: async (userId, topic, score, total) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        const currentStats = data.stats || {};
        const topicStats = currentStats.topics || {};
        
        // Mettre à jour les stats du thème
        const currentTopicStats = topicStats[topic] || { score: 0, completed: 0 };
        
        await updateDoc(userRef, {
          'stats.totalQuizzes': increment(1),
          'stats.correctAnswers': increment(score),
          [`stats.topics.${topic}`]: {
            score: (currentTopicStats.score || 0) + score,
            completed: (currentTopicStats.completed || 0) + 1,
            lastPlayed: new Date().toISOString()
          }
        });
        
        return { success: true, error: null };
      }
      
      return { success: false, error: 'Utilisateur non trouvé' };
    } catch (error) {
      console.error('Erreur mise à jour progression:', error);
      return { success: false, error: error.message };
    }
  },

  // Récupérer la progression de l'utilisateur
  getUserProgress: async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        return { 
          success: true, 
          data: data.stats || {},
          error: null 
        };
      }
      
      return { success: false, data: null, error: 'Utilisateur non trouvé' };
    } catch (error) {
      console.error('Erreur récupération progression:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Débloquer un jeu pour l'utilisateur
  unlockGame: async (userId, gameId) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        unlockedGames: arrayUnion(gameId)
      });
      return { success: true, error: null };
    } catch (error) {
      console.error('Erreur déblocage jeu:', error);
      return { success: false, error: error.message };
    }
  },

  // Récupérer les jeux débloqués
  getUnlockedGames: async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        return { 
          success: true, 
          data: data.unlockedGames || [],
          error: null 
        };
      }
      
      return { success: false, data: [], error: 'Utilisateur non trouvé' };
    } catch (error) {
      console.error('Erreur récupération jeux débloqués:', error);
      return { success: false, data: [], error: error.message };
    }
  }
};