import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  // 1. Inițializăm clientul Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // Recomandat pentru API-uri de admin: folosește SUPABASE_SECRET_KEY pentru a trece de restricțiile RLS
    process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // 2. Extragem comenzile și produsele asociate folosind codul discutat
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          cantitate,
          pret_unitar,
          produse (
            nume,
            imagine_url,
            pret
          )
        )
      `)
      .order('created_at', { ascending: false }); // Sortăm implicit să le vedem pe cele mai noi primele

    // Dacă apare o eroare la baza de date, o aruncăm pentru a fi prinsă de 'catch'
    if (error) {
      throw error;
    }

    // 3. Trimitem datele cu succes către frontend
    return NextResponse.json({ orders: data });

  } catch (error: any) {
    console.error("Eroare la extragerea comenzilor:", error.message);
    // Returnăm un status 500 în caz de eroare
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}