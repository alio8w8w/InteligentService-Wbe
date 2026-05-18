"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { ArrowRight, Film, Image as ImageIcon, Loader2 } from "lucide-react"
// IMPORTĂM HOOK-URILE PENTRU TRADUCERI
import { useTranslations, useLocale } from 'next-intl'

type GalleryItem = {
  id: string
  type: "image" | "video"
  url: string
  position: number
}

export function GalleryPreview() {
  // INIȚIALIZĂM TRADUCERILE
  const t = useTranslations('galleryPreview')
  const locale = useLocale()

  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase
          .from("gallery")
          .select("*")
          .order("position", { ascending: true })
          .limit(16)

        if (error) {
          console.error("Eroare la extragerea galeriei:", error)
        } else if (data) {
          setItems(data)
        }
      } catch (err) {
        console.error("Eroare neașteptată:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  // 1. STAREA DE ÎNCĂRCARE
  if (loading) {
    return (
      <section className="py-20 px-6 lg:px-12 bg-[#F5F2EC] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#F26A1B] mb-4" size={40} />
        <p className="text-[#0F2A4A] font-bold text-lg">{t('loading')}</p>
      </section>
    )
  }

  // 2. STAREA GOALĂ (Nu sunt poze)
  if (items.length === 0) {
    return (
      <section className="py-20 px-6 lg:px-12 bg-[#F5F2EC] flex flex-col items-center justify-center text-center">
        <div className="bg-white p-6 rounded-3xl border border-[#7A8CA5]/20 shadow-sm max-w-md w-full">
          <ImageIcon className="text-[#7A8CA5] mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-[#0F2A4A] mb-2">{t('emptyTitle')}</h2>
          <p className="text-[#7A8CA5] text-sm">
            {t('emptyDesc')}
          </p>
        </div>
      </section>
    )
  }

  // 3. STAREA DE SUCCES (Afișează imaginile)
  return (
    <section className="py-20 px-6 lg:px-12 bg-[#F5F2EC]">
      <div className="max-w-7xl mx-auto">
        
        {/* Titlu și Subtitlu */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F2A4A] tracking-tight mb-3">
            {t('title')}
          </h2>
          <p className="text-[#7A8CA5] font-medium max-w-xl mx-auto text-base">
            {t('subtitle')}
          </p>
        </div>

        {/* Grila tip Masonry (Stil Pinterest) */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {items.map((item) => (
            <Link 
              key={item.id} 
              // Adăugăm locale în link ca să păstrăm limba curentă
              href={`/${locale}/galerie?imageId=${item.id}`} 
              className="block w-full break-inside-avoid overflow-hidden rounded-2xl group relative cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 border border-white"
            >
              {item.type === "image" ? (
                <img 
                  src={item.url} 
                  alt="Proiect" 
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
              ) : (
                <div className="w-full relative">
                  <video src={item.url} className="w-full h-auto object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                    <Film className="text-white drop-shadow-md" size={32} />
                  </div>
                </div>
              )}

              {/* Efect de hover cu iconiță */}
              <div className="absolute inset-0 bg-[#0F2A4A]/0 group-hover:bg-[#0F2A4A]/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/90 p-3 rounded-full text-[#F26A1B] transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-75 shadow-lg">
                  <ImageIcon size={24} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Butonul 'Vezi mai multe' */}
        <div className="mt-16 flex justify-center">
          <Link 
            // Adăugăm locale în link
            href={`/${locale}/galerie`}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white text-sm transition-all active:scale-95 hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg,#F26A1B,#d45a10)' }}
          >
            {t('viewAll')}
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  )
}