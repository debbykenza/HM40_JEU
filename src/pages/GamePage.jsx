import React from 'react'
import './GamePage.css'
import { useUser } from '../context/UserContext'

const STEP_TITLES    = ['Découverte', 'Exploration', 'Pratique', 'Maîtrise', 'Expert']
const STEP_SUBTITLES = [
  'Introduction au sujet',
  "Continue l'aventure",
  'Renforce tes connaissances',
  'Défi avancé',
  'Défi ultime',
]
const STEP_REWARDS = [
  ['⭐ +20 XP', '🏆 Badge Découverte'],
  ['⭐ +30 XP', '🎁 Coffre bonus'],
  ['⭐ +40 XP', '💎 Gemme rare'],
  ['⭐ +50 XP', '🏅 Badge Champion'],
  ['⭐ +100 XP', '✨ Récompense finale'],
]

function getStepStatus(i, levelProgress) {
  if (!levelProgress) return i === 0 ? 'active' : 'locked'
  const completed = levelProgress.completedLevels || []
  const current   = levelProgress.currentLevel   ?? 0
  if (completed.includes(i)) return 'completed'
  if (i === current)         return 'active'
  return 'locked'
}

function GamePage({ game, topic, onBack, onNext }) {
  const { userData } = useUser()
  const topicId   = typeof topic === 'string' ? topic : topic?.id
  const gameType  = game?.name || 'Quiz'

  // Lecture de la progression depuis le contexte (local-first, mis à jour par completeLevel)
  const levelProgress = userData?.progress?.[gameType]?.[topicId] || null

  const steps = STEP_TITLES.map((title, i) => ({
    id:       i + 1,
    title,
    subtitle: STEP_SUBTITLES[i],
    status:   getStepStatus(i, levelProgress),
    rewards:  STEP_REWARDS[i],
  }))
  const done     = steps.filter(s => s.status === 'completed').length
  const pct      = Math.round((done / steps.length) * 100)
  const xp       = done * 20 + 40
  const topicName = topic?.title || topicId || 'Sujet'
  const gameName  = game?.name  || 'Quiz'

  return (
    <div className="game-detail-page">

      {/* ── Header ── */}
      <header className="app-header">
        <button type="button" className="circle-back-btn" onClick={onBack} aria-label="Retour">
          ←
        </button>
        <div className="header-context">
          <p className="header-context-label">{gameName} — {topicName}</p>
          <p className="header-context-progress">Progression : {pct}%</p>
        </div>
        <div className="header-badges">
          <div className="header-badge header-badge--green"><span>⚡</span><span>{xp} XP</span></div>
          <div className="header-badge header-badge--orange"><span>🔥</span><span>3 jours</span></div>
        </div>
      </header>

      <main className="chapter-content">

        {/* ── Progress panel ── */}
        <section className="chapter-progress-panel">
          <div className="chapter-progress-head">
            <div>
              <p className="chapter-progress-title">Progression du chapitre</p>
              <p className="chapter-progress-subtitle">{pct}% terminé · {done}/{steps.length} étapes</p>
            </div>
            <div className="chapter-xp-pill">⚡ {xp} XP</div>
          </div>
          <div className="chapter-progress-bar">
            <div className="chapter-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="chapter-progress-foot">
            <span>{done}/{steps.length} leçons terminées</span>
            <span>{steps.length - done} à faire</span>
          </div>
        </section>

        {/* ── Path ── */}
        <section className="progress-path">
          <div className="path-line" />

          {steps.map((step, i) => {
            const left      = i % 2 === 0
            const nodeIcon  = step.status === 'completed' ? '✓'
                            : step.status === 'active'    ? '▶'
                            : '🔒'

            const nodeEl = (
              <button
                key="node"
                type="button"
                className={`progress-node progress-node--${step.status}`}
                onClick={() => step.status === 'active' && onNext?.(i)}
                aria-label={step.title}
              >
                <span className="node-icon">{nodeIcon}</span>
              </button>
            )

            const cardEl = (
              <div
                key="card"
                className={[
                  'step-card',
                  step.status === 'active'    ? 'step-card--active'    : '',
                  step.status === 'completed' ? 'step-card--completed' : '',
                  step.status === 'locked'    ? 'step-card--locked'    : '',
                ].join(' ')}
              >
                <div className="step-card-top">
                  <p className="step-title">{step.title}</p>
                  <span className={`step-status-badge step-status-badge--${
                    step.status === 'completed' ? 'done'
                    : step.status === 'active'  ? 'active'
                    : 'locked'
                  }`}>
                    {step.status === 'completed' ? '✓ Terminé'
                     : step.status === 'active'  ? '▶ À faire'
                     : '🔒 Verrouillé'}
                  </span>
                </div>
                <p className="step-subtitle">{step.subtitle}</p>
                <div className="step-rewards">
                  {step.rewards.map(r => <span key={r} className="step-reward-chip">{r}</span>)}
                </div>
                <div className="step-footer">
                  {step.status === 'active' ? (
                    <button type="button" className="step-cta" onClick={() => onNext?.(i)}>▶ Continuer</button>
                  ) : step.status === 'completed' ? (
                    <span className="step-status-label">Validation réussie</span>
                  ) : (
                    <span className="step-status-label step-status-label--locked">À débloquer</span>
                  )}
                </div>
              </div>
            )

            return (
              <div key={step.id} className={`progress-item progress-item--${left ? 'left' : 'right'}`}>
                {left
                  ? <><div className="item-spacer" />{nodeEl}{cardEl}</>
                  : <>{cardEl}{nodeEl}<div className="item-spacer" /></>
                }
              </div>
            )
          })}
        </section>
      </main>
    </div>
  )
}

export default GamePage
