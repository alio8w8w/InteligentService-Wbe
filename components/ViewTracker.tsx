"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ViewTracker() {
  const pathname = usePathname()

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
  }, [pathname]);

  return null; // Componenta este invizibilă
}