// src/pages/HomePage.jsx
import React from 'react';
import { useUser } from '../context/UserContext';
import './HomePage.css';

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
];

function HomePage({ onSelectGame, onOpenTopics, onLogout }) {
  const { user, userData, stats, loading } = useUser();
  
  const availableCount = games.filter((game) => !game.locked).length;
  
  // Récupérer le nom depuis le contexte
  const userName = userData?.displayName || user?.displayName || 'Joueur';

  // Statistiques à afficher
  const displayStats = {
    points: stats.points || 0,
    badges: stats.badges || 0,
    unlocked: availableCount,
    total: games.length
  };

  function handleSelect(game) {
    if (game.locked) return;
    onSelectGame?.(game);
  }

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>;
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
              <span className="stats-value">{displayStats.points}</span>
              <span className="stats-label">points</span>
            </div>
            <div className="stats-pill">
              <span className="stats-value">{displayStats.badges}</span>
              <span className="stats-label">badges</span>
            </div>
            <div className="stats-pill">
              <span className="stats-value">{displayStats.unlocked}/{displayStats.total}</span>
              <span className="stats-label">jeux</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;