import AppShell from "./components/AppShell";
import { AppProvider, useApp } from "./context/AppContext";
import { ROUTES } from "./navigation/routes";
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

  if (!user) {
    if (route === ROUTES.AUTH_REGISTER) return <AuthScreen mode="register" />;
    return <AuthScreen mode="login" />;
  }

  switch (route) {
    case ROUTES.AUTH_LOGIN:
      return <AuthScreen mode="login" />;
    case ROUTES.AUTH_REGISTER:
      return <AuthScreen mode="register" />;
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
    case ROUTES.RESULT:
      return <ResultAnalysisScreen />;
    case ROUTES.PROGRESS:
      return <ProgressScreen />;
    case ROUTES.PROFILE:
      return <ProfileScreen />;
    default:
      return <PracticeScreen />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <AppShell>
        <AppRouter />
      </AppShell>
    </AppProvider>
  );
}
