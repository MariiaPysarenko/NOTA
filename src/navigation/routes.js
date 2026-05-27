/** App routes */
export const ROUTES = {
  AUTH_LOGIN: "auth-login",
  AUTH_REGISTER: "auth-register",
  REGISTRATION_PROMPT: "registration-prompt",
  PRICING: "pricing",
  INSTRUMENT: "instrument",
  TRACK_CHOICE: "track-choice",
  LIBRARY: "library",
  UPLOAD: "upload",
  REVIEW: "review",
  PRACTICE: "practice",
  SHEET_EDITOR: "sheet-editor",
  PROGRESS: "progress",
  PROFILE: "profile",
  RESULT: "result",
};

export const TAB_ROUTES = [
  ROUTES.PRACTICE,
  ROUTES.PROGRESS,
  ROUTES.LIBRARY,
  ROUTES.PROFILE,
];

export const AUTH_ROUTES = [ROUTES.AUTH_LOGIN, ROUTES.AUTH_REGISTER];

export const FLOW_ROUTES = [ROUTES.REGISTRATION_PROMPT, ROUTES.PRICING];

export const BACK_ROUTE = {
  [ROUTES.INSTRUMENT]: null,
  [ROUTES.LIBRARY]: ROUTES.TRACK_CHOICE,
  [ROUTES.UPLOAD]: ROUTES.TRACK_CHOICE,
  [ROUTES.REVIEW]: ROUTES.TRACK_CHOICE,
  [ROUTES.PRACTICE]: ROUTES.TRACK_CHOICE,
  [ROUTES.TRACK_CHOICE]: null,
  [ROUTES.SHEET_EDITOR]: ROUTES.PRACTICE,
  [ROUTES.PROGRESS]: null,
  [ROUTES.PROFILE]: null,
  [ROUTES.RESULT]: ROUTES.PRACTICE,
  [ROUTES.AUTH_LOGIN]: null,
  [ROUTES.AUTH_REGISTER]: ROUTES.AUTH_LOGIN,
  [ROUTES.REGISTRATION_PROMPT]: ROUTES.RESULT,
  [ROUTES.PRICING]: ROUTES.PROFILE,
};

export function showBottomNav(route, canUseApp) {
  if (!canUseApp) return false;
  if (AUTH_ROUTES.includes(route)) return false;
  if (FLOW_ROUTES.includes(route)) return false;
  if (route === ROUTES.INSTRUMENT) return false;
  return (
    TAB_ROUTES.includes(route) ||
    route === ROUTES.RESULT ||
    route === ROUTES.TRACK_CHOICE
  );
}
