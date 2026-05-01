"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import { ArrowRight, ShoppingCart, Loader2, ShieldCheck, CheckCircle, ChevronDown } from 'lucide-react'
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
  translatedDesc?: string // Aici vom salva descrierea tradusă din DB
}

export default function BrandPageClient({ locale, brandName }: { locale: string, brandName: string }) {
  const t = useTranslations('brandDetails')
  // Verificăm dacă avem date pentru acest brand în JSON, altfel folosim un fallback ca să nu crape
  const brandDataKey = (brandName === 'hikvision' || brandName === 'dahua') ? brandName : 'hikvision'

  const [products, setProducts] = useState<ProductWithTranslation[]>([])
  const [loading, setLoading] = useState(true)
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null)

  useEffect(() => {
    const fetchProductsAndTranslations = async () => {
      setLoading(true)
      
      // 1. Extragem produsele și facem JOIN cu traducerile
      const { data, error } = await supabase
        .from('produse')
        .select(`
          *,
          product_translations (
            language_code,
            description
          )
        `)
        .ilike('brand', brandName)

      if (data) {
        // 2. Mapăm datele pentru a scoate exact descrierea în limba activă a site-ului (ro, ru, en)
        const formattedProducts = data.map((product: any) => {
          const translation = product.product_translations?.find((tr: any) => tr.language_code === locale);
          const finalDesc = translation ? translation.description : "";
          
          return {
            ...product,
            translatedDesc: finalDesc
          } as ProductWithTranslation;
        })

        // 3. Sortăm produsele cu reduceri primele
        const sorted = formattedProducts.sort((a, b) => (a.has_discount === b.has_discount ? 0 : a.has_discount ? -1 : 1))
        setProducts(sorted)
      }
      setLoading(false)
    }

    fetchProductsAndTranslations()
  }, [brandName, locale])

  // Funcție derulare
  const scrollToProducts = () => {
    const element = document.getElementById('produse-section')
    if (element) {
      window.scrollTo({ top: element.getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth' });
    }
  }

  // --- LOGICA COȘ DE CUMPĂRĂTURI ---
  const handleAddToCart = (productId: string) => {
    const savedOrderId = localStorage.getItem('inteligent_order_id');
    setSelectedProductId(productId);

    if (!savedOrderId) {
      setIsBookingModalOpen(true);
      return;
    }
    proceedToAddProductToCart(savedOrderId, productId);
  }

  const proceedToAddProductToCart = async (orderId: string, productId: string) => {
    setAddingToCartId(productId)
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const finalPrice = product.has_discount 
      ? product.base_price - (product.base_price * product.discount_percentage / 100) 
      : product.base_price;

    const { error } = await supabase
      .from('order_items')
      .insert([{
        order_id: orderId,
        produse_id: productId,
        cantitate: 1,
        pret_unitar: finalPrice
      }]);

    if (!error) {
      setTimeout(() => {
        setAddingToCartId(null)
      }, 2000) // Se arată bifa verde 2 secunde
    }
  }

  return (
    <div className="w-full bg-[#F5F2EC] text-[#0F2A4A] pb-24">
      
      {/* 1. HERO SECTION */}
      <div className="relative w-full h-[60vh] min-h-[400px] flex flex-col justify-center items-center text-center px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/images/background-admin.jpg')] bg-cover bg-center bg-no-repeat opacity-40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F2A4A]/80 via-[#0F2A4A]/50 to-[#F5F2EC]" />
        </div>

        <div className="relative z-10 max-w-4xl mt-10">
          <Image src={`/images/${brandName}-logo.png`} alt={brandName} width={250} height={100} className="mx-auto mb-8 object-contain brightness-0 invert drop-shadow-xl" />
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 text-[#F5F2EC] drop-shadow-md">
            {t(`${brandDataKey}.heroTitle`)}
          </h1>
          <button 
            onClick={scrollToProducts}
            className="bg-[#F26A1B] hover:bg-[#C24C0F] text-white px-10 py-4 rounded-2xl font-black transition-all text-lg shadow-xl active:scale-95 flex items-center gap-3 mx-auto"
          >
            {t(`${brandDataKey}.discoverBtn`)} <ChevronDown size={24} />
          </button>
        </div>
      </div>

      {/* 2. CINE ESTE BRANDUL */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16 mb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">{t(`${brandDataKey}.whoIsTitle`)}</h2>
          <span className="inline-block bg-[#0F2A4A]/10 text-[#F26A1B] font-black uppercase tracking-widest px-4 py-2 rounded-lg text-sm mb-6">
            {t(`${brandDataKey}.tags`)}
          </span>
          <p className="text-lg text-[#7A8CA5] font-medium leading-relaxed">
            {t(`${brandDataKey}.whoIsText`)}
          </p>
        </div>
        <div className="relative h-[400px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
           <Image src="/images/brand-back.png" alt="Camera presentation" fill className="object-cover" />
        </div>
      </div>

      {/* 3. INSTALATOR AUTORIZAT (Banda Întunecată) */}
      <div className="bg-[#0F2A4A] text-[#F5F2EC] py-20 px-6 my-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-5 pointer-events-none">
          <ShieldCheck size={400} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ShieldCheck size={48} className="text-[#F26A1B] mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">{t(`${brandDataKey}.whyTitle`)}</h2>
          <p className="text-[#7A8CA5] text-lg font-medium leading-relaxed">
            {t(`${brandDataKey}.whyText`)}
          </p>
        </div>
      </div>

      {/* 4. CE OFERIM */}
      <div className="max-w-5xl mx-auto px-6 mb-32 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-8">{t(`${brandDataKey}.whatTitle`)}</h2>
        <div className="space-y-6 text-lg text-[#7A8CA5] font-medium leading-relaxed text-justify sm:text-center">
          <p>{t(`${brandDataKey}.whatText1`)}</p>
          <p>{t(`${brandDataKey}.whatText2`)}</p>
        </div>
      </div>

      {/* 5. GRID PRODUSE (Aici afișăm descrierea tradusă din DB) */}
      <div id="produse-section" className="max-w-7xl mx-auto px-6 lg:px-8 scroll-mt-24">
        <div className="flex items-center justify-between border-b border-[#7A8CA5]/20 pb-6 mb-12">
          <h2 className="text-3xl font-extrabold">{t('productsTitle')} <span className="capitalize">{brandName}</span></h2>
          <span className="bg-[#F26A1B] text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-md">{products.length} {t('productsTitle').split(' ')[0]}</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#F26A1B]" size={48} /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#7A8CA5]/10 shadow-sm text-[#7A8CA5] text-xl font-medium">
            Nu s-au găsit produse pentru acest brand.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => {
              const finalPrice = product.has_discount ? product.base_price - (product.base_price * product.discount_percentage / 100) : product.base_price;
              const isAdding = addingToCartId === product.id;

              return (
                <div key={product.id} className="bg-white rounded-[2.5rem] border border-[#7A8CA5]/15 shadow-sm hover:shadow-2xl hover:border-[#F26A1B]/30 transition-all duration-300 flex flex-col overflow-hidden group">
                  
                  {/* Imagine */}
                  <div className="relative h-72 w-full bg-[#F5F2EC]/50 p-8 flex items-center justify-center">
                    {product.has_discount && (
                      <div className="absolute top-4 left-4 bg-[#C24C0F] text-white text-xs font-black uppercase px-4 py-2 rounded-full z-10 shadow-md">
                        -{product.discount_percentage}% REDUCERE
                      </div>
                    )}
                    {product.images && product.images[0] ? (
                      <Image src={product.images[0]} alt={product.name} fill className="object-contain p-8 mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <ShoppingCart size={48} className="text-[#7A8CA5]/20" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-xl font-extrabold text-[#0F2A4A] mb-3 leading-snug">{product.name}</h3>
                    
                    {/* AICI ESTE DESCRIEREA TRADUSĂ EXTRASĂ DIN BAZA DE DATE! */}
                    <p className="text-[#7A8CA5] text-sm font-medium leading-relaxed mb-6 line-clamp-3">
                      {product.translatedDesc || "Informații adiționale nu sunt disponibile momentan."}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-[#7A8CA5]/10 flex items-center justify-between">
                      <div className="flex flex-col">
                        {product.has_discount && (
                          <span className="text-sm text-[#7A8CA5] line-through font-medium">{product.base_price} MDL</span>
                        )}
                        <span className="text-2xl font-black text-[#0F2A4A]">{finalPrice.toFixed(2)} MDL</span>
                      </div>
                      
                      <button 
                        onClick={() => handleAddToCart(product.id)}
                        disabled={isAdding}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-95 ${
                          isAdding ? 'bg-green-500 text-white' : 'bg-[#F26A1B] hover:bg-[#C24C0F] text-white'
                        }`}
                      >
                        {isAdding ? <CheckCircle size={24} /> : <ShoppingCart size={24} />}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* MODAL COȘ (Preluat din pașii anteriori) */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={(orderId) => {
          setIsBookingModalOpen(false);
          if (selectedProductId) {
            proceedToAddProductToCart(orderId, selectedProductId);
          }
        }}
      />
    </div>
  )
}