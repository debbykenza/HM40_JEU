import React from 'react'

const steps = [
  { id: 1, title: 'Découverte', subtitle: 'Premier pas terminé', status: 'completed', icon: '✓', rewards: ['⭐ +20 XP', '🏆 Badge découverte'] },
  { id: 2, title: 'Exploration', subtitle: 'Continue l’aventure', status: 'active', icon: '▶', rewards: ['⭐ +20 XP', '🎁 Coffre bonus'] },
  { id: 3, title: 'Trésor', subtitle: 'Coffre bonus', status: 'locked', icon: '🔒', rewards: ['⭐ +20 XP', '🎁 Bonus secret'] },
  { id: 4, title: 'Champion', subtitle: 'Niveau avancé', status: 'locked', icon: '🔒', rewards: ['⭐ +30 XP', '🏅 Badge force'] },
  { id: 5, title: 'Maître', subtitle: 'Défi ultime', status: 'locked', icon: '🔒', rewards: ['⭐ +40 XP', '✨ Récompense finale'] },
]

function GamePage({ game, onBack, onOpenTopics }) {
  const name = game?.name || 'Mini-jeu'
  const completedCount = steps.filter((step) => step.status === 'completed').length
  const progressPercent = Math.round((completedCount / steps.length) * 100)
  const xpGained = completedCount * 20 + 40

  return (
    <div className="game-detail-page">
      <header className="app-header">
        <button type="button" className="circle-back-btn" onClick={onBack} aria-label="Retour">
          ←
        </button>

        <div className="header-context">
          <p className="header-context-label">Chapitre 1</p>
          <p className="header-context-progress">Progression : {progressPercent}%</p>
        </div>

        <div className="header-badges">
          <div className="header-badge header-badge--green">
            <span>⚡</span>
            <span>{xpGained} XP</span>
          </div>
          <div className="header-badge header-badge--orange">
            <span>🔥</span>
            <span>3 jours</span>
          </div>
        </div>
      </header>

      <main className="chapter-content">
        <section className="chapter-card">
          <div className="chapter-visual">📘</div>
          <div className="chapter-text">
            <p className="chapter-eyebrow">{name.toUpperCase()}</p>
            <h1>Chapitre 1</h1>
            <p className="chapter-unit">Unité 1</p>
            <p className="chapter-tagline">Commence ton aventure</p>

            <div className="chapter-meta">
              <div className="chapter-meta-item">
                <span>📚</span>
                <span>4 leçons</span>
              </div>
              <div className="chapter-meta-item">
                <span>⏱</span>
                <span>15 min</span>
              </div>
            </div>
          </div>
        </section>

        <section className="chapter-progress-panel" aria-label="Progression du chapitre">
          <div className="chapter-progress-head">
            <div>
              <p className="chapter-progress-title">Progression du chapitre</p>
              <p className="chapter-progress-subtitle">{progressPercent}% terminé · {completedCount}/{steps.length} étapes complétées</p>
            </div>
            <div className="chapter-xp-pill">⚡ {xpGained} XP</div>
          </div>

          <div className="chapter-progress-bar" aria-hidden="true">
            <div className="chapter-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="chapter-progress-foot">
            <span>{completedCount}/{steps.length} leçons terminées</span>
            <span>{steps.length - completedCount} à faire</span>
          </div>
        </section>

        <section className="progress-path" aria-label="Parcours de progression">
          <div className="path-line" />
          {steps.map((step, index) => {
            const isLeft = index % 2 === 0
            const statusClass = `progress-node--${step.status}`

            return (
              <div key={step.id} className={`progress-item ${isLeft ? 'progress-item--left' : 'progress-item--right'}`}>
                <div className={`step-card ${step.status === 'active' ? 'step-card--active' : ''} ${step.status === 'completed' ? 'step-card--completed' : ''}`}>
                  <div className="step-card-top">
                    <p className="step-title">{step.title}</p>
                    <span className={`step-status-badge ${step.status === 'completed' ? 'step-status-badge--done' : step.status === 'active' ? 'step-status-badge--active' : 'step-status-badge--locked'}`}>
                      {step.status === 'completed' ? '✓ Terminé' : step.status === 'active' ? '▶ À faire' : '🔒 Verrouillé'}
                    </span>
                  </div>
                  <p className="step-subtitle">{step.subtitle}</p>

                  <div className="step-rewards">
                    {step.rewards.map((reward) => (
                      <span key={reward} className="step-reward-chip">{reward}</span>
                    ))}
                  </div>

                  <div className="step-footer">
                    {step.status === 'active' ? (
                      <button type="button" className="step-cta" onClick={() => onOpenTopics?.()}>
                        ▶ Continuer
                      </button>
                    ) : step.status === 'completed' ? (
                      <span className="step-status-label">Validation réussie</span>
                    ) : (
                      <span className="step-status-label">À débloquer</span>
                    )}
                  </div>
                </div>

                <button type="button" className={`progress-node ${statusClass}`} onClick={() => step.status === 'active' && onOpenTopics?.()}>
                  <span className="node-icon">{step.icon}</span>
                </button>
              </div>
            )
          })}
        </section>
      </main>
    </div>
  )
}

export default GamePage
