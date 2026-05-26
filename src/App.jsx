import { useEffect, useState } from "react";
import AppShell from "./components/AppShell";
import OnboardingFlow from "./components/OnboardingFlow";
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
import "./App.css";

function AppRouter() {
  const route = useNotaStore((s) => s.route);

  if (!useNotaStore((s) => s.user)) {
    if (route === ROUTES.AUTH_REGISTER) return <AuthScreen mode="register" />;
    return <AuthScreen mode="login" />;
  }

  switch (route) {
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
  const user = useNotaStore((s) => s.user);
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
      <div className="app app-standalone">
        <OnboardingFlow
          onComplete={() => {
            setPreAuthOnboardingDone();
            bump((n) => n + 1);
          }}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app app-standalone">
        <div className="phone phone-auth">
          <AppRouter />
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      <AppRouter />
    </AppShell>
  );
}
