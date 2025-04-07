
import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback to default values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
