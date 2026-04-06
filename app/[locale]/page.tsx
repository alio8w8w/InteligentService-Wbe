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