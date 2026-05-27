import { useMemo, useState } from "react";
import { useApp } from "../store/useNotaStore";
import { instruments } from "../instruments";
import { ROUTES } from "../navigation/routes";

export default function InstrumentSelectionScreen() {
  const { selectedInstrument, setSelectedInstrument, navigate, showToast, completeSetup } =
    useApp();
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("featured");

  const categories = ["All", "Woodwind", "Brass", "Strings", "Percussion"];

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

  const selectInstrument = (item) => {
    setSelectedInstrument(item);
    showToast(`${item.name} selected`);
  };

  if (view === "list") {
    return (
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
                className={`list-item ${selectedInstrument.id === item.id ? "selected" : ""}`}
                onClick={() => selectInstrument(item)}
              >
                <div className="instrument-image list-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.type}</p>
                </div>
                <div className="radio">{selectedInstrument.id === item.id ? "✓" : ""}</div>
              </button>
            ))
          )}
        </div>

        <div className="buttons fixed">
          <button
            type="button"
            className="primary"
            onClick={() => completeSetup()}
          >
            Continue with {selectedInstrument.name.split(" ")[0]}
          </button>
          <button type="button" className="secondary" onClick={() => setView("featured")}>
            Back to Featured
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="screen instrument-select-screen">
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
          <img src={selectedInstrument.image} alt={selectedInstrument.name} />
        </div>
        <div className="instrument-info">
          <h2>{selectedInstrument.name}</h2>
          <p>{selectedInstrument.type}</p>
        </div>
      </section>

      <div className="instrument-pills" role="tablist" aria-label="Choose instrument">
        {instruments.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selectedInstrument.id === item.id}
            className={`instrument-pill ${selectedInstrument.id === item.id ? "active" : ""}`}
            onClick={() => selectInstrument(item)}
          >
            {item.name.split(" ")[0]}
          </button>
        ))}
      </div>

      <div className="buttons instrument-select-actions">
        <button
          type="button"
          className="primary"
          onClick={() => completeSetup()}
        >
          Continue
        </button>
        <button type="button" className="secondary" onClick={() => setView("list")}>
          Explore All Instruments
        </button>
      </div>
    </main>
  );
}
