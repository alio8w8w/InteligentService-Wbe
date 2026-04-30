import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // 1. Aflăm numărul TOTAL de vizualizări
    const { count: totalViews, error: totalError } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    // 2. Aflăm numărul de vizualizări de ASTĂZI
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetăm ora pentru a lua doar ziua curentă

    const { count: todayViews, error: todayError } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    if (todayError) throw todayError;

    // 3. Aflăm CELE MAI VIZITATE PAGINI
    // Extragem toate căile pentru a le grupa și număra
    const { data: allPaths, error: pathsError } = await supabase
      .from('page_views')
      .select('path');

    if (pathsError) throw pathsError;

    // Calculăm de câte ori apare fiecare pagină
    const pageCounts: Record<string, number> = {};
    allPaths?.forEach((row) => {
      const path = row.path || "/";
      pageCounts[path] = (pageCounts[path] || 0) + 1;
    });

    // Transformăm obiectul într-un array, îl sortăm și luăm top 5
    const topPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); 

    // Returnăm fix structura de care are nevoie Frontend-ul
    return NextResponse.json({
      totalViews: totalViews || 0,
      todayViews: todayViews || 0,
      topPages: topPages
    });

  } catch (error: any) {
    console.error("Eroare API Analytics:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}