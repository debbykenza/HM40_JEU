import React from 'react'

function LoginPage({ onBack, onRegister, onLogin }) {
  return (
    <div className="login-page">
      <div className="login-card">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Retour
        </button>

        <div className="login-logo">🎓</div>
        <h2>Bienvenue !</h2>
        <p>Connecte-toi pour commencer à jouer et apprendre.</p>

        <label className="field-label" htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="exemple@email.com" />

        <label className="field-label" htmlFor="password">Mot de passe</label>
        <input id="password" type="password" placeholder="••••••••" />

        <div className="login-actions">
          <button type="button" className="login-btn" onClick={onLogin}>
            Se connecter
          </button>
          <button type="button" className="secondary-login-btn" onClick={onRegister}>
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
