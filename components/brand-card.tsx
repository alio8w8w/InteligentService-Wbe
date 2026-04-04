"use client"

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Brand } from '@/lib/types'
import { brandInfo, products } from '@/lib/types'
import { useTranslations } from 'next-intl' // <-- Importăm next-intl

interface BrandCardProps {
  brand: Brand
}

const brandLogos: Record<Brand, React.ReactNode> = {
  'dahua-imou': (
    <svg viewBox="0 0 100 40" className="h-8 text-[#FF4B04]" fill="currentColor">
      <text x="10" y="28" fontSize="18" fontWeight="bold">IMOU</text>
    </svg>
  ),
  'uniview': (
    <svg viewBox="0 0 100 40" className="h-8 text-blue-500" fill="currentColor">
      <text x="5" y="28" fontSize="14" fontWeight="bold">UNIVIEW</text>
    </svg>
  ),
  'hikvision': (
    <svg viewBox="0 0 100 40" className="h-8 text-red-500" fill="currentColor">
      <text x="5" y="28" fontSize="12" fontWeight="bold">HIKVISION</text>
    </svg>
  ),
  'china': (
    <svg viewBox="0 0 100 40" className="h-8 text-[#9BABAB]" fill="currentColor">
      <text x="10" y="28" fontSize="14" fontWeight="bold">BUDGET</text>
    </svg>
  )
}

// Am adaptat intensitatea culorilor de brand pentru a se îmbina fin cu tema dark (#06141B)
const brandColors: Record<Brand, string> = {
  'dahua-imou': 'from-[#FF4B04]/10 to-transparent border-[#FF4B04]/20 hover:border-[#FF4B04]/40 hover:shadow-[#FF4B04]/10',
  'uniview': 'from-blue-500/10 to-transparent border-blue-500/20 hover:border-blue-500/40 hover:shadow-blue-500/10',
  'hikvision': 'from-red-500/10 to-transparent border-red-500/20 hover:border-red-500/40 hover:shadow-red-500/10',
  'china': 'from-[#9BABAB]/10 to-transparent border-[#9BABAB]/20 hover:border-[#9BABAB]/40 hover:shadow-[#9BABAB]/10'
}

export function BrandCard({ brand }: BrandCardProps) {
  const info = brandInfo[brand]
  const productCount = products.filter(p => p.brand === brand).length
  
  // Inițializăm traducerile din fișierele locale JSON
  const t = useTranslations('brandCard')

  return (
    <Link href={`/branduri/${brand}`}>
      {/* Containerul principal folosește efectul de sticlă (backdrop-blur) și paleta dark */}
      <Card className={`overflow-hidden group transition-all duration-300 hover:-translate-y-2 bg-[#06141B]/80 bg-gradient-to-br ${brandColors[brand]} border backdrop-blur-md shadow-lg`}>
        
        <div className="aspect-[4/3] relative flex items-center justify-center p-6 border-b border-[#9BABAB]/10">
          <div className="text-center">
            <div className="mb-4 flex justify-center">{brandLogos[brand]}</div>
            {/* Culoarea de titlu preluată din Hero (#CCD0CF) */}
            <span className="text-2xl font-bold text-[#CCD0CF]">{info.name}</span>
          </div>
        </div>

        <CardContent className="p-5 bg-[#9BABAB]/5">
          {/* Culoarea pentru descriere preluată din Hero (#9BABAB) */}
          <p className="text-sm text-[#9BABAB] mb-4 line-clamp-2 leading-relaxed">
            {info.description}
          </p>
          
          <div className="flex items-center justify-between">
            {/* Subtext discret (#4A5C6A) */}
            <span className="text-xs text-[#4A5C6A] font-medium">
              {productCount} {t('products')}
            </span>
            {/* Butonul de "Vezi produse" preia culoarea de accent portocalie */}
            <span className="text-sm text-[#FF4B04] flex items-center gap-1 group-hover:gap-2 transition-all font-medium">
              {t('viewProducts')}
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </CardContent>

      </Card>
    </Link>
  )
}