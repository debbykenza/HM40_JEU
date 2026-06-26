// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { authService } from '../services/authService';
import './LoginPage.css';

function LoginPage({ onBack, onRegister, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = "N'oublie pas ton email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Vérifie le format de ton email (exemple@email.com).';
    }

    if (!password) {
      nextErrors.password = "N'oublie pas ton mot de passe.";
    } else if (password.length < 6) {
      nextErrors.password = 'Le mot de passe doit avoir au moins 6 caractères.';
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setFormError('');

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await authService.loginWithEmail(email.trim(), password);
      
      if (result.success && result.user) {
        onLogin({ 
          user: result.user, 
          userData: result.userData || null
        });
      } else {
        setFormError(result.error || 'Erreur de connexion. Réessaie !');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setFormError('Une erreur est survenue. Réessaie !');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSSO(provider) {
    setFormError('');
    setIsSubmitting(true);
    
    try {
      let result;
      if (provider === 'google') {
        result = await authService.loginWithGoogle();
      } else if (provider === 'microsoft') {
        // Pour Microsoft, il faut configurer le provider dans Firebase d'abord
        setFormError('La connexion Microsoft sera bientôt disponible !');
        setIsSubmitting(false);
        return;
      }
      
      if (result?.success && result?.user) {
        const userData = await authService.getUserData(result.user.uid);
        onLogin({ 
          user: result.user, 
          userData: userData.success ? userData.data : null 
        });
      } else if (result?.error) {
        setFormError(result.error);
      }
    } catch (error) {
      console.error('Erreur SSO:', error);
      setFormError('Erreur de connexion. Réessaie !');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <button type="button" className="back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" className="back-btn-icon" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Retour
        </button>

        <div className="login-logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 3 1 8l11 5 9-4.09V17h2V8L12 3Z" fill="currentColor" />
            <path d="M5 13.18v4.5L12 21l7-3.32v-4.5l-7 3.18-7-3.18Z" fill="currentColor" opacity="0.7" />
          </svg>
        </div>

        <h2 className="login-title">Bienvenue !</h2>
        <p className="login-subtitle">Connecte-toi pour commencer à jouer et apprendre.</p>

        <div className="sso-group">
          <button 
            type="button" 
            className="sso-btn" 
            onClick={() => handleSSO('google')}
            disabled={isSubmitting}
          >
            <svg viewBox="0 0 24 24" className="sso-icon" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.29-2.66l-3.57-2.77c-.99.67-2.26 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
              <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.94l3.66-2.84Z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.94 10.94 0 0 0 12 1a11 11 0 0 0-9.82 6.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
            </svg>
            Google
          </button>
          <button 
            type="button" 
            className="sso-btn" 
            onClick={() => handleSSO('microsoft')}
            disabled={isSubmitting}
          >
            <svg viewBox="0 0 24 24" className="sso-icon" aria-hidden="true">
              <rect x="2" y="2" width="9" height="9" fill="#F25022" />
              <rect x="13" y="2" width="9" height="9" fill="#7FBA00" />
              <rect x="2" y="13" width="9" height="9" fill="#00A4EF" />
              <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
            </svg>
            Microsoft
          </button>
        </div>

        <div className="login-divider" role="presentation">
          <span>ou</span>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label className="field-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="exemple@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={errors.email ? 'field-input field-input-error' : 'field-input'}
            autoComplete="email"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="field-error" id="email-error" role="alert">{errors.email}</p>
          )}

          <label className="field-label" htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className={errors.password ? 'field-input field-input-error' : 'field-input'}
            autoComplete="current-password"
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="field-error" id="password-error" role="alert">{errors.password}</p>
          )}

          {formError && (
            <p className="form-error" role="alert">{formError}</p>
          )}

          <div className="login-actions">
            <button type="submit" className="login-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>
            <button 
              type="button" 
              className="secondary-login-btn" 
              onClick={onRegister}
              disabled={isSubmitting}
            >
              Créer un compte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;