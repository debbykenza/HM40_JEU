// src/services/quizService.js
import { doc, updateDoc, increment, getDoc, setDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const quizService = {
  // Mettre à jour la progression de l'utilisateur
  updateUserProgress: async (userId, topic, score, total) => {
    try {
      console.log('📊 updateUserProgress appelé:', { userId, topic, score, total });
      
      if (!userId) {
        console.error('❌ userId manquant');
        return { success: false, error: 'userId manquant' };
      }

      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        console.error('❌ Utilisateur non trouvé:', userId);
        return { success: false, error: 'Utilisateur non trouvé' };
      }

      const data = userSnap.data();
      const currentStats = data.stats || {};
      const topicStats = currentStats.topics || {};
      
      // Mettre à jour les stats du thème
      const currentTopicStats = topicStats[topic] || { score: 0, completed: 0 };
      
      // Calcul des nouvelles valeurs
      const newScore = (currentTopicStats.score || 0) + score;
      const newCompleted = (currentTopicStats.completed || 0) + 1;
      
      console.log('📊 Mise à jour:', {
        oldScore: currentTopicStats.score,
        newScore,
        oldCompleted: currentTopicStats.completed,
        newCompleted
      });
      
      // Mise à jour Firestore
      await updateDoc(userRef, {
        'stats.totalQuizzes': increment(1),
        'stats.correctAnswers': increment(score),
        [`stats.topics.${topic}`]: {
          score: newScore,
          completed: newCompleted,
          lastPlayed: serverTimestamp()
        },
        // Mettre à jour la date de dernière activité
        lastActive: serverTimestamp()
      });
      
      console.log('✅ Stats mises à jour avec succès pour le thème:', topic);
      return { success: true, error: null };
      
    } catch (error) {
      console.error('❌ Erreur mise à jour progression:', error);
      return { success: false, error: error.message };
    }
  },

  // Récupérer la progression de l'utilisateur
  getUserProgress: async (userId) => {
    try {
      console.log('📊 getUserProgress appelé pour:', userId);
      
      if (!userId) {
        console.error('❌ userId manquant');
        return { success: false, data: null, error: 'userId manquant' };
      }

      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        console.log('✅ Données utilisateur récupérées:', data);
        return { 
          success: true, 
          data: data.stats || {},
          userData: data,
          error: null 
        };
      }
      
      console.warn('⚠️ Utilisateur non trouvé:', userId);
      return { success: false, data: null, error: 'Utilisateur non trouvé' };
      
    } catch (error) {
      console.error('❌ Erreur récupération progression:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Débloquer un jeu pour l'utilisateur
  unlockGame: async (userId, gameId) => {
    try {
      console.log('🔓 Déblocage du jeu:', { userId, gameId });
      
      if (!userId || !gameId) {
        console.error('❌ userId ou gameId manquant');
        return { success: false, error: 'Paramètres manquants' };
      }

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        unlockedGames: arrayUnion(gameId)
      });
      
      console.log('✅ Jeu débloqué avec succès:', gameId);
      return { success: true, error: null };
      
    } catch (error) {
      console.error('❌ Erreur déblocage jeu:', error);
      return { success: false, error: error.message };
    }
  },

  // Récupérer les jeux débloqués
  getUnlockedGames: async (userId) => {
    try {
      console.log('🎮 Récupération des jeux débloqués pour:', userId);
      
      if (!userId) {
        console.error('❌ userId manquant');
        return { success: false, data: [], error: 'userId manquant' };
      }

      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        const unlockedGames = data.unlockedGames || [];
        console.log('✅ Jeux débloqués:', unlockedGames);
        return { 
          success: true, 
          data: unlockedGames,
          error: null 
        };
      }
      
      console.warn('⚠️ Utilisateur non trouvé:', userId);
      return { success: false, data: [], error: 'Utilisateur non trouvé' };
      
    } catch (error) {
      console.error('❌ Erreur récupération jeux débloqués:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Nouvelle méthode : Initialiser les stats d'un utilisateur (si elles n'existent pas)
  initializeUserStats: async (userId) => {
    try {
      console.log('🔄 Initialisation des stats pour:', userId);
      
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // Créer un document utilisateur avec des stats par défaut
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
          unlockedGames: []
        });
        console.log('✅ Stats initialisées pour:', userId);
        return { success: true, error: null };
      }
      
      console.log('ℹ️ Les stats existent déjà pour:', userId);
      return { success: true, error: null };
      
    } catch (error) {
      console.error('❌ Erreur initialisation stats:', error);
      return { success: false, error: error.message };
    }
  }
};