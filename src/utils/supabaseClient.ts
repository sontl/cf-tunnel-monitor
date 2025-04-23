import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. Please connect to Supabase by clicking "Connect to Supabase" button in the top right.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true, // Enables session persistence
    autoRefreshToken: true, // Automatically refreshes the token
    detectSessionInUrl: true, // Detects OAuth tokens in the URL
  },
});