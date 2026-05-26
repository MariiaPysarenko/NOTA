export default function FloatingMetronome({ bpm, setBpm, isRunning, onToggle, visible }) {
  if (!visible) return null;

  return (
    <div className="floating-metronome glass-card">
      <span className="metro-label">Metronome</span>
      <div className="metro-controls">
        <button type="button" className="secondary small-btn" onClick={() => setBpm(Math.max(40, bpm - 5))}>
          −
        </button>
        <strong>{bpm} BPM</strong>
        <button type="button" className="secondary small-btn" onClick={() => setBpm(Math.min(220, bpm + 5))}>
          +
        </button>
        <button type="button" className={`primary small-btn ${isRunning ? "recording" : ""}`} onClick={onToggle}>
          {isRunning ? "Stop" : "Start"}
        </button>
      </div>
    </div>
  );
}
