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
      {TABS.map((tab) => (
        <button
          key={tab.route}
          type="button"
          className={route === tab.route || (tab.route === ROUTES.PRACTICE && route === ROUTES.TRACK_CHOICE) ? "active" : ""}
          onClick={() => go(tab.route)}
        >
          <span aria-hidden>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
