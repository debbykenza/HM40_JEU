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

  // Charger les données utilisateur
  const loadUserData = async (firebaseUser) => {
    console.log('🔄 loadUserData appelé avec:', firebaseUser?.uid || 'null');
    
    if (!firebaseUser) {
      console.log('👤 Aucun utilisateur, réinitialisation des données');
      setUser(null);
      setUserData(null);
      setStats({
        points: 0,
        badges: 0,
        totalQuizzes: 0,
        correctAnswers: 0,
        topics: {}
      });
      setLoading(false);
      return;
    }

    try {
      console.log('📥 Récupération des données pour:', firebaseUser.uid);
      const result = await authService.getUserData(firebaseUser.uid);
      
      if (result.success && result.data) {
        console.log('✅ Données utilisateur récupérées avec succès');
        setUser(firebaseUser);
        setUserData(result.data);
        
        const userStats = result.data.stats || {};
        console.log('📊 Stats récupérées:', userStats);
        
        const newStats = {
          points: userStats.totalQuizzes || 0,
          badges: Math.floor((userStats.correctAnswers || 0) / 10),
          totalQuizzes: userStats.totalQuizzes || 0,
          correctAnswers: userStats.correctAnswers || 0,
          topics: userStats.topics || {}
        };
        
        setStats(newStats);
        console.log('✅ Stats mises à jour:', newStats);
      } else {
        console.warn('⚠️ Aucune donnée utilisateur trouvée, création des stats par défaut');
        setUser(firebaseUser);
        setUserData(null);
        
        // Initialiser les stats dans Firestore
        await quizService.initializeUserStats(firebaseUser.uid);
        
        setStats({
          points: 0,
          badges: 0,
          totalQuizzes: 0,
          correctAnswers: 0,
          topics: {}
        });
      }
    } catch (error) {
      console.error('❌ Erreur chargement données:', error);
      setStats({
        points: 0,
        badges: 0,
        totalQuizzes: 0,
        correctAnswers: 0,
        topics: {}
      });
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour les stats après un quiz
  const updateStats = async (topic, score, total) => {
    console.log('📊 updateStats appelé:', { topic, score, total });
    
    try {
      if (!user) {
        console.error('❌ Aucun utilisateur connecté');
        return;
      }

      console.log('🔄 Mise à jour des stats pour:', user.uid);
      const result = await quizService.updateUserProgress(user.uid, topic, score, total);
      
      if (result.success) {
        console.log('✅ Stats mises à jour avec succès, rechargement des données...');
        // Recharger les données pour avoir les stats à jour
        await loadUserData(user);
      } else {
        console.error('❌ Erreur lors de la mise à jour:', result.error);
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour stats:', error);
    }
  };

  // Rafraîchir les données utilisateur
  const refreshUserData = async () => {
    if (user) {
      console.log('🔄 Rafraîchissement des données pour:', user.uid);
      await loadUserData(user);
    }
  };

  // Écouter les changements d'authentification
  useEffect(() => {
    console.log('🔄 Configuration de l\'écouteur d\'authentification');
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      console.log('👤 Changement d\'état auth:', firebaseUser?.uid || 'déconnecté');
      
      if (firebaseUser) {
        await loadUserData(firebaseUser);
      } else {
        console.log('👤 Utilisateur déconnecté, réinitialisation');
        setUser(null);
        setUserData(null);
        setStats({
          points: 0,
          badges: 0,
          totalQuizzes: 0,
          correctAnswers: 0,
          topics: {}
        });
        setLoading(false);
      }
    });

    // Nettoyer l'écouteur
    return () => {
      console.log('🔄 Nettoyage de l\'écouteur d\'authentification');
      unsubscribe();
    };
  }, []);

  const value = {
    user,
    userData,
    stats,
    loading,
    updateStats,
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