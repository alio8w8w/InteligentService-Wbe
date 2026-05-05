"use client"

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Package, LayoutGrid } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@supabase/supabase-js'

export type Brand = 'hikvision' | 'dahua'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const brands: {
  id: Brand
  logoUrl: string
  bgImage: string
  specs: string[]
  dark: boolean
}[] = [
  {
    id: 'hikvision',
    logoUrl: '/images/hikvision-logo.png',
    bgImage: '/images/products_02.jpg',
    specs: ['4K Ultra HD', 'AI Deep Learning', 'IR 60m', 'H.265+'],
    dark: true,
  },
  {
    id: 'dahua',
    logoUrl: '/images/dahua-logo.png',
    bgImage: '/images/back2.png',
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
        <Image src={brand.bgImage} alt="" fill className="object-cover" style={{ opacity: brand.dark ? 0.12 : 0.2 }} />
      </div>

      <div className={`relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 lg:gap-16 py-14 px-6 ${reverse ? 'md:flex-row-reverse' : ''}`}>

        <div className="flex-1 text-left" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : `translateX(${reverse ? '40px' : '-40px'})`, transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1) 0.2s' }}>

          {/* Badge Produse */}
          <div className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-lg mb-5 bg-[#F26A1B]/15 border border-[#F26A1B]/30 text-[#F26A1B] uppercase tracking-wider">
            <Package size={13} />
            {count} {t('products')}
          </div>

          {/* Logo */}
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

          {/* Specificații */}
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

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const counts: Record<string, number> = {}
        for (const brand of brands) {
          const { count } = await supabase.from('produse').select('*', { count: 'exact', head: true }).ilike('brand', brand.id)
          counts[brand.id] = count || 0
        }
        setProductCounts(counts)
      } catch (err) { console.error(err) }
    }
    fetchCounts()
  }, [])

  return (
    <section className="bg-[#0F2A4A]">
      {/* Header Secțiune */}
      <div className="relative overflow-hidden pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-7" ref={headerRef}>
          <div style={{ transform: headerVisible ? 'translateY(0)' : 'translateY(30px)', opacity: headerVisible ? 1 : 0, transition: 'all 0.8s ease' }}>

            <div className="flex items-center gap-2.5 text-[#F26A1B] text-xs font-black uppercase tracking-[0.3em] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#F26A1B] animate-pulse" />
              {t('partnerTag')}
            </div>

            <h2 className="font-black text-white tracking-tighter leading-[0.9] mb-4" style={{ fontSize: 'clamp(28px, 5.5vw, 50px)' }}>
              {t('sectionTitle')} <br /><span className="text-[#F26A1B]">{t('sectionTitleAccent')}</span>
            </h2>

            <p className="text-base font-medium text-white/40 max-w-xl border-l-2 border-[#F26A1B]/30 pl-4">
              {t('sectionSubtitle')}
            </p>
          </div>

          <Link href={`/${locale}/branduri`} className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-[#0F2A4A] font-black text-base hover:bg-[#F26A1B] hover:text-white transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] active:scale-95 transform md:-translate-y-3">
            <LayoutGrid size={22} className="group-hover:rotate-90 transition-transform duration-500 text-[#F26A1B] group-hover:text-white" />
            {t('discoverBrands')}
          </Link>
        </div>
      </div>

      {/* Tranziție moale */}
      <div className="relative w-full overflow-hidden" style={{ height: '64px' }}>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, #0F2A4A 0%, #0a2040 60%, #0d2545 100%)'
        }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{
          width: '60px',
          height: '2px',
          background: 'linear-gradient(to right, transparent, rgba(242,106,27,0.5), transparent)',
          borderRadius: '1px',
        }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: 'rgba(242,106,27,0.6)',
          boxShadow: '0 0 10px rgba(242,106,27,0.3)',
        }} />
      </div>

      {/* Brand panels */}
      {brands.map((brand, i) => (
        <div key={brand.id} className="relative">
          <BrandPanel brand={brand} count={productCounts[brand.id]} reverse={i % 2 !== 0} />
        </div>
      ))}
    </section>
  )
}