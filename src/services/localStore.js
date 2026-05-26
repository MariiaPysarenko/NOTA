const KEYS = {
  USER: "nota_user",
  SESSIONS: "nota_sessions",
  ANNOTATIONS: "nota_annotations",
};

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalUser() {
  return readJson(KEYS.USER, null);
}

export function setLocalUser(user) {
  writeJson(KEYS.USER, user);
}

export function clearLocalUser() {
  localStorage.removeItem(KEYS.USER);
}

export function getLocalSessions() {
  return readJson(KEYS.SESSIONS, []);
}

export function setLocalSessions(sessions) {
  writeJson(KEYS.SESSIONS, sessions);
}

export function getLocalAnnotations() {
  return readJson(KEYS.ANNOTATIONS, {});
}

export function setLocalAnnotations(annotationsBySheet) {
  writeJson(KEYS.ANNOTATIONS, annotationsBySheet);
}
