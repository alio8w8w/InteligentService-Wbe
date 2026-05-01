"use client"

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Package } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

export type Brand = 'hikvision' | 'dahua'

interface BrandCardProps {
  brand: Brand
  logoUrl: string
  productCount: number 
}

export function BrandCard({ brand, logoUrl, productCount }: BrandCardProps) {
  const t = useTranslations('brandCard')
  const locale = useLocale()

  const brandNames = {
    hikvision: 'Hikvision',
    dahua: 'Dahua'
  }

  const brandRoute = `/${locale}/branduri/${brand}`

  return (
    <Link href={brandRoute} className="block group h-full">
      <div className="flex flex-col h-full bg-white rounded-[2rem] border border-[#7A8CA5]/15 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:border-[#F26A1B]/30 overflow-hidden relative">
        
        {/* Accent color bar la hover */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#F26A1B] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out z-10" />

        {/* Zona Logo-ului */}
        <div className="relative h-40 w-full bg-[#f8fafc] flex items-center justify-center p-8 border-b border-[#7A8CA5]/5 group-hover:bg-white transition-colors duration-500">
          <div className="relative w-full h-full max-w-[200px] flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
             <Image 
                src={logoUrl} 
                alt={`Logo ${brandNames[brand]}`} 
                fill 
                className="object-contain filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
             />
          </div>
        </div>
        
        {/* Conținutul Cardului */}
        <div className="flex flex-col flex-grow p-8">
          <div className="mb-4">
            <h3 className="text-2xl font-extrabold text-[#0F2A4A] tracking-tight group-hover:text-[#F26A1B] transition-colors">
              {brandNames[brand]}
            </h3>
          </div>
          
          <p className="text-[#7A8CA5] mb-8 leading-relaxed font-medium flex-grow">
            {t(`${brand}Desc`)}
          </p>
          
          {/* Footer Card */}
          <div className="flex items-center justify-between pt-5 border-t border-[#7A8CA5]/10 mt-auto">
            
            {/* Contor Produse Reale */}
            <div className="flex items-center gap-2 text-[#0F2A4A] bg-[#f8fafc] px-3 py-1.5 rounded-lg border border-[#7A8CA5]/10">
              <Package size={16} className="text-[#7A8CA5]" />
              <span className="text-sm font-black">
                {productCount} <span className="text-[#7A8CA5] font-semibold text-xs ml-0.5">{productCount === 1 ? 'Produs' : 'Produse'}</span>
              </span>
            </div>
            
            {/* Buton "Vezi" */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f8fafc] text-[#7A8CA5] group-hover:bg-[#F26A1B] group-hover:text-white transition-all duration-300">
              <ArrowRight className="h-5 w-5 stroke-[2.5px] transform group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

      </div>
    </Link>
  )
}