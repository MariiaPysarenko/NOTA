import { useRef, useState } from "react";
import { useNotaStore } from "../store/useNotaStore";
import { ROUTES } from "../navigation/routes";
import { levelFromXp, ACHIEVEMENTS } from "../utils/gamification";
import { exportResultImage, downloadBlob, shareWithTeacher } from "../utils/exportResult";
import { instruments } from "../instruments";

export default function ProfileScreen() {
  const user = useNotaStore((s) => s.user);
  const gamification = useNotaStore((s) => s.gamification);
  const streak = useNotaStore((s) => s.streak);
  const practiceSessions = useNotaStore((s) => s.practiceSessions);
  const teacherMode = useNotaStore((s) => s.teacherMode);
  const setTeacherMode = useNotaStore((s) => s.setTeacherMode);
  const updateProfile = useNotaStore((s) => s.updateProfile);
  const logoutStore = useNotaStore((s) => s.logout);
  const navigate = useNotaStore((s) => s.navigate);
  const showToast = useNotaStore((s) => s.showToast);
  const getProgressStats = useNotaStore((s) => s.getProgressStats);
  const selectedInstrument = useNotaStore((s) => s.selectedInstrument);
  const setSelectedInstrument = useNotaStore((s) => s.setSelectedInstrument);

  const fileRef = useRef(null);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || null);

  const { level } = levelFromXp(gamification.totalXp || 0);
  const stats = getProgressStats();
  const lastSession = practiceSessions[0];
  const unlocked = gamification.unlockedAchievements?.length || 0;

  const handleAvatar = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      setAvatarPreview(url);
      updateProfile({ avatarUrl: url });
      showToast("Avatar updated");
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    await updateProfile({ displayName: displayName.trim() || user?.email?.split("@")[0] });
    showToast("Profile saved");
  };

  const shareCard = async () => {
    const blob = await exportResultImage({
      title: lastSession?.pieceTitle || "NOTA Practice",
      accuracy: lastSession?.accuracy ?? stats.avgAccuracy,
      xp: lastSession?.xpEarned ?? 25,
      streak: streak.current,
      instrument: selectedInstrument.name,
    });
    if (teacherMode) {
      await shareWithTeacher({
        title: lastSession?.pieceTitle,
        accuracy: lastSession?.accuracy ?? 0,
        minutes: Math.round((lastSession?.durationSeconds || 0) / 60),
        instrument: selectedInstrument.name,
      });
      showToast("Shared with teacher");
    } else {
      downloadBlob(blob, "nota-practice-card.png");
      showToast("Card downloaded");
    }
  };

  const handleLogout = async () => {
    await logoutStore();
    showToast("Signed out");
  };

  return (
    <main className="screen profile-screen">
      <section className="hero small">
        <h1>
          Your <span>Profile</span>
        </h1>
      </section>

      <section className="profile-card glass-card">
        <button type="button" className="avatar-btn" onClick={() => fileRef.current?.click()}>
          {avatarPreview ? (
            <img src={avatarPreview} alt="" className="avatar-img" />
          ) : (
            <span className="avatar-placeholder">{displayName?.[0]?.toUpperCase() || "?"}</span>
          )}
          <span className="avatar-edit">Edit</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="upload-input-hidden"
          onChange={(e) => handleAvatar(e.target.files?.[0])}
        />

        <label>
          Display name
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </label>

        <label>
          Instrument
          <select
            value={selectedInstrument.id}
            onChange={(e) => {
              const inst = instruments.find((i) => i.id === e.target.value);
              if (inst) setSelectedInstrument(inst);
            }}
          >
            {instruments.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </label>

        <label className="toggle-row">
          <span>Teacher mode</span>
          <input
            type="checkbox"
            checked={teacherMode}
            onChange={(e) => setTeacherMode(e.target.checked)}
          />
        </label>

        <button type="button" className="primary" onClick={saveProfile}>
          Save profile
        </button>
      </section>

      <section className="stats-grid glass-card">
        <div className="stat-tile">
          <span>Level</span>
          <strong>{level}</strong>
        </div>
        <div className="stat-tile">
          <span>Streak</span>
          <strong>🔥 {streak.current}</strong>
        </div>
        <div className="stat-tile">
          <span>Total time</span>
          <strong>{stats.totalPracticeMinutes}m</strong>
        </div>
        <div className="stat-tile">
          <span>Achievements</span>
          <strong>
            {unlocked}/{Object.keys(ACHIEVEMENTS).length}
          </strong>
        </div>
      </section>

      <section className="share-card-section glass-card">
        <h3>Practice summary card</h3>
        {lastSession ? (
          <>
            <p className="text-clamp-2">
              Latest: {lastSession.pieceTitle} · {lastSession.accuracy}% accuracy
            </p>
            <button type="button" className="secondary" onClick={shareCard}>
              {teacherMode ? "Share with teacher" : "Download practice card"}
            </button>
          </>
        ) : (
          <p className="muted">Complete a practice session to generate a shareable card.</p>
        )}
      </section>

      <button type="button" className="secondary" onClick={() => navigate(ROUTES.INSTRUMENT)}>
        Change instrument (full picker)
      </button>

      <button type="button" className="link-btn danger-text" onClick={handleLogout}>
        Log out
      </button>
    </main>
  );
}
