// Supabase client — cargado antes de cualquier módulo React/JSX
const SUPABASE_URL = 'https://xtgqsawmcofpvfafsste.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_yLiHcToAc1DcskonEhm9HQ_fDh72A4E';

// Leer el hash ANTES de que detectSessionInUrl lo borre al procesar el token
const _authHashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
window.__horizeoAuthType  = _authHashParams.get('type');   // 'signup' | 'recovery' | null
window.__horizeoAuthError = _authHashParams.get('error_description') || _authHashParams.get('error') || null;

window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
