import { useEffect, useRef } from "react";

const TAB_ORDER = ["practice", "progress", "library", "profile"];

export function useSwipeNavigation({ enabled, activeTab, setActiveTab, navigate, routes }) {
  const startRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const el = document.querySelector(".screen-transition");
    if (!el) return;

    const onStart = (e) => {
      const t = e.touches?.[0];
      if (!t) return;
      startRef.current = { x: t.clientX, y: t.clientY };
    };

    const onEnd = (e) => {
      if (!startRef.current) return;
      const t = e.changedTouches?.[0];
      if (!t) return;
      const dx = t.clientX - startRef.current.x;
      const dy = t.clientY - startRef.current.y;
      startRef.current = null;
      if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx)) return;

      const idx = TAB_ORDER.indexOf(activeTab);
      if (idx < 0) return;
      const nextIdx = dx < 0 ? idx + 1 : idx - 1;
      if (nextIdx < 0 || nextIdx >= TAB_ORDER.length) return;
      const tab = TAB_ORDER[nextIdx];
      setActiveTab(tab);
      const routeMap = {
        practice: routes.PRACTICE,
        progress: routes.PROGRESS,
        library: routes.LIBRARY,
        profile: routes.PROFILE,
      };
      navigate(routeMap[tab]);
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [enabled, activeTab, setActiveTab, navigate, routes]);
}
