"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { ArrowRight, Film, Image as ImageIcon, Loader2 } from "lucide-react"
import { useTranslations, useLocale } from 'next-intl'
import Masonry from 'react-masonry-css';

type GalleryItem = {
  id: string
  type: "image" | "video"
  url: string
  position: number
}

const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  768: 2,
  640: 1
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
          .eq("is_featured", true) // EXTRAGE DOAR POZELE CU STELUȚĂ
          .order("position", { ascending: true })
          .limit(8) // LIMITEAZĂ LA MAXIM 8 ELEMENTE (aprox 2 rânduri)

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

  if (loading) {
    return (
      <section className="py-20 px-6 lg:px-12 bg-[#F5F2EC] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#F26A1B] mb-4" size={40} />
        <p className="text-[#0F2A4A] font-bold text-lg">{t('loading')}</p>
      </section>
    )
  }

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

  return (
    <section className="py-20 px-6 lg:px-12 bg-[#F5F2EC]">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F2A4A] tracking-tight mb-3">
            {t('title')}
          </h2>
          <p className="text-[#7A8CA5] font-medium max-w-xl mx-auto text-base">
            {t('subtitle')}
          </p>
        </div>

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {items.map((item) => (
            <Link 
              key={item.id} 
              href={`/${locale}/galerie?imageId=${item.id}`} 
              className="block mb-4 overflow-hidden rounded-2xl group relative cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 border border-white"
            >
              {item.type === "image" ? (
                <img 
                  src={item.url} 
                  alt="Proiect Supraveghere" 
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
              ) : (
                <div className="w-full relative overflow-hidden">
                  <video 
                    src={item.url} 
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

              <div className="absolute inset-0 bg-[#0F2A4A]/0 group-hover:bg-[#0F2A4A]/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/90 p-3 rounded-full text-[#F26A1B] transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-75 shadow-lg">
                  <ImageIcon size={24} />
                </div>
              </div>
            </Link>
          ))}
        </Masonry>

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