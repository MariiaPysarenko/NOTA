import AppShell from "./components/AppShell";
import { AppProvider, useApp } from "./context/AppContext";
import { ROUTES } from "./navigation/routes";
import InstrumentSelectionScreen from "./screens/InstrumentSelectionScreen";
import PracticeScreen from "./screens/PracticeScreen";
import ReviewEditScreen from "./screens/ReviewEditScreen";
import TrackChoiceScreen from "./screens/TrackChoiceScreen";
import TrackLibraryScreen from "./screens/TrackLibraryScreen";
import UploadDigitizeScreen from "./screens/UploadDigitizeScreen";
import "./App.css";

function AppRouter() {
  const { route } = useApp();

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
    default:
      return <InstrumentSelectionScreen />;
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
