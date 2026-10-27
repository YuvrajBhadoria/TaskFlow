import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const dialogRef = useRef(null);
  const { login, register } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (isOutside) {
      onClose();
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@taskflow.dev');
    setPassword('demo1234');
    if (mode === 'register') {
      setName('Demo User');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'register' && !name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        await register(name.trim(), email.trim(), password);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={handleBackdropClick}
      aria-labelledby="auth-modal-title"
    >
      <div className="modal-header">
        <h2 id="auth-modal-title" className="modal-title">
          {mode === 'login' ? 'Welcome Back' : 'Create TaskFlow Account'}
        </h2>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          ✕
        </button>
      </div>

      <div className="filter-tabs" style={{ marginBottom: '1.25rem' }}>
        <button
          type="button"
          className={`filter-tab ${mode === 'login' ? 'active' : ''}`}
          onClick={() => {
            setMode('login');
            setErrorMsg('');
          }}
          style={{ flex: 1 }}
        >
          Sign In
        </button>
        <button
          type="button"
          className={`filter-tab ${mode === 'register' ? 'active' : ''}`}
          onClick={() => {
            setMode('register');
            setErrorMsg('');
          }}
          style={{ flex: 1 }}
        >
          Register
        </button>
      </div>

      {errorMsg && (
        <div className="alert-banner error" style={{ padding: '0.6rem 0.9rem', marginBottom: '1rem' }}>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {mode === 'register' && (
          <div className="form-group">
            <label htmlFor="auth-name" className="form-label">
              Full Name
            </label>
            <input
              id="auth-name"
              type="text"
              className="form-input"
              placeholder="e.g. Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="auth-email" className="form-label">
            Email Address
          </label>
          <input
            id="auth-email"
            type="email"
            className="form-input"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="auth-password" className="form-label">
            Password (min 6 characters)
          </label>
          <input
            id="auth-password"
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.5rem 0 1.25rem' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={handleFillDemo}
            style={{ fontSize: '0.8rem', color: 'var(--primary)' }}
          >
            ⚡ Auto-fill Demo Credentials
          </button>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </form>
    </dialog>
  );
};
