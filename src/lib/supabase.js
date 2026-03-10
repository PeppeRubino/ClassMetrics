import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rmdkzxenpjjgokaolbrz.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtZGt6eGVucGpqZ29rYW9sYnJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NjI5NTgsImV4cCI6MjA4ODEzODk1OH0.DAUMwz6ejeGGDZZhZ6aBo81NFFnH1HMpERQWtr4Z3ic';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const APP_SLUG = 'classmetrics';
