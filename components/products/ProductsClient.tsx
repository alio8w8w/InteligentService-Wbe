"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import { ShoppingCart, Loader2, X, CheckCircle, Info, Filter, SlidersHorizontal, ArrowRight } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import BookingModal from '@/components/booking-modal' 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type ProductWithTranslation = {
  id: string
  name: string
  base_price: number
  has_discount: boolean
  discount_percentage: number
  images: string[]
  brand: string
  translatedDesc?: string
}

export default function ProductsClient({ locale }: { locale: string }) {
  const t = useTranslations('productsPage')

  // Stări pentru Produse
  const [products, setProducts] = useState<ProductWithTranslation[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductWithTranslation[]>([])
  const [loading, setLoading] = useState(true)

  // Stări pentru Filtre
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [onlyDiscounted, setOnlyDiscounted] = useState(false)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Stări pentru Coș și Modal Produs
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductWithTranslation | null>(null)
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null)
  const [isAddedToCartModal, setIsAddedToCartModal] = useState(false)

  // Extragerea datelor (Inclusiv descrierea din product_translations)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('produse')
        .select(`*, product_translations (language_code, description)`)

      if (data) {
        const formattedProducts = data.map((product: any) => {
          const translation = product.product_translations?.find((tr: any) => tr.language_code === locale);
          return { ...product, translatedDesc: translation ? translation.description : "" } as ProductWithTranslation;
        })
        
        // Sortăm by default reducerile primele
        const sorted = formattedProducts.sort((a, b) => (a.has_discount === b.has_discount ? 0 : a.has_discount ? -1 : 1))
        setProducts(sorted)
        setFilteredProducts(sorted)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [locale])

  // Aplicarea Filtrelor
  useEffect(() => {
    let result = [...products]

    // Filtru Brand
    if (selectedBrand !== 'all') {
      result = result.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase())
    }

    // Filtru Reducere
    if (onlyDiscounted) {
      result = result.filter(p => p.has_discount)
    }

    // Filtru Preț
    if (minPrice !== '') {
      result = result.filter(p => getFinalPrice(p) >= parseFloat(minPrice))
    }
    if (maxPrice !== '') {
      result = result.filter(p => getFinalPrice(p) <= parseFloat(maxPrice))
    }

    setFilteredProducts(result)
  }, [selectedBrand, minPrice, maxPrice, onlyDiscounted, products])

  // Resetare filtre
  const resetFilters = () => {
    setSelectedBrand('all')
    setMinPrice('')
    setMaxPrice('')
    setOnlyDiscounted(false)
  }

  // Calcul Preț
  const getFinalPrice = (p: ProductWithTranslation) => p.has_discount ? p.base_price - (p.base_price * p.discount_percentage / 100) : p.base_price;

  // --- LOGICA COȘ ---
  const handleAddToCart = (e?: React.MouseEvent, productId?: string) => {
    if (e) e.stopPropagation(); 
    const targetId = productId || selectedProduct?.id;
    if (!targetId) return;

    const savedOrderId = localStorage.getItem('inteligent_order_id');
    if (!savedOrderId) {
      setIsBookingModalOpen(true);
      return;
    }
    proceedToAddProductToCart(savedOrderId, targetId);
  }

  const proceedToAddProductToCart = async (orderId: string, productId: string) => {
    setAddingToCartId(productId)
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const { error } = await supabase.from('order_items').insert([{
      order_id: orderId, produse_id: productId, cantitate: 1, pret_unitar: getFinalPrice(product)
    }]);

    if (!error) {
      if (selectedProduct) setIsAddedToCartModal(true); 
      setTimeout(() => {
        setAddingToCartId(null)
        setIsAddedToCartModal(false)
        setSelectedProduct(null)
      }, 2000)
    }
  }

  // Lista unică de branduri pentru filtru
  const uniqueBrands = Array.from(new Set(products.map(p => p.brand.toLowerCase())))

  return (
    <div className="w-full bg-[#F5F2EC] text-[#0F2A4A] min-h-screen">
      
      {/* 1. HEADER SIMPLU (NAVY) */}
      <div className="bg-[#0F2A4A] pt-12 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F26A1B]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 mt-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#F5F2EC] mb-3 tracking-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-[#7A8CA5] text-base md:text-lg max-w-xl font-medium">
              {t('heroDesc')}
            </p>
          </div>
          <button 
            className="md:hidden bg-[#F26A1B] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <Filter size={20} /> {t('filtersTitle')}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
        
        {/* 2. SIDEBAR FILTRE (Desktop) & MODAL (Mobil) */}
        <aside className={`fixed inset-0 z-[100] lg:static lg:z-auto lg:w-1/4 xl:w-1/5 transition-transform duration-300 ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="absolute inset-0 bg-[#0F2A4A]/50 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileFilterOpen(false)} />
          
          <div className="relative h-full lg:h-auto w-4/5 max-w-sm lg:w-full bg-white lg:bg-transparent p-6 lg:p-0 overflow-y-auto lg:overflow-visible shadow-2xl lg:shadow-none">
            <div className="flex items-center justify-between mb-8 lg:mb-6">
              <h3 className="text-xl font-extrabold flex items-center gap-2 text-[#0F2A4A]">
                <SlidersHorizontal size={20} className="text-[#F26A1B]" /> {t('filtersTitle')}
              </h3>
              <button className="lg:hidden text-[#7A8CA5]" onClick={() => setIsMobileFilterOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="space-y-8 bg-white lg:p-6 rounded-3xl lg:shadow-sm lg:border border-[#7A8CA5]/10">
              {/* Filtru Brand */}
              <div>
                <h4 className="font-bold mb-3 text-sm text-[#7A8CA5] uppercase tracking-wider">{t('brand')}</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="brand" checked={selectedBrand === 'all'} onChange={() => setSelectedBrand('all')} className="w-4 h-4 accent-[#F26A1B]" />
                    <span className="text-sm font-medium group-hover:text-[#F26A1B] transition-colors">{t('allBrands')}</span>
                  </label>
                  {uniqueBrands.map(brand => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="brand" checked={selectedBrand === brand} onChange={() => setSelectedBrand(brand)} className="w-4 h-4 accent-[#F26A1B]" />
                      <span className="text-sm font-medium capitalize group-hover:text-[#F26A1B] transition-colors">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtru Preț */}
              <div>
                <h4 className="font-bold mb-3 text-sm text-[#7A8CA5] uppercase tracking-wider">{t('priceRange')}</h4>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder={t('minPrice')} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full bg-[#F5F2EC] px-3 py-2 rounded-lg text-sm outline-none border border-transparent focus:border-[#F26A1B] transition-all" />
                  <span className="text-[#7A8CA5]">-</span>
                  <input type="number" placeholder={t('maxPrice')} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full bg-[#F5F2EC] px-3 py-2 rounded-lg text-sm outline-none border border-transparent focus:border-[#F26A1B] transition-all" />
                </div>
              </div>

              {/* Filtru Reducere */}
              <label className="flex items-center gap-3 cursor-pointer group bg-[#F5F2EC]/50 p-3 rounded-xl border border-[#7A8CA5]/10">
                <input type="checkbox" checked={onlyDiscounted} onChange={(e) => setOnlyDiscounted(e.target.checked)} className="w-4 h-4 accent-[#F26A1B] rounded" />
                <span className="text-sm font-bold text-[#C24C0F]">{t('onlyDiscounted')}</span>
              </label>

              <button onClick={resetFilters} className="w-full py-2.5 text-sm font-bold text-[#7A8CA5] hover:text-[#0F2A4A] bg-[#F5F2EC] hover:bg-[#7A8CA5]/20 rounded-xl transition-colors">
                {t('resetFilters')}
              </button>
            </div>
          </div>
        </aside>

        {/* 3. GRILĂ PRODUSE (Dreapta) */}
        <div className="flex-grow">
          <div className="mb-6 flex justify-between items-center">
            <span className="text-sm font-bold text-[#7A8CA5]">
              {filteredProducts.length} {t('results')}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#F26A1B]" size={48} /></div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#7A8CA5]/10 shadow-sm">
              <div className="w-20 h-20 bg-[#F5F2EC] rounded-full flex items-center justify-center mx-auto mb-4 text-[#7A8CA5]">
                <Filter size={32} />
              </div>
              <p className="text-lg text-[#0F2A4A] font-bold">{t('noProducts')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => {
                const finalPrice = getFinalPrice(product);
                const isAdding = addingToCartId === product.id;

                return (
                  <div 
                    key={product.id} 
                    onClick={() => setSelectedProduct(product)}
                    className="bg-white rounded-[1.5rem] border border-[#7A8CA5]/15 shadow-sm hover:shadow-xl hover:border-[#F26A1B]/30 transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
                  >
                    <div className="relative h-48 w-full bg-[#F5F2EC]/30 p-6 flex items-center justify-center">
                      {product.has_discount && (
                        <div className="absolute top-3 left-3 bg-[#C24C0F] text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full z-10 shadow-md">
                          -{product.discount_percentage}% {t('discountBadge')}
                        </div>
                      )}
                      {product.images && product.images[0] ? (
                        <Image src={product.images[0]} alt={product.name} fill className="object-contain p-4 mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <ShoppingCart size={32} className="text-[#7A8CA5]/20" />
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <span className="text-[10px] font-black text-[#7A8CA5] uppercase tracking-widest mb-1">{product.brand}</span>
                      <h3 className="text-base font-extrabold text-[#0F2A4A] mb-2 leading-snug line-clamp-2">{product.name}</h3>
                      <p className="text-[#7A8CA5] text-xs font-medium leading-relaxed mb-4 line-clamp-2">
                        {product.translatedDesc || t('noDescription')}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-[#7A8CA5]/10 flex items-center justify-between">
                        <div className="flex flex-col">
                          {product.has_discount && (
                            <span className="text-[10px] text-[#7A8CA5] line-through font-medium">{product.base_price} MDL</span>
                          )}
                          <span className="text-lg font-black text-[#0F2A4A]">{finalPrice.toFixed(2)} MDL</span>
                        </div>
                        <button 
                          onClick={(e) => handleAddToCart(e, product.id)}
                          disabled={isAdding}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-95 ${
                            isAdding ? 'bg-green-500 text-white' : 'bg-[#F26A1B] hover:bg-[#C24C0F] text-white'
                          }`}
                        >
                          {isAdding ? <CheckCircle size={18} /> : <ShoppingCart size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. MODAL PRODUS PLUTITOR */}
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
                  -{selectedProduct.discount_percentage}% {t('discountBadge')}
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
                <h2 className="text-2xl md:text-3xl font-extrabold mb-4 leading-tight">{selectedProduct.name}</h2>
                <p className="text-sm text-[#7A8CA5] font-medium leading-relaxed mb-6 overflow-y-auto max-h-[150px] pr-2 hide-scrollbar">
                   {selectedProduct.translatedDesc || t('noDescription')}
                </p>
                <div className="mb-8 p-5 bg-white rounded-2xl border border-[#7A8CA5]/20 shadow-sm flex justify-between items-center">
                  <span className="block text-sm text-[#7A8CA5] font-bold">{t('unitPrice')}:</span>
                  {selectedProduct.has_discount ? (
                    <div className="flex items-center gap-3">
                      <span className="text-lg text-[#7A8CA5] line-through font-medium">{selectedProduct.base_price} MDL</span>
                      <span className="text-3xl font-black text-[#C24C0F]">{(selectedProduct.base_price - (selectedProduct.base_price * selectedProduct.discount_percentage / 100)).toFixed(2)} MDL</span>
                    </div>
                  ) : (
                    <span className="text-3xl font-black">{selectedProduct.base_price} MDL</span>
                  )}
                </div>
              </div>
              
              {isAddedToCartModal ? (
                 <div className="w-full bg-[#0F2A4A] text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-md animate-in fade-in zoom-in duration-300">
                   <CheckCircle size={24} className="text-[#F26A1B]" /> {t('addedSuccess')}
                 </div>
              ) : (
                <button onClick={() => handleAddToCart(undefined, selectedProduct.id)} className="mt-auto w-full bg-[#F26A1B] hover:bg-[#C24C0F] text-white font-bold text-lg py-4 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-3">
                  <ShoppingCart size={22} /> {t('addToCart')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL DATE CLIENT */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={(orderId:string) => {
          setIsBookingModalOpen(false);
          const productId = addingToCartId || selectedProduct?.id;
          if (productId) proceedToAddProductToCart(orderId, productId);
        }}
      />
    </div>
  )
}