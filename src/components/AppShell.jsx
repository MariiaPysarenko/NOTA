import { BACK_ROUTE, ROUTES } from "../navigation/routes";
import { useApp } from "../context/AppContext";
import BottomNav from "./BottomNav";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";

const SWIPE_TABS = new Set([ROUTES.PRACTICE, ROUTES.PROGRESS, ROUTES.LIBRARY, ROUTES.PROFILE]);

export default function AppShell({ children }) {
  const { route, navigate, toast, user, isDemoMode, activeTab, setActiveTab } = useApp();

  useSwipeNavigation({
    enabled: user && SWIPE_TABS.has(route),
    activeTab,
    setActiveTab,
    navigate,
    routes: ROUTES,
  });
  const backRoute = BACK_ROUTE[route];
  const canGoBack = Boolean(backRoute);

  const goHome = () => navigate(user ? ROUTES.PRACTICE : ROUTES.AUTH_LOGIN);
  const goBack = () => {
    if (backRoute) navigate(backRoute);
  };

  return (
    <div className="app">
      <div className="phone">
        {toast && <div className="toast">{toast}</div>}

        <div className="status">
          <span>9:41</span>
          <span>▮▮▮ Wi-Fi ▰</span>
        </div>

        <header className="header">
          <button
            type="button"
            className={`back ${canGoBack ? "" : "hidden"}`}
            onClick={goBack}
            aria-label="Go back"
          >
            ‹
          </button>
          <button type="button" className="logo" onClick={goHome}>
            NOT<span>A</span>
          </button>
        </header>

        {isDemoMode && user && <p className="demo-badge">Demo Mode</p>}
        <div className="screen-transition">{children}</div>
        <BottomNav />
      </div>
    </div>
  );
}
