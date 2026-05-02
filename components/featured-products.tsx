"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { ArrowRight, Loader2, Search } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type FeaturedProduct = {
  id: string
  name: string
  base_price: number
  has_discount: boolean
  discount_percentage: number
  images: string[]
  brand: string
  translatedDesc?: string
}

export function FeaturedProducts() {
  const t = useTranslations("hero.products") // Folosim traducerile create anterior
  const locale = useLocale()
  
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('produse')
        .select(`
          id, name, base_price, has_discount, discount_percentage, images, brand,
          product_translations (language_code, description)
        `)
        .order('has_discount', { ascending: false })
        .limit(6)

      if (data) {
        const formatted = data.map((product: any) => {
          const translation = product.product_translations?.find((tr: any) => tr.language_code === locale);
          return {
            ...product,
            translatedDesc: translation ? translation.description : ""
          } as FeaturedProduct;
        });
        setFeaturedProducts(formatted)
      } else if (error) {
        console.error("Eroare la extragerea produselor:", error)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [locale])

  return (
    <section className="relative z-20 w-full bg-[#F5F2EC] py-20 border-t border-[#7A8CA5]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Antet Produse */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black text-[#0F2A4A] mb-4 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-[#7A8CA5] font-medium max-w-2xl mx-auto text-lg">
            {t("subtitle")}
          </p>
        </div>

        {/* Loader sau Grila de Produse */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-[#F26A1B]" size={48} />
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {featuredProducts.map((product) => {
              const finalPrice = product.has_discount 
                ? product.base_price - (product.base_price * product.discount_percentage / 100) 
                : product.base_price;

              return (
                <Link 
                  href={`/${locale}/produse/${product.id}`} 
                  key={product.id} 
                  // Stil modern, border gri-albăstrui subțire care devine portocaliu la hover
                  className="group relative bg-white rounded-3xl border border-[#7A8CA5]/20 p-5 flex flex-col hover:border-[#F26A1B]/60 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                >
                  {/* Badge Reducere cu Portocaliu Închis */}
                  {product.has_discount && (
                    <div className="absolute top-4 left-4 bg-[#C24C0F] text-white text-[11px] font-black uppercase px-3 py-1.5 rounded-lg z-10 shadow-md">
                      -{product.discount_percentage}%
                    </div>
                  )}

                  {/* Imagine MAI MARE (h-48 în loc de h-40) */}
                  <div className="relative h-48 w-full bg-gradient-to-b from-[#F5F2EC]/80 to-white rounded-2xl mb-5 p-4 flex items-center justify-center overflow-hidden border border-[#7A8CA5]/5 group-hover:bg-[#F26A1B]/5 transition-colors">
                    {product.images && product.images[0] ? (
                      <Image 
                        src={product.images[0]} 
                        alt={product.name} 
                        fill 
                        className="object-contain p-2 mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-[#7A8CA5]/10 flex items-center justify-center text-[#7A8CA5]/40">
                        <Search size={28} />
                      </div>
                    )}
                    
                    {/* Overlay HOVER "Vezi Mai Multe" în culorile brandului */}
                    <div className="absolute inset-0 bg-[#0F2A4A]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-[#F26A1B] text-white text-sm font-bold px-5 py-2.5 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                        {t("viewMore")} <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>

                  {/* Detalii Produs */}
                  <div className="flex flex-col flex-grow">
                    <span className="text-xs font-black text-[#7A8CA5] uppercase tracking-widest mb-1.5 border-b border-[#7A8CA5]/10 pb-1 w-max">
                      {product.brand}
                    </span>
                    <h3 className="text-sm font-extrabold text-[#0F2A4A] mb-4 line-clamp-2 leading-snug group-hover:text-[#F26A1B] transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="mt-auto flex flex-col bg-[#F5F2EC]/50 p-3 rounded-xl border border-[#7A8CA5]/5">
                      {product.has_discount && (
                        <span className="text-xs text-[#7A8CA5] line-through font-bold">
                          {product.base_price} MDL
                        </span>
                      )}
                      <span className="text-xl font-black text-[#0F2A4A]">
                        {finalPrice.toFixed(2)} MDL
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
           <div className="text-center py-10 bg-white rounded-3xl border border-[#7A8CA5]/10 shadow-sm text-[#7A8CA5] text-sm font-medium">
             Momentan nu există produse recomandate.
           </div>
        )}
      </div>
    </section>
  )
}