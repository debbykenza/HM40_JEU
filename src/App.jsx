// src/App.jsx
import { useState } from 'react';
import { UserProvider, useUser } from './context/UserContext';
import IntroPage from './pages/IntroPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import TopicsPage from './pages/TopicsPage';
import GameModePage from './pages/GameModePage';
import QuizPage from './pages/QuizPage';

function AppContent() {
  const [view, setView] = useState('intro');
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const { user, userData, loading } = useUser();

  // Gestionnaires de navigation
  const handleLogin = () => {
    setView('home');
  };

  const handleLogout = () => {
    setView('intro');
  };

  const handleRegister = async (email, password, displayName) => {
    const result = await authService.registerWithEmail(email, password, displayName);
    if (result.success && result.user) {
      setView('home');
      return { success: true, error: null };
    } else {
      return { success: false, error: result.error };
    }
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setView('game-mode');
  };

  const handleStartQuiz = () => {
    setView('quiz');
  };

  const handleFinishQuiz = () => {
    setView('home');
  };

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

  // Pages d'authentification
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

  // Pages du jeu
  if (view === 'game') {
    return (
      <GamePage 
        game={selectedGame} 
        onBack={() => setView('home')} 
        onOpenTopics={() => setView('topics')}
      />
    );
  }

  if (view === 'topics') {
    return (
      <TopicsPage 
        onBack={() => setView('home')} 
        onSelectTopic={handleSelectTopic}
      />
    );
  }

  if (view === 'game-mode') {
    return (
      <GameModePage 
        onBack={() => setView('topics')} 
        onStart={handleStartQuiz}
        topic={selectedTopic}
      />
    );
  }

  if (view === 'quiz') {
    return (
      <QuizPage 
        onBack={() => setView('game-mode')} 
        onHome={handleFinishQuiz}
        topic={selectedTopic}
      />
    );
  }

  if (view === 'home') {
    return (
      <HomePage 
        onSelectGame={(game) => { 
          setSelectedGame(game); 
          setView('game');
        }} 
        onOpenTopics={() => setView('topics')}
        onLogout={handleLogout}
      />
    );
  }

  return <IntroPage onStart={() => setView('login')} />;
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;