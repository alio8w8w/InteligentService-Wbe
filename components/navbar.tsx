"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useRouter, usePathname } from "next/navigation"
import { useLocale } from "next-intl"
import BookingModal from "./booking-modal"

const navKeys = ["servicii", "tehnologii", "echipa", "contacte"] as const
const navHrefs = ["#servicii", "#tehnologii", "#echipa", "#contacte"]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations("nav")
  const currentLocale = useLocale() // ← folosim hook-ul next-intl

  const toggleLang = () => {
    // Ciclăm prin cele 3 limbi: ro → ru → en → ro
    const locales = ["ro", "ru", "en"]
    const currentIndex = locales.indexOf(currentLocale)
    const newLocale = locales[(currentIndex + 1) % locales.length]

    // Înlocuim prefixul de locale în URL
    const segments = pathname.split("/")
    segments[1] = newLocale
    router.push(segments.join("/") || "/")
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (bookingOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [bookingOpen])

  // Afișăm eticheta butonului în funcție de limba curentă
  const langLabel = { ro: "RO", ru: "RU", en: "EN" }[currentLocale] ?? "RO"

  return (
    <>
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-[#1a1613]/90 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <nav className="flex items-center justify-between px-4 py-3 lg:mx-auto lg:max-w-7xl lg:px-10 lg:py-4">
          <a href="#" className="flex-shrink-0">
            <div className="relative h-9 w-[100px] sm:h-11 sm:w-[140px] lg:h-14 lg:w-[200px]">
              <Image
                src="/images/LogoVB.png"
                alt="Beauty Space by VB"
                fill
                sizes="(max-width: 640px) 100px, (max-width: 1024px) 140px, 200px"
                className="object-contain object-left"
                priority
              />
            </div>
          </a>

          <div className="hidden items-center gap-6 lg:flex">
            {navKeys.map((key, i) => (
              <a
                key={key}
                href={navHrefs[i]}
                className="font-[var(--font-raleway)] text-sm font-light tracking-wider text-[#f5f0eb]/80 transition-colors duration-300 hover:text-[#c9a96e]"
              >
                {t(key)}
              </a>
            ))}
            <button
              onClick={toggleLang}
              className="rounded-full border border-[#c9a96e]/30 px-3 py-1 font-[var(--font-raleway)] text-xs font-light tracking-widest text-[#c9a96e] transition-all duration-300 hover:border-[#c9a96e] hover:bg-[#c9a96e]/10"
            >
              {langLabel}
            </button>

            <button
              onClick={() => setBookingOpen(true)}
              className="rounded-full bg-[#c9a96e] px-6 py-2.5 font-[var(--font-raleway)] text-sm font-medium tracking-wider text-[#1a1613] transition-all duration-300 hover:bg-[#d4b87e]"
            >
              {t("programeaza")}
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleLang}
              className="rounded-full border border-[#c9a96e]/50 px-3 py-1 font-[var(--font-raleway)] text-xs font-light tracking-wider text-[#c9a96e]"
            >
              {langLabel}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex-shrink-0 p-1 text-[#f5f0eb]"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="absolute inset-x-0 top-full bg-[#1a1613]/97 backdrop-blur-lg lg:hidden">
            <div className="flex flex-col items-center gap-5 px-6 py-8">
              {navKeys.map((key, i) => (
                <a
                  key={key}
                  href={navHrefs[i]}
                  onClick={() => setMobileOpen(false)}
                  className="font-[var(--font-raleway)] text-sm font-light tracking-widest text-[#f5f0eb]/80 uppercase transition-colors duration-300 hover:text-[#c9a96e]"
                >
                  {t(key)}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false)
                  setBookingOpen(true)
                }}
                className="mt-2 w-full max-w-[240px] rounded-full bg-[#c9a96e] py-3 text-center font-[var(--font-raleway)] text-sm font-medium tracking-wider text-[#1a1613] transition-all duration-300 hover:bg-[#d4b87e]"
              >
                {t("programeaza")}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  )
}