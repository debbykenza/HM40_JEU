// src/pages/GameModePage.jsx
import React, { useState } from 'react';

function GameModePage({ onBack, onStart }) {
  const [gameType, setGameType] = useState('learning');
  const [playerMode, setPlayerMode] = useState('solo');

  // Le bouton Start est prêt uniquement si les deux modes sont sélectionnés
  const isReady = Boolean(gameType && playerMode);

  return (
    <div className="game-mode-page">
      <div className="game-mode-shell">
        <div className="topics-header game-mode-header">
          <button type="button" className="circle-back-btn" onClick={onBack} aria-label="Retour">
            ←
          </button>
          <h1>Mode de jeu</h1>
        </div>

        <div className="mode-section">
          <h2>Type de jeu</h2>
          <div className="mode-grid">
            <button
              type="button"
              className={`mode-card ${gameType === 'learning' ? 'mode-card--active' : ''}`}
              onClick={() => setGameType('learning')}
            >
              <div className="mode-icon">📖</div>
              <h3>Apprentissage</h3>
              <p>Des explications sont fournies après chaque question.</p>
            </button>

            <button
              type="button"
              className={`mode-card ${gameType === 'challenge' ? 'mode-card--active' : ''}`}
              onClick={() => setGameType('challenge')}
            >
              <div className="mode-icon">🏆</div>
              <h3>Challenge</h3>
              <p>Le score et les réponses sont affichés à la fin.</p>
            </button>
          </div>
        </div>

        <div className="mode-section">
          <h2>Nombre de joueurs</h2>
          <div className="mode-grid">
            <button
              type="button"
              className={`mode-card ${playerMode === 'solo' ? 'mode-card--active' : ''}`}
              onClick={() => setPlayerMode('solo')}
            >
              <div className="mode-icon">👤</div>
              <h3>Solo</h3>
              <p>Le quiz sera joué individuellement.</p>
            </button>

            {/* 🔥 Mode Multi toujours désactivé */}
            <button
              type="button"
              className="mode-card mode-card--disabled"
              disabled={true}
              onClick={() => {}}
            >
              <div className="mode-icon">👥</div>
              <h3>Multi</h3>
              <p>Bientôt disponible</p>
            </button>
          </div>
        </div>

        <button 
          type="button" 
          className={`start-quiz-btn ${isReady ? 'start-quiz-btn--ready' : ''}`} 
          onClick={onStart}
          disabled={!isReady}
        >
          Commencer le quiz
        </button>
      </div>
    </div>
  );
}

export default GameModePage;