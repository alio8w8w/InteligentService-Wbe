"use client"

import { useEffect, useState, Suspense } from "react"
// 1. Am modificat importul pentru a folosi funcția corectă:
import { createClient } from "@/lib/utils"
import { Film, Image as ImageIcon, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import Masonry from 'react-masonry-css'

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
}

// Aceasta este logica principală a galeriei
function GalleryContent() {
  const t = useTranslations('galleryPage')
  const searchParams = useSearchParams()
  const initialImageId = searchParams.get('imageId')

  // 2. Am inițializat clientul Supabase aici:
  const supabase = createClient()

  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "image" | "video">("all")
  
  // Starea pentru fereastra plutitoare (indexul elementului selectat)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase
          .from("gallery")
          .select("*")
          .order("position", { ascending: true })

        if (!error && data) {
          setItems(data)
          
          // Dacă avem un ID în URL (venit de pe prima pagină), deschidem poza automat
          if (initialImageId) {
            const index = data.findIndex((item: GalleryItem) => item.id === initialImageId)
            if (index !== -1) setSelectedIndex(index)
          }
        }
      } catch (err) {
        console.error("Eroare neașteptată:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  // 3. Am adăugat supabase la dependențe:
  }, [initialImageId, supabase])

  // Aplicăm filtrul selectat
  const filteredItems = items.filter(item => filter === "all" ? true : item.type === filter)

  // Funcții pentru navigarea în fereastra plutitoare
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation() // Previne închiderea modalului
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev! + 1) % filteredItems.length)
    }
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length)
    }
  }

  // Permitem navigarea din taste (Săgeți și Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return
      if (e.key === 'ArrowRight') setSelectedIndex((prev) => (prev! + 1) % filteredItems.length)
      if (e.key === 'ArrowLeft') setSelectedIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length)
      if (e.key === 'Escape') setSelectedIndex(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, filteredItems.length])


  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F2EC] flex flex-col items-center justify-center pt-32 pb-20">
        <Loader2 className="animate-spin text-[#F26A1B] mb-4" size={40} />
        <p className="text-[#0F2A4A] font-bold text-lg">{t('loading')}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F2EC] pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER ȘI FILTRE */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-[#0F2A4A] tracking-tight mb-4">
            {t('title')}
          </h1>
          <p className="text-[#7A8CA5] font-medium max-w-2xl mx-auto text-lg mb-10">
            {t('subtitle')}
          </p>

          {/* Butoane de filtrare */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { id: 'all', label: t('filterAll') },
              { id: 'image', label: t('filterImages') },
              { id: 'video', label: t('filterVideos') }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => { setFilter(btn.id as any); setSelectedIndex(null); }}
                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                  filter === btn.id 
                    ? 'bg-[#F26A1B] text-white shadow-lg shadow-orange-500/30 scale-105' 
                    : 'bg-white text-[#7A8CA5] border border-[#7A8CA5]/20 hover:border-[#F26A1B]/50 hover:text-[#0F2A4A]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* MESAJE PENTRU GALERIE GOALĂ */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <ImageIcon className="mx-auto text-[#7A8CA5]/50 mb-4" size={64} />
            <p className="text-[#0F2A4A] font-bold text-xl">{t('empty')}</p>
          </div>
        )}

        {/* GRILA MASONRY */}
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {filteredItems.map((item, index) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedIndex(index)} // Deschide modalul la click
              className="block mb-4 overflow-hidden rounded-2xl group relative cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 border border-white"
            >
              {item.type === "image" ? (
                <img 
                  src={item.url} 
                  alt="Proiect" 
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
              ) : (
                <div className="w-full relative overflow-hidden">
                  <video 
                    src={item.url} 
                    className="w-full h-full object-cover"
                    playsInline muted preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                    <Film className="text-white drop-shadow-md" size={32} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </Masonry>

      </div>

      {/* MODAL / FEREASTRĂ PLUTITOARE */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-[#0F2A4A]/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 opacity-100 transition-opacity"
          onClick={() => setSelectedIndex(null)} // Click pe fundal închide fereastra
        >
          {/* Buton Închidere */}
          <button 
            className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-[#F26A1B] text-white rounded-full transition-colors"
            onClick={() => setSelectedIndex(null)}
          >
            <X size={24} />
          </button>

          {/* Săgeată Stânga */}
          {filteredItems.length > 1 && (
            <button 
              className="absolute left-4 md:left-10 z-50 p-3 bg-white/10 hover:bg-[#F26A1B] text-white rounded-full transition-colors hidden sm:block"
              onClick={handlePrev}
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Elementul Central (Imagine sau Video) */}
          <div 
            className="relative max-w-5xl w-full max-h-full flex items-center justify-center outline-none"
            onClick={(e) => e.stopPropagation()} // Previne închiderea când dai click pe poză
          >
            {filteredItems[selectedIndex].type === "image" ? (
              <img 
                src={filteredItems[selectedIndex].url} 
                alt="Vizualizare" 
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" 
              />
            ) : (
              <video 
                src={filteredItems[selectedIndex].url} 
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl bg-black"
                controls autoPlay playsInline
              />
            )}
          </div>

          {/* Săgeată Dreapta */}
          {filteredItems.length > 1 && (
            <button 
              className="absolute right-4 md:right-10 z-50 p-3 bg-white/10 hover:bg-[#F26A1B] text-white rounded-full transition-colors hidden sm:block"
              onClick={handleNext}
            >
              <ChevronRight size={32} />
            </button>
          )}

          {/* Contor poze jos */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 font-medium tracking-widest text-sm bg-black/40 px-4 py-1.5 rounded-full">
            {selectedIndex + 1} / {filteredItems.length}
          </div>
        </div>
      )}
    </div>
  )
}

// Folosim Suspense pentru a preveni erorile de compilare pe Vercel cauzate de useSearchParams()
export default function PageGalerie() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F2EC] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#F26A1B]" size={40} />
      </div>
    }>
      <GalleryContent />
    </Suspense>
  )
}