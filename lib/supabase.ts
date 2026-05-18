import { createClient } from "@supabase/supabase-js";

// Funcție care forțează URL-ul să fie mereu valid pentru ca Vercel să nu crape la compilare
const getValidUrl = () => {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Dacă variabila lipsește complet, dăm un link fals pentru a trece de build
  if (!url || url.trim() === "") return 'https://placeholder.supabase.co';
  // Dacă îi lipsește https://, îl adăugăm automat
  if (!url.startsWith('http')) return `https://${url}`;
  return url;
};

const supabaseUrl = getValidUrl();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);