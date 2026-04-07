import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Phone } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'

// Definim brandurile valide
export type Brand = 'hikvision' | 'dahua'
const validBrands: Brand[] = ['hikvision', 'dahua']

// Generăm rutele statice pentru o încărcare mai rapidă
export function generateStaticParams() {
  return validBrands.map((brand) => ({ brand }))
}

interface BrandPageProps {
  // În arhitectura cu i18n, params include și 'locale'
  params: Promise<{ locale: string; brand: string }>
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { locale, brand } = await params
  
  if (!validBrands.includes(brand as Brand)) {
    notFound()
  }

  const brandKey = brand as Brand
  
  // Încărcăm traducerile specifice paginii și pe cele ale brand-card-ului pentru descrieri
  const t = await getTranslations({ locale, namespace: 'brandPage' })
  const tBrand = await getTranslations({ locale, namespace: 'brandCard' })

  // Detaliile brandului
  const brandDetails = {
    hikvision: {
      name: 'Hikvision',
      logoUrl: '/images/hikvision-logo.png'
    },
    dahua: {
      name: 'Dahua',
      logoUrl: '/images/dahua-logo.png'
    }
  }
  const info = brandDetails[brandKey]

  // MOCK: Simulăm câteva produse pentru acest brand. (Vei înlocui cu date din Supabase)
  const allMockProducts = [
    { id: 1, name: 'Cameră IP 4MP', price: 1200, brand: 'hikvision', image: '/placeholder.jpg' },
    { id: 2, name: 'NVR 8 Canale', price: 850, brand: 'hikvision', image: '/placeholder.jpg' },
    { id: 3, name: 'Sistem Supraveghere', price: 4500, brand: 'dahua', image: '/placeholder.jpg' },
    { id: 4, name: 'Cameră PTZ', price: 3200, brand: 'dahua', image: '/placeholder.jpg' },
  ]
  const brandProducts = allMockProducts.filter(p => p.brand === brandKey)

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EC]">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-12">
        {/* Page Header - Adaptat la Light Premium */}
        <section className="relative py-16 md:py-24 overflow-hidden bg-white/50 border-b border-[#7A8CA5]/10 backdrop-blur-sm">
          {/* Fundal decorativ subtil */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F26A1B]/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#7A8CA5]/10 rounded-full blur-3xl -z-10" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            
            {/* Buton Înapoi */}
            <Link 
              href={`/${locale}/branduri`} 
              className="inline-flex items-center text-[#7A8CA5] hover:text-[#F26A1B] font-bold transition-colors mb-10 group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              {t('backToBrands')}
            </Link>

            {/* Logo Brand */}
            <div className="relative w-64 h-24 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-[#7A8CA5]/15">
               <Image 
                 src={info.logoUrl} 
                 alt={`Logo ${info.name}`} 
                 fill 
                 className="object-contain p-2"
                 priority
               />
            </div>
            
            {/* Titlu și Descriere */}
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-[#0F2A4A] tracking-tight">
              {info.name}
            </h1>
            <p className="text-[#7A8CA5] max-w-3xl leading-relaxed text-lg font-medium">
              {tBrand(`${brandKey}Desc`)}
            </p>
          </div>
        </section>

        

        {/* CTA Section */}
        <section className="py-20 mt-10 bg-[#0F2A4A] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2A4A] to-[#163861]"></div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              {t('ctaTitleBefore')} <span className="text-[#F26A1B]">{t('ctaTitleHighlight')}</span>
            </h2>
            <p className="text-[#F5F2EC]/80 mb-10 max-w-2xl mx-auto leading-relaxed text-lg font-medium">
              {t('ctaDesc')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <a href="tel:+37368123456" className="w-full sm:w-auto">
                <Button size="lg" className="w-full rounded-full bg-[#F26A1B] text-white hover:bg-[#C24C0F] font-extrabold px-8 h-14 text-base transition-transform hover:-translate-y-1 shadow-lg">
                  <Phone className="h-5 w-5 mr-2 stroke-[2.5px]" />
                  {t('callNow')}
                </Button>
              </a>
              <Link href={`/${locale}/contact`} className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full rounded-full border-2 border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white font-extrabold px-8 h-14 text-base transition-transform hover:-translate-y-1">
                  {t('sendMessage')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}