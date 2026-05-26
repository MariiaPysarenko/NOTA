import { ROUTES } from "../navigation/routes";
import { useNotaStore } from "../store/useNotaStore";

const TABS = [
  { route: ROUTES.PRACTICE, label: "Practice", icon: "🎤" },
  { route: ROUTES.PROGRESS, label: "Progress", icon: "📈" },
  { route: ROUTES.LIBRARY, label: "Library", icon: "♫" },
  { route: ROUTES.PROFILE, label: "Profile", icon: "👤" },
];

export default function BottomNav() {
  const route = useNotaStore((s) => s.route);
  const navigate = useNotaStore((s) => s.navigate);
  const digitizedNotes = useNotaStore((s) => s.digitizedNotes);

  const go = (tabRoute) => {
    if (tabRoute === ROUTES.PRACTICE && !digitizedNotes.length) {
      navigate(ROUTES.TRACK_CHOICE);
      return;
    }
    navigate(tabRoute);
  };

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {TABS.map((tab) => {
        const active =
          route === tab.route ||
          (tab.route === ROUTES.PRACTICE && route === ROUTES.TRACK_CHOICE);
        return (
          <button
            key={tab.route}
            type="button"
            className={active ? "active" : ""}
            onClick={() => go(tab.route)}
            aria-current={active ? "page" : undefined}
          >
            <span className="nav-icon" aria-hidden>
              {tab.icon}
            </span>
            <span className="nav-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
