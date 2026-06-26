import { useState } from 'react'
import IntroPage from './pages/IntroPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import TopicsPage from './pages/TopicsPage'
import GameModePage from './pages/GameModePage'
import QuizPage from './pages/QuizPage'

function App() {
  const [view, setView] = useState('intro')
  const [selectedGame, setSelectedGame] = useState(null)

  if (view === 'login') {
    return <LoginPage onBack={() => setView('intro')} onRegister={() => setView('register')} onLogin={() => setView('home')} />
  }

  if (view === 'register') {
    return <RegisterPage onBack={() => setView('login')} onLogin={() => setView('login')} />
  }

  if (view === 'game') {
    return <GamePage game={selectedGame} onBack={() => setView('home')} onOpenTopics={() => setView('topics')} />
  }

  if (view === 'topics') {
    return <TopicsPage onBack={() => setView('home')} onSelectTopic={() => setView('game-mode')} />
  }

  if (view === 'game-mode') {
    return <GameModePage onBack={() => setView('topics')} onStart={() => setView('quiz')} />
  }

  if (view === 'quiz') {
    return <QuizPage onBack={() => setView('game-mode')} onHome={() => setView('home')} />
  }

  if (view === 'home') {
    return <HomePage name="Kenza" onSelectGame={(game) => { setSelectedGame(game); setView('game') }} onOpenTopics={() => setView('topics')} />
  }

  return <IntroPage onStart={() => setView('login')} />
}

export default App
