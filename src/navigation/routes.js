/** Screen route identifiers for the NOTA practice flow */
export const ROUTES = {
  AUTH_LOGIN: "auth-login",
  AUTH_REGISTER: "auth-register",
  INSTRUMENT: "instrument",
  TRACK_CHOICE: "track-choice",
  LIBRARY: "library",
  UPLOAD: "upload",
  REVIEW: "review",
  PRACTICE: "practice",
  SHEET_EDITOR: "sheet-editor",
  RESULT: "result",
  PROGRESS: "progress",
  PROFILE: "profile",
};

/** Back navigation map */
export const BACK_ROUTE = {
  [ROUTES.AUTH_LOGIN]: null,
  [ROUTES.AUTH_REGISTER]: ROUTES.AUTH_LOGIN,
  [ROUTES.INSTRUMENT]: null,
  [ROUTES.TRACK_CHOICE]: ROUTES.INSTRUMENT,
  [ROUTES.LIBRARY]: ROUTES.TRACK_CHOICE,
  [ROUTES.UPLOAD]: ROUTES.TRACK_CHOICE,
  [ROUTES.REVIEW]: ROUTES.TRACK_CHOICE,
  [ROUTES.PRACTICE]: ROUTES.REVIEW,
  [ROUTES.SHEET_EDITOR]: ROUTES.PRACTICE,
  [ROUTES.RESULT]: ROUTES.PRACTICE,
  [ROUTES.PROGRESS]: ROUTES.PRACTICE,
  [ROUTES.PROFILE]: ROUTES.PRACTICE,
};
