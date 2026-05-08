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
    <section className="w-full bg-[#F5F2EC] py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[#F26A1B] text-xs font-bold uppercase tracking-widest mb-3">
            <span className="w-5 h-px bg-[#F26A1B] rounded-full inline-block" />
            {t('eyebrow')}
            <span className="w-5 h-px bg-[#F26A1B] rounded-full inline-block" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F2A4A] tracking-tight mb-3">
            {t('title')}
          </h2>
          <p className="text-[#7A8CA5] font-medium max-w-xl mx-auto text-base">
            {t('subtitle')}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-[#F26A1B]" size={40} />
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredProducts.map((product) => {
              const finalPrice = product.has_discount
                ? product.base_price - (product.base_price * product.discount_percentage) / 100
                : product.base_price

              return (
                <Link
                  href={`/${locale}/produse/${product.id}`}
                  key={product.id}
                  className="group relative bg-white rounded-2xl border border-[#7A8CA5]/15 overflow-hidden flex flex-col hover:border-[#F26A1B]/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                >
                  {/* Discount badge */}
                  {product.has_discount && (
                    <div className="absolute top-3 left-3 z-10 bg-[#C24C0F] text-white text-[11px] font-black uppercase px-2.5 py-1 rounded-lg shadow-md">
                      -{product.discount_percentage}%
                    </div>
                  )}

                  {/* Image zone */}
                  <div className="relative h-52 bg-gradient-to-b from-[#f7f5f0] to-white flex items-center justify-center overflow-hidden">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-contain p-6 mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Search size={28} className="text-[#7A8CA5]/30" />
                    )}

                    {/* Hover overlay — full text always visible */}
                    <div className="absolute inset-0 bg-[#0F2A4A]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span
                        className="bg-[#F26A1B] text-white text-sm font-bold px-6 py-2.5 rounded-full flex items-center gap-2 whitespace-nowrap
                          translate-y-3 group-hover:translate-y-0 transition-transform duration-300 shadow-lg"
                      >
                        {t('viewMore')}
                        <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-grow p-4 pt-3">
                    <span className="text-[10px] font-black text-[#7A8CA5] uppercase tracking-widest mb-1.5">
                      {product.brand}
                    </span>
                    <h3 className="text-sm font-bold text-[#0F2A4A] mb-4 line-clamp-2 leading-snug group-hover:text-[#F26A1B] transition-colors">
                      {product.name}
                    </h3>

                    {/* Price block */}
                    <div className="mt-auto bg-[#F5F2EC] rounded-xl px-3 py-2.5">
                      {product.has_discount && (
                        <p className="text-xs text-[#7A8CA5] line-through font-semibold leading-tight">
                          {product.base_price.toLocaleString()} MDL
                        </p>
                      )}
                      <p className="text-xl font-extrabold text-[#0F2A4A] leading-tight">
                        {finalPrice.toFixed(2)}{' '}
                        <span className="text-xs font-semibold text-[#7A8CA5]">MDL</span>
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-[#7A8CA5]/10 text-[#7A8CA5] text-sm font-medium">
            {t('noProducts')}
          </div>
        )}

        {/* View all CTA */}
        <div className="mt-10 text-center">
          <Link
            href={`/${locale}/produse`}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white text-sm transition-all active:scale-95 hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg,#F26A1B,#d45a10)' }}
          >
            {t('viewAll')}
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  )
}