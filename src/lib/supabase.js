import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qtoptwgmqulrumyojtjv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0b3B0d2dtcXVscnVteW9qdGp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3Mzk2MTAsImV4cCI6MjA5MDMxNTYxMH0.qeRXNytcgBKc4fyFpTqnUkhGdtHEBYAi0_AU-9AFF74'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
