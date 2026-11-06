import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { createBrowserClient } from '@supabase/ssr'

// Utilitar pentru clase Tailwind (shadcn/ui)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utilitar pentru sesiuni Guest
export function getOrCreateSessionId(): string {
  if (typeof window !== 'undefined') {
    let sessionId = localStorage.getItem("guest_session_id")
    if (!sessionId) {
      sessionId = `${crypto.randomUUID()}-${Date.now()}`
      localStorage.setItem("guest_session_id", sessionId)
    }
    return sessionId
  }
  return ""
}

// Funcție care forțează URL-ul să fie valid pentru build-ul de pe Vercel
const getValidUrl = () => {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || url.trim() === "") return 'https://placeholder.supabase.co';
  if (!url.startsWith('http')) return `https://${url}`;
  return url;
};

// Variabilă globală pentru a stoca instanța unică doar în browser
let browserClient: any = null;

// Funcția supremă și sigură pentru inițializarea clientului Supabase
export function createClient() {
  const supabaseUrl = getValidUrl();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

  // Dacă codul rulează pe Server (Next.js SSR), trebuie să returnăm mereu unul nou
  if (typeof window === 'undefined') {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  // Dacă codul rulează în Browser (Client), refolosim mereu ACEEAȘI instanță
  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  return browserClient;
}