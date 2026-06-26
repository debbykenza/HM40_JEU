import React from 'react'

const games = [
  { name: 'Quiz', icon: '❓', accent: 'green' },
  { name: 'Memory', icon: '🧠', accent: 'purple' },
  { name: 'Puzzle', icon: '🧩', accent: 'blue' },
  { name: 'Musique', icon: '🎵', accent: 'pink' },
  { name: 'Carte', icon: '🗺️', accent: 'amber' },
  { name: 'Rapid', icon: '⚡', accent: 'red' },
  { name: 'Anagramme', icon: '🔤', accent: 'teal' },
  { name: 'Dessin', icon: '🎨', accent: 'orange' },
  { name: 'Énigme', icon: '🕵️', accent: 'indigo' },
  { name: 'Chrono', icon: '⏱️', accent: 'cyan' },
]

function HomePage({ name = 'Kenza', onSelectGame, onOpenTopics }) {
  return (
    <div className="home-page">
      <div className="home-content">
        <div className="home-header">
          <div>
            <p className="home-eyebrow">Bienvenue</p>
            <h1>Bonjour {name}</h1>
          </div>
          <div className="home-badge">🎮 6 mini-jeux</div>
        </div>

        <p className="home-subtitle">Choisis un mini-jeu et commence à jouer.</p>

        <div className="games-grid">
          {games.map((game) => (
            <button type="button" className={`game-card ${game.accent}`} key={game.name} onClick={() => onSelectGame?.(game)}>
              <span className="game-icon">{game.icon}</span>
              <span className="game-name">{game.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage
