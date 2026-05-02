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
  cameraImage: string      
  specs: string[]
  dark: boolean            
}[] = [
  {
    id: 'hikvision',
    logoUrl: '/images/hikvision-logo.png',
    bgImage: '/images/products_02.jpg',
    cameraImage: '/images/hikvision-brand.png',
    specs: ['4K Ultra HD', 'AI Deep Learning', 'IR 60m', 'H.265+'],
    dark: true,
  },
  {
    id: 'dahua',
    logoUrl: '/images/dahua-logo.png',
    bgImage: '/images/brand-back.png',
    cameraImage: '/images/dahua-brand.png',
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
    <div ref={ref} className="relative overflow-hidden" style={{ minHeight: '520px', background: brand.dark ? '#0F2A4A' : '#F5F2EC' }}>
      <div className="absolute inset-0 z-0">
        <Image src={brand.bgImage} alt="" fill className="object-cover" style={{ opacity: brand.dark ? 0.15 : 0.22 }} />
      </div>

      <div className={`relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-20 py-16 px-6 ${reverse ? 'md:flex-row-reverse' : ''}`}>
        
        {/* Imagine Produs (+20% față de anterior) */}
        <div className="flex-shrink-0 relative"
          style={{
            width: 'clamp(250px, 35vw, 420px)', 
            height: 'clamp(280px, 40vw, 450px)',
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            opacity: visible ? 1 : 0,
            transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <Image src={brand.cameraImage} alt={brand.id} fill className="object-contain" 
            style={{ filter: brand.dark ? 'drop-shadow(0 25px 60px rgba(0,0,0,0.8))' : 'drop-shadow(0 20px 40px rgba(15,42,74,0.3))' }} />
        </div>

        {/* Text Content aliniat la container */}
        <div className="flex-1 text-left" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : `translateX(${reverse ? '30px' : '-30px'})`, transition: 'all 1s ease 0.2s' }}>
          
          {/* Badge Stoc */}
          <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-6 bg-[#F26A1B]/10 border border-[#F26A1B]/20 text-[#F26A1B]">
            <Package size={14} />
            {count} {t('products')}
          </div>

          {/* Logo pe Dreptunghi Semitransparent Portocaliu */}
          <div className="mb-6 flex">
            <div className="relative p-4 rounded-xl bg-[#F26A1B]/20 backdrop-blur-md border border-[#F26A1B]/30 flex items-center justify-center">
               <div className="relative w-40 h-10 transform scale-125"> {/* +30% size */}
                  <Image src={brand.logoUrl} alt={brand.id} fill className="object-contain brightness-0 invert" />
               </div>
            </div>
          </div>

          <h3 className="font-black leading-tight tracking-tight mb-4" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: brand.dark ? 'white' : '#0F2A4A' }}>
            {t(`${brand.id}Title`)}
          </h3>

          <p className="text-base md:text-lg font-medium leading-relaxed mb-8" style={{ color: brand.dark ? 'rgba(255,255,255,0.6)' : '#4A5B75', maxWidth: '520px' }}>
            {t(`${brand.id}Desc`)}
          </p>

          {/* Specificații mult mai vizibile */}
          <div className="flex flex-wrap gap-3 mb-10">
            {brand.specs.map((spec) => (
              <span key={spec} className={`text-xs md:text-sm font-bold px-4 py-2 rounded-lg border shadow-sm ${brand.dark ? 'bg-white/10 border-white/20 text-white' : 'bg-[#0F2A4A]/5 border-[#0F2A4A]/10 text-[#0F2A4A]'}`}>
                {spec}
              </span>
            ))}
          </div>

          <Link href={`/${locale}/branduri/${brand.id}`} className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-orange-600/30" style={{ background: 'linear-gradient(135deg,#F26A1B,#E85A0D)' }}>
            {t(`${brand.id}Cta`)}
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
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
    <section>
      {/* Header Secțiune */}
      <div className="relative overflow-hidden py-20 px-6" style={{ background: '#0F2A4A' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8" ref={headerRef}>
          <div style={{ transform: headerVisible ? 'translateY(0)' : 'translateY(30px)', opacity: headerVisible ? 1 : 0, transition: 'all 0.8s ease' }}>
            <div className="flex items-center gap-2 text-[#F26A1B] text-sm font-bold uppercase tracking-[0.2em] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#F26A1B] animate-pulse" />
              {t('partnerTag')}
            </div>
            <h2 className="font-black text-white tracking-tight leading-none mb-4" style={{ fontSize: 'clamp(32px, 6vw, 56px)' }}>
              {t('sectionTitle')} <br/><span className="text-[#F26A1B]">{t('sectionTitleAccent')}</span>
            </h2>
            <p className="text-lg font-medium text-white/50 max-w-lg">
              {t('sectionSubtitle')}
            </p>
          </div>
          
          <Link href={`/${locale}/branduri`} className="group flex items-center gap-4 px-10 py-5 rounded-2xl bg-white text-[#0F2A4A] font-black text-lg hover:bg-[#F26A1B] hover:text-white transition-all shadow-2xl active:scale-95 transform md:translate-y-4">
            <LayoutGrid size={24} className="group-hover:rotate-90 transition-transform duration-500" />
            {t('discoverBrands')}
          </Link>
        </div>
      </div>

      {/* BLOC VITAL DE TRECERE (Seamless bridge) */}
      <div className="h-24 w-full relative z-20" style={{ background: 'linear-gradient(to bottom, #0F2A4A, #0F2A4A 20%, transparent 100%)', marginTop: '-2px' }}>
         <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-right from-transparent via-[#F26A1B]/40 to-transparent" />
      </div>

      {/* Brand panels */}
      {brands.map((brand, i) => (
        <div key={brand.id} className="relative">
          <BrandPanel brand={brand} count={productCounts[brand.id]} reverse={i % 2 !== 0} />
          {i === 0 && (
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F5F2EC] to-transparent z-20 pointer-events-none" />
          )}
        </div>
      ))}
    </section>
  )
}