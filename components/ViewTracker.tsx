"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
// 1. Am modificat importul pentru a folosi funcția ta din utils
import { createClient } from "@/lib/utils"

export default function ViewTracker() {
  const pathname = usePathname()
  // 2. Am inițializat clientul Supabase în interiorul componentei
  const supabase = createClient()

  useEffect(() => {
    const trackView = async () => {
      // NU înregistrăm vizitele pe paginile de admin
      if (pathname?.includes("/admin")) {
        console.log("Tracker: Vizită pe admin ignorată.");
        return;
      }

      console.log("Tracker: Încerc să înregistrez vizita pentru:", pathname);

      const { error } = await supabase
        .from("page_views")
        .insert([{ path: pathname || "/" }]);

      if (error) {
        console.error("Tracker Error:", error.message);
      } else {
        console.log("Tracker Success: Vizită salvată în Supabase!");
      }
    };

    trackView();
  // 3. Am adăugat supabase în array-ul de dependențe pentru useEffect
  }, [pathname, supabase]);

  return null; // Componenta este invizibilă
}