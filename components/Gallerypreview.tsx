"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { ArrowRight, Film, Image as ImageIcon, Loader2 } from "lucide-react"
import { useTranslations, useLocale } from 'next-intl'

// IMPORTĂM BIBLIOTECA NOUĂ
import Masonry from 'react-masonry-css';

type GalleryItem = {
  id: string
  type: "image" | "video"
  url: string
  position: number
}

// DEFINIM BREAKPOINT-URILE PENTRU GRILĂ (Câte coloane să avem la ce rezoluție)
const breakpointColumnsObj = {
  default: 4, // Pe PC mare avem 4 coloane
  1024: 3,    // Sub 1024px avem 3 coloane
  768: 2,     // Sub 768px (tablete) avem 2 coloane
  640: 1      // Sub 640px (telefoane) avem 1 coloană
};

export function GalleryPreview() {
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

  // 2. STAREA GOALĂ
  if (items.length === 0) {
    return (
      <section className="py-20 px-6 lg:px-12 bg-[#F5F2EC] flex flex-col items-center justify-center text-center">
        <div className="bg-white p-6 rounded-3xl border border-[#7A8CA5]/20 shadow-sm max-w-md w-full">
          <ImageIcon className="text-[#7A8CA5] mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-[#0F2A4A] mb-2">{t('emptyTitle')}</h2>
          <p className="text-[#7A8CA5] text-sm">{t('emptyDesc')}</p>
        </div>
      </section>
    )
  }

  // 3. STAREA DE SUCCES
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

        {/* GRILA MASONRY NOUĂ ȘI FLEXIBILĂ */}
        {/* Adăugăm stiluri CSS inline pentru spațierea corectă între poze */}
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex -ml-4 w-auto" // Se bazează pe flexbox pentru aliniere
          columnClassName="pl-4 bg-clip-padding" // Spațiere între coloane
        >
          {items.map((item) => (
            <Link 
              key={item.id} 
              href={`/${locale}/galerie?imageId=${item.id}`} 
              // mb-4 pentru spațiu între poze pe verticală în interiorul coloanei
              className="block mb-4 overflow-hidden rounded-2xl group relative cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 border border-white"
            >
              {item.type === "image" ? (
                <img 
                  src={item.url} 
                  alt="Proiect Supraveghere" 
                  // CORECȚIE: h-auto în loc de h-full pentru a respecta dimensiunile originale
                  // object-cover pentru a umple containerul fără bare negre
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
              ) : (
                <div className="w-full relative overflow-hidden">
                  <video 
                    src={item.url} 
                    // CORECȚIE VIDEO: object-cover umple pătratul
                    // playsInline muted preload="metadata" îi spun browserului să încarce primul cadru
                    className="w-full h-full object-cover"
                    playsInline 
                    muted 
                    preload="metadata"
                  />
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
        </Masonry>

        {/* Butonul 'Vezi mai multe' */}
        <div className="mt-16 flex justify-center">
          <Link 
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