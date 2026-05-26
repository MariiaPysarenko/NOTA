const KEYS = {
  USER: "nota_user",
  SESSIONS: "nota_sessions",
  ANNOTATIONS: "nota_annotations",
  GAMIFICATION: "nota_gamification",
  FAVORITES: "nota_favorites",
  PRE_AUTH_ONBOARDING: "nota_pre_auth_onboarding_done",
  SETUP_COMPLETE: "nota_setup_complete",
  ONBOARDING: "nota_onboarding_done",
  INTRO: "nota_intro_done",
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

export function getGamification() {
  return readJson(KEYS.GAMIFICATION, null);
}

export function setGamification(state) {
  writeJson(KEYS.GAMIFICATION, state);
}

export function getFavorites() {
  return readJson(KEYS.FAVORITES, []);
}

export function setFavorites(ids) {
  writeJson(KEYS.FAVORITES, ids);
}

/** Pre-registration product onboarding (shown once ever) */
export function isPreAuthOnboardingDone() {
  return localStorage.getItem(KEYS.PRE_AUTH_ONBOARDING) === "1";
}

export function setPreAuthOnboardingDone() {
  localStorage.setItem(KEYS.PRE_AUTH_ONBOARDING, "1");
}

/** Instrument + first-time setup finished */
export function isSetupComplete() {
  return localStorage.getItem(KEYS.SETUP_COMPLETE) === "1";
}

export function setSetupComplete() {
  localStorage.setItem(KEYS.SETUP_COMPLETE, "1");
}

export function clearSetupComplete() {
  localStorage.removeItem(KEYS.SETUP_COMPLETE);
}

/** @deprecated Legacy tip overlay — treated as done if setup complete */
export function isOnboardingDone() {
  return isSetupComplete() || localStorage.getItem(KEYS.ONBOARDING) === "1";
}

export function setOnboardingDone() {
  localStorage.setItem(KEYS.ONBOARDING, "1");
}

export function isIntroDone() {
  return localStorage.getItem(KEYS.INTRO) === "1";
}

export function setIntroDone() {
  localStorage.setItem(KEYS.INTRO, "1");
}
