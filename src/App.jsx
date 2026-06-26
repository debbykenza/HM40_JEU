import { useState } from 'react';
import { UserProvider, useUser } from './context/UserContext';
import { authService } from './services/authService';
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
  const [selectedLevel, setSelectedLevel] = useState(0);
  const { user, userData, loading, refreshUserData } = useUser();

  const handleLogin = async () => {
    await refreshUserData();
    setView('home');
  };

  const handleLogout = () => {
    setView('intro');
    setSelectedGame(null);
    setSelectedTopic(null);
  };

  const handleRegister = async (email, password, displayName) => {
    const result = await authService.registerWithEmail(email, password, displayName);
    if (result.success && result.user) {
      await refreshUserData();
      setView('home');
      return { success: true, error: null };
    } else {
      return { success: false, error: result.error };
    }
  };

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    setView('topics');
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setView('game');
  };

  const handleGameComplete = (levelIndex = 0) => {
    setSelectedLevel(levelIndex);
    setView('game-mode');
  };

  const handleStartQuiz = () => {
    setView('quiz');
  };

  const handleFinishQuiz = () => {
    setView('home');
    setSelectedGame(null);
    setSelectedTopic(null);
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

  if (view === 'home') {
    return (
      <HomePage 
        onSelectGame={handleSelectGame}
        onLogout={handleLogout}
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

  if (view === 'game') {
    return (
      <GamePage 
        game={selectedGame}
        topic={selectedTopic}
        onBack={() => setView('topics')}
        onNext={handleGameComplete}
      />
    );
  }

  if (view === 'game-mode') {
    return (
      <GameModePage 
        onBack={() => setView('game')} 
        onStart={handleStartQuiz}
        topic={selectedTopic}
        game={selectedGame}
      />
    );
  }

  if (view === 'quiz') {
    return (
      <QuizPage
        onBack={() => setView('game-mode')}
        onHome={handleFinishQuiz}
        topic={selectedTopic}
        game={selectedGame}
        level={selectedLevel}
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