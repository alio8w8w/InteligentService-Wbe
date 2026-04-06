"use client"

import Link from 'next/link'
import { Phone, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/hero-section'
import { BrandComp } from '@/components/brand-comp' // Importăm noul component
import { useTranslations, useLocale } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('homePage')
  const locale = useLocale()

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EC]">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />

        {/* Componenta de Branduri (extrasă) */}
        <BrandComp />

        {/* Why Us Section */}
        <section className="py-24 bg-white/60 border-y border-[#7A8CA5]/15 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F2A4A] mb-8 tracking-tight">
                  {t('whyUs.title')} <span className="text-[#F26A1B]">{t('whyUs.titleHighlight')}</span>
                </h2>
                <ul className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <li key={item} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#7A8CA5]/15 shadow-sm">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#F26A1B]/10 flex items-center justify-center mt-0.5">
                        <Check className="h-4 w-4 stroke-[3px] text-[#F26A1B]" />
                      </div>
                      <span className="text-[#0F2A4A] font-bold">{t(`whyUs.item${item}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="bg-[#0F2A4A] rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#F26A1B]/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#7A8CA5]/20 rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10 text-7xl md:text-8xl font-extrabold text-[#F26A1B] mb-4">500+</div>
                  <div className="relative z-10 text-xl font-bold text-[#F5F2EC]">{t('whyUs.stat')}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#F5F2EC]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-[#F26A1B] to-[#C24C0F] rounded-3xl p-10 md:p-16 text-center shadow-[0_20px_50px_-15px_rgba(194,76,15,0.5)]">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                {t('cta.title')} <span className="text-[#F5F2EC]/90">{t('cta.titleHighlight')}</span>
              </h2>
              <p className="text-white/90 font-medium mb-10 max-w-xl mx-auto text-lg">
                {t('cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-5">
                <a href="tel:+37368123456" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full rounded-full bg-white text-[#C24C0F] hover:bg-[#F5F2EC] font-extrabold h-14 px-8 text-base shadow-lg hover:-translate-y-1 transition-all">
                    <Phone className="h-5 w-5 mr-2 stroke-[2.5px]" />
                    {t('cta.phone')}
                  </Button>
                </a>
                <Link href={`/${locale}/contact`} className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full rounded-full border-2 border-white/40 bg-transparent text-white hover:bg-white/10 hover:border-white font-extrabold h-14 px-8 text-base hover:-translate-y-1 transition-all">
                    {t('cta.form')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}