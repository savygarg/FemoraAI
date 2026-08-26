/** Development-only authentication helpers. Not real authentication. */

export const DEMO_TOKEN_KEY = 'token';
export const DEMO_USER_KEY = 'user';

export function isDemoAuthenticated() {
  return Boolean(localStorage.getItem(DEMO_TOKEN_KEY));
}

export function getDemoUser() {
  const raw = localStorage.getItem(DEMO_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function demoLogin(user) {
  localStorage.setItem(DEMO_TOKEN_KEY, 'demo-token');
  localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
}

export function demoLogout() {
  localStorage.removeItem(DEMO_TOKEN_KEY);
  localStorage.removeItem(DEMO_USER_KEY);
}

export function getUserInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
