"use client"

import { useTranslations } from 'next-intl'
import { BrandCard, type Brand } from '@/components/brand-card'

// Am mutat array-ul aici deoarece este folosit doar de acest component
const brands: Brand[] = ['hikvision', 'dahua']

export function BrandComp() {
  const t = useTranslations('homePage')

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F2A4A] mb-4 tracking-tight">
            {t('brands.title')} <span className="text-[#F26A1B]">{t('brands.titleHighlight')}</span>
          </h2>
          <p className="text-[#7A8CA5] font-medium max-w-xl mx-auto text-lg">
            {t('brands.description')}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {brands.map((brand) => (
            <BrandCard key={brand} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  )
}