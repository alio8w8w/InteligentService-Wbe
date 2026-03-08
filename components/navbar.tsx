"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Phone } from "lucide-react"

const navLinks = [
  { label: "Acasa", href: "/" },
  { label: "Despre Noi", href: "#about" },
  { label: "Servicii", href: "/servicii" },
  { label: "Preturi", href: "/preturi" },
  { label: "Contact", href: "#contact" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
      role="navigation"
      aria-label="Navigatie principala"
    >
      <div
        className={`w-full max-w-5xl rounded-2xl border transition-all duration-500 ${
          scrolled
            ? "border-[#9BABAB]/15 bg-[#06141B]/60 shadow-lg shadow-[#06141B]/40"
            : "border-[#9BABAB]/10 bg-[#06141B]/30"
        } backdrop-blur-xl backdrop-saturate-150`}
      >
        <div className="px-5 lg:px-6">
          <div className="flex h-14 items-center justify-between">
            {/* Logo - left aligned */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="flex items-center gap-1 group"
                aria-label="Inteligent Service - Pagina principala"
              >
                <span className="text-lg font-bold tracking-tight text-[#CCD0CF] font-mono transition-colors duration-300 group-hover:text-white">
                  Inteligent
                </span>
                <span className="text-lg font-bold tracking-tight text-[#FF4B04] font-mono">
                  Service
                </span>
              </Link>
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative px-3.5 py-2 text-sm text-[#9BABAB] rounded-xl transition-all duration-300 hover:text-[#CCD0CF] hover:bg-[#9BABAB]/10 hover:backdrop-blur-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA button desktop */}
            <div className="hidden md:flex items-center">
              <a
                href="tel:+40700000000"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#FF4B04]/90 border border-[#FF4B04]/30 transition-all duration-300 hover:bg-[#FF4B04] hover:shadow-lg hover:shadow-[#FF4B04]/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Suna Acum</span>
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-[#9BABAB] hover:text-[#CCD0CF] rounded-xl transition-all duration-300 hover:bg-[#9BABAB]/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Inchide meniul" : "Deschide meniul"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-400 ease-out ${
            mobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-5 pb-4 pt-1 border-t border-[#9BABAB]/10">
            <div className="flex flex-col gap-0.5 mt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2.5 text-sm text-[#9BABAB] hover:text-[#CCD0CF] hover:bg-[#9BABAB]/10 rounded-xl transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 mt-1 border-t border-[#9BABAB]/10">
                <a
                  href="tel:+40700000000"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[#FF4B04]/90 transition-all duration-300 hover:bg-[#FF4B04]"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Suna Acum</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
