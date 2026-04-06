"use client"

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer' 
import { BrandCard, type Brand } from '@/components/brand-card'
import { useTranslations } from 'next-intl'

// Folosim exact cele 2 branduri din arhitectura ta curentă
const brands: Brand[] = ['hikvision', 'dahua']

export default function BrandsPage() {
  // Inițializăm corect hook-ul de traducere pentru această pagină
  const t = useTranslations('brandsPage')

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EC]">
      <Navbar />
      
      {/* Adăugăm padding-top pentru a nu se ascunde sub Navbar-ul fixed */}
      <main className="flex-1 pt-32 pb-12">
        
        {/* Page Header - Stilizat conform paletei Light Premium */}
        <section className="relative py-12 md:py-16 overflow-hidden">
          {/* Elementele de fundal decorative bluroase pentru un aspect modern */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7A8CA5]/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#F26A1B]/5 rounded-full blur-3xl -z-10" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#0F2A4A] mb-6 tracking-tight">
              {t('title')} <span className="text-[#F26A1B]">{t('titleHighlight')}</span>
            </h1>
            <p className="text-[#7A8CA5] max-w-2xl mx-auto leading-relaxed text-lg font-medium">
              {t('description')}
            </p>
          </div>
        </section>

        {/* Brands Grid - Limităm lățimea maximă pentru a arăta bine cu doar 2 carduri */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
              {brands.map((brand) => (
                <BrandCard key={brand} brand={brand} />
              ))}
            </div>
          </div>
        </section>

        {/* Info Section - Tradus și integrat în design */}
        <section className="py-20 mt-12 bg-white/60 border-y border-[#7A8CA5]/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F2A4A] mb-8 tracking-tight">
                {t('infoTitleBefore')} <span className="text-[#F26A1B]">{t('infoTitleHighlight')}</span>
              </h2>
              <div className="space-y-6 text-[#7A8CA5] text-lg font-medium leading-relaxed">
                <p>{t('infoDesc1')}</p>
                <p>{t('infoDesc2')}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  )
}