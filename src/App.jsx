// src/App.jsx
import { useState, useEffect } from 'react';
import { authService } from './services/authService';
import IntroPage from './pages/IntroPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import TopicsPage from './pages/TopicsPage';
import GameModePage from './pages/GameModePage';
import QuizPage from './pages/QuizPage';

function App() {
  const [view, setView] = useState('intro');
  const [selectedGame, setSelectedGame] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🎯 Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Récupérer les données utilisateur depuis Firestore
        const result = await authService.getUserData(firebaseUser.uid);
        setUser({
          ...firebaseUser,
          userData: result.success ? result.data : null
        });
        
        // Si l'utilisateur est connecté, aller directement à l'accueil
        setView('home');
      } else {
        setUser(null);
        // Si pas connecté, rester sur la page d'intro
        if (view === 'home') {
          setView('intro');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔐 Gestionnaire de connexion
  const handleLogin = (userData) => {
    setUser(userData);
    setView('home');
  };

  // 📝 Gestionnaire d'inscription
  const handleRegister = async (email, password, displayName) => {
    const result = await authService.registerWithEmail(email, password, displayName);
    if (result.success && result.user) {
      const userData = await authService.getUserData(result.user.uid);
      setUser({
        ...result.user,
        userData: userData.success ? userData.data : null
      });
      setView('home');
      return { success: true, error: null };
    } else {
      return { success: false, error: result.error };
    }
  };

  // 🚪 Gestionnaire de déconnexion
  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setView('intro');
  };

  // ⏳ Afficher un écran de chargement
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Chargement...
      </div>
    );
  }

  // 📄 Pages d'authentification
  if (view === 'login') {
    return (
      <LoginPage 
        onBack={() => setView('intro')} 
        onRegister={() => setView('register')} 
        onLogin={handleLogin}
      />
    );
  }

  if (view === 'register') {
    return (
      <RegisterPage 
        onBack={() => setView('login')} 
        onRegister={handleRegister}
        onLogin={() => setView('login')}
      />
    );
  }

  // 🎮 Pages du jeu (protégées - nécessitent d'être connecté)
  if (view === 'game') {
    return (
      <GamePage 
        game={selectedGame} 
        onBack={() => setView('home')} 
        onOpenTopics={() => setView('topics')}
        user={user}
      />
    );
  }

  if (view === 'topics') {
    return (
      <TopicsPage 
        onBack={() => setView('home')} 
        onSelectTopic={() => setView('game-mode')}
        user={user}
      />
    );
  }

  if (view === 'game-mode') {
    return (
      <GameModePage 
        onBack={() => setView('topics')} 
        onStart={() => setView('quiz')}
        user={user}
      />
    );
  }

  if (view === 'quiz') {
    return (
      <QuizPage 
        onBack={() => setView('game-mode')} 
        onHome={() => setView('home')}
        user={user}
      />
    );
  }

  // 🏠 Page d'accueil
  if (view === 'home') {
    return (
      <HomePage 
        name={user?.userData?.displayName || user?.displayName || 'Joueur'}
        user={user}
        onSelectGame={(game) => { 
          setSelectedGame(game); 
          setView('game');
        }} 
        onOpenTopics={() => setView('topics')}
        onLogout={handleLogout}
      />
    );
  }

  // 🎬 Page d'intro
  return <IntroPage onStart={() => setView('login')} />;
}

export default App;