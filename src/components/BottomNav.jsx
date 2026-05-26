import { ROUTES } from "../navigation/routes";
import { useApp } from "../context/AppContext";

const TABS = [
  { id: "practice", icon: "⌁", label: "Practice", route: ROUTES.PRACTICE },
  { id: "progress", icon: "▥", label: "Progress", route: ROUTES.PROGRESS },
  { id: "library", icon: "♫", label: "Library", route: ROUTES.LIBRARY },
  { id: "profile", icon: "○", label: "Profile", route: ROUTES.PROFILE },
];

export default function BottomNav() {
  const { route, activeTab, setActiveTab, navigate, user } = useApp();
  if (!user) return null;

  const hiddenRoutes = new Set([
    ROUTES.AUTH_LOGIN,
    ROUTES.AUTH_REGISTER,
    ROUTES.INSTRUMENT,
    ROUTES.TRACK_CHOICE,
    ROUTES.UPLOAD,
    ROUTES.REVIEW,
    ROUTES.SHEET_EDITOR,
  ]);
  if (hiddenRoutes.has(route)) return null;

  return (
    <nav className="bottom-nav app-nav">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={activeTab === tab.id ? "active" : ""}
          onClick={() => {
            setActiveTab(tab.id);
            navigate(tab.route);
          }}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
