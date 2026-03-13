"use client"

import { type MouseEvent, useEffect, useMemo, useState } from "react"
import { Phone, Menu, X, LogIn } from "lucide-react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const t = useTranslations("nav")
  const currentLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const homePath = `/${currentLocale}`

  const toggleLang = () => {
    const locales = ["ro", "ru", "en"]
    const currentIndex = locales.indexOf(currentLocale)
    const newLocale = locales[(currentIndex + 1) % locales.length]
    const segments = pathname.split("/")
    segments[1] = newLocale
    router.push(segments.join("/") || `/${newLocale}`, { scroll: false })
  }

  const langLabel = (currentLocale ?? "ro").toUpperCase()
  const returnTo = useMemo(() => {
    const currentPath = pathname || homePath
    const currentSearch = searchParams.toString()
    const fullPath = currentSearch ? `${currentPath}?${currentSearch}` : currentPath

    if (fullPath.startsWith(`/${currentLocale}/auth`)) {
      return `/${currentLocale}/cont`
    }

    return fullPath
  }, [currentLocale, homePath, pathname, searchParams])

  const loginHref = `/${currentLocale}/auth/login?returnTo=${encodeURIComponent(returnTo)}`

  const navLinks = [
    { key: "despre", sectionId: "about" },
    { key: "servicii", sectionId: "services" },
    { key: "produse", sectionId: "products" },
    { key: "contact", sectionId: "contact" },
  ]

  const navigateToSection = (sectionId: string) => {
    if (pathname === homePath) {
      const section = document.getElementById(sectionId)
      section?.scrollIntoView({ behavior: "smooth", block: "start" })
      return
    }

    sessionStorage.setItem("pendingHomeSection", sectionId)
    router.push(homePath)
  }

  useEffect(() => {
    let timeoutId: number | undefined

    const onScroll = () => {
      setIsScrolled(window.scrollY > 10)
      setIsScrolling(true)

      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }

      timeoutId = window.setTimeout(() => {
        setIsScrolling(false)
      }, 140)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  useEffect(() => {
    if (pathname !== homePath) {
      return
    }

    const pendingSection = sessionStorage.getItem("pendingHomeSection")
    if (!pendingSection) {
      return
    }

    const timer = window.setTimeout(() => {
      const section = document.getElementById(pendingSection)
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      sessionStorage.removeItem("pendingHomeSection")
    }, 120)

    return () => window.clearTimeout(timer)
  }, [homePath, pathname])

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== homePath) {
      return
    }

    event.preventDefault()
    window.scrollTo({ top: 0, behavior: "smooth" })
    window.history.replaceState({}, "", homePath)
  }

  const navSurfaceClass = isScrolling
    ? "bg-[#11212D]/55"
    : isScrolled
      ? "bg-[#11212D]/75"
      : "bg-[#11212D]/95"

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-4 mt-3">
        <nav
          className={`${navSurfaceClass} backdrop-blur-md rounded-full border border-[#253745] px-6 py-3 flex items-center justify-between transition-colors duration-300`}
        >

          {/* Logo */}
          <Link href={homePath} onClick={handleLogoClick} className="flex items-center">
            <span className="font-mono text-lg font-bold tracking-tight">
              <span className="text-[#CCD0CF]">Inteligent </span>
              <span className="text-[#FF4B04]">Service</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ key, sectionId }) => (
              <button
                key={sectionId}
                type="button"
                onClick={() => navigateToSection(sectionId)}
                className="px-4 py-2 text-sm text-[#9BABAB] hover:text-[#CCD0CF] hover:bg-[#253745] rounded-full transition-all duration-200"
              >
                {t(key)}
              </button>
            ))}
          </div>

          {/* Desktop right: Auth + Phone + Lang */}
          <div className="hidden lg:flex items-center gap-2">

            {/* Buton autentificare — cu locale corect */}
            <Link
              href={loginHref}
              className="flex items-center gap-1.5 border border-[#253745] bg-[#06141B]/60 text-[#9BABAB] px-4 py-2 rounded-full text-sm font-medium hover:border-[#4A5C6A] hover:text-[#CCD0CF] transition-all duration-200"
            >
              <LogIn className="h-3.5 w-3.5" />
              {t("autentificare")}
            </Link>

            {/* CTA telefon */}
            <a
              href="tel:+37368123456"
              className="flex items-center gap-2 bg-[#FF4B04] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#FF4B04]/85 transition-colors duration-200"
            >
              <Phone className="h-4 w-4" />
              +373 68 123 456
            </a>

            {/* Buton limbă */}
            <button
              onClick={toggleLang}
              className="min-w-11 border border-[#253745] bg-[#06141B]/60 text-[#9BABAB] px-3 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:border-[#4A5C6A] hover:text-[#CCD0CF] transition-all duration-200"
            >
              {langLabel}
            </button>
          </div>

          {/* Mobile right: Lang + Auth icon + Burger */}
          <div className="flex lg:hidden items-center gap-2">

            <button
              onClick={toggleLang}
              className="border border-[#253745] bg-[#06141B]/60 text-[#9BABAB] px-2.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:border-[#4A5C6A] hover:text-[#CCD0CF] transition-all duration-200"
            >
              {langLabel}
            </button>

            <Link
              href={loginHref}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-[#253745] bg-[#06141B]/60 text-[#9BABAB] hover:border-[#4A5C6A] hover:text-[#CCD0CF] transition-all duration-200"
              aria-label={t("autentificare")}
            >
              <LogIn className="h-4 w-4" />
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#CCD0CF] p-2 rounded-full hover:bg-[#253745] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        {isOpen && (
          <div className="lg:hidden mt-2 bg-[#11212D]/97 backdrop-blur-md rounded-2xl border border-[#253745] p-4">
            {navLinks.map(({ key, sectionId }) => (
              <button
                key={sectionId}
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  navigateToSection(sectionId)
                }}
                className="block px-4 py-3 text-[#9BABAB] hover:text-[#CCD0CF] hover:bg-[#253745] rounded-xl transition-all duration-200"
              >
                {t(key)}
              </button>
            ))}

            <div className="my-3 border-t border-[#253745]" />

            <Link
              href={loginHref}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 border border-[#253745] bg-[#06141B]/60 text-[#9BABAB] px-5 py-3 rounded-full text-sm font-medium mb-2 hover:border-[#4A5C6A] hover:text-[#CCD0CF] transition-all duration-200"
            >
              <LogIn className="h-4 w-4" />
              {t("autentificare")}
            </Link>

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