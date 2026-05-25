import { useMemo, useState } from "react";
import PracticeScreen from "./components/PracticeScreen";
import { instruments } from "./instruments";
import "./App.css";

const sessionHistory = [
  { id: 1, piece: "Autumn Leaves", score: 847, date: "Today" },
  { id: 2, piece: "Blue Bossa", score: 792, date: "Yesterday" },
  { id: 3, piece: "Summertime", score: 810, date: "Mon" },
];

const trends = [
  { title: "Jazz Standards Week", tag: "Trending" },
  { title: "Breathing Warm-ups", tag: "New" },
  { title: "Sight-Reading Challenge", tag: "Community" },
];

export default function App() {
  const [screen, setScreen] = useState("featured");
  const [menuTab, setMenuTab] = useState("home");
  const [selected, setSelected] = useState(instruments[0]);
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState("");

  const categories = ["All", "Woodwind", "Brass", "Strings", "Percussion"];

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => setToast(""), 2200);
  };

  const filtered = useMemo(() => {
    const byCategory =
      category === "All"
        ? instruments
        : instruments.filter((item) => item.type === category);
    const query = searchQuery.trim().toLowerCase();
    if (!query) return byCategory;
    return byCategory.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query)
    );
  }, [category, searchQuery]);

  const goHome = () => {
    setScreen("featured");
    setMenuTab("home");
  };

  const goBack = () => {
    if (screen === "featured") return;
    if (screen === "list") setScreen("featured");
    else if (screen === "menu") setScreen("featured");
    else if (screen === "practice" || screen === "history" || screen === "trends")
      setScreen("menu");
  };

  const openMenu = () => {
    setScreen("menu");
    setMenuTab("home");
  };

  const selectInstrument = (item) => {
    setSelected(item);
    showToast(`${item.name} selected`);
  };

  const canGoBack = screen !== "featured";

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

        {screen === "featured" && (
          <main className="screen">
            <section className="hero">
              <h1>
                Choose Your <br />
                <span>Instrument.</span>
              </h1>
              <p>Select your instrument to personalize your practice experience.</p>
            </section>

            <section className="big-card">
              <div className="orange-light"></div>
              <div className="instrument-image big">
                <img src={selected.image} alt={selected.name} />
              </div>
              <div className="instrument-info">
                <h2>{selected.name}</h2>
                <p>{selected.type}</p>
              </div>
            </section>

            <div className="carousel">
              {instruments.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`mini-card ${selected.id === item.id ? "active" : ""}`}
                  onClick={() => selectInstrument(item)}
                >
                  <div className="instrument-image mini">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <span>{item.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>

            <div className="counter">
              {selected.id} / {instruments.length}
            </div>

            <div className="buttons">
              <button type="button" className="primary" onClick={openMenu}>
                Continue
              </button>
              <button type="button" className="secondary" onClick={() => setScreen("list")}>
                Explore All Instruments
              </button>
            </div>
          </main>
        )}

        {screen === "list" && (
          <main className="screen list-screen">
            <section className="hero small">
              <h1>
                All <span>Instruments</span>
              </h1>
            </section>

            <label className="search">
              <span aria-hidden>⌕</span>
              <input
                type="search"
                placeholder="Search instrument"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>

            <div className="chips">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`chip ${category === item ? "active" : ""}`}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="instrument-list">
              {filtered.length === 0 ? (
                <p className="empty-state">No instruments match your search.</p>
              ) : (
                filtered.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`list-item ${selected.id === item.id ? "selected" : ""}`}
                    onClick={() => selectInstrument(item)}
                  >
                    <div className="instrument-image list-img">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.type}</p>
                    </div>
                    <div className="radio">{selected.id === item.id ? "✓" : ""}</div>
                  </button>
                ))
              )}
            </div>

            <div className="buttons fixed">
              <button type="button" className="primary" onClick={openMenu}>
                Continue with {selected.name.split(" ")[0]}
              </button>
              <button type="button" className="secondary" onClick={() => setScreen("featured")}>
                Back to Featured
              </button>
            </div>
          </main>
        )}

        {screen === "menu" && (
          <main className="screen menu-screen">
            {menuTab === "home" && (
              <>
                <section className="menu-hero">
                  <h1>
                    Welcome <span>Back</span>
                  </h1>
                  <p>
                    Ready for today’s session with your{" "}
                    <button type="button" className="inline-link" onClick={() => setScreen("featured")}>
                      {selected.name}
                    </button>
                    ?
                  </p>
                </section>

                <div className="stats">
                  <div>
                    <b>🔥 12</b>
                    <span>Day Streak</span>
                  </div>
                  <div>
                    <b>⭐ 945</b>
                    <span>Total Score</span>
                  </div>
                  <div>
                    <b>▮ 48</b>
                    <span>Sessions</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="feature-card training clickable-card"
                  onClick={() => setScreen("practice")}
                >
                  <div className="feature-icon">⌁</div>
                  <div className="feature-wave"></div>
                  <h3>Practice Training</h3>
                  <p>Real-time pitch feedback and guided sessions to improve your sound.</p>
                  <span className="card-action">→</span>
                </button>

                <button
                  type="button"
                  className="feature-card history clickable-card"
                  onClick={() => setScreen("history")}
                >
                  <div className="feature-icon">⌁</div>
                  <div className="chart-line"></div>
                  <h3>Training History</h3>
                  <p>Track your progress, view analytics and stay consistent.</p>
                  <span className="card-action">→</span>
                </button>

                <button
                  type="button"
                  className="trend-card clickable-card"
                  onClick={() => setScreen("trends")}
                >
                  <div>
                    <h3>Explore Trends</h3>
                    <p>See what’s new in music and practice.</p>
                    <span className="pill-btn">EXPLORE NOW</span>
                  </div>
                  <div className="vinyl"></div>
                </button>
              </>
            )}

            {menuTab === "sessions" && (
              <section className="sub-screen">
                <h2 className="sub-title">
                  Your <span>Sessions</span>
                </h2>
                <div className="session-list">
                  {sessionHistory.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="session-item"
                      onClick={() => {
                        setScreen("practice");
                        showToast(`Opening ${s.piece}`);
                      }}
                    >
                      <div>
                        <h4>{s.piece}</h4>
                        <p>{s.date} · {selected.name}</p>
                      </div>
                      <b>{s.score} pts</b>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {menuTab === "progress" && (
              <section className="sub-screen">
                <h2 className="sub-title">
                  Your <span>Progress</span>
                </h2>
                <div className="progress-card">
                  <p>Weekly practice</p>
                  <div className="progress-bars">
                    {[40, 65, 30, 80, 55, 90, 48].map((h, i) => (
                      <span key={i} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <p className="progress-note">6.2 hrs this week · +18% vs last week</p>
                </div>
                <button type="button" className="primary" onClick={() => setScreen("practice")}>
                  Start Today’s Session
                </button>
              </section>
            )}

            {menuTab === "profile" && (
              <section className="sub-screen">
                <h2 className="sub-title">
                  Your <span>Profile</span>
                </h2>
                <div className="profile-card">
                  <div className="instrument-image profile-img">
                    <img src={selected.image} alt={selected.name} />
                  </div>
                  <div>
                    <h3>{selected.name}</h3>
                    <p>{selected.type}</p>
                  </div>
                </div>
                <button type="button" className="secondary" onClick={() => setScreen("featured")}>
                  Change Instrument
                </button>
                <button type="button" className="secondary" onClick={() => showToast("Settings coming soon")}>
                  App Settings
                </button>
              </section>
            )}

            <nav className="bottom-nav">
              {[
                { id: "home", icon: "⌂", label: "Home" },
                { id: "sessions", icon: "▣", label: "Sessions" },
                { id: "progress", icon: "▥", label: "Progress" },
                { id: "profile", icon: "○", label: "Profile" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={menuTab === tab.id ? "active" : ""}
                  onClick={() => setMenuTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </main>
        )}

        {screen === "history" && (
          <main className="screen">
            <section className="hero small">
              <h1>
                Training <span>History</span>
              </h1>
            </section>
            <div className="session-list">
              {sessionHistory.map((s) => (
                <div key={s.id} className="session-item static">
                  <div>
                    <h4>{s.piece}</h4>
                    <p>{s.date}</p>
                  </div>
                  <b>{s.score}</b>
                </div>
              ))}
            </div>
            <button type="button" className="primary" onClick={() => setScreen("practice")}>
              Practice Again
            </button>
          </main>
        )}

        {screen === "trends" && (
          <main className="screen">
            <section className="hero small">
              <h1>
                Explore <span>Trends</span>
              </h1>
            </section>
            <div className="trend-list">
              {trends.map((t) => (
                <button
                  key={t.title}
                  type="button"
                  className="trend-item"
                  onClick={() => showToast(`Joined: ${t.title}`)}
                >
                  <span className="trend-tag">{t.tag}</span>
                  <h4>{t.title}</h4>
                </button>
              ))}
            </div>
          </main>
        )}

        {screen === "practice" && (
          <PracticeScreen selected={selected} showToast={showToast} />
        )}
      </div>
    </div>
  );
}
