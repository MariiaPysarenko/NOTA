import { ROUTES } from "../navigation/routes";
import { isSetupComplete } from "../services/localStore";

export function getPostAuthRoute() {
  return isSetupComplete() ? ROUTES.TRACK_CHOICE : ROUTES.INSTRUMENT;
}
