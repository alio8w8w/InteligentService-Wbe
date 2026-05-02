"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { ArrowRight, ShoppingCart, Loader2, ShieldCheck, CheckCircle, ChevronDown, PhoneCall, Image as ImageIcon, Mail, X, Info } from 'lucide-react'
import { useTranslations } from 'next-intl'
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

export default function BrandPageClient({ locale, brandName }: { locale: string, brandName: string }) {
  const t = useTranslations('brandDetails')
  const brandDataKey = (brandName === 'hikvision' || brandName === 'dahua') ? brandName : 'hikvision'

  const [products, setProducts] = useState<ProductWithTranslation[]>([])
  const [loading, setLoading] = useState(true)
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductWithTranslation | null>(null)
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null)
  const [isAddedToCartModal, setIsAddedToCartModal] = useState(false)

  const bgImage = brandDataKey === 'dahua' ? 'products_02.jpg' : 'hikvision-back.png'
  const howImage = brandDataKey === 'dahua' ? 'dahua-how.jpg' : 'heack-how.jpg'
  const logoImage = brandDataKey === 'dahua' ? 'dahua-logo.png' : 'hikvision-logo.png'

  useEffect(() => {
    const fetchProductsAndTranslations = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('produse')
        .select(`*, product_translations (language_code, description)`)
        .ilike('brand', brandName)

      if (data) {
        const formattedProducts = data.map((product: any) => {
          const translation = product.product_translations?.find((tr: any) => tr.language_code === locale);
          return { ...product, translatedDesc: translation ? translation.description : "" } as ProductWithTranslation;
        })
        const sorted = formattedProducts.sort((a, b) => (a.has_discount === b.has_discount ? 0 : a.has_discount ? -1 : 1))
        setProducts(sorted)
      }
      setLoading(false)
    }
    fetchProductsAndTranslations()
  }, [brandName, locale])

  const scrollToProducts = () => {
    const element = document.getElementById('produse-section')
    if (element) {
      window.scrollTo({ top: element.getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth' });
    }
  }

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

    const finalPrice = product.has_discount ? product.base_price - (product.base_price * product.discount_percentage / 100) : product.base_price;

    const { error } = await supabase.from('order_items').insert([{
      order_id: orderId, produse_id: productId, cantitate: 1, pret_unitar: finalPrice
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

  return (
    <div className="w-full bg-[#F5F2EC] text-[#0F2A4A] flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION (Micșorat și aliniat) */}
      <div className="relative w-full min-h-[60vh] flex flex-col justify-center pt-32 pb-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url('/images/${bgImage}')`}}/>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2A4A] via-[#0F2A4A]/80 to-transparent w-full md:w-3/4" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F5F2EC] via-transparent to-transparent opacity-90" />
        </div>

        {/* Aliniat cu Navbar-ul */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
          <Image src={`/images/${logoImage}`} alt={brandName} width={200} height={60} className="object-contain brightness-0 invert drop-shadow-lg mb-6" priority />
          
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white drop-shadow-lg leading-tight">
            {t(`${brandDataKey}.heroTitle`)}
          </h1>
          <p className="text-base md:text-lg text-[#F5F2EC]/90 font-medium mb-8 max-w-xl leading-relaxed">
            {t(`${brandDataKey}.heroDesc`)}
          </p>

          <button 
            onClick={scrollToProducts}
            className="bg-[#F26A1B] hover:bg-[#C24C0F] text-white px-8 py-3 rounded-xl font-bold transition-all text-base shadow-lg active:scale-95 flex items-center gap-3 w-max"
          >
            {t(`${brandDataKey}.discoverBtn`)} <ChevronDown size={20} />
          </button>
        </div>
      </div>

      {/* 2. CINE ESTE BRANDUL + CTA */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-16 mb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">{t(`${brandDataKey}.whoIsTitle`)}</h2>
          {t(`${brandDataKey}.tags`) && (
            <span className="inline-block bg-[#0F2A4A]/10 text-[#F26A1B] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md text-xs mb-4">
              {t(`${brandDataKey}.tags`)}
            </span>
          )}
          <p className="text-sm text-[#7A8CA5] font-medium leading-relaxed text-justify mb-8">
            {t(`${brandDataKey}.whoIsText`)}
          </p>

          <div className="flex flex-wrap gap-3 mt-4">
            <a href="tel:+37368123456" className="bg-[#0F2A4A] hover:bg-[#F26A1B] text-[#F5F2EC] px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
              <PhoneCall size={16} /> {t('buttons.call')}
            </a>
            <Link href={`/${locale}/galerie`} className="bg-white border border-[#7A8CA5]/20 text-[#0F2A4A] hover:border-[#F26A1B] hover:text-[#F26A1B] px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
              <ImageIcon size={16} /> {t('buttons.gallery')}
            </Link>
            <Link href={`/${locale}/contact`} className="bg-white border border-[#7A8CA5]/20 text-[#0F2A4A] hover:border-[#F26A1B] hover:text-[#F26A1B] px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
              <Mail size={16} /> {t('buttons.contact')}
            </Link>
          </div>
        </div>
        <div className="relative h-[300px] lg:h-[400px] rounded-[1.5rem] overflow-hidden shadow-xl border-4 border-white bg-[#0F2A4A]/5">
           <Image src={`/images/${howImage}`} alt="Brand presentation" fill className="object-cover" />
        </div>
      </div>

      {/* 3. CE OFERIM (Design Premium, Fundal Parallax) */}
      <div className="relative w-full py-24 mb-20 overflow-hidden">
        {/* Fundal tech elegant */}
        <div className="absolute inset-0 bg-[url('/images/products_02.jpg')] bg-cover bg-center bg-fixed opacity-30 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F2A4A] via-[#0F2A4A]/95 to-[#0F2A4A]/90" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-12 border-l-4 border-[#F26A1B] pl-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#F5F2EC] tracking-tight">
              {t(`${brandDataKey}.whatTitle`)}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 text-sm font-medium leading-relaxed text-[#F5F2EC]/80 text-justify">
            <div>
              <p>{t(`${brandDataKey}.whatText1`)}</p>
            </div>
            <div>
              <p>{t(`${brandDataKey}.whatText2`)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. GRID PRODUSE */}
      <div id="produse-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-24 mb-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#7A8CA5]/20 pb-4 mb-8 gap-4">
          <h2 className="text-2xl font-extrabold">{t('productsTitle')} <span className="capitalize text-[#F26A1B]">{brandName}</span></h2>
          <span className="bg-[#0F2A4A] text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-md flex-shrink-0 w-max">{products.length} {t('productsTitle').split(' ')[0]}</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#F26A1B]" size={48} /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#7A8CA5]/10 shadow-sm text-[#7A8CA5] text-xl font-medium">
            Nu s-au găsit produse pentru acest brand.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => {
              const finalPrice = product.has_discount ? product.base_price - (product.base_price * product.discount_percentage / 100) : product.base_price;
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
                        -{product.discount_percentage}%
                      </div>
                    )}
                    {product.images && product.images[0] ? (
                      <Image src={product.images[0]} alt={product.name} fill className="object-contain p-6 mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <ShoppingCart size={32} className="text-[#7A8CA5]/20" />
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-base font-extrabold text-[#0F2A4A] mb-2 leading-snug line-clamp-2">{product.name}</h3>
                    <p className="text-[#7A8CA5] text-xs font-medium leading-relaxed mb-4 line-clamp-2">
                      {product.translatedDesc || "Detalii indisponibile."}
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

      {/* 5. INSTALATOR AUTORIZAT (Mutat jos) */}
      <div className="bg-[#0F2A4A] text-[#F5F2EC] py-20 px-6 mt-auto relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-5 pointer-events-none">
          <ShieldCheck size={400} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ShieldCheck size={48} className="text-[#F26A1B] mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4 leading-tight">{t(`${brandDataKey}.whyTitle`)}</h2>
          <p className="text-[#7A8CA5] text-sm font-medium leading-relaxed">
            {t(`${brandDataKey}.whyText`)}
          </p>
        </div>
      </div>

      {/* MODAL PRODUS PLUTITOR */}
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
                <p className="text-sm text-[#7A8CA5] font-medium leading-relaxed mb-6 overflow-y-auto max-h-[150px] pr-2 hide-scrollbar">
                   {selectedProduct.translatedDesc}
                </p>
                <div className="mb-8 p-5 bg-white rounded-2xl border border-[#7A8CA5]/20 shadow-sm flex justify-between items-center">
                  <span className="block text-sm text-[#7A8CA5] font-bold">Preț unitar:</span>
                  {selectedProduct.has_discount ? (
                    <div className="flex items-center gap-3">
                      <span className="text-lg text-[#7A8CA5] line-through font-medium">{selectedProduct.base_price} MDL</span>
                      <span className="text-3xl font-black text-[#C24C0F]">{(selectedProduct.base_price - (selectedProduct.base_price * selectedProduct.discount_percentage / 100)).toFixed(2)} MDL</span>
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
              {isAddedToCartModal ? (
                 <div className="w-full bg-[#0F2A4A] text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-md animate-in fade-in zoom-in duration-300">
                   <CheckCircle size={24} className="text-[#F26A1B]" />
                   Produs adăugat în coș!
                 </div>
              ) : (
                <button onClick={() => handleAddToCart(undefined, selectedProduct.id)} className="mt-auto w-full bg-[#F26A1B] hover:bg-[#C24C0F] text-white font-bold text-lg py-4 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-3">
                  <ShoppingCart size={22} /> Adaugă în Coș
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DATE CLIENT */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={(orderId: string) => {
          setIsBookingModalOpen(false);
          const productId = addingToCartId || selectedProduct?.id;
          if (productId) proceedToAddProductToCart(orderId, productId);
        }}
      />
    </div>
  )
}