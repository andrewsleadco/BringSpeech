import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ozpyodveiksiwxzhtatf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96cHlvZHZlaWtzaXd4emh0YXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5Mjc4NTIsImV4cCI6MjA2NDUwMzg1Mn0.pVSw8fPayTUuaBZOYodoRy82fO3saNlj7QU4cc3sEkU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
