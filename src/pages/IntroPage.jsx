import React from 'react'
import './IntroPage.css'

function IntroPage({ onStart }) {
  return (
    <div className="intro-page">
      <div className="intro-image-wrapper">
        <img src="/src/assets/Learning-bro.png" alt="Illustration" className="intro-image" />
      </div>

      <h1 className="intro-title">culture générale</h1>
      <p className="intro-subtitle">
        Apprends, joue et progresse en découvrant de nouveaux mots et faits fascinants.
      </p>

      <button type="button" className="start-btn" onClick={onStart}>
        Commencer
      </button>
    </div>
  )
}

export default IntroPage
