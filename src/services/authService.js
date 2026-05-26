import { isDemoMode, supabase } from "./supabaseClient";
import { clearLocalUser, getLocalUser, setLocalUser } from "./localStore";

function demoUserFromInput({ name, email, selectedInstrument }) {
  return {
    id: `demo-${email}`,
    name: name || "Demo Musician",
    email,
    avatar_url: "",
    selected_instrument: selectedInstrument || "Alto Saxophone",
    created_at: new Date().toISOString(),
  };
}

export async function login({ email, password }) {
  if (isDemoMode) {
    const user =
      getLocalUser() ??
      demoUserFromInput({ name: "Demo Musician", email, selectedInstrument: "Alto Saxophone" });
    setLocalUser(user);
    return { user, demo: true };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return { user: data.user, demo: false };
}

export async function register({ name, email, password, selectedInstrument }) {
  if (isDemoMode) {
    const user = demoUserFromInput({ name, email, selectedInstrument });
    setLocalUser(user);
    return { user, demo: true };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        selected_instrument: selectedInstrument || "Alto Saxophone",
      },
    },
  });
  if (error) throw error;
  return { user: data.user, demo: false };
}

export async function logout() {
  if (isDemoMode) {
    clearLocalUser();
    return;
  }
  await supabase.auth.signOut();
}

export function getInitialAuthState() {
  if (isDemoMode) return getLocalUser();
  return null;
}
