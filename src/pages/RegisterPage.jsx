// src/pages/RegisterPage.jsx
import React, { useState } from 'react'
import { authService } from '../services/authService'

function RegisterPage({ onBack, onLogin }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate() {
    const nextErrors = {}

    if (!fullName.trim()) {
      nextErrors.fullName = "N'oublie pas ton nom complet."
    }

    if (!email.trim()) {
      nextErrors.email = "N'oublie pas ton email."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Vérifie le format de ton email.'
    }

    if (!password) {
      nextErrors.password = 'N\'oublie pas ton mot de passe.'
    } else if (password.length < 6) {
      nextErrors.password = 'Le mot de passe doit avoir au moins 6 caractères.'
    }

    if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Les mots de passe ne correspondent pas.'
    }

    return nextErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    setFormError('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    try {
      const result = await authService.registerWithEmail(
        email.trim(), 
        password, 
        fullName.trim()
      )
      
      if (result.success && result.user) {
        // Connexion automatique après inscription
        onLogin()
      } else {
        setFormError(result.error || 'Erreur lors de l\'inscription. Réessaie !')
      }
    } catch (error) {
      console.error('Erreur inscription:', error)
      setFormError('Une erreur est survenue. Réessaie !')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card register-card">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Retour
        </button>

        <div className="login-logo">✍️</div>
        <h2>Créer un compte</h2>
        <p>Remplis les informations ci-dessous pour rejoindre l’application.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label className="field-label" htmlFor="fullName">Nom complet</label>
          <input 
            id="fullName" 
            type="text" 
            placeholder="Jean Dupont"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={errors.fullName ? 'field-input field-input-error' : 'field-input'}
            disabled={isSubmitting}
          />
          {errors.fullName && (
            <p className="field-error" role="alert">{errors.fullName}</p>
          )}

          <label className="field-label" htmlFor="registerEmail">Email</label>
          <input 
            id="registerEmail" 
            type="email" 
            placeholder="exemple@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? 'field-input field-input-error' : 'field-input'}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="field-error" role="alert">{errors.email}</p>
          )}

          <label className="field-label" htmlFor="registerPassword">Mot de passe</label>
          <input 
            id="registerPassword" 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? 'field-input field-input-error' : 'field-input'}
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="field-error" role="alert">{errors.password}</p>
          )}

          <label className="field-label" htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <input 
            id="confirmPassword" 
            type="password" 
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={errors.confirmPassword ? 'field-input field-input-error' : 'field-input'}
            disabled={isSubmitting}
          />
          {errors.confirmPassword && (
            <p className="field-error" role="alert">{errors.confirmPassword}</p>
          )}

          {formError && (
            <p className="form-error" role="alert">{formError}</p>
          )}

          <div className="login-actions">
            <button 
              type="submit" 
              className="login-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Inscription...' : 'S\'inscrire'}
            </button>
            <button 
              type="button" 
              className="secondary-login-btn" 
              onClick={onLogin}
              disabled={isSubmitting}
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage