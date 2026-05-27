import { useRef, useState } from "react";
import { useNotaStore } from "../store/useNotaStore";
import { ROUTES } from "../navigation/routes";
import {
  levelFromXp,
  ACHIEVEMENTS,
  DAILY_GOAL_MINUTES,
  minutesPracticedToday,
} from "../utils/gamification";
import { exportResultImage, downloadBlob, shareWithTeacher } from "../utils/exportResult";
import { instruments } from "../instruments";
import { isDemoMode } from "../services/supabaseClient";
import EmptyState from "../components/EmptyState";

const QUICK_ACTIONS = [
  { route: ROUTES.PRACTICE, icon: "🎤", label: "Practice" },
  { route: ROUTES.LIBRARY, icon: "♫", label: "Library" },
  { route: ROUTES.UPLOAD, icon: "📄", label: "Upload" },
  { route: ROUTES.PROGRESS, icon: "📈", label: "Progress" },
];

export default function ProfileScreen() {
  const user = useNotaStore((s) => s.user);
  const gamification = useNotaStore((s) => s.gamification);
  const streak = useNotaStore((s) => s.streak);
  const practiceSessions = useNotaStore((s) => s.practiceSessions);
  const teacherMode = useNotaStore((s) => s.teacherMode);
  const setTeacherMode = useNotaStore((s) => s.setTeacherMode);
  const updateProfile = useNotaStore((s) => s.updateProfile);
  const logoutStore = useNotaStore((s) => s.logout);
  const openAuth = useNotaStore((s) => s.openAuth);
  const openPricing = useNotaStore((s) => s.openPricing);
  const continueAsGuest = useNotaStore((s) => s.continueAsGuest);
  const navigate = useNotaStore((s) => s.navigate);
  const showToast = useNotaStore((s) => s.showToast);
  const getProgressStats = useNotaStore((s) => s.getProgressStats);
  const setPracticeSummary = useNotaStore((s) => s.setPracticeSummary);
  const selectedInstrument = useNotaStore((s) => s.selectedInstrument);
  const setSelectedInstrument = useNotaStore((s) => s.setSelectedInstrument);
  const digitizedNotes = useNotaStore((s) => s.digitizedNotes);
  const sheetAssetsById = useNotaStore((s) => s.sheetAssetsById);
  const pieceMeta = useNotaStore((s) => s.pieceMeta);

  const fileRef = useRef(null);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || null);
  const [saving, setSaving] = useState(false);

  const { level, progress, xpToNext, xpInLevel } = levelFromXp(gamification.totalXp || 0);
  const stats = getProgressStats();
  const lastSession = practiceSessions[0];
  const recentSessions = practiceSessions.slice(0, 5);
  const unlockedSet = new Set(gamification.unlockedAchievements || []);
  const dailyMinutes = minutesPracticedToday(practiceSessions);
  const dailyPct = Math.min(100, Math.round((dailyMinutes / DAILY_GOAL_MINUTES) * 100));

  const handleAvatar = (file) => {
    if (!file) return;
    if (!user) {
      openAuth("register", ROUTES.PROFILE);
      return;
    }
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
    if (!user) {
      openAuth("register", ROUTES.PROFILE);
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        displayName: displayName.trim() || user?.email?.split("@")[0],
      });
      showToast("Profile saved");
    } finally {
      setSaving(false);
    }
  };

  const openSessionAnalysis = (session) => {
    if (!session?.summary) {
      showToast("No analysis data for this session");
      return;
    }
    setPracticeSummary(session.summary);
    navigate(ROUTES.RESULT);
  };

  const shareCard = async () => {
    const blob = await exportResultImage({
      title: lastSession?.pieceTitle || pieceMeta.title || "NOTA Practice",
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

  const goPractice = () => {
    const hasUploadedSheet = Boolean(sheetAssetsById[pieceMeta.id]?.dataUrl);
    if (!digitizedNotes.length && !hasUploadedSheet) {
      navigate(ROUTES.TRACK_CHOICE);
      showToast("Choose a track to practice");
      return;
    }
    navigate(ROUTES.PRACTICE);
  };

  const handleLogout = async () => {
    await logoutStore();
    showToast("Signed out");
  };

  return (
    <main className="screen profile-screen">
      <section className="profile-hero glass-card">
        <button type="button" className="avatar-btn" onClick={() => fileRef.current?.click()}>
          {avatarPreview ? (
            <img src={avatarPreview} alt="" className="avatar-img" />
          ) : (
            <span className="avatar-placeholder">
              {(displayName || user?.email)?.[0]?.toUpperCase() || "?"}
            </span>
          )}
          <span className="avatar-edit">Change photo</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="upload-input-hidden"
          onChange={(e) => handleAvatar(e.target.files?.[0])}
        />

        <div className="profile-hero-text">
          <h2 className="text-clamp-1">
            {displayName || user?.displayName || (user ? "Musician" : "Guest musician")}
          </h2>
          <p className="profile-email text-clamp-1">
            {user?.email || "Sign in to sync progress across devices"}
          </p>
          <div className="profile-level-row">
            <span className="level-pill">Level {level}</span>
            <span className="profile-xp">{gamification.totalXp || 0} XP</span>
          </div>
        </div>

        <div className="level-progress profile-level-bar">
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className="profile-level-caption">
          {xpInLevel} / {xpToNext} XP to level {level + 1}
        </p>
      </section>

      <section className="profile-daily glass-card">
        <div className="profile-daily-header">
          <span>Today&apos;s goal</span>
          <strong>
            {dailyMinutes}/{DAILY_GOAL_MINUTES} min
          </strong>
        </div>
        <div className="level-progress">
          <span style={{ width: `${dailyPct}%` }} />
        </div>
        <p className="profile-level-caption">
          🔥 {streak.current} day streak · best {streak.longest}
        </p>
      </section>

      <nav className="profile-quick-actions" aria-label="Quick actions">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.route}
            type="button"
            className="profile-action-btn"
            onClick={() =>
              action.route === ROUTES.PRACTICE ? goPractice() : navigate(action.route)
            }
          >
            <span aria-hidden>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </nav>

      <section className="stats-grid glass-card profile-stats">
        <div className="stat-tile">
          <span>Avg accuracy</span>
          <strong>{stats.avgAccuracy}%</strong>
        </div>
        <div className="stat-tile">
          <span>Total time</span>
          <strong>{stats.totalPracticeMinutes}m</strong>
        </div>
        <div className="stat-tile">
          <span>Sessions</span>
          <strong>{practiceSessions.length}</strong>
        </div>
        <div className="stat-tile">
          <span>Achievements</span>
          <strong>
            {unlockedSet.size}/{Object.keys(ACHIEVEMENTS).length}
          </strong>
        </div>
      </section>

      <section className="profile-section glass-card">
        <h3 className="profile-section-title">Recent practice</h3>
        {recentSessions.length === 0 ? (
          <EmptyState
            compact
            icon="🎼"
            title="No sessions yet"
            message="Your latest runs will show up here with accuracy and date."
            actionLabel="Start practicing"
            onAction={goPractice}
          />
        ) : (
          <ul className="profile-session-list">
            {recentSessions.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className="profile-session-row"
                  onClick={() => openSessionAnalysis(s)}
                >
                  <div className="session-meta">
                    <strong className="text-clamp-1">{s.pieceTitle || "Practice"}</strong>
                    <p className="text-clamp-1">
                      {(s.date || "").slice(0, 10)} · {Math.round((s.durationSeconds || 0) / 60)}m
                    </p>
                  </div>
                  <span className="accuracy-pill">{s.accuracy}%</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {practiceSessions.length > 0 && (
          <button type="button" className="link-btn" onClick={() => navigate(ROUTES.PROGRESS)}>
            View all progress →
          </button>
        )}
      </section>

      <section className="profile-section glass-card">
        <h3 className="profile-section-title">Achievements</h3>
        <div className="profile-achievements-row">
          {Object.values(ACHIEVEMENTS).map((badge) => (
            <div
              key={badge.id}
              className={`profile-ach-chip ${unlockedSet.has(badge.id) ? "unlocked" : ""}`}
              title={badge.desc}
            >
              <span>{badge.icon}</span>
              <small>{badge.title}</small>
            </div>
          ))}
        </div>
      </section>

      {!user && (
        <section className="profile-section glass-card profile-guest-cta">
          <h3 className="profile-section-title">Save your progress</h3>
          <p className="muted">
            Create an account to keep XP, streaks, AI feedback, and session history.
          </p>
          <div className="profile-guest-actions">
            <button
              type="button"
              className="primary"
              onClick={() => openAuth("register", ROUTES.PROFILE)}
            >
              Create account
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => openAuth("login", ROUTES.PROFILE)}
            >
              Sign in
            </button>
            <button type="button" className="link-btn" onClick={() => openPricing(ROUTES.PROFILE)}>
              View plans & pricing
            </button>
            <button type="button" className="link-btn muted-link" onClick={continueAsGuest}>
              Continue demo
            </button>
          </div>
        </section>
      )}

      <section className="profile-section glass-card profile-settings">
        <h3 className="profile-section-title">{user ? "Account" : "Preferences"}</h3>

        <label>
          Display name
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
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
          <span>
            Teacher mode
            <small className="toggle-hint">Share formatted reports instead of images</small>
          </span>
          <input
            type="checkbox"
            checked={teacherMode}
            onChange={(e) => setTeacherMode(e.target.checked)}
          />
        </label>

        {isDemoMode && (
          <p className="profile-demo-hint">Demo mode — data is stored on this device only.</p>
        )}

        <button type="button" className="primary" onClick={saveProfile} disabled={saving}>
          {saving ? "Saving…" : user ? "Save changes" : "Sign in to save"}
        </button>

        {user && (
          <button type="button" className="link-btn" onClick={() => openPricing(ROUTES.PROFILE)}>
            Plans & pricing →
          </button>
        )}
      </section>

      <section className="profile-section glass-card">
        <h3 className="profile-section-title">Share</h3>
        {lastSession ? (
          <>
            <p className="text-clamp-2 profile-share-summary">
              Latest: <strong>{lastSession.pieceTitle}</strong> · {lastSession.accuracy}% · +
              {lastSession.xpEarned || 0} XP
            </p>
            <div className="profile-share-actions">
              <button type="button" className="secondary" onClick={shareCard}>
                {teacherMode ? "Share with teacher" : "Download card"}
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => openSessionAnalysis(lastSession)}
              >
                View analysis
              </button>
            </div>
          </>
        ) : (
          <p className="muted">Complete a practice session to export or share results.</p>
        )}
      </section>

      {user ? (
        <button type="button" className="link-btn danger-text profile-logout" onClick={handleLogout}>
          Log out
        </button>
      ) : null}
    </main>
  );
}
