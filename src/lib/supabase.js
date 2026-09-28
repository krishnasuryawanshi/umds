import { createClient } from '@supabase/supabase-js';

export const getSupabaseClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return null;

  if (supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon')) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};
