"use client"

import { useTranslations } from 'next-intl'
import { BrandCard, type Brand } from '@/components/brand-card'

const brands = ['hikvision', 'dahua'] as const satisfies readonly Brand[]

export function BrandComp() {
  const t = useTranslations('homePage')
  const title = t('brands.title')
  const titleHighlight = t('brands.titleHighlight')
  const description = t('brands.description')

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F2A4A] mb-5 tracking-tight">
            {title} <span className="text-[#F26A1B]">{titleHighlight}</span>
          </h2>
          <p className="text-[#7A8CA5] font-medium max-w-2xl mx-auto text-lg md:text-xl">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {brands.map((brand) => <BrandCard key={brand} brand={brand} />)}
        </div>
      </div>
    </section>
  )
}