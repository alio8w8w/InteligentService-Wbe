"use client"

import { useState } from "react"
import { Phone, Menu, X, LogIn } from "lucide-react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import { useRouter, usePathname } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations("nav")
  const currentLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggleLang = () => {
    const locales = ["ro", "ru", "en"]
    const currentIndex = locales.indexOf(currentLocale)
    const newLocale = locales[(currentIndex + 1) % locales.length]
    const segments = pathname.split("/")
    segments[1] = newLocale
    router.push(segments.join("/") || `/${newLocale}`)
  }

  const langLabel = (currentLocale ?? "ro").toUpperCase()

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-4 mt-3">
        <nav className="bg-[#11212D]/95 backdrop-blur-md rounded-full border border-[#253745] px-6 py-3 flex items-center justify-between">

          {/* Logo — doar text, fără icon */}
          <Link href="#acasa" className="flex items-center">
            <span className="font-mono text-lg font-bold tracking-tight">
              <span className="text-[#CCD0CF]">Inteligent </span>
              <span className="text-[#FF4B04]">Service</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {[
              { href: "#acasa",    key: "acasa"    },
              { href: "#servicii", key: "servicii" },
              { href: "#produse",  key: "produse"  },
              { href: "#despre",   key: "despre"   },
              { href: "#contact",  key: "contact"  },
            ].map(({ href, key }) => (
              <a
                key={href}
                href={href}
                className="px-4 py-2 text-sm text-[#9BABAB] hover:text-[#CCD0CF] hover:bg-[#253745] rounded-full transition-all duration-200"
              >
                {t(key)}
              </a>
            ))}
          </div>

          {/* Desktop right: Auth + Lang + CTA */}
          <div className="hidden lg:flex items-center gap-2">

            {/* Buton autentificare */}
            <a
              href="/auth/login"
              className="flex items-center gap-1.5 border border-[#253745] bg-[#06141B]/60 text-[#9BABAB] px-4 py-2 rounded-full text-sm font-medium hover:border-[#4A5C6A] hover:text-[#CCD0CF] transition-all duration-200"
            >
              <LogIn className="h-3.5 w-3.5" />
              {t("autentificare")}
            </a>

            {/* Buton limbă */}
            <button
              onClick={toggleLang}
              className="min-w-[44px] border border-[#253745] bg-[#06141B]/60 text-[#9BABAB] px-3 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:border-[#4A5C6A] hover:text-[#CCD0CF] transition-all duration-200"
            >
              {langLabel}
            </button>

            {/* CTA telefon — #FF4B04 */}
            <a
              href="tel:+37368123456"
              className="flex items-center gap-2 bg-[#FF4B04] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#FF4B04]/85 transition-colors duration-200"
            >
              <Phone className="h-4 w-4" />
              +373 68 123 456
            </a>
          </div>

          {/* Mobile right: Lang + Auth icon + Burger */}
          <div className="flex lg:hidden items-center gap-2">

            {/* Limbă */}
            <button
              onClick={toggleLang}
              className="border border-[#253745] bg-[#06141B]/60 text-[#9BABAB] px-2.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:border-[#4A5C6A] hover:text-[#CCD0CF] transition-all duration-200"
            >
              {langLabel}
            </button>

            {/* Autentificare icon */}
            <a
              href="/auth/login"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-[#253745] bg-[#06141B]/60 text-[#9BABAB] hover:border-[#4A5C6A] hover:text-[#CCD0CF] transition-all duration-200"
              aria-label={t("autentificare")}
            >
              <LogIn className="h-4 w-4" />
            </a>

            {/* Burger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#CCD0CF] p-2 rounded-full hover:bg-[#253745] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown menu */}
        {isOpen && (
          <div className="lg:hidden mt-2 bg-[#11212D]/97 backdrop-blur-md rounded-2xl border border-[#253745] p-4">
            {[
              { href: "#acasa",    key: "acasa"    },
              { href: "#servicii", key: "servicii" },
              { href: "#produse",  key: "produse"  },
              { href: "#despre",   key: "despre"   },
              { href: "#contact",  key: "contact"  },
            ].map(({ href, key }) => (
              <a
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-[#9BABAB] hover:text-[#CCD0CF] hover:bg-[#253745] rounded-xl transition-all duration-200"
              >
                {t(key)}
              </a>
            ))}

            {/* Separator */}
            <div className="my-3 border-t border-[#253745]" />

            {/* Autentificare mobil */}
            <a
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 border border-[#253745] bg-[#06141B]/60 text-[#9BABAB] px-5 py-3 rounded-full text-sm font-medium mb-2 hover:border-[#4A5C6A] hover:text-[#CCD0CF] transition-all duration-200"
            >
              <LogIn className="h-4 w-4" />
              {t("autentificare")}
            </a>

            {/* CTA telefon mobil — #FF4B04 */}
            <a
              href="tel:+37368123456"
              className="flex items-center justify-center gap-2 bg-[#FF4B04] text-white px-5 py-3 rounded-full text-sm font-semibold hover:bg-[#FF4B04]/85 transition-colors duration-200"
            >
              <Phone className="h-4 w-4" />
              +373 68 123 456
            </a>
          </div>
        )}
      </div>
    </header>
  )
}