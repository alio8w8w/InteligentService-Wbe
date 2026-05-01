"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { Trash2, ArrowRight, ShoppingCart, Loader2, PhoneCall, MonitorPlay } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type CartItem = {
  id: string
  cantitate: number
  pret_unitar: number
  produse: {
    id: string
    name: string
    images: string[]
    brand: string
  }
}

type Product = {
  id: string
  name: string
  base_price: number
  images: string[]
}

export default function CartClient({ locale }: { locale: string }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [recommended, setRecommended] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true)
      const savedOrderId = localStorage.getItem('inteligent_order_id')
      
      if (savedOrderId) {
        setOrderId(savedOrderId)
        // 1. Extragem produsele din coș (face JOIN automat cu tabelul produse)
        const { data, error } = await supabase
          .from('order_items')
          .select(`
            id,
            cantitate,
            pret_unitar,
            produse ( id, name, images, brand )
          `)
          .eq('order_id', savedOrderId)

        if (data) setCartItems(data as any[])
        if (error) console.error("Eroare la extragerea coșului:", error)
      }

      // 2. Extragem 4 produse recomandate (aleatorii sau cele mai noi)
      const { data: recData } = await supabase
        .from('produse')
        .select('id, name, base_price, images')
        .limit(4)
      
      if (recData) setRecommended(recData)
      
      setLoading(false)
    }

    fetchCartData()
  }, [])

  const removeItem = async (itemId: string) => {
    // Actualizare UI instantanee
    setCartItems(prev => prev.filter(item => item.id !== itemId))
    
    // Ștergere din baza de date
    await supabase.from('order_items').delete().eq('id', itemId)
  }

  const totalSum = cartItems.reduce((acc, item) => acc + (item.pret_unitar * item.cantitate), 0)

  if (loading) {
    return <div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="animate-spin text-[#F26A1B]" size={48} /></div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans text-[#0F2A4A]">
      
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">Coșul tău</h1>
        <p className="text-[#7A8CA5] font-medium">
          {cartItems.length} {cartItems.length === 1 ? 'produs' : 'produse'} în coș
        </p>
      </div>

      {cartItems.length === 0 ? (
        // STATE: COȘ GOL
        <div className="bg-white rounded-[2rem] border border-[#7A8CA5]/20 p-12 text-center shadow-sm flex flex-col items-center">
          <div className="w-24 h-24 bg-[#F5F2EC] rounded-full flex items-center justify-center mb-6 text-[#7A8CA5]">
            <ShoppingCart size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-4">Coșul tău este gol</h2>
          <p className="text-[#7A8CA5] mb-8 max-w-md">Descoperă gama noastră de sisteme de securitate și găsește echipamentul perfect pentru nevoile tale.</p>
          <Link href={`/${locale}/produse`} className="bg-[#F26A1B] hover:bg-[#C24C0F] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md active:scale-95 flex items-center gap-2">
            Înapoi la magazin <ArrowRight size={20} />
          </Link>
        </div>
      ) : (
        // STATE: COȘ PLIN
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Lista de produse */}
          <div className="lg:w-2/3 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 sm:p-6 rounded-[2rem] border border-[#7A8CA5]/20 shadow-sm flex flex-col sm:flex-row items-center gap-6 group hover:border-[#F26A1B]/30 transition-colors">
                
                {/* Imagine produs */}
                <div className="w-full sm:w-32 h-32 bg-[#F5F2EC] rounded-2xl p-4 flex items-center justify-center relative flex-shrink-0">
                  {item.produse.images && item.produse.images[0] ? (
                    <Image src={item.produse.images[0]} alt={item.produse.name} fill className="object-contain p-2 mix-blend-multiply" />
                  ) : (
                    <ShoppingCart size={24} className="text-[#7A8CA5]/40" />
                  )}
                </div>

                {/* Detalii produs */}
                <div className="flex-grow text-center sm:text-left">
                  <span className="text-xs font-black text-[#7A8CA5] uppercase tracking-widest">{item.produse.brand}</span>
                  <h3 className="text-lg font-bold text-[#0F2A4A] leading-tight mt-1 mb-2">{item.produse.name}</h3>
                  <div className="text-[#7A8CA5] text-sm font-medium">Cantitate: {item.cantitate}</div>
                </div>

                {/* Preț & Ștergere */}
                <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-4 sm:gap-2 w-full sm:w-auto">
                  <span className="text-xl font-black text-[#0F2A4A] whitespace-nowrap">{item.pret_unitar.toFixed(2)} MDL</span>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-[#7A8CA5] hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors flex items-center gap-2 text-sm sm:text-base"
                    title="Șterge produsul"
                  >
                    <Trash2 size={20} /> <span className="sm:hidden font-bold">Șterge</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sumar Comandă */}
          <div className="lg:w-1/3">
            <div className="bg-[#0F2A4A] text-[#F5F2EC] rounded-[2rem] p-8 shadow-2xl sticky top-28">
              <h3 className="text-xl font-extrabold mb-6 border-b border-[#7A8CA5]/20 pb-4">Sumar Comandă</h3>
              
              <div className="space-y-4 mb-6 text-[#7A8CA5] font-medium">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} produse)</span>
                  <span className="text-[#F5F2EC]">{totalSum.toFixed(2)} MDL</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxe / Instalare</span>
                  <span className="text-[#F5F2EC]">Se calculează ulterior</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-[#7A8CA5]/20 pt-6 mb-8">
                <span className="text-lg font-bold">Total estimat</span>
                <span className="text-3xl font-black text-[#F26A1B]">{totalSum.toFixed(2)} MDL</span>
              </div>

              <button className="w-full bg-[#F26A1B] hover:bg-[#C24C0F] text-white py-4 rounded-xl font-bold transition-all shadow-md active:scale-95 text-lg">
                Trimite Comanda
              </button>
              <p className="text-xs text-center text-[#7A8CA5] mt-4">
                Un consultant te va contacta pentru confirmare și detalii despre instalare.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* SECȚIUNE: PRODUSE RECOMANDATE */}
      {recommended.length > 0 && (
        <div className="mt-24 pt-12 border-t border-[#7A8CA5]/20">
          <h2 className="text-2xl font-extrabold text-[#0F2A4A] mb-8">Produse recomandate</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommended.map(product => (
              <Link href={`/${locale}/produse/${product.id}`} key={product.id} className="bg-white rounded-2xl p-4 border border-[#7A8CA5]/10 hover:border-[#F26A1B]/30 hover:shadow-xl transition-all duration-300 group flex flex-col">
                <div className="h-40 w-full bg-[#F5F2EC] rounded-xl mb-4 p-4 relative flex items-center justify-center">
                  {product.images && product.images[0] ? (
                    <Image src={product.images[0]} alt={product.name} fill className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <ShoppingCart className="text-[#7A8CA5]/30" size={32} />
                  )}
                </div>
                <h4 className="font-bold text-[#0F2A4A] line-clamp-2 mb-2 group-hover:text-[#F26A1B] transition-colors">{product.name}</h4>
                <div className="mt-auto font-black text-[#0F2A4A]">{product.base_price} MDL</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SECȚIUNE: CALL TO ACTION (CTA) */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CTA 1: Apel */}
        <div className="bg-[#0F2A4A] rounded-[2rem] p-8 flex flex-col sm:flex-row items-center gap-6 text-[#F5F2EC] shadow-lg border border-[#0F2A4A]">
          <div className="w-16 h-16 rounded-full bg-[#F26A1B]/20 flex items-center justify-center flex-shrink-0">
            <PhoneCall size={32} className="text-[#F26A1B]" />
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h3 className="text-xl font-bold mb-2">Nu ești sigur ce să alegi?</h3>
            <p className="text-[#7A8CA5] text-sm mb-4">Inginerii noștri îți oferă consultanță gratuită pentru a alege sistemul optim.</p>
            <a href="tel:+37368123456" className="inline-block text-[#F26A1B] font-bold hover:text-[#F5F2EC] transition-colors">
              Solicită un apel telefonic →
            </a>
          </div>
        </div>

        {/* CTA 2: Ecrane LED */}
        <div className="bg-[#F5F2EC] rounded-[2rem] p-8 flex flex-col sm:flex-row items-center gap-6 text-[#0F2A4A] shadow-sm border border-[#7A8CA5]/20 hover:border-[#F26A1B]/40 transition-colors">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-[#7A8CA5]/10">
            <MonitorPlay size={32} className="text-[#0F2A4A]" />
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h3 className="text-xl font-bold mb-2">Sisteme de afișaj profesionale</h3>
            <p className="text-[#7A8CA5] text-sm mb-4">Descoperă gama noastră de ecrane LED pentru interior și exterior.</p>
            <Link href={`/${locale}/led-ecrane`} className="inline-block text-[#0F2A4A] font-bold hover:text-[#F26A1B] transition-colors">
              Vezi colecția LED →
            </Link>
          </div>
        </div>

      </div>

    </div>
  )
}