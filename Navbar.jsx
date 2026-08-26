function Navbar({ onMenuToggle }) {
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

        <div className="navbar__brand">
          <div className="navbar__logo" aria-hidden="true">
            F
          </div>
          <div>
            <div className="navbar__title">FemoraAI</div>
            <div className="navbar__tagline">Women&apos;s Health Intelligence</div>
          </div>
        </div>
      </div>

      <div className="navbar__right">
        <div className="navbar__user">
          <div className="navbar__avatar" aria-hidden="true">
            U
          </div>
          <span className="navbar__user-label">Account</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
