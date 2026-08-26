export const STORAGE_KEYS = {
  HEALTH_PROFILE: 'femoraai_health_profile',
  HEALTH_LOGS: 'femoraai_health_logs',
  ASSESSMENT_RESULTS: 'femoraai_assessment_results',
};

export function readStorage(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
