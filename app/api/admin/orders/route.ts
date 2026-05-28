import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';


export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          cantitate,
          pret_unitar,
          produse (
            name,
            images,
            base_price,
            brand
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ orders: data });

  } catch (error: any) {
    console.error("Eroare la extragerea comenzilor:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}