import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserSession = {
  id: string;
  session_id: string;
  usage_count: number;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
};

export type Trip = {
  id: string;
  session_id: string;
  destination: string;
  travel_date: string | null;
  weather_summary: Record<string, unknown> | null;
  created_at: string;
};

export function getSessionId(): string {
  let sessionId = localStorage.getItem('voyage_session_id');
  if (!sessionId) {
    sessionId = `sess_${crypto.randomUUID()}`;
    localStorage.setItem('voyage_session_id', sessionId);
  }
  return sessionId;
}

export async function getOrCreateSession(): Promise<UserSession> {
  const sessionId = getSessionId();
  const { data } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('session_id', sessionId)
    .maybeSingle();

  if (data) return data as UserSession;

  const { data: newSession, error } = await supabase
    .from('user_sessions')
    .insert({ session_id: sessionId })
    .select()
    .single();

  if (error) throw error;
  return newSession as UserSession;
}

export async function incrementUsage(sessionId: string): Promise<UserSession> {
  const { data: current } = await supabase
    .from('user_sessions')
    .select('usage_count')
    .eq('session_id', sessionId)
    .maybeSingle();

  const newCount = ((current?.usage_count) ?? 0) + 1;

  const { data, error } = await supabase
    .from('user_sessions')
    .update({ usage_count: newCount, updated_at: new Date().toISOString() })
    .eq('session_id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data as UserSession;
}

export async function activatePremium(sessionId: string): Promise<void> {
  await supabase
    .from('user_sessions')
    .update({ is_premium: true, updated_at: new Date().toISOString() })
    .eq('session_id', sessionId);

  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  await supabase
    .from('subscriptions')
    .upsert({
      session_id: sessionId,
      plan: 'premium_monthly',
      status: 'active',
      started_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
    }, { onConflict: 'session_id' });
}

export async function saveTrip(
  sessionId: string,
  destination: string,
  travelDate: string | null,
  weatherSummary: Record<string, unknown>
): Promise<Trip> {
  const { data, error } = await supabase
    .from('trips')
    .insert({ session_id: sessionId, destination, travel_date: travelDate, weather_summary: weatherSummary })
    .select()
    .single();
  if (error) throw error;
  return data as Trip;
}

export async function getTrips(sessionId: string): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Trip[];
}

export async function deleteTrip(tripId: string): Promise<void> {
  await supabase.from('trips').delete().eq('id', tripId);
}
