import { BACK_ROUTE, ROUTES } from "../navigation/routes";
import { useApp } from "../context/AppContext";

export default function AppShell({ children }) {
  const { route, navigate, toast } = useApp();
  const backRoute = BACK_ROUTE[route];
  const canGoBack = Boolean(backRoute);

  const goHome = () => navigate(ROUTES.INSTRUMENT);
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

        {children}
      </div>
    </div>
  );
}
