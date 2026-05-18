import { createClient } from "@supabase/supabase-js"

// Preluăm variabilele corecte și adăugăm "fallback" (valoare de rezervă)
// Astfel, dacă Vercel nu le găsește la build, scriptul NU va crăpa.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)