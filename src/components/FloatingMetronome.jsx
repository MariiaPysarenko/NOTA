export default function FloatingMetronome({ bpm, setBpm, isRunning, onToggle, visible }) {
  if (!visible) return null;
  return (
    <div className="floating-metronome glass-card">
      <button type="button" className="metro-toggle" onClick={onToggle}>
        {isRunning ? "❚❚" : "♩"}
      </button>
      <div>
        <p>Metronome</p>
        <b>{bpm} BPM</b>
      </div>
      <input
        type="range"
        min={50}
        max={160}
        value={bpm}
        onChange={(e) => setBpm(parseInt(e.target.value, 10))}
        aria-label="Metronome tempo"
      />
    </div>
  );
}
