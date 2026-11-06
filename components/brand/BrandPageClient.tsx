"use client"

import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/utils'
import { ArrowRight, ShoppingCart, Loader2, ShieldCheck, CheckCircle, ChevronDown, PhoneCall, Image as ImageIcon, Mail, X, Info } from 'lucide-react'
import { useTranslations } from 'next-intl'
import BookingModal from '@/components/booking-modal' 

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
export default function BrandPageClient({ locale, brandName }: { locale: string; brandName: string }) {
  const t = useTranslations('brandDetails')
  const brandDataKey = brandName === 'hikvision' || brandName === 'dahua' ? brandName : 'hikvision'

  const [products, setProducts] = useState<ProductWithTranslation[]>([])
  const [loading, setLoading] = useState(true)

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductWithTranslation | null>(null)

  const [addingToCartId, setAddingToCartId] = useState<string | null>(null)
  const [isAddingToModalCart, setIsAddingToModalCart] = useState(false)
  const [isAddedToCartModal, setIsAddedToCartModal] = useState(false)
  const [pendingProductId, setPendingProductId] = useState<string | null>(null)

  const { bgImage, howImage, logoImage } = useMemo(() => {
    return {
      bgImage: brandDataKey === 'dahua' ? 'products_02.jpg' : 'hikvision-back.png',
      howImage: brandDataKey === 'dahua' ? 'dahua-how.jpg' : 'heack-how.jpg',
      logoImage: brandDataKey === 'dahua' ? 'dahua-logo.png' : 'hikvision-logo.png',
    }
  }, [brandDataKey])

  useEffect(() => {
    const fetchProductsAndTranslations = async () => {
      setLoading(true)
      const { data } = await createClient().from('produse').select(`*, product_translations (language_code, description)`).ilike('brand', brandName)

      if (data) {
        const formattedProducts: ProductWithTranslation[] = data.map((product: any) => {
          const translation = product.product_translations?.find((tr: any) => tr.language_code === locale)
          return { ...product, translatedDesc: translation ? translation.description : '' } as ProductWithTranslation
        })
        const sorted = [...formattedProducts].sort((a, b) => (a.has_discount === b.has_discount ? 0 : a.has_discount ? -1 : 1))
        setProducts(sorted)
      }
      setLoading(false)
    }
    fetchProductsAndTranslations()
  }, [brandName, locale])

  const scrollToProducts = () => {
    const element = document.getElementById('produse-section')
    if (element) {
      window.scrollTo({ top: element.getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth' })
    }
  }

  const handleAddToCart = (e?: React.MouseEvent, productId?: string) => {
    if (e) e.stopPropagation()
    const targetId = productId || selectedProduct?.id
    if (!targetId) return

    const savedOrderId = localStorage.getItem('inteligent_order_id')
    const expiryTime = localStorage.getItem('inteligent_order_expiry')
    const now = new Date().getTime()

    if (!savedOrderId || !expiryTime || now > parseInt(expiryTime)) {
      localStorage.removeItem('inteligent_order_id')
      localStorage.removeItem('inteligent_order_expiry')
      setPendingProductId(targetId)
      setIsBookingModalOpen(true)
      return
    }
    proceedToAddProductToCart(savedOrderId, targetId)
  }

  const proceedToAddProductToCart = async (orderId: string, productId: string) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    if (selectedProduct?.id === productId) setIsAddingToModalCart(true)
    else setAddingToCartId(productId)

    const finalPrice = product.has_discount ? product.base_price - (product.base_price * product.discount_percentage) / 100 : product.base_price

    const { error } = await createClient().from('order_items').insert([{ order_id: orderId, produse_id: productId, cantitate: 1, pret_unitar: finalPrice }])

    setIsAddingToModalCart(false)

    if (!error) {
      if (selectedProduct?.id === productId) {
        setIsAddedToCartModal(true)
        setTimeout(() => {
          setIsAddedToCartModal(false)
          setSelectedProduct(null)
        }, 2000)
      } else {
        setTimeout(() => {
          setAddingToCartId(null)
        }, 2000)
      }
    } else {
      console.error('Eroare la adăugarea în coș', error)
      setAddingToCartId(null)
    }
  }

  return (
    <div className="w-full bg-[#F5F2EC] text-[#0F2A4A] flex flex-col min-h-screen">
      <div className="relative w-full min-h-[60vh] flex flex-col justify-center pt-32 pb-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('/images/${bgImage}')` }} />
          <div className="absolute inset-0 bg-linear-to-r from-[#0F2A4A] via-[#0F2A4A]/80 to-transparent w-full md:w-3/4" />
          <div className="absolute inset-0 bg-linear-to-t from-[#F5F2EC] via-transparent to-transparent opacity-90" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
          <Image src={`/images/${logoImage}`} alt={brandName} width={200} height={60} className="object-contain brightness-0 invert drop-shadow-lg mb-6" priority />

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white drop-shadow-lg leading-tight">{t(`${brandDataKey}.heroTitle`)}</h1>
          <p className="text-base md:text-lg text-[#F5F2EC]/90 font-medium mb-8 max-w-xl leading-relaxed">{t(`${brandDataKey}.heroDesc`)}</p>

          <button onClick={scrollToProducts} className="bg-[#F26A1B] hover:bg-[#C24C0F] text-white px-8 py-3 rounded-xl font-bold transition-all text-base shadow-lg active:scale-95 flex items-center gap-3 w-max">
            {t(`${brandDataKey}.discoverBtn`)} <ChevronDown size={20} />
          </button>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-16 mb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">{t(`${brandDataKey}.whoIsTitle`)}</h2>
          {t(`${brandDataKey}.tags`) && <span className="inline-block bg-[#0F2A4A]/10 text-[#F26A1B] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md text-xs mb-4">{t(`${brandDataKey}.tags`)}</span>}
          <p className="text-sm text-[#7A8CA5] font-medium leading-relaxed text-justify mb-8">{t(`${brandDataKey}.whoIsText`)}</p>

          <div className="flex flex-wrap gap-3 mt-4">
            <a href="tel:+37368123456" className="bg-[#0F2A4A] hover:bg-[#F26A1B] text-[#F5F2EC] px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"><PhoneCall size={16} /> {t('buttons.call')}</a>
            <Link href={`/${locale}/galerie`} className="bg-white border border-[#7A8CA5]/20 text-[#0F2A4A] hover:border-[#F26A1B] hover:text-[#F26A1B] px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"><ImageIcon size={16} /> {t('buttons.gallery')}</Link>
            <Link href={`/${locale}/#contact`} className="bg-white border border-[#7A8CA5]/20 text-[#0F2A4A] hover:border-[#F26A1B] hover:text-[#F26A1B] px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"><Mail size={16} /> {t('buttons.contact')}</Link>
          </div>
        </div>
        <div className="relative h-75 lg:h-100 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-[#0F2A4A]/5">
          <Image src={`/images/${howImage}`} alt="Brand presentation" fill className="object-cover" />
        </div>
      </div>

      <div id="produse-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-24 mb-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#7A8CA5]/20 pb-4 mb-8 gap-4">
          <h2 className="text-2xl font-extrabold">{t('productsTitle')} <span className="capitalize text-[#F26A1B]">{brandName}</span></h2>
          <span className="bg-[#0F2A4A] text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-md shrink-0 w-max">{products.length} {t('productsTitle').split(' ')[0]}</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#F26A1B]" size={48} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => {
              const finalPrice = product.has_discount ? product.base_price - (product.base_price * product.discount_percentage) / 100 : product.base_price
              const isAdding = addingToCartId === product.id

              return (
                <div key={product.id} onClick={() => setSelectedProduct(product)} className="bg-white rounded-3xl border border-[#7A8CA5]/15 shadow-sm hover:shadow-xl hover:border-[#F26A1B]/30 transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer">
                  <div className="relative h-48 w-full bg-[#F5F2EC]/30 p-6 flex items-center justify-center">
                    {product.has_discount && <div className="absolute top-3 left-3 bg-[#C24C0F] text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full z-10 shadow-md">-{product.discount_percentage}%</div>}
                    {product.images && product.images[0] ? (<Image src={product.images[0]} alt={product.name} fill className="object-contain p-6 mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />) : (<ShoppingCart size={32} className="text-[#7A8CA5]/20" />)}
                  </div>

                  <div className="p-5 flex flex-col grow">
                    <h3 className="text-base font-extrabold text-[#0F2A4A] mb-2 leading-snug line-clamp-2">{product.name}</h3>
                    <p className="text-[#7A8CA5] text-xs font-medium leading-relaxed mb-4 line-clamp-2">{product.translatedDesc || 'Detalii indisponibile.'}</p>
                    <div className="mt-auto pt-4 border-t border-[#7A8CA5]/10 flex items-center justify-between">
                      <div className="flex flex-col">
                        {product.has_discount && <span className="text-[10px] text-[#7A8CA5] line-through font-medium">{product.base_price} MDL</span>}
                        <span className="text-lg font-black text-[#0F2A4A]">{finalPrice.toFixed(2)} MDL</span>
                      </div>
                      <button onClick={(e) => handleAddToCart(e, product.id)} disabled={isAdding} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-95 ${isAdding ? 'bg-green-500 text-white' : 'bg-[#F26A1B] hover:bg-[#C24C0F] text-white'}`}>
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

      {selectedProduct && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-[#0F2A4A]/80 backdrop-blur-md" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-4xl bg-[#F5F2EC] rounded-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] animate-in zoom-in-95 duration-300">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-50 bg-[#0F2A4A]/10 text-[#0F2A4A] hover:bg-[#C24C0F] hover:text-white p-2 rounded-full transition-colors backdrop-blur-sm shadow-sm"><X size={24} /></button>
            <div className="w-full md:w-1/2 bg-white relative min-h-62.5 md:min-h-100 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-[#7A8CA5]/10">
              <Image src={selectedProduct.images[0] || '/placeholder.png'} alt={selectedProduct.name} fill className="object-contain p-8 mix-blend-multiply" />
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between text-[#0F2A4A] bg-[#F5F2EC]">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-6 leading-tight">{selectedProduct.name}</h2>
              {isAddedToCartModal ? (
                <div className="bg-[#0F2A4A] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"><CheckCircle size={24} className="text-[#F26A1B]" /> Produs adăugat!</div>
              ) : (
                <button onClick={(e) => handleAddToCart(e, selectedProduct.id)} disabled={isAddingToModalCart} className="w-full bg-[#F26A1B] text-white font-bold py-4 rounded-xl">{isAddingToModalCart ? <Loader2 className="animate-spin" /> : 'Adaugă în Coș'}</button>
              )}
            </div>
          </div>
        </div>
      )}

      <BookingModal isOpen={isBookingModalOpen} onClose={() => { setIsBookingModalOpen(false); setPendingProductId(null) }} onSuccess={(orderId: string) => { setIsBookingModalOpen(false); if (pendingProductId) { proceedToAddProductToCart(orderId, pendingProductId); setPendingProductId(null) } }} />
    </div>
  )
}