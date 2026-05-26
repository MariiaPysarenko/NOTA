import { ROUTES } from "../navigation/routes";
import { useNotaStore } from "../store/useNotaStore";

const TABS = [
  { route: ROUTES.TRACK_CHOICE, label: "Practice", icon: "🎤", match: [ROUTES.TRACK_CHOICE, ROUTES.PRACTICE] },
  { route: ROUTES.PROGRESS, label: "Progress", icon: "📈", match: [ROUTES.PROGRESS] },
  { route: ROUTES.LIBRARY, label: "Library", icon: "♫", match: [ROUTES.LIBRARY, ROUTES.UPLOAD, ROUTES.REVIEW] },
  { route: ROUTES.PROFILE, label: "Profile", icon: "👤", match: [ROUTES.PROFILE] },
];

export default function BottomNav() {
  const route = useNotaStore((s) => s.route);
  const navigate = useNotaStore((s) => s.navigate);

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {TABS.map((tab) => {
        const active = tab.match.includes(route);
        return (
          <button
            key={tab.label}
            type="button"
            className={active ? "active" : ""}
            onClick={() => navigate(tab.route)}
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
