"use client"

import { useEffect, useState, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { ArrowLeft, ShoppingCart, X, Tag, Loader2, CheckCircle2 } from 'lucide-react'

// Inițializare Supabase
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

export default function BrandPage({ params }: { params: Promise<{ brand: string, locale: string }> }) {
  // Despachetăm parametrii folosind React.use() pentru noile versiuni de Next.js
  const resolvedParams = use(params)
  const brandName = resolvedParams.brand.toLowerCase()
  const locale = resolvedParams.locale

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Stări pentru Fereastra Plutitoare (Modal)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({ nume: "", telefon: "", email: "" })
  const [orderSuccess, setOrderSuccess] = useState(false)

  // Numele formatat pentru afișare
  const displayBrandName = brandName === 'hikvision' ? 'Hikvision' : brandName === 'dahua' ? 'Dahua' : brandName;
  const logoSrc = `/images/${brandName}-logo.png`

  useEffect(() => {
    const fetchBrandProducts = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('produse')
        .select('*')
        .ilike('brand', brandName) // Extragem doar produsele acestui brand

      if (data) {
        // Sortare: Cele cu reducere apar primele
        const sortedProducts = data.sort((a, b) => {
          if (a.has_discount && !b.has_discount) return -1;
          if (!a.has_discount && b.has_discount) return 1;
          return 0;
        })
        setProducts(sortedProducts)
      }
      setLoading(false)
    }

    fetchBrandProducts()
  }, [brandName])

  // Funcție de calculare preț final
  const getFinalPrice = (p: Product) => {
    return p.has_discount ? p.base_price - (p.base_price * p.discount_percentage / 100) : p.base_price;
  }

  // Funcție pentru trimiterea formularului din fereastra plutitoare
  const handleQuickOrder = (e: React.FormEvent) => {
    e.preventDefault()
    // AICI POȚI ADĂUGA LOGICA DE SALVARE ÎN BAZA DE DATE SAU ÎN COȘUL GLOBAL
    console.log("Comandă rapidă:", { produs: selectedProduct?.name, client: formData })
    setOrderSuccess(true)
    setTimeout(() => {
      setOrderSuccess(false)
      setSelectedProduct(null)
      setFormData({ nume: "", telefon: "", email: "" })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
      
      {/* 1. SECȚIUNEA HERO (Cu Background) */}
      <div className="relative w-full h-[40vh] min-h-[300px] flex flex-col items-center justify-center border-b border-[#7A8CA5]/20">
        {/* Imaginea de fundal (Poți pune o poză reală cu camere în folderul public/images/) */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: "url('/images/background-admin.jpg')" }} // Schimbă cu o poză relevantă dacă vrei
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc]/50 to-[#f8fafc] z-0" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col items-center">
          <Link href={`/${locale}/branduri`} className="absolute left-6 top-0 flex items-center gap-2 text-[#7A8CA5] hover:text-[#F26A1B] font-medium transition-colors">
            <ArrowLeft size={18} /> Înapoi la branduri
          </Link>

          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-[#7A8CA5]/10 flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-500 mb-6 w-full max-w-xs">
            <div className="relative h-16 w-full">
               <Image src={logoSrc} alt={displayBrandName} fill className="object-contain" priority />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0F2A4A] tracking-tight text-center">
            Produse {displayBrandName}
          </h1>
        </div>
      </div>

      {/* 2. SECȚIUNEA DE PRODUSE (GRID) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#7A8CA5]">
            <Loader2 className="animate-spin mb-4 text-[#F26A1B]" size={40} />
            <p className="font-medium">Se încarcă produsele {displayBrandName}...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#7A8CA5]/10 shadow-sm">
            <p className="text-xl text-[#7A8CA5] font-medium">Nu există produse pentru acest brand momentan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div 
                key={product.id} 
                onClick={() => setSelectedProduct(product)}
                className="group bg-white rounded-3xl border border-[#7A8CA5]/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col relative"
              >
                {/* Sticker Reducere */}
                {product.has_discount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black uppercase px-3 py-1.5 rounded-full z-10 shadow-md flex items-center gap-1">
                    <Tag size={12} /> -{product.discount_percentage}%
                  </div>
                )}

                {/* Imagine Produs */}
                <div className="relative h-64 w-full bg-gray-50 overflow-hidden p-6 flex items-center justify-center">
                  {product.images && product.images[0] ? (
                     <Image 
                       src={product.images[0]} 
                       alt={product.name} 
                       fill 
                       className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                     />
                  ) : (
                    <div className="text-gray-300"><ShoppingCart size={48} /></div>
                  )}
                </div>

                {/* Detalii Produs */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-[#0F2A4A] mb-2 line-clamp-2 group-hover:text-[#F26A1B] transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="mt-auto pt-4 flex items-end justify-between">
                    <div>
                      {product.has_discount ? (
                        <div className="flex flex-col">
                          <span className="text-sm text-[#7A8CA5] line-through font-medium">{product.base_price} MDL</span>
                          <span className="text-xl font-black text-red-500">{getFinalPrice(product).toFixed(2)} MDL</span>
                        </div>
                      ) : (
                        <span className="text-xl font-black text-[#0F2A4A]">{product.base_price} MDL</span>
                      )}
                    </div>
                    <div className="bg-[#f8fafc] p-3 rounded-full text-[#0F2A4A] group-hover:bg-[#F26A1B] group-hover:text-white transition-colors">
                      <ShoppingCart size={20} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. FEREASTRA PLUTITOARE (MODAL) PENTRU PRODUS */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          {/* Fundal Blur */}
          <div className="absolute inset-0 bg-[#0F2A4A]/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          
          {/* Fereastra */}
          <div className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-300">
            
            {/* Buton Închidere */}
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur text-[#0F2A4A] hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            {/* Poza in Modal */}
            <div className="w-full md:w-1/2 bg-gray-50 relative min-h-[300px] flex items-center justify-center p-8">
              {selectedProduct.has_discount && (
                <div className="absolute top-6 left-6 bg-red-500 text-white text-sm font-black uppercase px-4 py-1.5 rounded-full z-10 shadow-md">
                  -{selectedProduct.discount_percentage}% REDUCERE
                </div>
              )}
              {selectedProduct.images && selectedProduct.images[0] && (
                <Image src={selectedProduct.images[0]} alt={selectedProduct.name} fill className="object-contain p-8 mix-blend-multiply" />
              )}
            </div>

            {/* Formular și Detalii */}
            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto">
              <span className="text-[#7A8CA5] font-black uppercase tracking-widest text-xs mb-2">{selectedProduct.brand}</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F2A4A] mb-6">{selectedProduct.name}</h2>
              
              <div className="mb-8 p-4 bg-[#f8fafc] rounded-2xl border border-[#7A8CA5]/10">
                <span className="block text-sm text-[#7A8CA5] font-bold mb-1">Preț final:</span>
                {selectedProduct.has_discount ? (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-red-500">{getFinalPrice(selectedProduct).toFixed(2)} MDL</span>
                    <span className="text-lg text-[#7A8CA5] line-through font-medium">{selectedProduct.base_price} MDL</span>
                  </div>
                ) : (
                  <span className="text-3xl font-black text-[#0F2A4A]">{selectedProduct.base_price} MDL</span>
                )}
              </div>

              {orderSuccess ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-green-50 rounded-3xl border border-green-100">
                   <CheckCircle2 size={64} className="text-green-500 mb-4" />
                   <h3 className="text-xl font-bold text-green-800 mb-2">Cerere înregistrată!</h3>
                   <p className="text-green-600 font-medium text-sm">Te vom contacta în cel mai scurt timp pentru confirmare.</p>
                 </div>
              ) : (
                <form onSubmit={handleQuickOrder} className="flex-1 flex flex-col gap-4">
                  <h3 className="font-bold text-[#0F2A4A] mb-2 flex items-center gap-2">
                    <ShoppingCart size={20} className="text-[#F26A1B]" /> Comandă Rapidă
                  </h3>
                  
                  <div>
                    <label className="block text-xs font-bold text-[#7A8CA5] mb-1.5 uppercase">Nume Prenume *</label>
                    <input required value={formData.nume} onChange={e => setFormData({...formData, nume: e.target.value})} type="text" placeholder="Ion Popescu" className="w-full px-4 py-3 rounded-xl border border-[#7A8CA5]/20 focus:border-[#F26A1B] focus:ring-1 focus:ring-[#F26A1B] outline-none transition-all text-[#0F2A4A]" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#7A8CA5] mb-1.5 uppercase">Telefon *</label>
                      <input required value={formData.telefon} onChange={e => setFormData({...formData, telefon: e.target.value})} type="tel" placeholder="068 123 456" className="w-full px-4 py-3 rounded-xl border border-[#7A8CA5]/20 focus:border-[#F26A1B] focus:ring-1 focus:ring-[#F26A1B] outline-none transition-all text-[#0F2A4A]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#7A8CA5] mb-1.5 uppercase">Email</label>
                      <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" placeholder="ion@email.com" className="w-full px-4 py-3 rounded-xl border border-[#7A8CA5]/20 focus:border-[#F26A1B] focus:ring-1 focus:ring-[#F26A1B] outline-none transition-all text-[#0F2A4A]" />
                    </div>
                  </div>

                  <button type="submit" className="mt-auto w-full bg-[#F26A1B] hover:bg-[#d95c14] text-white font-bold text-lg py-4 rounded-xl transition-all shadow-md hover:shadow-xl active:scale-[0.98]">
                    Solicită Produsul
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  )
}