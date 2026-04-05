"use client"

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

// Definim strict doar cele 2 branduri pe care le folosești
export type Brand = 'hikvision' | 'dahua'

interface BrandCardProps {
  brand: Brand
  productCount?: number // Am pus asta opțional. O vei popula mai târziu din Supabase.
}

export function BrandCard({ brand, productCount = 0 }: BrandCardProps) {
  const t = useTranslations('brandCard')
  const currentLocale = useLocale()

  // Configurarea datelor statice pentru carduri
  const brandData = {
    hikvision: {
      name: 'Hikvision',
      logoUrl: '/images/hikvision-logo.png', // Asigură-te că ai imaginea în public/images/
      href: `/${currentLocale}/branduri/hikvision`,
      // Efect subtil de hover specific brandului
      hoverTheme: 'hover:shadow-[#0F2A4A]/15 hover:border-[#0F2A4A]/20'
    },
    dahua: {
      name: 'Dahua',
      logoUrl: '/images/dahua-logo.png', // Asigură-te că ai imaginea în public/images/
      href: `/${currentLocale}/branduri/dahua`,
      hoverTheme: 'hover:shadow-[#F26A1B]/15 hover:border-[#F26A1B]/20'
    }
  }

  const currentBrand = brandData[brand]

  return (
    <Link href={currentBrand.href}>
      {/* Design Premium Glassmorphism pe fundal luminos */}
      <div className={`group overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_10px_30px_-15px_rgba(15,42,74,0.08)] transition-all duration-400 hover:-translate-y-2 ${currentBrand.hoverTheme}`}>
        
        {/* Zona pentru Logotipul Brandului */}
        <div className="aspect-[16/9] relative flex items-center justify-center p-8 border-b border-[#0F2A4A]/5 bg-gradient-to-b from-transparent to-[#F5F2EC]/40">
          <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
            <Image 
              src={currentBrand.logoUrl} 
              alt={`Logotip ${currentBrand.name}`} 
              fill 
              className="object-contain" 
            />
          </div>
        </div>

        {/* Zona de Informații */}
        <div className="p-6">
          <h3 className="text-xl font-extrabold text-[#0F2A4A] mb-2">
            {currentBrand.name}
          </h3>
          
          {/* Descrierea se ia dinamic din fișierele de traducere (ex: hikvisionDesc) */}
          <p className="text-sm text-[#7A8CA5] font-medium mb-6 line-clamp-2 leading-relaxed">
            {t(`${brand}Desc`)}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-[#0F2A4A]/5">
            {/* Afișăm numărul de produse sau un text generic dacă e 0 */}
            <span className="text-xs font-bold text-[#7A8CA5] uppercase tracking-wider">
              {productCount > 0 ? `${productCount} ${t('products')}` : t('explore')}
            </span>
            
            <span className="text-sm font-bold text-[#F26A1B] flex items-center gap-1 group-hover:gap-2 transition-all">
              {t('viewProducts')}
              <ArrowRight className="h-4 w-4 stroke-[2.5px]" />
            </span>
          </div>
        </div>

      </div>
    </Link>
  )
}