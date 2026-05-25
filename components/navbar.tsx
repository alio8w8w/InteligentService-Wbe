"use client"

import { useEffect, useState, useCallback } from "react"
import { Phone, Menu, X, ShoppingCart, Globe } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const LOCALES = ["ro", "ru", "en"] as const

const NAV_LINKS = [
  { key: "branduri", route: "/branduri" },
  { key: "produse", route: "/produse" },
  { key: "galerie", route: "/galerie" },
  { key: "led_ecrane", route: "/led-ecrane" },
  { key: "contact", route: "/#contact" },
] as const

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  
  const t = useTranslations("nav")
  const currentLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  
  const homePath = `/${currentLocale}`
  const langLabel = (currentLocale ?? "ro").toUpperCase()
  const cartHref = `/${currentLocale}/cos`

  const fetchCartCount = useCallback(async () => {
    const savedOrderId = localStorage.getItem('inteligent_order_id')
    if (!savedOrderId) return

    const { count, error } = await supabase
      .from('order_items')
      .select('*', { count: 'exact', head: true })
      .eq('order_id', savedOrderId)

    if (!error && count !== null) {
      setCartCount(count)
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("focus", fetchCartCount)
    
    fetchCartCount()
    
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("focus", fetchCartCount)
    }
  }, [fetchCartCount])

  const toggleLang = () => {
    const currentIndex = LOCALES.indexOf(currentLocale as (typeof LOCALES)[number])
    const newLocale = LOCALES[(currentIndex + 1) % LOCALES.length]
    const segments = pathname.split("/")
    segments[1] = newLocale 
    router.push(segments.join("/") || `/${newLocale}`, { scroll: false })
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-2" : "py-4"}`}>
      <div className="mx-auto max-w-7xl px-4 relative">
        
        <nav className={`relative z-50 flex items-center justify-between px-6 py-2.5 rounded-full transition-all duration-300 
          ${isOpen ? "bg-white shadow-sm" : isScrolled ? "bg-white/90 backdrop-blur-md shadow-lg border border-gray-100" : "bg-[#F5F2EC]/95 backdrop-blur-sm border border-[#0F2A4A]/5"}`}>
          
          <Link href={homePath} className="relative w-40 h-12 transition-transform hover:scale-105 flex items-center" onClick={() => setIsOpen(false)}>
            <Image src="/images/logo.png" alt="Inteligent Service Logo" fill className="object-contain" priority />
          </Link>

          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            {NAV_LINKS.map(({ key, route }) => {
              const fullRoute = `/${currentLocale}${route}`
              const isActive = pathname === fullRoute || (route !== "/#contact" && pathname.startsWith(fullRoute))

              return (
                <Link
                  key={key}
                  href={fullRoute}
                  className={`font-semibold text-sm tracking-tight transition-colors relative group
                    ${isActive ? "text-[#F26A1B]" : "text-[#0F2A4A] hover:text-[#F26A1B]"}`}
                >
                  {t(key)}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#F26A1B] transition-all 
                    ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}>
                  </span>
                </Link>
              )
            })}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <a 
              href="tel:+37368123456" 
              className="flex items-center gap-2.5 bg-[#0F2A4A] text-[#F26A1B] px-5 py-2.5 rounded-full shadow-md hover:bg-[#0F2A4A]/90 transition-all group hover:-translate-y-0.5"
            >
              <Phone className="h-4 w-4 stroke-[2px] group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold tracking-tight">+373 68 123 456</span>
            </a>

            <div className="h-8 w-px bg-[#0F2A4A]/10"></div>

            <div className="flex items-center gap-3">
              <Link href={cartHref} className="flex items-center justify-center w-10 h-10 rounded-full border border-[#0F2A4A]/10 text-[#0F2A4A] hover:border-[#F26A1B]/30 hover:bg-[#F26A1B]/5 hover:text-[#F26A1B] transition-all relative">
                <ShoppingCart className="h-5 w-5 stroke-[1.5px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F26A1B] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button onClick={toggleLang} className="flex items-center justify-center w-10 h-10 rounded-full border border-[#0F2A4A]/10 text-[#0F2A4A] hover:border-[#F26A1B]/30 hover:bg-[#F26A1B]/5 hover:text-[#F26A1B] transition-all group">
                 <Globe className="h-5 w-5 stroke-[1.5px] group-hover:rotate-12 transition-transform" />
                 <span className="absolute -bottom-5 text-[10px] font-bold text-[#0F2A4A]/50 group-hover:text-[#F26A1B]">{langLabel}</span>
              </button>
            </div>
          </div>

          <button className="lg:hidden text-[#0F2A4A] p-2 rounded-full hover:bg-[#0F2A4A]/5 relative z-50" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {isOpen && (
          <div 
            className="fixed inset-0 z-40 bg-[#F5F2EC]/80 backdrop-blur-md lg:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}

        {isOpen && (
          <div className="absolute top-[80px] left-4 right-4 z-50 lg:hidden p-5 bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col gap-5 animate-fade-in-down">
            {NAV_LINKS.map(({ key, route }) => {
              const fullRoute = `/${currentLocale}${route}`
              const isActive = pathname === fullRoute || (route !== "/#contact" && pathname.startsWith(fullRoute))
              
              return (
                <Link 
                  key={key} 
                  href={fullRoute}
                  onClick={() => setIsOpen(false)} 
                  className={`text-left py-3 border-b border-gray-50 font-semibold text-lg flex justify-between items-center hover:text-[#F26A1B]
                    ${isActive ? "text-[#F26A1B]" : "text-[#0F2A4A]"}`}
                >
                  {t(key)}
                  <span className="text-[#F26A1B]">→</span>
                </Link>
              )
            })}
            
            <div className="flex justify-center items-center gap-6 pt-4 border-t border-gray-100">
               <Link href={cartHref} onClick={() => setIsOpen(false)} className="flex flex-col items-center gap-1 text-[#0F2A4A] relative">
                  <ShoppingCart className="h-7 w-7 stroke-[1.5px]" />
                  <span className="text-xs">Coș</span>
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-[#F26A1B] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
               </Link>

               <button onClick={() => { toggleLang(); setIsOpen(false); }} className="flex flex-col items-center gap-1 text-[#0F2A4A]">
                  <Globe className="h-7 w-7 stroke-[1.5px]" />
                  <span className="text-xs font-bold">{langLabel}</span>
               </button>
            </div>
            
            <a href="tel:+37368123456" className="bg-[#0F2A4A] text-[#F26A1B] py-4 rounded-full flex justify-center items-center gap-3 shadow-lg active:scale-95 transition-all">
              <Phone className="h-5 w-5 stroke-[2px]" /> <span className="font-bold text-lg">+373 68 123 456</span>
            </a>
          </div>
        )}
      </div>
    </header>
  )
}