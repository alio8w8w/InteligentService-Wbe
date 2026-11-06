"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { createClient } from "@/lib/supabase"
import { Loader2, ArrowDown, Filter, ShoppingCart, X, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"
import { useTranslations, useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useCart } from "@/hooks/use-cart"

type Product = {
  id: string
  name: string
  brand: string
  base_price: number
  has_discount: boolean
  discount_percentage: number
  images: string[]
  product_translations?: { language_code: string; description: string }[]
}

function LedEcranContent() {
  const t = useTranslations('ledPage')
  const locale = useLocale()
  const searchParams = useSearchParams()
  const initialProductId = searchParams.get('productId')
  const cart = useCart()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState<"default" | "asc" | "desc">("default")
  const [showDiscountOnly, setShowDiscountOnly] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)

  const productsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await createClient()
          .from("produse")
          .select("*, product_translations(language_code, description)")
          .eq("brand", "LED Ecran")
          
        if (!error && data) {
          setProducts(data as Product[])
          
          if (initialProductId) {
            const prod = (data as Product[]).find((p: Product) => p.id === initialProductId)
            if (prod) {
              setSelectedProduct(prod as Product)
              setTimeout(() => {
                productsRef.current?.scrollIntoView({ behavior: 'smooth' })
              }, 500)
            }
          }
        }
      } catch (err) {
        console.error("Eroare:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [initialProductId])

  const getFinalPrice = (product: Product) => {
    return product.has_discount 
      ? product.base_price * (1 - product.discount_percentage / 100) 
      : product.base_price
  }

  let displayedProducts = [...products]
  if (showDiscountOnly) {
    displayedProducts = displayedProducts.filter(p => p.has_discount)
  }
  
  if (sortOrder === "asc") {
    displayedProducts.sort((a, b) => getFinalPrice(a) - getFinalPrice(b))
  } else if (sortOrder === "desc") {
    displayedProducts.sort((a, b) => getFinalPrice(b) - getFinalPrice(a))
  }

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleAddToCart = (product: Product) => {
    const productForCart = {
      ...product,
      base_price: getFinalPrice(product)
    }

    cart.addToCart(productForCart as any)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const getDescription = (product: Product) => {
    if (!product.product_translations) return ""
    const translation = product.product_translations.find(t => t.language_code === locale)
    return translation ? translation.description : product.product_translations[0]?.description || ""
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F2EC] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#F26A1B] mb-4" size={40} />
      </div>
    )
  }

  return (
    <div className="bg-[#F5F2EC] min-h-screen pb-20">
      
      <section className="relative w-full max-w-[1280px] h-[560px] mx-auto mt-8 rounded-3xl overflow-hidden shadow-2xl flex items-center">
        <div className="absolute inset-0">
          <img 
            src="/images/Led-Back.png" 
            alt="LED Ecran Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2A4A] via-[#0F2A4A]/80 to-transparent" />
        </div>

        <div className="relative z-10 px-8 lg:px-16 max-w-2xl text-white">
          <div className="inline-block px-4 py-1.5 bg-[#F26A1B] text-white font-black uppercase tracking-widest text-xs rounded-full mb-6">
            Premium Displays
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-medium mb-10 leading-relaxed opacity-90">
            {t('heroDesc')}
          </p>
        </div>

        <button 
          onClick={scrollToProducts}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group cursor-pointer z-10"
        >
          <span className="text-white/80 font-bold text-sm tracking-widest uppercase group-hover:text-white transition-colors">
            {t('scrollDown')}
          </span>
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center group-hover:bg-[#F26A1B] transition-all duration-300">
            <ArrowDown className="text-white animate-bounce mt-1" size={24} />
          </div>
        </button>
      </section>

      <section ref={productsRef} className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 scroll-mt-10">
        
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-[#7A8CA5]/20 mb-10 gap-4">
          <div className="flex items-center gap-2 text-[#0F2A4A] font-bold">
            <Filter size={20} className="text-[#F26A1B]" /> Filtre:
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setShowDiscountOnly(!showDiscountOnly)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${showDiscountOnly ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'} border`}
            >
              {t('filterDiscount')}
            </button>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-5 py-2 rounded-xl text-sm font-bold bg-gray-50 border border-gray-200 text-[#0F2A4A] outline-none cursor-pointer hover:bg-gray-100"
            >
              <option value="default">{t('filterAll')}</option>
              <option value="asc">{t('sortAsc')}</option>
              <option value="desc">{t('sortDesc')}</option>
            </select>
          </div>
        </div>

        {displayedProducts.length === 0 ? (
          <div className="text-center py-20 text-[#7A8CA5] font-bold text-xl">{t('empty')}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map(product => {
              const finalPrice = getFinalPrice(product)
              
              return (
                <div 
                  key={product.id} 
                  onClick={() => { setSelectedProduct(product); setActiveImageIndex(0); }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-white"
                >
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <img src={product.images[0] || '/placeholder.png'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {product.has_discount && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white font-black text-xs px-3 py-1 rounded-full z-10 shadow-lg">
                        -{product.discount_percentage}%
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-[#0F2A4A] text-lg mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex justify-between items-end mt-4">
                      <div>
                        {product.has_discount && (
                          <div className="text-xs text-[#7A8CA5] line-through mb-1">{product.base_price.toLocaleString()} MDL</div>
                        )}
                        <div className="font-black text-xl text-[#F26A1B]">{finalPrice.toLocaleString()} MDL</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[#F5F2EC] flex items-center justify-center text-[#0F2A4A] group-hover:bg-[#0F2A4A] group-hover:text-white transition-colors">
                        <ArrowDown className="rotate-[-45deg]" size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#0F2A4A]/90 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] w-full max-w-5xl max-h-[95vh] overflow-y-auto flex flex-col md:flex-row relative shadow-2xl animate-in fade-in zoom-in duration-300">
            
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-50 bg-gray-100 hover:bg-red-500 hover:text-white text-gray-500 p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <div className="w-full md:w-1/2 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4">
                <img src={selectedProduct.images[activeImageIndex]} alt="Preview" className="w-full h-full object-contain" />
                
                {selectedProduct.images.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-[#F26A1B] hover:text-white transition-colors shadow-md">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => (prev + 1) % selectedProduct.images.length); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-[#F26A1B] hover:text-white transition-colors shadow-md">
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {selectedProduct.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImageIndex === idx ? 'border-[#F26A1B] opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
              <div className="inline-block px-3 py-1 bg-[#F5F2EC] text-[#7A8CA5] text-xs font-black uppercase tracking-widest rounded-lg mb-4 w-max">
                {selectedProduct.brand}
              </div>
              <h2 className="text-3xl font-black text-[#0F2A4A] mb-4 leading-tight">{selectedProduct.name}</h2>
              
              <div className="mb-8">
                <span className="text-sm text-[#7A8CA5] font-bold uppercase">{t('price')}</span>
                <div className="flex items-end gap-3 mt-1">
                  <span className="text-4xl font-black text-[#F26A1B]">
                    {getFinalPrice(selectedProduct).toLocaleString()} MDL
                  </span>
                  {selectedProduct.has_discount && (
                    <span className="text-xl text-[#7A8CA5] line-through mb-1">
                      {selectedProduct.base_price.toLocaleString()} MDL
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-10">
                <h4 className="font-bold text-[#0F2A4A] mb-2">{t('description')}</h4>
                <p className="text-[#7A8CA5] leading-relaxed whitespace-pre-wrap text-sm">
                  {getDescription(selectedProduct) || "Fără descriere disponibilă."}
                </p>
              </div>

              <button 
                onClick={() => handleAddToCart(selectedProduct)}
                disabled={addedToCart}
                className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-xl active:scale-95 ${
                  addedToCart 
                    ? 'bg-green-500 text-white shadow-green-500/30' 
                    : 'bg-gradient-to-r from-[#0F2A4A] to-[#1a3a5f] text-white hover:shadow-[#0F2A4A]/30'
                }`}
              >
                {addedToCart ? (
                  <><CheckCircle2 size={24} /> Adăugat cu succes!</>
                ) : (
                  <><ShoppingCart size={24} /> {t('addToCart')}</>
                )}
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  )
}

export default function LedEcranPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F2EC] flex items-center justify-center"><Loader2 className="animate-spin text-[#F26A1B]" size={40} /></div>}>
      <LedEcranContent />
    </Suspense>
  )
}