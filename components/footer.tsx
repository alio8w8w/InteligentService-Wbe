"use client"

import Link from "next/link"
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react"
import { useLocale } from "next-intl"

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

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

export function Footer() {
  const locale = useLocale()

  const quickLinks = [
    { label: "Acasa", href: `/${locale}` },
    { label: "Despre Noi", href: `/${locale}#about` },
    { label: "Servicii", href: `/${locale}#services` },
    { label: "Contact", href: `/${locale}#contact` },
  ]

  const serviceLinks = [
    { label: "Instalare Camere", href: `/${locale}#services` },
    { label: "Monitorizare Remota", href: `/${locale}#services` },
    { label: "Sisteme Wireless", href: `/${locale}#services` },
    { label: "Service si Intretinere", href: `/${locale}#services` },
  ]

  return (
    <footer className="relative border-t border-[#9BABAB]/10 bg-[#11212D]" role="contentinfo">
      {/* Smooth top transition */}
      <div className="absolute -top-px left-0 right-0 h-px bg-linear-to-r from-transparent via-[#9BABAB]/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-1" aria-label="Inteligent Service">
              <span className="text-xl font-bold tracking-tight text-[#CCD0CF] font-mono">
                Inteligent
              </span>
              <span className="text-xl font-bold tracking-tight text-[#FF4B04] font-mono">
                Service
              </span>
            </Link>
            <p className="mt-4 text-sm text-[#4A5C6A] leading-relaxed max-w-xs">
              Instalare si deservire camere de supraveghere pentru gospodarii si companii.
              Securitate profesionala, solutii moderne.
            </p>
            {/* Social links - glass style */}
            <div className="mt-6 flex items-center gap-2">
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 rounded-xl border border-[#9BABAB]/10 bg-[#9BABAB]/5 text-[#9BABAB] transition-all duration-300 hover:bg-[#9BABAB]/15 hover:border-[#9BABAB]/25 hover:text-[#CCD0CF] hover:scale-105"
                aria-label="TikTok"
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 rounded-xl border border-[#9BABAB]/10 bg-[#9BABAB]/5 text-[#9BABAB] transition-all duration-300 hover:bg-[#9BABAB]/15 hover:border-[#9BABAB]/25 hover:text-[#CCD0CF] hover:scale-105"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 rounded-xl border border-[#9BABAB]/10 bg-[#9BABAB]/5 text-[#9BABAB] transition-all duration-300 hover:bg-[#9BABAB]/15 hover:border-[#9BABAB]/25 hover:text-[#CCD0CF] hover:scale-105"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-[#CCD0CF] uppercase tracking-wider mb-4">
              Navigare
            </h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#4A5C6A] hover:text-[#9BABAB] transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-[#CCD0CF] uppercase tracking-wider mb-4">
              Servicii
            </h3>
            <ul className="flex flex-col gap-2.5">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#4A5C6A] hover:text-[#9BABAB] transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-sm font-semibold text-[#CCD0CF] uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="tel:+40700000000" className="flex items-center gap-3 text-sm text-[#4A5C6A] hover:text-[#9BABAB] transition-colors duration-300">
                  <Phone className="h-4 w-4 text-[#9BABAB] shrink-0" />
                  +40 700 000 000
                </a>
              </li>
              <li>
                <a href="mailto:contact@inteligentservice.ro" className="flex items-center gap-3 text-sm text-[#4A5C6A] hover:text-[#9BABAB] transition-colors duration-300">
                  <Mail className="h-4 w-4 text-[#9BABAB] shrink-0" />
                  contact@inteligentservice.ro
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-[#4A5C6A]">
                  <MapPin className="h-4 w-4 text-[#9BABAB] shrink-0 mt-0.5" />
                  <span>Str. Exemplu Nr. 123,<br />Oras, Judet</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-[#9BABAB]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#4A5C6A]">
            &copy; {new Date().getFullYear()} Inteligent Service. Toate drepturile rezervate.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/termeni" className="text-xs text-[#4A5C6A] hover:text-[#9BABAB] transition-colors duration-300">
              Termeni si Conditii
            </Link>
            <Link href="/confidentialitate" className="text-xs text-[#4A5C6A] hover:text-[#9BABAB] transition-colors duration-300">
              Politica de Confidentialitate
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
