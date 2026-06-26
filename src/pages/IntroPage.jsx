import React from 'react'
import './IntroPage.css'

function IntroPage({ onStart }) {
  return (
    <div className="intro-page">
      <div className="intro-decor" aria-hidden="true">
        <span className="intro-shape intro-shape-1" />
        <span className="intro-shape intro-shape-2" />
        <span className="intro-shape intro-shape-3" />
      </div>

      <div className="intro-card">
        <div className="intro-mascot" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="7" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="8" cy="13" r="1.6" fill="currentColor" />
            <circle cx="16" cy="13" r="1.6" fill="currentColor" />
            <path d="M9 4.5C9 3.12 10.12 2 11.5 2S14 3.12 14 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>

        <p className="intro-eyebrow">Bienvenue sur</p>
        <h1 className="intro-title">PLAY &amp; LEARN</h1>
        <p className="intro-subtitle">
          Apprends, joue et progresse en découvrant de nouveaux mots et faits fascinants.
        </p>

        <button type="button" className="start-btn" onClick={onStart}>
          Commencer
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="start-btn-icon">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="intro-badges" role="list" aria-label="Matieres disponibles">
          <span className="intro-badge intro-badge-green" role="listitem">Géographie</span>
          <span className="intro-badge intro-badge-yellow" role="listitem">Sciences</span>
          <span className="intro-badge intro-badge-red" role="listitem">Histoire</span>
        </div>
      </div>
    </div>
  )
}

export default IntroPage
