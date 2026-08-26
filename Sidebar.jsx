import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 13h6V4H4v9zm0 7h6v-5H4v5zm8 0h8v-9h-8v9zm0-16v5h8V4h-8z"
          fill="currentColor"
        />
      </svg>
    ),
  },

  {
    label: 'Health Profile',
    to: '/profile',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          fill="currentColor"
        />
      </svg>
    ),
  },

  {
    label: 'Health Logs',
    to: '/health-logs',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z"
          fill="currentColor"
        />
      </svg>
    ),
  },

  {
    label: 'AI Prediction',
    to: '/prediction',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7zm0 2a5 5 0 0 0-5 5c0 1.62.77 3.06 1.97 3.97L10 14.1V17h4v-2.9l1.03-1.13A4.99 4.99 0 0 0 17 9a5 5 0 0 0-5-5z"
          fill="currentColor"
        />
      </svg>
    ),
  },

  {
    label: 'Results',
    to: '/results',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 3h2v18H3V3zm8 10h2v8h-2v-8zm8-6h2v14h-2V7z"
          fill="currentColor"
        />
      </svg>
    ),
  },

  // NEW — AI HEALTH ASSISTANT
  {
    label: 'AI Health Assistant',
    to: '/chatbot',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 4H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h3v3l4-3h9c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 9H7v-2h4v2zm6 0h-4v-2h4v2zm0-4H7V7h10v2z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

function Sidebar({ isOpen, onClose }) {
  const linkClassName = ({ isActive }) =>
    `sidebar__link${isActive ? ' sidebar__link--active' : ''}`;

  return (
    <>
      <div
        className={`sidebar-overlay${
          isOpen ? ' sidebar-overlay--visible' : ''
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`sidebar${isOpen ? ' sidebar--open' : ''}`}
        aria-label="Main navigation"
      >
        <div className="sidebar__header">
          <span className="sidebar__label">
            Navigation
          </span>
        </div>

        <nav className="sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={linkClassName}
              onClick={onClose}
            >
              <span className="sidebar__link-icon">
                {item.icon}
              </span>

              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <p className="sidebar__footer-text">
            AI-powered insights for informed health decisions.
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;