import { isDemoMode, supabase } from "./supabaseClient";
import { clearLocalUser, getLocalUser, setLocalUser } from "./localStore";

function demoUser(email, displayName) {
  const id = `demo-${btoa(email).slice(0, 12)}`;
  return {
    id,
    email,
    displayName: displayName || email.split("@")[0],
    avatarUrl: null,
    instrument: "Alto Saxophone",
    teacherMode: false,
  };
}

export function getInitialAuthState() {
  if (isDemoMode) {
    const local = getLocalUser();
    return { user: local, session: local ? { user: local } : null };
  }
  return { user: null, session: null };
}

export async function initAuthSession() {
  if (isDemoMode) {
    const user = getLocalUser();
    return { user, session: user ? { user } : null };
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  if (!data.session) return { user: null, session: null };

  const profile = await fetchProfile(data.session.user.id);
  const user = mapSupabaseUser(data.session.user, profile);
  return { user, session: data.session };
}

export async function login({ email, password }) {
  if (isDemoMode) {
    const user = demoUser(email);
    setLocalUser(user);
    return { user, session: { user } };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const profile = await fetchProfile(data.user.id);
  const user = mapSupabaseUser(data.user, profile);
  return { user, session: data.session };
}

export async function register({ email, password, displayName }) {
  if (isDemoMode) {
    const user = demoUser(email, displayName);
    setLocalUser(user);
    return { user, session: { user } };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });
  if (error) throw error;

  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      display_name: displayName || email.split("@")[0],
      instrument: "Alto Saxophone",
    });
  }

  const profile = data.user ? await fetchProfile(data.user.id) : null;
  const user = data.user ? mapSupabaseUser(data.user, profile) : null;
  return { user, session: data.session };
}

export async function logout() {
  if (isDemoMode) {
    clearLocalUser();
    return;
  }
  await supabase.auth.signOut();
}

export async function updateUserProfile(patch) {
  if (isDemoMode) {
    const current = getLocalUser();
    const next = { ...current, ...patch };
    setLocalUser(next);
    return next;
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData.session?.user?.id;
  if (!uid) throw new Error("Not signed in");

  const row = {
    display_name: patch.displayName,
    avatar_url: patch.avatarUrl,
    instrument: patch.instrument,
    teacher_mode: patch.teacherMode,
    updated_at: new Date().toISOString(),
  };
  Object.keys(row).forEach((k) => row[k] === undefined && delete row[k]);

  await supabase.from("profiles").upsert({ id: uid, ...row });
  const profile = await fetchProfile(uid);
  return mapSupabaseUser(sessionData.session.user, profile);
}

async function fetchProfile(userId) {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  return data;
}

function mapSupabaseUser(authUser, profile) {
  return {
    id: authUser.id,
    email: authUser.email,
    displayName: profile?.display_name || authUser.user_metadata?.display_name || authUser.email?.split("@")[0],
    avatarUrl: profile?.avatar_url || null,
    instrument: profile?.instrument || "Alto Saxophone",
    teacherMode: profile?.teacher_mode || false,
  };
}

export function onAuthStateChange(callback) {
  if (isDemoMode) return () => {};
  const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
    if (!session) {
      callback(null, null);
      return;
    }
    const profile = await fetchProfile(session.user.id);
    callback(mapSupabaseUser(session.user, profile), session);
  });
  return () => data.subscription.unsubscribe();
}
