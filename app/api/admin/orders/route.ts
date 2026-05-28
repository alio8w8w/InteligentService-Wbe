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

    const formattedOrders = data.map((order: any) => {
      // 1. Extragem și formatăm produsele
      const produseFormatate = order.order_items 
        ? order.order_items.map((item: any) => ({
            // Luăm numele din relația cu tabela 'produse'
            nume_produs: item.produse?.name || "Produs necunoscut", 
            cantitate: item.cantitate,
            pret_unitar: item.pret_unitar
          })) 
        : [];
      const { order_items, ...restOfOrder } = order;
      
      return {
        ...restOfOrder,
        produse: produseFormatate
      };
    });

    return NextResponse.json({ orders: formattedOrders });

  } catch (error: any) {
    console.error("Eroare la extragerea comenzilor:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}