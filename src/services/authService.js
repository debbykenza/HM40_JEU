import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
  onIdTokenChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { quizService } from './quizService';

export const authService = {
  loginWithEmail: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        // S'assure que le profil Firestore existe et a un displayName
        await authService.createUserProfile(userCredential.user);
        quizService.mergeLocalWithFirestore(userCredential.user.uid);
      }
      // Retourner l'utilisateur mis à jour depuis Firestore
      const result = await authService.getUserData(userCredential.user.uid);
      return { 
        success: true, 
        user: userCredential.user,
        userData: result.success ? result.data : null,
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
        userData: null,
        error: errorMessage 
      };
    }
  },

  loginWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        await authService.createUserProfile(result.user);
        quizService.mergeLocalWithFirestore(result.user.uid);
        const userData = await authService.getUserData(result.user.uid);
        return { 
          success: true, 
          user: result.user,
          userData: userData.success ? userData.data : null,
          error: null 
        };
      }
      
      return { success: false, user: null, userData: null, error: 'Aucun utilisateur retourné' };
    } catch (error) {
      console.error('Erreur Google:', error);
      return { 
        success: false, 
        user: null,
        userData: null,
        error: 'Erreur de connexion avec Google. Réessaie !' 
      };
    }
  },

  registerWithEmail: async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Inscrire le nom dans le profil Firebase Auth pour que user.displayName soit disponible
      if (displayName) {
        await updateProfile(userCredential.user, { displayName: displayName.trim() });
      }

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

  createUserProfile: async (user, displayName = null) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      // Priorité : displayName paramètre > displayName Firestore existant > défaut
      let nameToUse = displayName;
      if (!nameToUse && userSnap.exists() && userSnap.data().displayName) {
        nameToUse = userSnap.data().displayName;
      }
      if (!nameToUse) {
        nameToUse = user.displayName || 'Joueur';
      }

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: nameToUse,
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
          },
          progress: {},
          unlockedGames: []
        });
      } else {
        // Mettre à jour le displayName si manquant dans le document existant
        const existingData = userSnap.data();
        if (!existingData.displayName && displayName) {
          await updateDoc(userRef, { displayName: displayName });
        }
      }

      return true;
    } catch (error) {
      console.error('Erreur création profil:', error);
      return false;
    }
  },

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
    // Utilise onAuthStateChanged ET onIdTokenChanged pour une détection fiable
    const unsub1 = onAuthStateChanged(auth, callback);
    const unsub2 = onIdTokenChanged(auth, callback);
    return () => { unsub1(); unsub2(); };
  },

  getCurrentUser: () => {
    return auth.currentUser;
  }
};