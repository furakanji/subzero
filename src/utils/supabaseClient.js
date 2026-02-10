import { createClient } from '@supabase/supabase-js';

// Retrieve usage keys from environment variables
// VITE_ prefix is required for Vite to expose them to the frontend
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase Environment Variables. Cloud features will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
