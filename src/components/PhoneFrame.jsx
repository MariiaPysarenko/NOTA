/**
 * Shared mobile device frame used for pre-auth flows (onboarding, auth).
 * Matches the shell dimensions and chrome of AppShell.
 */
export default function PhoneFrame({ children, className = "" }) {
  return (
    <div className="app">
      <div className={`phone ${className}`.trim()}>
        <div className="status">
          <span>9:41</span>
          <span>▮▮▮ Wi-Fi ▰</span>
        </div>

        <header className="header">
          <span className="back hidden" aria-hidden />
          <p className="logo logo-static">
            NOT<span>A</span>
          </p>
        </header>

        <div className="phone-content">{children}</div>
      </div>
    </div>
  );
}
