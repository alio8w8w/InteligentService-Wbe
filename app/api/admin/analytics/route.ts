import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // 1. Luăm numărul total de vizite
    const { count: totalViews, error: errTotal } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true });

    // 2. Luăm vizitele de astăzi
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: todayViews, error: errToday } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    if (errTotal || errToday) throw new Error("Eroare Supabase");

    // 3. Luăm toate path-urile pentru a calcula Top Pagini
    const { data: allPaths } = await supabase.from('page_views').select('path');
    
    const pageCounts: Record<string, number> = {};
    if (allPaths) {
      allPaths.forEach((row) => {
        pageCounts[row.path] = (pageCounts[row.path] || 0) + 1;
      });
    }

    // Sortăm descrescător pentru a obține topul
    const topPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Arătăm doar top 5 pagini

    return NextResponse.json({
      totalViews: totalViews || 0,
      todayViews: todayViews || 0,
      topPages: topPages
    });

  } catch (error) {
    console.error("Eroare Analytics API:", error);
    return NextResponse.json({ error: "Nu s-au putut prelua datele" }, { status: 500 });
  }
}