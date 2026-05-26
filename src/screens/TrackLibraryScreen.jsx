import { useApp } from "../context/AppContext";
import { LIBRARY_TRACKS } from "../data/libraryTracks";
import { ROUTES } from "../navigation/routes";

export default function TrackLibraryScreen() {
  const { setDigitizedNotes, navigate, showToast, setActiveTab, favoriteIds, toggleFavorite } =
    useApp();

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
        {LIBRARY_TRACKS.filter((t) => favoriteIds.includes(t.id)).length > 0 && (
          <>
            <p className="exercise-label">Favorites</p>
            {LIBRARY_TRACKS.filter((t) => favoriteIds.includes(t.id)).map((track) => (
              <div key={`fav-${track.id}`} className="track-item glass-card">
                <button type="button" className="track-open" onClick={() => selectTrack(track)}>
                  <div className="track-meta">
                    <h3>{track.title}</h3>
                    <p>{track.subtitle}</p>
                  </div>
                  <span className="card-action">→</span>
                </button>
                <button
                  type="button"
                  className="fav-btn active"
                  onClick={() => toggleFavorite(track.id)}
                  aria-label="Remove favorite"
                >
                  ★
                </button>
              </div>
            ))}
          </>
        )}
        <p className="exercise-label">All tracks</p>
        {LIBRARY_TRACKS.map((track) => (
          <div key={track.id} className="track-item glass-card">
            <button type="button" className="track-open" onClick={() => selectTrack(track)}>
              <div className="track-meta">
                <h3>{track.title}</h3>
                <p>{track.subtitle}</p>
                <span className="track-note-count">{track.notes.length} notes</span>
              </div>
              <span className="card-action">→</span>
            </button>
            <button
              type="button"
              className={`fav-btn ${favoriteIds.includes(track.id) ? "active" : ""}`}
              onClick={() => toggleFavorite(track.id)}
              aria-label="Toggle favorite"
            >
              {favoriteIds.includes(track.id) ? "★" : "☆"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
