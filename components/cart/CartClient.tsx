"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
// 1. Am modificat importul aici:
import { createClient } from '@/lib/utils'
import { Trash2, ArrowRight, ShoppingCart, Loader2, PhoneCall, MonitorPlay, X, CheckCircle2 } from 'lucide-react'
import BookingModal from '@/components/booking-modal'

type CartItem = {
  id: string
  cantitate: number
  pret_unitar: number
  produse: {
    id: string
    name: string
    images: string[]
    brand: string
  }
}

type Product = {
  id: string
  name: string
  base_price: number
  images: string[]
  has_discount: boolean
  discount_percentage: number
  brand: string
  translatedDesc?: string
}

export default function CartClient({ locale }: { locale: string }) {
  // 2. Am inițializat clientul Supabase aici:
  const supabase = createClient()

  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [recommended, setRecommended] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [orderId, setOrderId] = useState<string | null>(null)

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isAddedToCartModal, setIsAddedToCartModal] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true)
      const savedOrderId = localStorage.getItem('inteligent_order_id')
      const expiryTime = localStorage.getItem('inteligent_order_expiry')
      const now = new Date().getTime()

      let validOrderId = null;

      if (savedOrderId && expiryTime && now <= parseInt(expiryTime)) {
        validOrderId = savedOrderId;
        setOrderId(savedOrderId)
      } else {
        localStorage.removeItem('inteligent_order_id')
        localStorage.removeItem('inteligent_order_expiry')
        setOrderId(null)
      }

      const fetchCart = validOrderId 
        ? supabase
            .from('order_items')
            .select('id, cantitate, pret_unitar, produse ( id, name, images, brand )')
            .eq('order_id', validOrderId)
        : Promise.resolve({ data: null, error: null })

      const fetchRecs = supabase
        .from('produse')
        .select('id, name, base_price, images, has_discount, discount_percentage, brand, product_translations(language_code, description)')
        .limit(4)

      const [cartResponse, recsResponse] = await Promise.all([fetchCart, fetchRecs])

      if (cartResponse.data) setCartItems(cartResponse.data as any[])
      
      if (recsResponse.data) {
        const formattedRecs = recsResponse.data.map((p: any) => {
          const translation = p.product_translations?.find((tr: any) => tr.language_code === locale);
          return {
            ...p,
            translatedDesc: translation ? translation.description : ""
          };
        });
        setRecommended(formattedRecs as Product[])
      }

      setLoading(false)
    }

    fetchCartData()
  // 3. Adăugat 'supabase' în array-ul de dependențe pentru useEffect:
  }, [locale, supabase]) 

  const removeItem = async (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
    await supabase.from('order_items').delete().eq('id', itemId)
  }

  const getFinalPrice = (p: Product) => p.has_discount ? p.base_price - (p.base_price * p.discount_percentage / 100) : p.base_price;

  const proceedToAddProductToCart = async (targetOrderId: string, product: Product) => {
    const finalPrice = getFinalPrice(product);
    const existingItem = cartItems.find(item => item.produse.id === product.id);

    if (existingItem) {
      const newQuantity = existingItem.cantitate + 1;
      
      const { data, error } = await supabase
        .from('order_items')
        .update({ cantitate: newQuantity })
        .eq('id', existingItem.id)
        .select('id, cantitate, pret_unitar, produse ( id, name, images, brand )')
        .single()

      if (!error && data) {
        setCartItems(prev => prev.map(item => item.id === existingItem.id ? (data as any) : item));
        showSuccessModal();
      }
    } else {
      const { data, error } = await supabase
        .from('order_items')
        .insert([{
          order_id: targetOrderId,
          produse_id: product.id,
          cantitate: 1,
          pret_unitar: finalPrice
        }])
        .select('id, cantitate, pret_unitar, produse ( id, name, images, brand )')
        .single()

      if (!error && data) {
        setCartItems(prev => [...prev, data as any]);
        showSuccessModal();
      }
    }
  }

  const showSuccessModal = () => {
    setIsAddedToCartModal(true);
    setTimeout(() => {
      setIsAddedToCartModal(false);
      setSelectedProduct(null);
    }, 2000);
  }

  const handleAddRecommendedToCart = () => {
    if (!selectedProduct) return;
    
    const savedOrderId = localStorage.getItem('inteligent_order_id');
    const expiryTime = localStorage.getItem('inteligent_order_expiry');
    const now = new Date().getTime();

    if (!savedOrderId || !expiryTime || now > parseInt(expiryTime)) {
      setIsBookingModalOpen(true);
      return;
    }

    proceedToAddProductToCart(savedOrderId, selectedProduct);
  }

  const totalSum = cartItems.reduce((acc, item) => acc + (item.pret_unitar * item.cantitate), 0)

  if (loading) {
    return <div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="animate-spin text-[#F26A1B]" size={48} /></div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans text-[#0F2A4A] relative">
      <div className="mb-8 mt-6">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">Coșul tău</h1>
        <p className="text-[#7A8CA5] font-medium">
          {cartItems.length} {cartItems.length === 1 ? 'produs' : 'produse'} în coș
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-[#7A8CA5]/20 p-12 text-center shadow-sm flex flex-col items-center">
          <div className="w-24 h-24 bg-[#F5F2EC] rounded-full flex items-center justify-center mb-6 text-[#7A8CA5]">
            <ShoppingCart size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-4">Coșul tău este gol</h2>
          <p className="text-[#7A8CA5] mb-8 max-w-md">Descoperă gama noastră de sisteme de securitate și găsește echipamentul perfect pentru nevoile tale.</p>
          <Link href={`/${locale}/produse`} className="bg-[#F26A1B] hover:bg-[#C24C0F] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md active:scale-95 flex items-center gap-2">
            Înapoi la magazin <ArrowRight size={20} />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="lg:w-2/3 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 sm:p-6 rounded-[2rem] border border-[#7A8CA5]/20 shadow-sm flex flex-col sm:flex-row items-center gap-6 group hover:border-[#F26A1B]/30 transition-colors">
                <div className="w-full sm:w-32 h-32 bg-[#F5F2EC] rounded-2xl p-4 flex items-center justify-center relative flex-shrink-0">
                  {item.produse.images && item.produse.images[0] ? (
                    <Image src={item.produse.images[0]} alt={item.produse.name} fill className="object-contain p-2 mix-blend-multiply" />
                  ) : (
                    <ShoppingCart size={24} className="text-[#7A8CA5]/40" />
                  )}
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <span className="text-xs font-black text-[#7A8CA5] uppercase tracking-widest">{item.produse.brand || "Echipament"}</span>
                  <h3 className="text-lg font-bold text-[#0F2A4A] leading-tight mt-1 mb-2">{item.produse.name}</h3>
                  <div className="text-[#7A8CA5] text-sm font-medium">Cantitate: {item.cantitate}</div>
                </div>
                <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-4 sm:gap-2 w-full sm:w-auto">
                  <span className="text-xl font-black text-[#0F2A4A] whitespace-nowrap">{item.pret_unitar.toFixed(2)} MDL</span>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-[#7A8CA5] hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Trash2 size={20} /> <span className="sm:hidden font-bold">Șterge</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-1/3">
            <div className="bg-[#0F2A4A] text-[#F5F2EC] rounded-[2rem] p-8 shadow-2xl sticky top-28">
              <h3 className="text-xl font-extrabold mb-6 border-b border-[#7A8CA5]/20 pb-4">Sumar Comandă</h3>
              <div className="space-y-4 mb-6 text-[#7A8CA5] font-medium">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} produse)</span>
                  <span className="text-[#F5F2EC]">{totalSum.toFixed(2)} MDL</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxe / Instalare</span>
                  <span className="text-[#F5F2EC]">Se calculează ulterior</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-[#7A8CA5]/20 pt-6 mb-8">
                <span className="text-lg font-bold">Total estimat</span>
                <span className="text-3xl font-black text-[#F26A1B]">{totalSum.toFixed(2)} MDL</span>
              </div>
              <button className="w-full bg-[#F26A1B] hover:bg-[#C24C0F] text-white py-4 rounded-xl font-bold transition-all shadow-md active:scale-95 text-lg">
                Trimite Comanda
              </button>
            </div>
          </div>
        </div>
      )}

      {recommended.length > 0 && (
        <div className="mt-24 pt-12 border-t border-[#7A8CA5]/20">
          <h2 className="text-2xl font-extrabold text-[#0F2A4A] mb-8">Produse recomandate</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommended.map(product => (
              <div 
                key={product.id} 
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-2xl p-4 border border-[#7A8CA5]/10 hover:border-[#F26A1B]/30 hover:shadow-xl transition-all duration-300 group flex flex-col cursor-pointer relative"
              >
                {product.has_discount && (
                  <div className="absolute top-6 left-6 bg-[#C24C0F] text-white text-[10px] font-black uppercase px-2 py-1 rounded-full z-10 shadow-md">
                    -{product.discount_percentage}%
                  </div>
                )}
                <div className="h-40 w-full bg-[#F5F2EC] rounded-xl mb-4 p-4 relative flex items-center justify-center">
                  {product.images && product.images[0] ? (
                    <Image src={product.images[0]} alt={product.name} fill className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <ShoppingCart className="text-[#7A8CA5]/30" size={32} />
                  )}
                </div>
                <h4 className="font-bold text-[#0F2A4A] line-clamp-2 mb-2 group-hover:text-[#F26A1B] transition-colors">{product.name}</h4>
                <div className="mt-auto flex flex-col">
                  {product.has_discount && <span className="text-xs text-[#7A8CA5] line-through font-medium">{product.base_price} MDL</span>}
                  <div className="font-black text-[#0F2A4A]">{getFinalPrice(product).toFixed(2)} MDL</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
        <div className="bg-[#0F2A4A] rounded-[2rem] p-8 flex flex-col sm:flex-row items-center gap-6 text-[#F5F2EC] shadow-lg border border-[#0F2A4A]">
          <div className="w-16 h-16 rounded-full bg-[#F26A1B]/20 flex items-center justify-center flex-shrink-0">
            <PhoneCall size={32} className="text-[#F26A1B]" />
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h3 className="text-xl font-bold mb-2">Nu ești sigur ce să alegi?</h3>
            <p className="text-[#7A8CA5] text-sm mb-4">Inginerii noștri îți oferă consultanță gratuită pentru a alege sistemul optim.</p>
            <a href="tel:+37368123456" className="inline-block text-[#F26A1B] font-bold hover:text-[#F5F2EC] transition-colors">
              Solicită un apel telefonic →
            </a>
          </div>
        </div>

        <div className="bg-[#F5F2EC] rounded-[2rem] p-8 flex flex-col sm:flex-row items-center gap-6 text-[#0F2A4A] shadow-sm border border-[#7A8CA5]/20 hover:border-[#F26A1B]/40 transition-colors">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-[#7A8CA5]/10">
            <MonitorPlay size={32} className="text-[#0F2A4A]" />
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h3 className="text-xl font-bold mb-2">Sisteme de afișaj profesionale</h3>
            <p className="text-[#7A8CA5] text-sm mb-4">Descoperă gama noastră de ecrane LED pentru interior și exterior.</p>
            <Link href={`/${locale}/led-ecran`} className="inline-block text-[#0F2A4A] font-bold hover:text-[#F26A1B] transition-colors">
              Vezi colecția LED →
            </Link>
          </div>
        </div>
      </div>

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
                <span className="text-[#7A8CA5] font-black uppercase tracking-widest text-xs mb-2 block">{selectedProduct.brand || 'Recomandat'}</span>
                <h2 className="text-2xl md:text-3xl font-extrabold mb-4 leading-tight">{selectedProduct.name}</h2>
                <p className="text-sm text-[#7A8CA5] font-medium leading-relaxed mb-6 overflow-y-auto max-h-[150px] pr-2 hide-scrollbar">
                   {selectedProduct.translatedDesc || "Nu există descriere disponibilă."}
                </p>
                <div className="mb-8 p-5 bg-white rounded-2xl border border-[#7A8CA5]/20 shadow-sm flex justify-between items-center">
                  <span className="block text-sm text-[#7A8CA5] font-bold">Preț unitar:</span>
                  {selectedProduct.has_discount ? (
                    <div className="flex items-center gap-3">
                      <span className="text-lg text-[#7A8CA5] line-through font-medium">{selectedProduct.base_price} MDL</span>
                      <span className="text-3xl font-black text-[#C24C0F]">{getFinalPrice(selectedProduct).toFixed(2)} MDL</span>
                    </div>
                  ) : (
                    <span className="text-3xl font-black">{selectedProduct.base_price} MDL</span>
                  )}
                </div>
              </div>
              
              {isAddedToCartModal ? (
                 <div className="w-full bg-[#0F2A4A] text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-md animate-in fade-in zoom-in duration-300">
                   <CheckCircle2 size={24} className="text-[#F26A1B]" />
                   Produs adăugat în coș!
                 </div>
              ) : (
                <button onClick={handleAddRecommendedToCart} className="mt-auto w-full bg-[#F26A1B] hover:bg-[#C24C0F] text-white font-bold text-lg py-4 rounded-xl transition-all shadow-md hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-3">
                  <ShoppingCart size={22} /> Adaugă în Coș
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={(newOrderId: string) => {
          setOrderId(newOrderId);
          setIsBookingModalOpen(false);
          if (selectedProduct) {
            proceedToAddProductToCart(newOrderId, selectedProduct);
          }
        }}
      />
    </div>
  )
}