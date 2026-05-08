"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@supabase/supabase-js'
import { ArrowRight, X, ChevronLeft, ChevronRight, Images, Play } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type GalleryItem = {
  id: string
  url: string
  type: 'image' | 'video'
  position: number
  created_at: string
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

export function GalleryPreview() {
  const t = useTranslations('gallery')
  const locale = useLocale()
  const { ref: headerRef, visible: headerVisible } = useReveal()
  const { ref: gridRef, visible: gridVisible } = useReveal()

  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 })

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('gallery')
        .select('*')
        .order('position', { ascending: true })
        .limit(12)
      setItems((data as GalleryItem[]) || [])
      setLoading(false)
    }
    fetch()
  }, [])

  const openLightbox = (index: number) => setLightbox({ open: true, index })
  const closeLightbox = useCallback(() => setLightbox({ open: false, index: 0 }), [])
  const prev = useCallback(() => setLightbox(l => ({ ...l, index: (l.index - 1 + items.length) % items.length })), [items.length])
  const next = useCallback(() => setLightbox(l => ({ ...l, index: (l.index + 1) % items.length })), [items.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightbox.open) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox.open, closeLightbox, prev, next])

  // Masonry-style layout: assign items to columns
  const columns = 3
  const columnItems: GalleryItem[][] = Array.from({ length: columns }, () => [])
  items.forEach((item, i) => columnItems[i % columns].push(item))

  const currentItem = items[lightbox.index]

  return (
    <section className="bg-[#F5F2EC] py-16 px-6">
      {/* Header */}
      <div
        ref={headerRef}
        className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.7s ease',
        }}
      >
        <div>
          <div className="flex items-center gap-2.5 text-[#F26A1B] text-xs font-black uppercase tracking-[0.3em] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#F26A1B] animate-pulse" />
            {t('previewTag')}
          </div>
          <h2 className="font-black text-[#0F2A4A] tracking-tighter leading-[0.9] mb-3" style={{ fontSize: 'clamp(26px, 4vw, 42px)' }}>
            {t('previewTitle')}<br />
            <span className="text-[#F26A1B]">{t('previewTitleAccent')}</span>
          </h2>
          <p className="text-sm font-medium text-[#4A5B75] max-w-md border-l-2 border-[#F26A1B]/40 pl-3">
            {t('previewSubtitle')}
          </p>
        </div>

        <Link
          href={`/${locale}/galerie`}
          className="group flex items-center gap-3 px-7 py-3.5 rounded-xl bg-[#0F2A4A] text-white font-black text-sm hover:bg-[#F26A1B] transition-all shadow-lg active:scale-95 shrink-0"
        >
          <Images size={18} className="text-[#F26A1B] group-hover:text-white transition-colors" />
          {t('viewAll')}
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid masonry */}
      <div
        ref={gridRef}
        className="max-w-6xl mx-auto"
      >
        {loading ? (
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-[#0F2A4A]/10 animate-pulse" style={{ height: i % 3 === 0 ? '240px' : '180px' }} />
            ))}
          </div>
        ) : (
          <div className="flex gap-3">
            {columnItems.map((col, ci) => (
              <div key={ci} className="flex flex-col gap-3 flex-1">
                {col.map((item, ii) => {
                  const globalIndex = items.indexOf(item)
                  const tall = (ci + ii) % 3 === 0
                  return (
                    <div
                      key={item.id}
                      className="relative overflow-hidden rounded-xl cursor-pointer group"
                      style={{
                        height: tall ? '260px' : '185px',
                        opacity: gridVisible ? 1 : 0,
                        transform: gridVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
                        transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${(globalIndex * 60)}ms`,
                      }}
                      onClick={() => openLightbox(globalIndex)}
                    >
                      {item.type === 'video' ? (
                        <>
                          <video
                            src={item.url}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            muted
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-[#F26A1B] flex items-center justify-center shadow-lg">
                              <Play size={20} className="text-white ml-1" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <Image
                          src={item.url}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-[#0F2A4A]/0 group-hover:bg-[#0F2A4A]/30 transition-all duration-300 rounded-xl" />
                      <div className="absolute inset-0 border-2 border-[#F26A1B]/0 group-hover:border-[#F26A1B]/60 transition-all duration-300 rounded-xl" />
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox.open && currentItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            onClick={closeLightbox}
          >
            <X size={20} />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-[#F26A1B] flex items-center justify-center text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); prev() }}
          >
            <ChevronLeft size={22} />
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-[#F26A1B] flex items-center justify-center text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); next() }}
          >
            <ChevronRight size={22} />
          </button>

          <div
            className="relative max-w-5xl max-h-[85vh] w-full mx-8"
            onClick={(e) => e.stopPropagation()}
          >
            {currentItem.type === 'video' ? (
              <video
                src={currentItem.url}
                controls
                autoPlay
                className="w-full max-h-[85vh] rounded-xl object-contain"
              />
            ) : (
              <div className="relative w-full" style={{ maxHeight: '85vh', aspectRatio: '16/9' }}>
                <Image
                  src={currentItem.url}
                  alt=""
                  fill
                  className="object-contain rounded-xl"
                  sizes="90vw"
                />
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs font-medium">
            {lightbox.index + 1} / {items.length}
          </div>
        </div>
      )}
    </section>
  )
}