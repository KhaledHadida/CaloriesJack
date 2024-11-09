// supabaseClient.js - where we establish the supabase connection
import { createClient } from '@supabase/supabase-js';

// For Vercel, use NEXT_PUBLIC_ prefix
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;  
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
