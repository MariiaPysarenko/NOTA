import { ROUTES } from "../navigation/routes";
import { isSetupComplete } from "../services/localStore";

export function getPostAuthRoute() {
  return isSetupComplete() ? ROUTES.TRACK_CHOICE : ROUTES.INSTRUMENT;
}

export function getGuestEntryRoute() {
  return getPostAuthRoute();
}

export function canUseMainApp({ user }) {
  return Boolean(user) || isSetupComplete();
}
