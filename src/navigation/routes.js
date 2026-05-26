/** Screen route identifiers for the NOTA practice flow */
export const ROUTES = {
  INSTRUMENT: "instrument",
  TRACK_CHOICE: "track-choice",
  LIBRARY: "library",
  UPLOAD: "upload",
  REVIEW: "review",
  PRACTICE: "practice",
};

/** Back navigation map */
export const BACK_ROUTE = {
  [ROUTES.INSTRUMENT]: null,
  [ROUTES.TRACK_CHOICE]: ROUTES.INSTRUMENT,
  [ROUTES.LIBRARY]: ROUTES.TRACK_CHOICE,
  [ROUTES.UPLOAD]: ROUTES.TRACK_CHOICE,
  [ROUTES.REVIEW]: ROUTES.TRACK_CHOICE,
  [ROUTES.PRACTICE]: ROUTES.REVIEW,
};
