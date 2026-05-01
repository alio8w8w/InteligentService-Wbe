"use client"

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { BrandCard, type Brand } from '@/components/brand-card'
import { createClient } from '@supabase/supabase-js'

// Inițializăm Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Datele statice de bază
const brandsData: { id: Brand; logoUrl: string }[] = [
  { id: 'hikvision', logoUrl: '/images/hikvision-logo.png' },
  { id: 'dahua', logoUrl: '/images/dahua-logo.png' }
]

export function BrandComp() {
  // Folosim useTranslations pentru Client Components
  const t = useTranslations('homePage')
  
  // Aici vom salva numărul de produse extrase din Supabase
  const [productCounts, setProductCounts] = useState<Record<string, number>>({
    hikvision: 0,
    dahua: 0
  })

  // Extragem numărul real de produse când se încarcă secțiunea
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
    <section className="py-20 md:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Antetul secțiunii */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F2A4A] mb-5 tracking-tight">
            {t('brands.title')} <span className="text-[#F26A1B]">{t('brands.titleHighlight')}</span>
          </h2>
          <p className="text-[#7A8CA5] font-medium max-w-2xl mx-auto text-lg md:text-xl">
            {t('brands.description')}
          </p>
        </div>
        
        {/* Grid-ul de carduri */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {brandsData.map((brand) => (
            <BrandCard 
              key={brand.id} 
              brand={brand.id} 
              logoUrl={brand.logoUrl}
              productCount={productCounts[brand.id]} // Transmitem numărul real din state
            />
          ))}
        </div>
        
      </div>
    </section>
  )
}