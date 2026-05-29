// Supabase client — cargado antes de cualquier módulo React/JSX
const SUPABASE_URL = 'https://xtgqsawmcofpvfafsste.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_yLiHcToAc1DcskonEhm9HQ_fDh72A4E';

window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
