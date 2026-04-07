"use client"

import { useTranslations } from 'next-intl'
import { BrandCard, type Brand } from '@/components/brand-card'

// Datele brandurilor cu căile corecte către folderul public/images/
const brands: { id: Brand; logoUrl: string }[] = [
  { id: 'hikvision', logoUrl: '/images/hikvision-logo.png' },
  { id: 'dahua', logoUrl: '/images/dahua-logo.png' }
]

export function BrandComp() {
  const t = useTranslations('homePage')

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {brands.map((brand) => (
            <BrandCard 
              key={brand.id} 
              brand={brand.id} 
              logoUrl={brand.logoUrl}
            />
          ))}
        </div>
        
      </div>
    </section>
  )
}