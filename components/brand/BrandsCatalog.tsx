"use client"

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { ArrowRight, ShoppingCart, X, Loader2, ChevronRight, ChevronLeft, CheckCircle2, Info } from 'lucide-react'
import { useTranslations } from 'next-intl'

import BookingModal from '@/components/booking-modal' 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Product = {
  id: string
  name: string
  base_price: number
  has_discount: boolean
  discount_percentage: number
  images: string[]
  brand: string
}

export default function BrandsCatalog({ locale }: { locale: string }) {
  const t = useTranslations('brandsCatalog')

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  const hikvisionRef = useRef<HTMLDivElement>(null)
  const dahuaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('produse').select('*')
      if (data) {
        const sorted = data.sort((a, b) => (a.has_discount === b.has_discount ? 0 : a.has_discount ? -1 : 1))
        setProducts(sorted)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const hikvisionProducts = products.filter(p => p.brand.toLowerCase() === 'hikvision')
  const dahuaProducts = products.filter(p => p.brand.toLowerCase() === 'dahua')

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -350 : 350
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const getFinalPrice = (p: Product) => p.has_discount ? p.base_price - (p.base_price * p.discount_percentage / 100) : p.base_price;

  const handleAddToCart = () => {
    const savedOrderId = localStorage.getItem('inteligent_order_id');
    if (!savedOrderId) {
      setIsBookingModalOpen(true);
      return;
    }
    proceedToAddProductToCart(savedOrderId);
  }

  const proceedToAddProductToCart = async (orderId: string) => {
    if (!selectedProduct) return;
    const finalPrice = getFinalPrice(selectedProduct);
    const { error } = await supabase
      .from('order_items')
      .insert([{
        order_id: orderId,
        produse_id: selectedProduct.id,
        cantitate: 1,
        pret_unitar: finalPrice
      }]);

    if (error) {
      console.error("Eroare:", error.message);
      return;
    }
    
    setIsAddedToCart(true)
    setTimeout(() => {
      setIsAddedToCart(false)
      setSelectedProduct(null)
    }, 2500)
  }

  return (
    <div className="w-full bg-[#0F2A4A] text-[#F5F2EC] pb-20">
      
      {/* 1. HERO SECTION (Text micșorat și aliniat cu Navbar-ul) */}
      <div className="relative w-full pt-32 pb-24 flex flex-col justify-center overflow-hidden min-h-[500px]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/images/brand-back.png')] bg-cover bg-center md:bg-right bg-no-repeat opacity-60 md:opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2A4A] via-[#0F2A4A]/80 to-transparent w-full md:w-3/4" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2A4A] via-transparent to-transparent" />
        </div>

        {/* Aliniere perfectă cu meniul de sus */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 mt-10 md:mt-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5 leading-tight text-[#F5F2EC]">
            {t('heroTitle')}
          </h1>
          <p className="text-base md:text-lg text-[#7A8CA5] font-medium max-w-xl">
            {t('heroDesc')}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-32"><Loader2 className="animate-spin text-[#F26A1B]" size={48} /></div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-24 px-4 sm:px-6 mt-10">
          
          {/* ================= HIKVISION CAROUSEL ================= */}
          <section id="hikvision-section" className="relative pt-10">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4 px-2">
              <div>
                <h2 className="text-3xl font-extrabold mb-2 text-[#F5F2EC]">{t('exploreHikvision')}</h2>
                <p className="text-[#7A8CA5] text-sm font-medium">{t('exploreHikvisionSub')}</p>
              </div>
              <div className="flex gap-3 hidden sm:flex">
                <button onClick={() => scroll(hikvisionRef, 'left')} className="p-3 rounded-full bg-white/5 border border-[#7A8CA5]/30 text-[#F5F2EC] hover:bg-[#F26A1B] hover:border-[#F26A1B] transition-colors"><ChevronLeft size={20} /></button>
                <button onClick={() => scroll(hikvisionRef, 'right')} className="p-3 rounded-full bg-white/5 border border-[#7A8CA5]/30 text-[#F5F2EC] hover:bg-[#F26A1B] hover:border-[#F26A1B] transition-colors"><ChevronRight size={20} /></button>
              </div>
            </div>

            <div ref={hikvisionRef} className="flex gap-6 overflow-x-auto pb-6 pt-4 px-2 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {hikvisionProducts.length === 0 ? <p className="text-[#7A8CA5]">Niciun produs găsit.</p> : hikvisionProducts.map(product => (
                <ProductCard key={product.id} product={product} onClick={() => { setSelectedProduct(product); setIsAddedToCart(false); }} />
              ))}
            </div>

            {/* BUTON CĂTRE PAGINA HIKVISION */}
            <div className="mt-6 flex justify-start px-2">
               <Link href={`/${locale}/branduri/hikvision`} className="group flex items-center gap-3 border-2 border-[#F26A1B] text-[#F26A1B] hover:bg-[#F26A1B] hover:text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm">
                 Află de ce să alegi Hikvision <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
               </Link>
            </div>
          </section>

          {/* ================= DAHUA CAROUSEL ================= */}
          <section id="dahua-section" className="relative pt-10 border-t border-[#7A8CA5]/10">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4 px-2">
              <div>
                <h2 className="text-3xl font-extrabold mb-2 text-[#F5F2EC]">{t('exploreDahua')}</h2>
                <p className="text-[#7A8CA5] text-sm font-medium">{t('exploreDahuaSub')}</p>
              </div>
              <div className="flex gap-3 hidden sm:flex">
                <button onClick={() => scroll(dahuaRef, 'left')} className="p-3 rounded-full bg-white/5 border border-[#7A8CA5]/30 text-[#F5F2EC] hover:bg-[#F26A1B] hover:border-[#F26A1B] transition-colors"><ChevronLeft size={20} /></button>
                <button onClick={() => scroll(dahuaRef, 'right')} className="p-3 rounded-full bg-white/5 border border-[#7A8CA5]/30 text-[#F5F2EC] hover:bg-[#F26A1B] hover:border-[#F26A1B] transition-colors"><ChevronRight size={20} /></button>
              </div>
            </div>

            <div ref={dahuaRef} className="flex gap-6 overflow-x-auto pb-6 pt-4 px-2 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {dahuaProducts.length === 0 ? <p className="text-[#7A8CA5]">Niciun produs găsit.</p> : dahuaProducts.map(product => (
                <ProductCard key={product.id} product={product} onClick={() => { setSelectedProduct(product); setIsAddedToCart(false); }} />
              ))}
            </div>

            {/* BUTON CĂTRE PAGINA DAHUA */}
            <div className="mt-6 flex justify-start px-2">
               <Link href={`/${locale}/branduri/dahua`} className="group flex items-center gap-3 border-2 border-[#F26A1B] text-[#F26A1B] hover:bg-[#F26A1B] hover:text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm">
                 Află de ce să alegi Dahua <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
               </Link>
            </div>
          </section>

          {/* ================= BOTTOM BANNER ================= */}
          <section className="relative w-full rounded-[2rem] overflow-hidden bg-[#F5F2EC] flex flex-col md:flex-row items-center mt-20 shadow-2xl">
              <div className="md:w-1/2 p-10 md:p-16 lg:p-20 z-10 flex flex-col items-start justify-center">
                <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F2A4A] mb-8 leading-tight">
                  {t('bannerTitle')}
                </h2>
                <Link href={`/${locale}/produse`} className="bg-[#0F2A4A] hover:bg-[#F26A1B] text-[#F5F2EC] px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all shadow-lg hover:shadow-xl active:scale-95">
                  {t('bannerBtn')} <ArrowRight size={20} />
                </Link>
              </div>
              <div className="md:w-1/2 w-full h-64 md:h-full min-h-[300px] relative">
                <div className="absolute inset-0 bg-[url('/images/brand-lange.png')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#F5F2EC] via-[#F5F2EC]/20 to-transparent hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F5F2EC] via-[#F5F2EC]/20 to-transparent md:hidden" />
              </div>
          </section>

        </div>
      )}

      {/* MODAL PLUTITOR PRODUS */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-[#0F2A4A]/80 backdrop-blur-md" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-4xl bg-[#F5F2EC] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] animate-in zoom-in-95 duration-300">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-50 bg-[#0F2A4A]/10 text-[#0F2A4A] hover:bg-[#C24C0F] hover:text-white p-2 rounded-full transition-colors backdrop-blur-sm shadow-sm">
              <X size={24} />
            </button>
            <div className="w-full md:w-1/2 bg-white relative min-h-[250px] md:min-h-[400px] flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-[#7A8CA5]/10">
              {selectedProduct.has_discount && (
                <div className="absolute top-6 left-6 bg-[#C24C0F] text-white text-xs font-black uppercase px-4 py-1.5 rounded-full z-10 shadow-md">
                  -{selectedProduct.discount_percentage}% REDUCERE
                </div>
              )}
              {selectedProduct.images && selectedProduct.images[0] ? (
                <Image src={selectedProduct.images[0]} alt={selectedProduct.name} fill className="object-contain p-8 mix-blend-multiply" />
              ) : (
                 <ShoppingCart size={64} className="text-[#7A8CA5]/30" />
              )}
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between text-[#0F2A4A] bg-[#F5F2EC]">
              <div>
                <span className="text-[#7A8CA5] font-black uppercase tracking-widest text-xs mb-2 block">{selectedProduct.brand}</span>
                <h2 className="text-2xl md:text-3xl font-extrabold mb-6 leading-tight">{selectedProduct.name}</h2>
                <div className="mb-8 p-5 bg-white rounded-2xl border border-[#7A8CA5]/20 shadow-sm">
                  <span className="block text-sm text-[#7A8CA5] font-bold mb-1">Preț unitar:</span>
                  {selectedProduct.has_discount ? (
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black text-[#C24C0F]">{getFinalPrice(selectedProduct).toFixed(2)} MDL</span>
                      <span className="text-lg text-[#7A8CA5] line-through font-medium">{selectedProduct.base_price} MDL</span>
                    </div>
                  ) : (
                    <span className="text-3xl font-black">{selectedProduct.base_price} MDL</span>
                  )}
                </div>
                <div className="flex items-start gap-3 mb-8 p-4 bg-[#7A8CA5]/10 rounded-xl text-sm font-medium text-[#0F2A4A]/80">
                  <Info className="w-5 h-5 text-[#F26A1B] flex-shrink-0 mt-0.5" />
                  <p>Pentru detalii complete de instalare și specificații tehnice avansate, consultă secțiunea principală a produsului în magazin.</p>
                </div>
              </div>
              {isAddedToCart ? (
                 <div className="w-full bg-[#0F2A4A] text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-md animate-in fade-in zoom-in duration-300">
                   <CheckCircle2 size={24} className="text-[#F26A1B]" />
                   Produs adăugat în coș!
                 </div>
              ) : (
                <button onClick={handleAddToCart} className="mt-auto w-full bg-[#F26A1B] hover:bg-[#C24C0F] text-white font-bold text-lg py-4 rounded-xl transition-all shadow-md hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-3">
                  <ShoppingCart size={22} /> Adaugă în Coș
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL PENTRU DATELE CLIENTULUI */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={(orderId: string) => {
          setIsBookingModalOpen(false);
          proceedToAddProductToCart(orderId);
        }}
      />
    </div>
  )
}

function ProductCard({ product, onClick }: { product: Product, onClick: () => void }) {
  const finalPrice = product.has_discount ? product.base_price - (product.base_price * product.discount_percentage / 100) : product.base_price;
  return (
    <div onClick={onClick} className="group min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] snap-center bg-[#F5F2EC] rounded-[2rem] overflow-hidden cursor-pointer flex flex-col relative transition-all duration-300 hover:-translate-y-2 border border-[#7A8CA5]/10 hover:shadow-2xl shadow-black/20">
      {product.has_discount && (
        <div className="absolute top-4 left-4 bg-[#C24C0F] text-white text-xs font-black uppercase px-3 py-1.5 rounded-full z-10 shadow-md">
          -{product.discount_percentage}%
        </div>
      )}
      <div className="h-64 w-full bg-white relative p-6 border-b border-[#7A8CA5]/10 flex items-center justify-center">
        {product.images && product.images[0] ? (
          <Image src={product.images[0]} alt={product.name} fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" />
        ) : (
          <ShoppingCart size={40} className="text-[#7A8CA5]/30" />
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow text-[#0F2A4A]">
        <h3 className="text-lg font-bold mb-4 line-clamp-2 leading-snug group-hover:text-[#F26A1B] transition-colors">{product.name}</h3>
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            {product.has_discount && <span className="text-sm text-[#7A8CA5] line-through font-medium">{product.base_price} MDL</span>}
            <span className="text-2xl font-black">{finalPrice.toFixed(2)} MDL</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#0F2A4A] text-[#F5F2EC] flex items-center justify-center group-hover:bg-[#F26A1B] transition-colors shadow-md">
            <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  )
}