import { BACK_ROUTE, ROUTES, showBottomNav } from "../navigation/routes";
import { useNotaStore } from "../store/useNotaStore";
import { isDemoMode } from "../services/supabaseClient";
import BottomNav from "./BottomNav";

export default function AppShell({ children }) {
  const route = useNotaStore((s) => s.route);
  const navigate = useNotaStore((s) => s.navigate);
  const toast = useNotaStore((s) => s.toast);
  const user = useNotaStore((s) => s.user);
  const teacherMode = useNotaStore((s) => s.teacherMode);
  const authReady = useNotaStore((s) => s.authReady);
  const backRoute = BACK_ROUTE[route];
  const canGoBack = Boolean(backRoute) && route !== ROUTES.PROGRESS && route !== ROUTES.PROFILE;
  const hasNav = authReady && user && showBottomNav(route, true);

  const goHome = () => navigate(user ? ROUTES.TRACK_CHOICE : ROUTES.AUTH_LOGIN);
  const goBack = () => {
    if (backRoute) navigate(backRoute);
  };

  return (
    <div className="app">
      <div className={`phone ${hasNav ? "has-bottom-nav" : ""}`}>
        {toast && <div className="toast">{toast}</div>}

        {isDemoMode && user && <div className="demo-badge">Demo mode</div>}

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
          {teacherMode && <span className="teacher-badge">Teacher</span>}
        </header>

        <div className="phone-content">
          <div key={route} className="screen-host screen-transition">
            {children}
          </div>
          {hasNav && (
            <div className="bottom-nav-shell">
              <BottomNav />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
