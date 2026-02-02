import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;

export const getSupabaseClient = () => {
  if (!supabase) {
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase URL or Key not configured');
      return null;
    }
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
};

export default getSupabaseClient();
