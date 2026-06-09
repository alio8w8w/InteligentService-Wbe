"use client"

import { useMemo } from 'react'
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react"
import { useTranslations } from 'next-intl'

export function ContactSection() {
  const t = useTranslations('contactSection')

  const PHONE = '+373 69 230 593'
  const EMAIL = 'inteligentservice2023@gmail.com'

  const contactItems = useMemo(() => [
    {
      icon: MapPin,
      label: t('info.address.label'),
      content: (
        <p className="text-sm text-[#0F2A4A] mt-1 leading-relaxed font-bold">
          {t('info.address.city')},<br />
          {t('info.address.street')}
        </p>
      ),
    },
    {
      icon: Phone,
      label: t('info.phone.label'),
      content: (
        <div className="mt-1 flex flex-col gap-1">
          <a href={`tel:${PHONE.replace(/\s+/g,'')}`} className="text-sm font-bold text-[#0F2A4A] hover:text-[#F26A1B] transition-colors duration-300">
            {PHONE}
          </a>
        </div>
      ),
    },
    {
      icon: Mail,
      label: t('info.email.label'),
      content: (
        <a href={`mailto:${EMAIL}`} className="text-sm font-bold text-[#0F2A4A] hover:text-[#F26A1B] transition-colors duration-300 mt-1 block break-all">
          {EMAIL}
        </a>
      ),
    },
    {
      icon: Clock,
      label: t('info.schedule.label'),
      content: (
        <div className="mt-2 flex flex-col gap-2.5">
          <div className="flex justify-between items-center gap-6 border-b border-[#7A8CA5]/20 pb-1.5">
            <span className="text-sm font-black text-[#7A8CA5] uppercase">{t('info.schedule.weekdays')}</span>
            <span className="text-sm text-[#0F2A4A] font-bold">08:30 - 16:00</span>
          </div>
          <div className="flex justify-between items-center gap-6 border-b border-[#7A8CA5]/20 pb-1.5">
            <span className="text-sm font-black text-[#7A8CA5] uppercase">{t('info.schedule.saturday')}</span>
            <span className="text-sm text-[#0F2A4A] font-bold">09:00 - 14:00</span>
          </div>
          <div className="flex justify-between items-center gap-6 pt-0.5">
            <span className="text-sm font-black text-[#7A8CA5] uppercase">{t('info.schedule.sunday')}</span>
            <span className="text-xs text-[#F26A1B] font-black uppercase tracking-widest bg-[#F26A1B]/10 px-2 py-1 rounded-md">
              {t('info.schedule.closed')}
            </span>
          </div>
        </div>
      ),
    },
  ], [t])

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-[#F5F2EC]">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-[3px] w-12 bg-[#F26A1B] rounded-full" />
          <span className="text-xs font-black tracking-[0.2em] uppercase text-[#F26A1B]">
            {t('badge')}
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F2A4A] leading-tight text-balance font-mono tracking-tight">
          {t('title')}
        </h2>
        <p className="mt-4 text-[#7A8CA5] font-medium leading-relaxed max-w-2xl text-lg">
          {t('description')}
        </p>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-5">
            {contactItems.map((item) => (
              <div
                key={item.label}
                className="p-6 rounded-3xl bg-white shadow-lg shadow-[#0F2A4A]/5 flex items-start gap-5 transition-all duration-300 hover:shadow-xl hover:shadow-[#0F2A4A]/10 hover:-translate-y-1 border border-[#7A8CA5]/10"
              >
                <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-[#0F2A4A] text-[#F26A1B] flex-shrink-0">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-[11px] font-black uppercase tracking-widest text-[#7A8CA5] mb-1.5">
                    {item.label}
                  </p>
                  {item.content}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3 rounded-3xl shadow-lg shadow-[#0F2A4A]/5 overflow-hidden min-h-[450px] flex flex-col bg-white border border-[#7A8CA5]/10">
            <div className="flex-1 relative bg-gray-100">
              <iframe
                src="https://maps.google.com/maps?q=C%C4%83l%C4%83ra%C8%99i,%20Republica%20Moldova&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="absolute inset-0 w-full h-full border-0 grayscale-[10%]"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Harta locație Călărași"
              />
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#7A8CA5]/10 bg-white">
              <p className="text-sm font-black text-[#0F2A4A] uppercase tracking-wide">
                {t('map.getDirections')}
              </p>
              <a
                href="https://www.google.com/maps/place/C%C4%83l%C4%83ra%C8%99i,+Moldova/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full sm:w-auto gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-[#F5F2EC] bg-[#F26A1B] transition-all duration-300 hover:bg-[#C24C0F] hover:shadow-lg hover:shadow-[#F26A1B]/30 hover:-translate-y-0.5 active:scale-95"
              >
                <ExternalLink className="h-4 w-4" />
                {t('map.openMap')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}