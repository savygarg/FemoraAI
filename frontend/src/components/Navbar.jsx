import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserInitials } from '../utils/auth';

function Navbar({ onMenuToggle }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button
          type="button"
          className="navbar__menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <Link to="/" className="navbar__brand">
          <div className="navbar__logo" aria-hidden="true">
            F
          </div>
          <div>
            <div className="navbar__title">FemoraAI</div>
            <div className="navbar__tagline">Women&apos;s Health Intelligence</div>
          </div>
        </Link>
      </div>

      <div className="navbar__right">
        <Link
          to="/my-profile"
          className="navbar__user navbar__user-link"
          aria-label="Open My Profile"
        >
          <div className="navbar__avatar" aria-hidden="true">
            {getUserInitials(user?.name) || 'U'}
          </div>
          <span className="navbar__user-label">{user?.name || 'Account'}</span>
        </Link>

        <button
          type="button"
          className="btn btn--ghost navbar__logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
