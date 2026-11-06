import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export const dynamic = 'force-dynamic'

const supabase = createClient()

export async function POST(req: NextRequest) {
  try {
    const { guest, session_id, cartItems } = await req.json()

    const { data: guestData, error: guestError } = await supabase
      .from("leads_and_customers")
      .upsert({
        first_name: guest.firstName,
        last_name: guest.lastName,
        phone: guest.phone,
        email: guest.email,
        consent_given: guest.consent,
      }, { onConflict: "phone" })
      .select()
      .single()

    if (guestError) return NextResponse.json({ error: guestError.message }, { status: 400 })

    const { data: cartData, error: cartError } = await supabase
      .from("carts")
      .upsert(
        {
          customer_id: guestData.id,
          session_id,
          status: "pending",
          total_amount: cartItems.reduce((a: number, i: any) => a + Number(i.price_at_add_time) * i.quantity, 0),
        },
        { onConflict: "session_id" }
      )
      .select()
      .single()

    if (cartError) return NextResponse.json({ error: cartError.message }, { status: 400 })

    await supabase.from("cart_items").delete().eq("cart_id", cartData.id)
    
    const itemsInsert = cartItems.map((i: any) => ({
      cart_id: cartData.id,
      product_id: i.product_id,
      quantity: i.quantity,
      price_at_add_time: i.price_at_add_time,
    }))
    
    const { error: cartItemErr } = await supabase.from("cart_items").insert(itemsInsert)
    
    if (cartItemErr) return NextResponse.json({ error: cartItemErr.message }, { status: 400 })

    return NextResponse.json({ success: true, cart_id: cartData.id })
  } catch (error: any) {
    return NextResponse.json({ error: "A apărut o eroare la procesarea cererii." }, { status: 500 })
  }
}