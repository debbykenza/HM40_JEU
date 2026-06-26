// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react'
import { authService } from '../services/authService'
import { quizService } from '../services/quizService'
import './HomePage.css'

const games = [
  { id: 'quiz', name: 'Quiz', icon: '❓', accent: 'green', featured: true, locked: false },
  { id: 'memory', name: 'Memory', icon: '🧠', accent: 'purple', locked: false },
  { id: 'puzzle', name: 'Puzzle', icon: '🧩', accent: 'blue', locked: false },
  { id: 'musique', name: 'Musique', icon: '🎵', accent: 'pink', locked: false },
  { id: 'carte', name: 'Carte', icon: '🗺️', accent: 'amber', locked: false },
  { id: 'rapid', name: 'Rapid', icon: '⚡', accent: 'red', locked: false },
  { id: 'anagramme', name: 'Anagramme', icon: '🔤', accent: 'gray', locked: true },
  { id: 'dessin', name: 'Dessin', icon: '🎨', accent: 'gray', locked: true },
  { id: 'enigme', name: 'Énigme', icon: '🕵️', accent: 'gray', locked: true },
  { id: 'chrono', name: 'Chrono', icon: '⏱️', accent: 'gray', locked: true },
]

function HomePage({ stats: initialStats, onSelectGame, onLogout }) {
  const [stats, setStats] = useState(initialStats || {
    points: 0,
    badges: 0,
    unlocked: games.filter(g => !g.locked).length,
    total: games.length
  })
  const [userName, setUserName] = useState('Joueur')
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  const availableCount = games.filter((game) => !game.locked).length

  // 🔥 Charger les données utilisateur depuis Firestore
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Récupérer l'utilisateur actuel
        const currentUser = authService.getCurrentUser()
        if (currentUser) {
          const result = await authService.getUserData(currentUser.uid)
          if (result.success && result.data) {
            const userStats = result.data.stats || {}
            setUserData(result.data)
            // 🔥 Mettre à jour le nom depuis Firestore
            setUserName(result.data.displayName || currentUser.displayName || 'Joueur')
            setStats({
              points: userStats.totalQuizzes || 0,
              badges: Math.floor((userStats.correctAnswers || 0) / 10),
              unlocked: availableCount,
              total: games.length
            })
          } else {
            // Si pas de données dans Firestore, utiliser le nom du currentUser
            setUserName(currentUser.displayName || 'Joueur')
          }
        }
      } catch (error) {
        console.error('Erreur chargement données:', error)
        setUserName('Joueur')
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  function handleSelect(game) {
    if (game.locked) {
      return
    }
    onSelectGame?.(game)
  }

  // 🔥 Mettre à jour les stats quand l'utilisateur termine un quiz
  const updateStats = async (quizResult) => {
    try {
      const currentUser = authService.getCurrentUser()
      if (!currentUser) return

      const result = await quizService.updateUserProgress(
        currentUser.uid,
        quizResult.topic,
        quizResult.score,
        quizResult.total
      )

      if (result.success) {
        setStats(prev => ({
          ...prev,
          points: prev.points + quizResult.score,
          badges: Math.floor((prev.points + quizResult.score) / 10)
        }))
      }
    } catch (error) {
      console.error('Erreur mise à jour stats:', error)
    }
  }

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>
  }

  return (
    <div className="home-page">
      <div className="home-content">
        <div className="home-header">
          <div>
            <p className="home-eyebrow">Bienvenue</p>
            <h1 className="home-title">Bonjour {userName}</h1>
          </div>

          <div className="home-header-actions">
            <div className="home-badge">
              <span aria-hidden="true">🎮</span>
              {availableCount} mini-jeux
            </div>
            <button type="button" className="logout-btn" onClick={onLogout}>
              <svg viewBox="0 0 24 24" fill="none" className="logout-icon" aria-hidden="true">
                <path d="M15 17l5-5-5-5M20 12H9M12 19H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="logout-label">Déconnexion</span>
            </button>
          </div>
        </div>

        <p className="home-subtitle">Choisis un mini-jeu et commence à jouer.</p>

        <div className="games-grid">
          {games.map((game) => (
            <button
              type="button"
              className={[
                'game-card',
                `accent-${game.accent}`,
                game.featured ? 'game-card-featured' : '',
                game.locked ? 'game-card-locked' : '',
              ].filter(Boolean).join(' ')}
              key={game.id}
              onClick={() => handleSelect(game)}
              disabled={game.locked}
              aria-disabled={game.locked}
            >
              {game.locked && (
                <span className="game-lock-badge">
                  <svg viewBox="0 0 24 24" fill="none" className="game-lock-icon" aria-hidden="true">
                    <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  Bientôt
                </span>
              )}
              <span className="game-icon" aria-hidden="true">{game.icon}</span>
              <span className="game-name">{game.name}</span>
            </button>
          ))}
        </div>

        <div className="stats-panel">
          <div>
            <p className="stats-title">Tes statistiques</p>
            <p className="stats-subtitle">Continue à apprendre pour débloquer plus de jeux !</p>
          </div>
          <div className="stats-numbers">
            <div className="stats-pill">
              <span className="stats-value">{stats.points}</span>
              <span className="stats-label">points</span>
            </div>
            <div className="stats-pill">
              <span className="stats-value">{stats.badges}</span>
              <span className="stats-label">badges</span>
            </div>
            <div className="stats-pill">
              <span className="stats-value">{stats.unlocked}/{stats.total}</span>
              <span className="stats-label">jeux</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage