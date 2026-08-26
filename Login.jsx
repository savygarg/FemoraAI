import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { demoLogin } from '../utils/auth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
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
        name: 'Demo User',
        email: email.trim(),
      });

      if (rememberMe) {
        localStorage.setItem('femoraai_remember_email', email.trim());
      } else {
        localStorage.removeItem('femoraai_remember_email');
      }

      navigate('/dashboard');
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="auth-page">
      <div className="auth-page__brand">
  <div className="auth-page__brand-decoration decoration-one"></div>
  <div className="auth-page__brand-decoration decoration-two"></div>

  <div className="auth-page__brand-inner">

    <div className="auth-page__logo">
      F
    </div>

    <p className="auth-page__eyebrow">
      WOMEN'S HEALTH INTELLIGENCE
    </p>

    <h1 className="auth-page__brand-title">
      Your health.
      <br />
      <span>Your insights.</span>
    </h1>

    <p className="auth-page__brand-tagline">
      FemoraAI brings your health information, intelligent risk insights,
      and personal trends together in one place.
    </p>

    <div className="auth-page__feature-list">

      <div className="auth-feature">
        <div className="auth-feature__icon">✦</div>
        <div>
          <strong>AI-powered insights</strong>
          <span>Understand your health patterns</span>
        </div>
      </div>

      <div className="auth-feature">
        <div className="auth-feature__icon">◉</div>
        <div>
          <strong>Personalized tracking</strong>
          <span>Keep your health journey organized</span>
        </div>
      </div>

      <div className="auth-feature">
        <div className="auth-feature__icon">↗</div>
        <div>
          <strong>Meaningful trends</strong>
          <span>See how your health changes over time</span>
        </div>
      </div>

    </div>

  </div>
</div>

      <div className="auth-page__form-section">
        <div className="auth-card">
          <div className="auth-card__header">
            <h2 className="auth-card__title">Welcome back</h2>
            <p className="auth-card__subtitle">Sign in to your FemoraAI account</p>
          </div>

          {/* <div className="demo-banner" role="note">
            <strong>Development demo login.</strong> Any valid email and password will sign you
            in locally. No data is sent to a server. This is not real authentication.
          </div> */}

          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label className="form-label" htmlFor="login-email">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                className={`form-input${errors.email ? ' form-input--error' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="login-password">
                Password
              </label>
              <div className="form-input-group">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input${errors.password ? ' form-input--error' : ''}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            <div className="form-row">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <button type="button" className="form-link">
                Forgot password?
              </button>
            </div>

            <button type="submit" className="btn btn--primary btn--full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="auth-card__footer">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="form-link form-link--inline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
