import { useEffect, useState } from "react";
import AppShell from "./components/AppShell";
import OnboardingFlow from "./components/OnboardingFlow";
import PhoneFrame from "./components/PhoneFrame";
import AuthLoading from "./components/AuthLoading";
import { useNotaStore } from "./store/useNotaStore";
import { ROUTES } from "./navigation/routes";
import {
  isPreAuthOnboardingDone,
  setPreAuthOnboardingDone,
} from "./services/localStore";
import AuthScreen from "./screens/AuthScreen";
import InstrumentSelectionScreen from "./screens/InstrumentSelectionScreen";
import PracticeScreen from "./screens/PracticeScreen";
import ReviewEditScreen from "./screens/ReviewEditScreen";
import TrackChoiceScreen from "./screens/TrackChoiceScreen";
import TrackLibraryScreen from "./screens/TrackLibraryScreen";
import UploadDigitizeScreen from "./screens/UploadDigitizeScreen";
import SheetEditorScreen from "./screens/SheetEditorScreen";
import ProgressScreen from "./screens/ProgressScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ResultAnalysisScreen from "./screens/ResultAnalysisScreen";
import RegistrationPromptScreen from "./screens/RegistrationPromptScreen";
import PricingScreen from "./screens/PricingScreen";
import "./App.css";

function AppRouter() {
  const route = useNotaStore((s) => s.route);

  switch (route) {
    case ROUTES.AUTH_LOGIN:
      return <AuthScreen mode="login" />;
    case ROUTES.AUTH_REGISTER:
      return <AuthScreen mode="register" />;
    case ROUTES.REGISTRATION_PROMPT:
      return <RegistrationPromptScreen />;
    case ROUTES.PRICING:
      return <PricingScreen />;
    case ROUTES.INSTRUMENT:
      return <InstrumentSelectionScreen />;
    case ROUTES.TRACK_CHOICE:
      return <TrackChoiceScreen />;
    case ROUTES.LIBRARY:
      return <TrackLibraryScreen />;
    case ROUTES.UPLOAD:
      return <UploadDigitizeScreen />;
    case ROUTES.REVIEW:
      return <ReviewEditScreen />;
    case ROUTES.PRACTICE:
      return <PracticeScreen />;
    case ROUTES.SHEET_EDITOR:
      return <SheetEditorScreen />;
    case ROUTES.PROGRESS:
      return <ProgressScreen />;
    case ROUTES.PROFILE:
      return <ProfileScreen />;
    case ROUTES.RESULT:
      return <ResultAnalysisScreen />;
    default:
      return <TrackChoiceScreen />;
  }
}

export default function App() {
  const initApp = useNotaStore((s) => s.initApp);
  const authReady = useNotaStore((s) => s.authReady);
  const [, bump] = useState(0);

  useEffect(() => {
    initApp();
  }, [initApp]);

  if (!authReady) {
    return (
      <div className="app app-standalone">
        <AuthLoading />
      </div>
    );
  }

  if (!isPreAuthOnboardingDone()) {
    return (
      <PhoneFrame className="phone-onboarding">
        <OnboardingFlow
          onComplete={() => {
            setPreAuthOnboardingDone();
            bump((n) => n + 1);
          }}
        />
      </PhoneFrame>
    );
  }

  return (
    <AppShell>
      <AppRouter />
    </AppShell>
  );
}
