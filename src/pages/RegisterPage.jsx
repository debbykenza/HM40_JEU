import React from 'react'

function RegisterPage({ onBack, onLogin }) {
  return (
    <div className="login-page">
      <div className="login-card register-card">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Retour
        </button>

        <div className="login-logo">✍️</div>
        <h2>Créer un compte</h2>
        <p>Remplis les informations ci-dessous pour rejoindre l’application.</p>

        <label className="field-label" htmlFor="fullName">Nom complet</label>
        <input id="fullName" type="text" placeholder="Jean Dupont" />

        <label className="field-label" htmlFor="registerEmail">Email</label>
        <input id="registerEmail" type="email" placeholder="exemple@email.com" />

        <label className="field-label" htmlFor="registerPassword">Mot de passe</label>
        <input id="registerPassword" type="password" placeholder="••••••••" />

        <label className="field-label" htmlFor="confirmPassword">Confirmer le mot de passe</label>
        <input id="confirmPassword" type="password" placeholder="••••••••" />

        <div className="login-actions">
          <button type="button" className="login-btn">S’inscrire</button>
          <button type="button" className="secondary-login-btn" onClick={onLogin}>
            Se connecter
          </button>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
