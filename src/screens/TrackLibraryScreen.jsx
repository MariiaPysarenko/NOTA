import { useApp } from "../context/AppContext";
import { LIBRARY_TRACKS } from "../data/libraryTracks";
import { ROUTES } from "../navigation/routes";

export default function TrackLibraryScreen() {
  const { setDigitizedNotes, navigate, showToast, setActiveTab } = useApp();

  const selectTrack = (track) => {
    setDigitizedNotes(track.notes, {
      id: track.id,
      title: track.title,
      subtitle: track.subtitle,
    });
    showToast(`${track.title} loaded`);
    setActiveTab("practice");
    navigate(ROUTES.REVIEW);
  };

  return (
    <main className="screen">
      <section className="hero small">
        <h1>
          Track <span>Library</span>
        </h1>
        <p>Each track is already digitized into structured notes for practice.</p>
      </section>

      <div className="track-list">
        {LIBRARY_TRACKS.map((track) => (
          <button
            key={track.id}
            type="button"
            className="track-item"
            onClick={() => selectTrack(track)}
          >
            <div className="track-meta">
              <h3>{track.title}</h3>
              <p>{track.subtitle}</p>
              <span className="track-note-count">{track.notes.length} notes</span>
            </div>
            <span className="card-action">→</span>
          </button>
        ))}
      </div>
    </main>
  );
}
