import { useState } from "react";
import AppShell from "./components/AppShell";
import IntroSplash from "./components/IntroSplash";
import OnboardingTutorial from "./components/OnboardingTutorial";
import { useNotaStore } from "./store/useNotaStore";
import { ROUTES } from "./navigation/routes";
import { isIntroDone, setIntroDone, isOnboardingDone, setOnboardingDone } from "./services/localStore";
import InstrumentSelectionScreen from "./screens/InstrumentSelectionScreen";
import PracticeScreen from "./screens/PracticeScreen";
import ReviewEditScreen from "./screens/ReviewEditScreen";
import TrackChoiceScreen from "./screens/TrackChoiceScreen";
import TrackLibraryScreen from "./screens/TrackLibraryScreen";
import UploadDigitizeScreen from "./screens/UploadDigitizeScreen";
import SheetEditorScreen from "./screens/SheetEditorScreen";
import "./App.css";

function AppRouter() {
  const route = useNotaStore((s) => s.route);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const showOnboarding = !isOnboardingDone() && route === ROUTES.INSTRUMENT;

  let screen;
  switch (route) {
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
    default:
      screen = <InstrumentSelectionScreen />;
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
    <>
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
    </>
  );
}
