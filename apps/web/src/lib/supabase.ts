import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let client: SupabaseClient | null = null;
let accessToken: string | null = null;

export function getSupabase(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
  }
  if (!client) {
    client = createClient(url, anonKey);
  }
  return client;
}

export function getAccessToken(): string | undefined {
  return accessToken ?? undefined;
}

/** Keeps SDK Authorization header in sync with Supabase session. */
export function initSupabaseAuthSync() {
  const supabase = getSupabase();

  supabase.auth.getSession().then(({ data }) => {
    accessToken = data.session?.access_token ?? null;
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    accessToken = session?.access_token ?? null;
  });

  return () => subscription.unsubscribe();
}

export async function signIn(email: string, password: string) {
  const { data, error } = await getSupabase().auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  accessToken = data.session?.access_token ?? null;
  return data;
}

export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await getSupabase().auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  if (error) throw error;
  accessToken = data.session?.access_token ?? null;
  return data;
}

export async function signOut() {
  await getSupabase().auth.signOut();
  accessToken = null;
}
