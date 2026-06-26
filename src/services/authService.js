// src/services/authService.js
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const authService = {
  // Connexion avec Email/Mot de passe
  loginWithEmail: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { 
        success: true, 
        user: userCredential.user,
        error: null 
      };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      let errorMessage = 'Email ou mot de passe incorrect. Réessaie !';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Aucun compte trouvé avec cet email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Mot de passe incorrect.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Trop de tentatives. Réessaie plus tard.';
      }
      
      return { 
        success: false, 
        user: null,
        error: errorMessage 
      };
    }
  },

  // Connexion avec Google
  loginWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Si c'est un nouvel utilisateur, créer son profil dans Firestore
      if (result.user) {
        await authService.createUserProfile(result.user);
      }
      
      return { 
        success: true, 
        user: result.user,
        error: null 
      };
    } catch (error) {
      console.error('Erreur Google:', error);
      return { 
        success: false, 
        user: null,
        error: 'Erreur de connexion avec Google. Réessaie !' 
      };
    }
  },

  // Créer un compte
  registerWithEmail: async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Créer le profil utilisateur dans Firestore
      await authService.createUserProfile(userCredential.user, displayName);
      
      return { 
        success: true, 
        user: userCredential.user,
        error: null 
      };
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      let errorMessage = 'Erreur lors de l\'inscription. Réessaie !';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Cet email est déjà utilisé.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Le mot de passe est trop faible (minimum 6 caractères).';
      }
      
      return { 
        success: false, 
        user: null,
        error: errorMessage 
      };
    }
  },

  // Créer le profil utilisateur dans Firestore
  createUserProfile: async (user, displayName = null) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      // Si l'utilisateur n'existe pas encore
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: displayName || user.displayName || 'Joueur',
          photoURL: user.photoURL || null,
          createdAt: serverTimestamp(),
          stats: {
            totalQuizzes: 0,
            correctAnswers: 0,
            topics: {
              geographie: { score: 0, completed: 0 },
              sciences: { score: 0, completed: 0 },
              histoire: { score: 0, completed: 0 }
            }
          }
        });
      }
      
      return true;
    } catch (error) {
      console.error('Erreur création profil:', error);
      return false;
    }
  },

  // Récupérer les données utilisateur
  getUserData: async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { 
          success: true, 
          data: userSnap.data(),
          error: null 
        };
      } else {
        return { 
          success: false, 
          data: null,
          error: 'Utilisateur non trouvé' 
        };
      }
    } catch (error) {
      console.error('Erreur récupération données:', error);
      return { 
        success: false, 
        data: null,
        error: error.message 
      };
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      await signOut(auth);
      return { success: true, error: null };
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      return { success: false, error: error.message };
    }
  },

  onAuthStateChange: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  getCurrentUser: () => {
    return auth.currentUser;
  }
};