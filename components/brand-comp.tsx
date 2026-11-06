"use client"

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Package, LayoutGrid } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
// 1. Am modificat importul aici:
import { createClient } from '@/lib/utils'

export type Brand = 'hikvision' | 'dahua'

// AM ȘTERS INIȚIALIZAREA GLOBALĂ DE AICI

const brands: {
  id: Brand
  logoUrl: string
  bgImage: string
  bgImageMobile: string
  specs: string[]
  dark: boolean
}[] = [
  {
    id: 'hikvision',
    logoUrl: '/images/hikvision-logo.png',
    bgImage: '/images/products_02.jpg',
    bgImageMobile: '/images/products_02-mobil.jpg',
    specs: ['4K Ultra HD', 'AI Deep Learning', 'IR 60m', 'H.265+'],
    dark: true,
  },
  {
    id: 'dahua',
    logoUrl: '/images/dahua-logo.png',
    bgImage: '/images/back2.png',
    bgImageMobile: '/images/back2-mobil.png',
    specs: ['Perimeter Protection', 'Face Recognition', 'Starlight', 'SMD Plus'],
    dark: false,
  },
]

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  
  return { ref, visible }
}

function BrandPanel({ brand, count, reverse }: { brand: typeof brands[number], count: number, reverse: boolean }) {
  const t = useTranslations('brandShowcase')
  const locale = useLocale()
  const { ref, visible } = useReveal()

  return (
    <div ref={ref} className="relative overflow-hidden" style={{ minHeight: '420px', background: brand.dark ? '#0F2A4A' : '#F5F2EC' }}>
      <div className="absolute inset-0 z-0">
        <Image src={brand.bgImageMobile} alt="" fill className="object-cover md:hidden" style={{ opacity: brand.dark ? 0.12 : 0.2 }} />
        <Image src={brand.bgImage} alt="" fill className="object-cover hidden md:block" style={{ opacity: brand.dark ? 0.12 : 0.2 }} />
      </div>

      <div className={`relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 lg:gap-16 py-14 px-6 ${reverse ? 'md:flex-row-reverse' : ''}`}>
        <div className="flex-1 text-left" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : `translateX(${reverse ? '40px' : '-40px'})`, transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1) 0.2s' }}>
          
          <div className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-lg mb-5 bg-[#F26A1B]/15 border border-[#F26A1B]/30 text-[#F26A1B] uppercase tracking-wider">
            <Package size={13} />
            {count} {t('products')}
          </div>

          <div className="mb-5 flex">
            <div className="relative px-5 py-3 rounded-xl bg-[#F26A1B]/20 backdrop-blur-sm border border-[#F26A1B]/40 flex items-center justify-center">
              <div className="relative w-36 h-9">
                <Image src={brand.logoUrl} alt={brand.id} fill className="object-contain brightness-0 invert" />
              </div>
            </div>
          </div>

          <h3 className="font-black leading-tight tracking-tighter mb-4" style={{ fontSize: 'clamp(22px, 3vw, 34px)', color: brand.dark ? 'white' : '#0F2A4A' }}>
            {t(`${brand.id}Title`)}
          </h3>

          <p className="text-base font-medium leading-relaxed mb-7" style={{ color: brand.dark ? 'rgba(255,255,255,0.5)' : '#4A5B75', maxWidth: '480px' }}>
            {t(`${brand.id}Desc`)}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {brand.specs.map((spec) => (
              <span key={spec} className={`text-xs font-black px-3.5 py-2 rounded-lg border transition-all ${brand.dark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-[#0F2A4A]/5 border-[#0F2A4A]/10 text-[#0F2A4A]'}`}>
                {spec}
              </span>
            ))}
          </div>

          <Link href={`/${locale}/branduri/${brand.id}`} className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-black text-white transition-all hover:scale-105 hover:shadow-orange-500/40 active:scale-95 shadow-xl shadow-orange-900/30 text-base" style={{ background: 'linear-gradient(135deg,#F26A1B,#d45a10)' }}>
            {t(`${brand.id}Cta`)}
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export function BrandShowcase() {
  const t = useTranslations('brandShowcase')
  const locale = useLocale()
  const { ref: headerRef, visible: headerVisible } = useReveal()
  const [productCounts, setProductCounts] = useState<Record<string, number>>({ hikvision: 0, dahua: 0 })

  // 2. Inițializăm clientul aici:
  const supabase = createClient()

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const counts: Record<string, number> = {}
        for (const brand of brands) {
          const { count } = await supabase.from('produse').select('*', { count: 'exact', head: true }).ilike('brand', brand.id)
          counts[brand.id] = count || 0
        }
        setProductCounts(counts)
      } catch (err) { 
        console.error(err) 
      }
    }
    fetchCounts()
  }, [supabase]) // Am adăugat supabase la dependențe

  return (
    <section className="bg-[#0F2A4A]">
      <div className="relative overflow-hidden pt-12 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10" ref={headerRef}>
          
          <div style={{ transform: headerVisible ? 'translateY(0)' : 'translateY(30px)', opacity: headerVisible ? 1 : 0, transition: 'all 0.8s ease' }} className="w-full lg:w-1/2">
            <div className="flex items-center gap-2.5 text-[#F26A1B] text-xs font-black uppercase tracking-[0.3em] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#F26A1B] animate-pulse" />
              {t('partnerTag')}
            </div>

            <h2 className="font-black text-white tracking-tighter leading-[1.1] mb-5" style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}>
              {t('sectionTitle')} <br className="hidden sm:block"/><span className="text-[#F26A1B]">{t('sectionTitleAccent')}</span>
            </h2>

            <p className="text-base font-medium text-[#7A8CA5] max-w-md border-l-2 border-[#F26A1B]/50 pl-4 mb-8">
              {t('sectionSubtitle')}
            </p>

            <Link href={`/${locale}/branduri`} className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-[#0F2A4A] font-black text-base hover:bg-[#F26A1B] hover:text-white transition-all shadow-lg active:scale-95">
              <LayoutGrid size={22} className="group-hover:rotate-90 transition-transform duration-500 text-[#F26A1B] group-hover:text-white" />
              {t('discoverBrands')}
            </Link>
          </div>

          <div style={{ transform: headerVisible ? 'translateY(0)' : 'translateY(30px)', opacity: headerVisible ? 1 : 0, transition: 'all 0.8s ease 0.2s' }} className="w-full lg:w-1/2 flex flex-col sm:flex-row justify-start lg:justify-end items-center gap-4 lg:gap-6 mt-8 lg:mt-0">
            <Link href={`/${locale}/branduri/dahua`} className="relative w-full sm:w-56 h-28 lg:h-36 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:shadow-xl hover:shadow-white/5 group">
              <Image src="/images/dahua-logo.png" alt="Dahua" fill className="object-contain p-6 lg:p-8 brightness-0 invert group-hover:scale-105 transition-transform duration-300" />
            </Link>
            <Link href={`/${locale}/branduri/hikvision`} className="relative w-full sm:w-56 h-28 lg:h-36 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:shadow-xl hover:shadow-white/5 group">
              <Image src="/images/hikvision-logo.png" alt="Hikvision" fill className="object-contain p-6 lg:p-8 brightness-0 invert group-hover:scale-105 transition-transform duration-300" />
            </Link>
          </div>

        </div>
      </div>

      <div className="relative w-full overflow-hidden" style={{ height: '64px' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #0F2A4A 0%, #0a2040 60%, #0d2545 100%)' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: '60px', height: '2px', background: 'linear-gradient(to right, transparent, rgba(242,106,27,0.5), transparent)', borderRadius: '1px' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(242,106,27,0.6)', boxShadow: '0 0 10px rgba(242,106,27,0.3)' }} />
      </div>

      {brands.map((brand, i) => (
        <div key={brand.id} className="relative">
          <BrandPanel brand={brand} count={productCounts[brand.id]} reverse={i % 2 !== 0} />
        </div>
      ))}
    </section>
  )
}