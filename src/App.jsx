import { useState } from "react";
import AppShell from "./components/AppShell";
import IntroSplash from "./components/IntroSplash";
import OnboardingTutorial from "./components/OnboardingTutorial";
import { AppProvider, useApp } from "./context/AppContext";
import { ROUTES } from "./navigation/routes";
import { isIntroDone, setIntroDone, isOnboardingDone, setOnboardingDone } from "./services/localStore";
import InstrumentSelectionScreen from "./screens/InstrumentSelectionScreen";
import PracticeScreen from "./screens/PracticeScreen";
import ReviewEditScreen from "./screens/ReviewEditScreen";
import TrackChoiceScreen from "./screens/TrackChoiceScreen";
import TrackLibraryScreen from "./screens/TrackLibraryScreen";
import UploadDigitizeScreen from "./screens/UploadDigitizeScreen";
import AuthScreen from "./screens/AuthScreen";
import ResultAnalysisScreen from "./screens/ResultAnalysisScreen";
import ProgressScreen from "./screens/ProgressScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SheetEditorScreen from "./screens/SheetEditorScreen";
import "./App.css";

function AppRouter() {
  const { route, user } = useApp();
  const [onboardingStep, setOnboardingStep] = useState(0);
  const showOnboarding = user && !isOnboardingDone() && route === ROUTES.INSTRUMENT;

  if (!user) {
    if (route === ROUTES.AUTH_REGISTER) return <AuthScreen mode="register" />;
    return <AuthScreen mode="login" />;
  }

  let screen;
  switch (route) {
    case ROUTES.AUTH_LOGIN:
      screen = <AuthScreen mode="login" />;
      break;
    case ROUTES.AUTH_REGISTER:
      screen = <AuthScreen mode="register" />;
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
    case ROUTES.RESULT:
      screen = <ResultAnalysisScreen />;
      break;
    case ROUTES.PROGRESS:
      screen = <ProgressScreen />;
      break;
    case ROUTES.PROFILE:
      screen = <ProfileScreen />;
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
    </>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(!isIntroDone());

  return (
    <AppProvider>
      {showIntro && (
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
    </AppProvider>
  );
}
