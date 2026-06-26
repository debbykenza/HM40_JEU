import React from 'react'

function IntroPage({ onStart }) {
  return (
    <div className="intro-page">
      <div className="intro-card">
        <h1>culture générale</h1>
        <p>Apprends, joue et progresse en découvrant de nouveaux mots et faits fascinants.</p>
        <button type="button" className="start-btn" onClick={onStart}>
          Commencer
        </button>
      </div>
    </div>
  )
}

export default IntroPage
