import { useState } from "react";
import "./App.css";

const instruments = [
  { id: 1, name: "Alto Saxophone", type: "Woodwind", image: "/instruments/saxophone.png" },
  { id: 2, name: "Trumpet", type: "Brass", image: "/instruments/trumpet.png" },
  { id: 3, name: "Clarinet", type: "Woodwind", image: "/instruments/clarinet.png" },
  { id: 4, name: "Flute", type: "Woodwind", image: "/instruments/flute.png" },
  { id: 5, name: "Trombone", type: "Brass", image: "/instruments/trombone.png" },
  { id: 6, name: "Violin", type: "Strings", image: "/instruments/violin.png" },
  { id: 7, name: "Drums", type: "Percussion", image: "/instruments/drums.png" },
];

export default function App() {
  const [screen, setScreen] = useState("featured");
  const [selected, setSelected] = useState(instruments[0]);
  const [category, setCategory] = useState("All");

  const categories = ["All", "Woodwind", "Brass", "Strings", "Percussion"];

  const filtered =
    category === "All"
      ? instruments
      : instruments.filter((item) => item.type === category);

  const goBack = () => {
    if (screen === "featured") return;
    if (screen === "list") setScreen("featured");
    else setScreen("menu");
  };

  return (
    <div className="app">
      <div className="phone">
        <div className="status">
          <span>9:41</span>
          <span>▮▮▮ Wi-Fi ▰</span>
        </div>

        <header className="header">
          <button className="back" onClick={goBack}>‹</button>
          <div className="logo">
            NOT<span>A</span>
          </div>
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
                  className={`mini-card ${selected.id === item.id ? "active" : ""}`}
                  onClick={() => setSelected(item)}
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
              <button className="primary" onClick={() => setScreen("menu")}>
                Continue
              </button>
              <button className="secondary" onClick={() => setScreen("list")}>
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

            <div className="search">⌕ Search instrument</div>

            <div className="chips">
              {categories.map((item) => (
                <button
                  key={item}
                  className={`chip ${category === item ? "active" : ""}`}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="instrument-list">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  className={`list-item ${selected.id === item.id ? "selected" : ""}`}
                  onClick={() => setSelected(item)}
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
              ))}
            </div>

            <div className="buttons fixed">
              <button className="primary" onClick={() => setScreen("menu")}>
                Continue
              </button>
              <button className="secondary" onClick={() => setScreen("featured")}>
                Back to Featured
              </button>
            </div>
          </main>
        )}

        {screen === "menu" && (
          <main className="screen menu-screen">
            <section className="menu-hero">
              <h1>
                Welcome <span>Back</span>
              </h1>
              <p>Ready for today’s session?</p>
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

            <div className="feature-card training">
              <div className="feature-icon">⌁</div>
              <div className="feature-wave"></div>

              <h3>Practice Training</h3>
              <p>Real-time pitch feedback and guided sessions to improve your sound.</p>

              <button onClick={() => setScreen("practice")}>→</button>
            </div>

            <div className="feature-card history">
              <div className="feature-icon">⌁</div>
              <div className="chart-line"></div>

              <h3>Training History</h3>
              <p>Track your progress, view analytics and stay consistent.</p>

              <button>→</button>
            </div>

            <div className="trend-card">
              <div>
                <h3>Explore Trends</h3>
                <p>See what’s new in music and practice.</p>
                <button>EXPLORE NOW</button>
              </div>

              <div className="vinyl"></div>
            </div>

            <nav className="bottom-nav">
              <button className="active">
                ⌂<span>Home</span>
              </button>
              <button>
                ▣<span>Sessions</span>
              </button>
              <button>
                ▥<span>Progress</span>
              </button>
              <button>
                ○<span>Profile</span>
              </button>
            </nav>
          </main>
        )}

        {screen === "practice" && (
          <main className="screen practice-screen">
            <section className="practice-top">
              <h2>Practice Session</h2>
              <span>● LIVE</span>
            </section>

            <div className="practice-stats">
              <div>
                <b>847</b>
                <span>PTS</span>
                <small>Total Score</small>
              </div>
              <div>
                <b>🔥 12</b>
                <span>Notes Streak</span>
              </div>
              <div>
                <b>4 /16</b>
                <span>Bar Progress</span>
              </div>
              <div>
                <b>6:00</b>
                <span>of 10 min</span>
              </div>
            </div>

            <section className="piece-row">
              <div>
                <span className="sax-icon">🎷</span>
                <p>{selected.name} — Part 2</p>
              </div>

              <div>
                <h4>Autumn Leaves</h4>
                <span>Joseph Kosma</span>
              </div>
            </section>

            <section className="sheet-music">
              <div className="staff">
                <span className="clef">𝄞</span>
                <span className="notes">♩ ♪ ♫ ♩ ♭ ♪ ♫ ♩</span>
              </div>

              <div className="staff">
                <span className="clef">𝄞</span>
                <span className="notes">♪ ♫ ♩ ♭ ♩ ♪ ♫ 𝄽</span>
              </div>

              <div className="playhead"></div>
            </section>

            <section className="pitch-card">
              <div className="pitch-labels">
                <div className="red">
                  TOO LOW
                  <br />♭
                </div>
                <div className="green">IN TUNE</div>
                <div className="red">
                  TOO HIGH
                  <br />#
                </div>
              </div>

              <div className="tuner">
                {Array.from({ length: 42 }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      i > 17 && i < 25
                        ? "good"
                        : i > 13 && i < 30
                        ? "close"
                        : "bad"
                    }
                  />
                ))}
                <div className="tuner-line"></div>
              </div>

              <div className="target-note">
                <h1>D4</h1>
                <p>TARGET NOTE</p>
              </div>

              <button className="mic-btn">🎙</button>
            </section>

            <section className="player-card">
              <button className="play-btn">▶</button>
              <button className="pause-btn">Ⅱ</button>

              <div className="tempo">
                <p>
                  TEMPO <b>80%</b>
                </p>
                <input type="range" min="60" max="100" defaultValue="80" />
              </div>

              <button className="loop-btn">
                ↻<span>LOOP</span>
              </button>

              <div className="waveform">
                <span>0:45</span>
                <div></div>
                <span>2:15</span>
              </div>
            </section>

            <section className="goal-card">
              <div className="music-icon">♪</div>

              <div>
                <h4>Today’s Goal</h4>
                <p>Practice 10 min — 6 min done</p>
                <div className="goal-line">
                  <span></span>
                </div>
              </div>

              <button>VIEW STATS ↗</button>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}