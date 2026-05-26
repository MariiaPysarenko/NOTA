import { useApp } from "../context/AppContext";
import { ROUTES } from "../navigation/routes";

export default function TrackChoiceScreen() {
  const { selectedInstrument, navigate } = useApp();

  return (
    <main className="screen">
      <section className="hero small">
        <h1>
          Choose Your <span>Track</span>
        </h1>
        <p>
          Playing <strong className="accent-inline">{selectedInstrument.name}</strong> — pick
          from the library or upload your own sheet music.
        </p>
      </section>

      <button
        type="button"
        className="choice-card"
        onClick={() => navigate(ROUTES.LIBRARY)}
      >
        <div className="choice-icon">♫</div>
        <div>
          <h3>Choose track from library</h3>
          <p>Pre-digitized pieces ready to practice</p>
        </div>
        <span className="card-action">→</span>
      </button>

      <button
        type="button"
        className="choice-card"
        onClick={() => navigate(ROUTES.UPLOAD)}
      >
        <div className="choice-icon">📄</div>
        <div>
          <h3>Upload my sheet music</h3>
          <p>PNG, JPG, or PDF — we digitize it into playable notes</p>
        </div>
        <span className="card-action">→</span>
      </button>
    </main>
  );
}
