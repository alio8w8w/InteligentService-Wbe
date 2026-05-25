"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { ArrowRight, MonitorPlay, Loader2, Eye } from "lucide-react"
import { useTranslations, useLocale } from 'next-intl'

type Product = {
  id: string;
  name: string;
  brand: string;
  base_price: number;
  has_discount: boolean;
  discount_percentage: number;
  images: string[];
}

export function FeaturedLedScreens() {
  const t = useTranslations('featuredLed')
  const locale = useLocale()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLedScreens = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("produse")
          .select("*")
          // Search case-insensitively for any brand containing "LED" to avoid missing rows
          .ilike("brand", "%led%")
          .eq("is_featured_on_homepage", true)
          .limit(6) // Modificat din 4 în 6 conform cerinței tale

        if (error) {
          console.error("Eroare la extragerea ecranelor LED:", error)
        } else if (data) {
          setProducts(data as Product[])
        }
      } catch (err) {
        console.error("Eroare neașteptată:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchLedScreens()
  }, [])

  return (
    <section className="py-24 px-6 lg:px-12 bg-[#0F2A4A] relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-125 h-125 bg-[#F26A1B]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-4 text-[#F26A1B]">
             <MonitorPlay size={32} />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-[#7A8CA5] font-medium max-w-2xl mx-auto text-lg">
            {t('subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="animate-spin text-[#F26A1B] mb-4" size={40} />
            <p className="text-white font-bold text-lg">{t('loading')}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-10 bg-white/5 border border-white/10 rounded-3xl text-white/80 font-medium">
            {t('empty')}
          </div>
        ) : (
          /* Grila actualizată: 1 coloană pe mobil, 2 pe tablete, 3 pe desktop (pentru a încadra frumos 6 produse) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link 
                key={product.id} 
                href={`/${locale}/led-ecran?productId=${product.id}`}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#F26A1B]/20 transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                  <img 
                    src={product.images && product.images[0] ? product.images[0] : '/placeholder.png'} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  <div className="absolute inset-0 bg-[#0F2A4A]/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                    <div className="bg-[#F26A1B] text-white p-3 rounded-full mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Eye size={24} />
                    </div>
                    <span className="text-white font-bold tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      {t('viewMore')}
                    </span>
                  </div>

                  {product.has_discount && (
                    <div className="absolute top-3 right-3 bg-[#F26A1B] text-white text-xs font-black px-3 py-1.5 rounded-full z-10 shadow-md">
                      -{product.discount_percentage}%
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1 justify-between bg-white relative z-20">
                  <div>
                    <h3 className="text-[#0F2A4A] font-extrabold text-xl mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      {product.has_discount ? (
                        <div className="flex flex-col">
                          <span className="text-[#7A8CA5] text-sm line-through">
                            {product.base_price.toLocaleString()} MDL
                          </span>
                          <span className="text-[#F26A1B] font-black text-xl">
                            {(product.base_price - (product.base_price * product.discount_percentage / 100)).toLocaleString()} MDL
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#0F2A4A] font-black text-xl">
                          {product.base_price.toLocaleString()} MDL
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-16 flex justify-center relative z-10">
          <Link 
            href={`/${locale}/led-ecran`}
            className="group flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 active:scale-95 shadow-xl shadow-[#F26A1B]/20 hover:shadow-[#F26A1B]/40 bg-[#F26A1B] hover:bg-[#c24c0f]"
          >
            {t('viewAll')}
            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  )
}