"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase' 
import { ArrowRight, Loader2, Search } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

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
  const t = useTranslations('featuredProducts')
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
        .not('brand', 'ilike', '%led ecran%') 
        .order('has_discount', { ascending: false })
        .limit(6)

      if (data) {
        const formatted = data.map((product: any) => {
          const translation = product.product_translations?.find(
            (tr: any) => tr.language_code === locale
          )
          return {
            ...product,
            translatedDesc: translation?.description ?? '',
          } as FeaturedProduct
        })
        setFeaturedProducts(formatted)
      } else if (error) {
        console.error('Eroare la extragerea produselor:', error)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [locale])

  return (
    <section className="w-full bg-[#0F2A4A] py-16 md:py-24 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-[100px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#F26A1B]/5 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 text-[#F26A1B] text-xs sm:text-sm font-bold uppercase tracking-widest mb-3 sm:mb-4 bg-[#F26A1B]/10 px-4 py-1.5 rounded-full border border-[#F26A1B]/20">
            {t('eyebrow')}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-[#7A8CA5] font-medium max-w-xl mx-auto text-sm sm:text-base">
            {t('subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#F26A1B]" size={48} />
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {featuredProducts.map((product) => {
              const finalPrice = product.has_discount
                ? product.base_price - (product.base_price * (product.discount_percentage || 0)) / 100
                : product.base_price

              return (
                <Link
                  href={`/${locale}/produse?productId=${product.id}`}
                  key={product.id}
                  className="group relative bg-white rounded-xl sm:rounded-2xl border border-transparent overflow-hidden flex flex-col hover:border-[#F26A1B]/50 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-xl hover:shadow-[#F26A1B]/10 transition-all duration-300"
                >
                  {product.has_discount && product.discount_percentage && (
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-[#C24C0F] text-white text-[10px] sm:text-xs font-black uppercase px-2 sm:px-3 py-1 rounded-md sm:rounded-lg shadow-md">
                      -{product.discount_percentage}%
                    </div>
                  )}

                  <div className="relative h-36 sm:h-56 bg-gradient-to-b from-[#f7f5f0] to-white flex items-center justify-center overflow-hidden p-2 sm:p-4">
                    {product.images && product.images.length > 0 && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-contain p-4 sm:p-6 mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Search size={24} className="text-[#7A8CA5]/30 sm:w-8 sm:h-8" />
                    )}

                    <div className="hidden sm:flex absolute inset-0 bg-[#0F2A4A]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-[#F26A1B] text-white text-sm font-bold px-6 py-2.5 rounded-full flex items-center gap-2 whitespace-nowrap translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                        {t('viewMore')}
                        <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-grow p-3 sm:p-5 pt-2 sm:pt-4">
                    <span className="text-[9px] sm:text-[10px] font-black text-[#7A8CA5] uppercase tracking-wider mb-1 sm:mb-1.5">
                      {product.brand}
                    </span>
                    
                    <h3 className="text-xs sm:text-base font-bold text-[#0F2A4A] mb-3 sm:mb-5 line-clamp-2 leading-tight group-hover:text-[#F26A1B] transition-colors">
                      {product.name}
                    </h3>

                    <div className="mt-auto bg-[#F5F2EC] rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-2 sm:py-3 border border-[#0F2A4A]/5">
                      {product.has_discount && (
                        <p className="text-[10px] sm:text-xs text-[#7A8CA5] line-through font-semibold leading-none mb-1">
                          {product.base_price.toLocaleString()} MDL
                        </p>
                      )}
                      <p className="text-sm sm:text-xl font-black text-[#0F2A4A] leading-none flex items-baseline gap-1">
                        {finalPrice.toFixed(0)}{' '}
                        <span className="text-[9px] sm:text-xs font-bold text-[#7A8CA5]">MDL</span>
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 text-[#F5F2EC] text-sm font-medium">
            {t('noProducts')}
          </div>
        )}

        <div className="mt-12 sm:mt-16 text-center">
          <Link
            href={`/${locale}/produse`}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:px-12 sm:py-4 rounded-xl sm:rounded-2xl font-black text-white text-sm sm:text-lg transition-all active:scale-95 shadow-xl shadow-[#F26A1B]/20 hover:shadow-[#F26A1B]/40 hover:-translate-y-1"
            style={{ background: 'linear-gradient(135deg, #F26A1B, #d45a10)' }}
          >
            {t('viewAll')}
            <ArrowRight size={18} className="sm:w-5 sm:h-5" />
          </Link>
        </div>

      </div>
    </section>
  )
}