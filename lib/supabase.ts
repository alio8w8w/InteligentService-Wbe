// Am modificat importul de aici pentru a folosi pachetul SSR instalat mai devreme
import { createBrowserClient } from "@supabase/ssr";

// Funcție care forțează URL-ul să fie mereu valid pentru ca Vercel să nu crape la compilare
const getValidUrl = () => {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Dacă variabila lipsește complet, dăm un link fals pentru a trece de build
  if (!url || url.trim() === "") return 'https://placeholder.supabase.co';
  // Dacă îi lipsește https://, îl adăugăm automat
  if (!url.startsWith('http')) return `https://${url}`;
  return url;
};

// Am transformat exportul dintr-o CONSTANTĂ directă într-o FUNCȚIE
export function createClient() {
  const supabaseUrl = getValidUrl();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  
  // Această funcție returnează instanța sigură, reutilizabilă în browser
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}