export default function DigitizeLoader({ message = "Digitizing sheet music…" }) {
  return (
    <div className="digitize-loader glass-card" role="status" aria-live="polite">
      <div className="loader-orbit">
        <span className="loader-note">♩</span>
        <span className="loader-note delay-1">♪</span>
        <span className="loader-note delay-2">♫</span>
      </div>
      <p>{message}</p>
      <div className="loader-bar">
        <span className="loader-bar-fill" />
      </div>
    </div>
  );
}
