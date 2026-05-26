import { useEffect, useState } from "react";
import AppShell from "./components/AppShell";
import IntroSplash from "./components/IntroSplash";
import OnboardingTutorial from "./components/OnboardingTutorial";
import AuthLoading from "./components/AuthLoading";
import BottomNav from "./components/BottomNav";
import { useNotaStore } from "./store/useNotaStore";
import { ROUTES, showBottomNav } from "./navigation/routes";
import { isIntroDone, setIntroDone, isOnboardingDone, setOnboardingDone } from "./services/localStore";
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
  const user = useNotaStore((s) => s.user);
  const authReady = useNotaStore((s) => s.authReady);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const showOnboarding =
    user && !isOnboardingDone() && (route === ROUTES.INSTRUMENT || route === ROUTES.PRACTICE);

  if (!authReady) return <AuthLoading />;

  if (!user) {
    if (route === ROUTES.AUTH_REGISTER) return <AuthScreen mode="register" />;
    return <AuthScreen mode="login" />;
  }

  let screen;
  switch (route) {
    case ROUTES.AUTH_LOGIN:
    case ROUTES.AUTH_REGISTER:
      screen = <PracticeScreen />;
      break;
    case ROUTES.INSTRUMENT:
      screen = <InstrumentSelectionScreen />;
      break;
    case ROUTES.TRACK_CHOICE:
      screen = <TrackChoiceScreen />;
      break;
    case ROUTES.LIBRARY:
      screen = <TrackLibraryScreen />;
      break;
    case ROUTES.UPLOAD:
      screen = <UploadDigitizeScreen />;
      break;
    case ROUTES.REVIEW:
      screen = <ReviewEditScreen />;
      break;
    case ROUTES.PRACTICE:
      screen = <PracticeScreen />;
      break;
    case ROUTES.SHEET_EDITOR:
      screen = <SheetEditorScreen />;
      break;
    case ROUTES.PROGRESS:
      screen = <ProgressScreen />;
      break;
    case ROUTES.PROFILE:
      screen = <ProfileScreen />;
      break;
    case ROUTES.RESULT:
      screen = <ResultAnalysisScreen />;
      break;
    default:
      screen = <PracticeScreen />;
  }

  return (
    <>
      {screen}
      {showOnboarding && (
        <OnboardingTutorial
          step={onboardingStep}
          onNext={() => {
            if (onboardingStep >= 3) setOnboardingDone();
            else setOnboardingStep((s) => s + 1);
          }}
          onSkip={() => setOnboardingDone()}
        />
      )}
      {showBottomNav(route, Boolean(user)) && <BottomNav />}
    </>
  );
}

export default function App() {
  const initApp = useNotaStore((s) => s.initApp);
  const [showIntro, setShowIntro] = useState(!isIntroDone());
  const user = useNotaStore((s) => s.user);
  const authReady = useNotaStore((s) => s.authReady);

  useEffect(() => {
    initApp();
  }, [initApp]);

  return (
    <>
      {showIntro && authReady && user && (
        <IntroSplash
          onDone={() => {
            setIntroDone();
            setShowIntro(false);
          }}
        />
      )}
      <AppShell>
        <AppRouter />
      </AppShell>
    </>
  );
}
