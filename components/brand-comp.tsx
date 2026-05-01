"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Package } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@supabase/supabase-js'

export type Brand = 'hikvision' | 'dahua'

// Inițializare Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const brandsData: { id: Brand; logoUrl: string }[] = [
  { id: 'hikvision', logoUrl: '/images/hikvision-logo.png' },
  { id: 'dahua', logoUrl: '/images/dahua-logo.png' }
]

export function BrandShowcase() {
  const t = useTranslations('brandShowcase')
  const locale = useLocale()
  
  const [productCounts, setProductCounts] = useState<Record<string, number>>({
    hikvision: 0,
    dahua: 0
  })

  // Extragerea numărului de produse din Supabase
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const counts: Record<string, number> = {}
        for (const brand of brandsData) {
          const { count } = await supabase
            .from('produse')
            .select('*', { count: 'exact', head: true })
            .ilike('brand', brand.id)
          counts[brand.id] = count || 0
        }
        setProductCounts(counts)
      } catch (error) {
        console.error("Eroare la extragerea numărului de produse:", error)
      }
    }
    fetchCounts()
  }, [])

  return (
    // Padding mai mic (py-12 în loc de py-28) pentru a ocupa mai puțin loc pe homepage
    <section className="py-12 md:py-16 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Antet Compact */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-extrabold text-[#0F2A4A] mb-3 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-[#7A8CA5] font-medium text-sm md:text-base">
            {t('subtitle')}
          </p>
        </div>

        {/* Grid cu 2 coloane - Fără spații goale, compact și echilibrat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {brandsData.map((brand) => {
            return (
              <div 
                key={brand.id}
                className="bg-[#F5F2EC] rounded-[2rem] p-6 sm:p-8 flex flex-col border border-[#7A8CA5]/20 hover:border-[#F26A1B]/40 transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
              >
                {/* Accent subtil la hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#F26A1B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                {/* Header Card: Logo + Badge Produse */}
                <div className="flex justify-between items-start mb-6 gap-4">
                  <div className="bg-white p-3 rounded-2xl shadow-sm w-32 h-16 relative flex-shrink-0 border border-[#7A8CA5]/10">
                    <Image 
                      src={brand.logoUrl} 
                      alt={brand.id} 
                      fill 
                      className="object-contain p-2" 
                    />
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm text-[#0F2A4A] text-xs font-bold border border-[#7A8CA5]/10">
                    <Package size={14} className="text-[#F26A1B]" />
                    {productCounts[brand.id]} <span className="hidden sm:inline">{t('products')}</span>
                  </div>
                </div>

                {/* Conținut: Titlu & Descriere (Limitată la 3 rânduri pentru compactare) */}
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F2A4A] mb-3 leading-tight">
                  {t(`${brand.id}Title`)}
                </h3>
                <p className="text-[#7A8CA5] text-sm leading-relaxed mb-8 flex-grow line-clamp-3 font-medium">
                  {t(`${brand.id}Desc`)}
                </p>

                {/* Buton Acțiune - Folosim noul portocaliu */}
                <Link 
                  href={`/${locale}/branduri/${brand.id}`}
                  className="bg-[#F26A1B] hover:bg-[#C24C0F] text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-xl active:scale-95 w-full mt-auto"
                >
                  {t('viewProducts')}
                  <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}