import { BACK_ROUTE, ROUTES } from "../navigation/routes";
import { useNotaStore } from "../store/useNotaStore";
import { isDemoMode } from "../services/supabaseClient";

export default function AppShell({ children }) {
  const route = useNotaStore((s) => s.route);
  const navigate = useNotaStore((s) => s.navigate);
  const toast = useNotaStore((s) => s.toast);
  const user = useNotaStore((s) => s.user);
  const teacherMode = useNotaStore((s) => s.teacherMode);
  const backRoute = BACK_ROUTE[route];
  const canGoBack = Boolean(backRoute) && route !== ROUTES.PROGRESS && route !== ROUTES.PROFILE;

  const goHome = () => navigate(user ? ROUTES.PRACTICE : ROUTES.AUTH_LOGIN);
  const goBack = () => {
    if (backRoute) navigate(backRoute);
  };

  return (
    <div className="app">
      <div className={`phone ${user ? "has-bottom-nav" : ""}`}>
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

        <div key={route} className="screen-transition screen-body">
          {children}
        </div>
      </div>
    </div>
  );
}
