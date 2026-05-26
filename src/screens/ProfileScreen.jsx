import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { logout } from "../services/authService";
import { ROUTES } from "../navigation/routes";

export default function ProfileScreen() {
  const { user, setUser, selectedInstrument, practiceSessions, navigate, showToast } = useApp();
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || "");
  const [name, setName] = useState(user?.name || "Musician");

  const aggregates = useMemo(() => {
    const totalSeconds = practiceSessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0);
    const avgAccuracy = practiceSessions.length
      ? Math.round(practiceSessions.reduce((sum, s) => sum + (s.accuracy || 0), 0) / practiceSessions.length)
      : 0;
    return { totalMinutes: Math.round(totalSeconds / 60), avgAccuracy };
  }, [practiceSessions]);

  const onAvatar = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    setUser((prev) => ({ ...prev, avatar_url: url }));
  };

  const onSaveProfile = () => {
    setUser((prev) => ({ ...prev, name, avatar_url: avatarPreview }));
    showToast("Profile updated");
  };

  const shareProgress = async () => {
    const text = `Today I practiced Alto Saxophone for ${aggregates.totalMinutes} minutes in NOTA and reached ${aggregates.avgAccuracy}% accuracy.`;
    try {
      await navigator.clipboard.writeText(text);
      showToast("Progress copied to clipboard");
    } catch {
      showToast("Could not copy share text");
    }
  };

  const onLogout = async () => {
    await logout();
    setUser(null);
    navigate(ROUTES.AUTH_LOGIN);
  };

  return (
    <main className="screen">
      <section className="hero small">
        <h1>
          Your <span>Profile</span>
        </h1>
      </section>

      <section className="profile-card">
        <div className="instrument-image profile-img avatar-wrap">
          {avatarPreview ? <img src={avatarPreview} alt="Avatar" /> : <span>👤</span>}
        </div>
        <div className="profile-meta">
          <h3>{user?.name || "Musician"}</h3>
          <p>{user?.email || "demo@nota.app"}</p>
          <small>{selectedInstrument.name}</small>
        </div>
      </section>

      <section className="editor-fields">
        <label>
          Name
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Avatar
          <input type="file" accept="image/*" onChange={(e) => onAvatar(e.target.files?.[0])} />
        </label>
      </section>

      <section className="stats">
        <div>
          <b>{aggregates.totalMinutes}m</b>
          <span>Total practice</span>
        </div>
        <div>
          <b>{aggregates.avgAccuracy}%</b>
          <span>Average accuracy</span>
        </div>
        <div>
          <b>{practiceSessions.length}</b>
          <span>Sessions</span>
        </div>
      </section>

      <div className="buttons">
        <button type="button" className="primary" onClick={onSaveProfile}>
          Save Profile
        </button>
        <button type="button" className="secondary" onClick={shareProgress}>
          Share Progress
        </button>
        <button type="button" className="secondary" onClick={onLogout}>
          Logout
        </button>
      </div>
    </main>
  );
}
