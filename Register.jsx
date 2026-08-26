import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { demoLogin } from '../utils/auth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', width: '0%' };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const widths = ['25%', '50%', '75%', '100%'];
  const classes = ['weak', 'fair', 'good', 'strong'];

  const index = Math.max(0, score - 1);

  return {
    score,
    label: password.length ? labels[index] || 'Weak' : '',
    width: password.length ? widths[index] || '25%' : '0%',
    className: classes[index] || 'weak',
  };
}

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strength = getPasswordStrength(form.password);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required.';
    } else if (form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!form.termsAccepted) {
      nextErrors.termsAccepted = 'You must accept the terms to continue.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      demoLogin({
        name: form.fullName.trim(),
        email: form.email.trim(),
        isDemoUser: true,
      });

      navigate('/dashboard');
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="auth-page">
      <div className="auth-page__brand">
        <div className="auth-page__brand-inner">
          <div className="auth-page__logo">F</div>
          <h1 className="auth-page__brand-title">FemoraAI</h1>
          <p className="auth-page__brand-tagline">
            Join a modern platform designed for women&apos;s health tracking and AI-assisted insights.
          </p>
        </div>
      </div>

      <div className="auth-page__form-section">
        <div className="auth-card">
          <div className="auth-card__header">
            <h2 className="auth-card__title">Create your account</h2>
            <p className="auth-card__subtitle">Start your health journey with FemoraAI</p>
          </div>

          {/* <div className="demo-banner" role="note">
            <strong>Development demo registration.</strong> No data is sent to a server. A local
            demo session is created on successful submission.
          </div> */}

          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label className="form-label" htmlFor="register-name">
                Full name
              </label>
              <input
                id="register-name"
                type="text"
                className={`form-input${errors.fullName ? ' form-input--error' : ''}`}
                value={form.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
              />
              {errors.fullName && <p className="form-error">{errors.fullName}</p>}
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="register-email">
                Email address
              </label>
              <input
                id="register-email"
                type="email"
                className={`form-input${errors.email ? ' form-input--error' : ''}`}
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="register-password">
                Password
              </label>
              <div className="form-input-group">
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input${errors.password ? ' form-input--error' : ''}`}
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="form-input-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {form.password && (
                <div className="password-strength">
                  <div className="password-strength__bar">
                    <div
                      className={`password-strength__fill password-strength__fill--${strength.className}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <span className="password-strength__label">{strength.label}</span>
                </div>
              )}
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="register-confirm">
                Confirm password
              </label>
              <div className="form-input-group">
                <input
                  id="register-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`form-input${errors.confirmPassword ? ' form-input--error' : ''}`}
                  value={form.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="form-input-toggle"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
            </div>

            <div className="form-field">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  checked={form.termsAccepted}
                  onChange={(e) => updateField('termsAccepted', e.target.checked)}
                />
                <span>
                  I agree to the Terms of Service and consent to health data processing for
                  platform features.
                </span>
              </label>
              {errors.termsAccepted && <p className="form-error">{errors.termsAccepted}</p>}
            </div>

            <button type="submit" className="btn btn--primary btn--full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="auth-card__footer">
            Already have an account?{' '}
            <Link to="/login" className="form-link form-link--inline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
