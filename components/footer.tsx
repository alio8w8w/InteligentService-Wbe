"use client"

import Link from "next/link"
import { Phone, MapPin, ArrowUpRight } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.78a8.21 8.21 0 004.77 1.52V6.85a4.86 4.86 0 01-1-.16z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export function Footer() {
  const locale = useLocale()
  const t = useTranslations('footer')

  const quickLinks = [
    { label: t('nav.brands'), href: `/${locale}/branduri` },
    { label: t('nav.products'), href: `/${locale}/produse` },
    { label: t('nav.gallery'), href: `/${locale}/galerie` },
    { label: t('nav.ledScreens'), href: `/${locale}/led-ecrane` }, 
    { label: t('nav.contact'), href: `/${locale}#contact` },
  ]

  const serviceLinks = [
    { label: "Dahua", href: `/${locale}/branduri/dahua` },
    { label: "Hikvision", href: `/${locale}/branduri/hikvision` },
    { label: t('nav.ledScreens'), href: `/${locale}/led-ecrane` },
  ]

  return (
    <footer className="relative border-t border-[#7A8CA5]/20 bg-[#0F2A4A]" role="contentinfo">
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7A8CA5]/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-1" aria-label="Inteligent Service">
              <span className="text-xl font-bold tracking-tight text-[#F5F2EC] font-mono">
                Inteligent
              </span>
              <span className="text-xl font-bold tracking-tight text-[#F26A1B] font-mono">
                Service
              </span>
            </Link>
            <p className="mt-4 text-sm text-[#7A8CA5] leading-relaxed max-w-xs">
              {t('companyDescription')}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.tiktok.com/@inteligentservice"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-10 w-10 rounded-xl border border-[#7A8CA5]/20 bg-[#7A8CA5]/10 text-[#7A8CA5] transition-all duration-300 hover:bg-[#F26A1B] hover:border-[#F26A1B] hover:text-[#F5F2EC] hover:scale-105"
                aria-label="TikTok"
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/share/1DdGhfkG8m/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-10 w-10 rounded-xl border border-[#7A8CA5]/20 bg-[#7A8CA5]/10 text-[#7A8CA5] transition-all duration-300 hover:bg-[#F26A1B] hover:border-[#F26A1B] hover:text-[#F5F2EC] hover:scale-105"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#F5F2EC] uppercase tracking-wider mb-4">
              {t('sections.navigation')}
            </h3>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#7A8CA5] hover:text-[#F26A1B] transition-colors duration-300 flex items-center gap-1.5 group font-medium"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#F5F2EC] uppercase tracking-wider mb-4">
              {t('sections.services')}
            </h3>
            <ul className="flex flex-col gap-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#7A8CA5] hover:text-[#F26A1B] transition-colors duration-300 flex items-center gap-1.5 group font-medium"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#F5F2EC] uppercase tracking-wider mb-4">
              {t('sections.contact')}
            </h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a href="tel:+37369230593" className="flex items-center gap-3 text-sm text-[#7A8CA5] hover:text-[#F26A1B] transition-colors duration-300 font-medium">
                  <Phone className="h-4 w-4 text-[#F26A1B] shrink-0" />
                  +373 69 230 593
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-[#7A8CA5] font-medium leading-relaxed">
                  <MapPin className="h-4 w-4 text-[#F26A1B] shrink-0 mt-0.5" />
                  <span>{t('contactInfo.address')}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-[#7A8CA5]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#7A8CA5] font-medium">
            &copy; {new Date().getFullYear()} Inteligent Service. {t('legal.rights')}.
          </p>
          <div className="flex items-center gap-6">
            {/* AICI S-AU MODIFICAT: din <Link> in <span> */}
            <span className="text-xs text-[#7A8CA5] font-medium">
              {t('legal.terms')}
            </span>
            <span className="text-xs text-[#7A8CA5] font-medium">
              {t('legal.privacy')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}