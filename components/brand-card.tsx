"use client"

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

// Restrângem tipurile strict la cele 2 branduri pe care le folosești
export type Brand = 'hikvision' | 'dahua'

interface BrandCardProps {
  brand: Brand
  productCount?: number // Numărul de produse (îl vei aduce din baza de date)
}

export function BrandCard({ brand, productCount = 0 }: BrandCardProps) {
  // Inițializăm next-intl
  const t = useTranslations('brandCard')
  const locale = useLocale()

  // Numele formatate ale brandurilor
  const brandNames = {
    hikvision: 'Hikvision',
    dahua: 'Dahua'
  }

  // Generăm ruta corectă folosind limba curentă (ex: /ro/branduri/hikvision)
  const brandRoute = `/${locale}/branduri/${brand}`

  return (
    <Link href={brandRoute} className="block h-full group">
      {/* Container: Fundal alb/deschis cu bordură subtilă Slate Blue. 
          La hover, se ridică ușor și primește un accent portocaliu fin pe bordură. */}
      <div className="flex flex-col h-full p-6 rounded-2xl bg-white border border-[#7A8CA5]/20 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-[#F26A1B]/40">
        
        {/* Titlu Brand - Navy Dark */}
        <div className="mb-3">
          <span className="text-xl font-extrabold text-[#0F2A4A] tracking-tight">
            {brandNames[brand]}
          </span>
        </div>
        
        {/* Descrierea - preluată automat din fișierele .json - Slate Blue */}
        <p className="text-sm text-[#7A8CA5] mb-6 line-clamp-3 leading-relaxed flex-grow font-medium">
          {t(`${brand}Desc`)}
        </p>
        
        {/* Footer-ul cardului */}
        <div className="flex items-center justify-between pt-4 border-t border-[#7A8CA5]/10 mt-auto">
          {/* Număr produse - Slate Blue */}
          <span className="text-xs text-[#7A8CA5] font-bold uppercase tracking-wider">
            {productCount} {t('products')}
          </span>
          
          {/* Buton "Vezi produse" - Vibrant Orange */}
          <span className="text-sm text-[#F26A1B] flex items-center gap-1 group-hover:gap-2 transition-all font-bold">
            {t('viewProducts')}
            <ArrowRight className="h-4 w-4 stroke-[2.5px]" />
          </span>
        </div>

      </div>
    </Link>
  )
}