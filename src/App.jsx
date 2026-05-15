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

  return (
    <div className="app">
      <div className="phone">
        <div className="status">
          <span>9:41</span>
          <span>▮▮▮  Wi-Fi  ▰</span>
        </div>

        <header className="header">
          <button className="back" onClick={() => setScreen("featured")}>‹</button>
          <div className="logo">NOT<span>A</span></div>
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
              <div className="orange-light" />

              <div className="instrument-image big">
                <img src={selected.image} alt={selected.name} />
              </div>

              <div className="instrument-info">
                <h2>{selected.name}</h2>
                <p>{selected.type}</p>
              </div>
            </section>

            <div className="carousel">
              {instruments.slice(0, 5).map((item) => (
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
                  className={category === item ? "chip active" : "chip"}
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

                  <div className="radio">
                    {selected.id === item.id ? "✓" : ""}
                  </div>
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
          <main className="screen">
            <section className="hero small">
              <h1>
                Welcome <span>Back</span>
              </h1>
              <p>Ready for today’s session?</p>
            </section>

            <div className="stats">
              <div><b>🔥 12</b><span>Day Streak</span></div>
              <div><b>⭐ 945</b><span>Total Score</span></div>
              <div><b>▮ 48</b><span>Sessions</span></div>
            </div>

            <div className="menu-card">
              <h3>Practice Training</h3>
              <p>Real-time pitch feedback and guided sessions.</p>
              <button>→</button>
            </div>

            <div className="menu-card">
              <h3>Sheet Music Search</h3>
              <p>Find exercises, melodies and practice pieces.</p>
              <button>→</button>
            </div>

            <div className="menu-card">
              <h3>Training History</h3>
              <p>Track your progress, scores and consistency.</p>
              <button>→</button>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}