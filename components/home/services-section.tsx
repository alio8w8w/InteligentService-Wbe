"use client"

import Image from "next/image"
import { Camera, MonitorSmartphone, Settings, Wifi, Phone, ExternalLink } from "lucide-react"
import { useTranslations } from "next-intl"

const services = [
  {
    key: "installation",
    icon: Camera,
    image: "/images/hero-cctv.jpg",
  },
  {
    key: "remote",
    icon: MonitorSmartphone,
    image: "/images/about-cctv.jpg",
  },
  {
    key: "wireless",
    icon: Wifi,
    image: "/images/hero-service.jpg",
  },
  {
    key: "maintenance",
    icon: Settings,
    image: "/images/about-workshop.jpg",
  },
]

export function ServicesSection() {
  const t = useTranslations("servicesSection")

  return (
    <section id="services" className="scroll-mt-28 bg-[#11212D] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#FF4B04]">{t("badge")}</p>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold text-[#CCD0CF] font-mono">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-3xl text-base sm:text-lg text-[#9BABAB]">
            {t("description")}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {services.map((service) => (
            <article
              key={service.key}
              className="rounded-2xl border border-[#253745] bg-[#06141B]/60 overflow-hidden"
            >
              <div className="relative h-52 w-full">
                <Image
                  src={service.image}
                  alt={t(`items.${service.key}.imageAlt`)}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#06141B]/70 via-transparent to-transparent" />
              </div>

              <div className="p-5">
                <div className="h-10 w-10 rounded-xl border border-[#253745] bg-[#11212D] flex items-center justify-center mb-4">
                <service.icon className="h-5 w-5 text-[#9BABAB]" />
                </div>

                <h3 className="text-xl font-semibold text-[#CCD0CF]">{t(`items.${service.key}.title`)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#9BABAB]">{t(`items.${service.key}.text`)}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <a
                    href="tel:+37368123456"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#FF4B04] px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#FF4B04]/85"
                  >
                    <Phone className="h-4 w-4" />
                    {t("contactButton")}
                  </a>

                  <a
                    href="https://www.tiktok.com/@inteligentservice"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#253745] bg-[#11212D] px-3.5 py-2 text-sm font-medium text-[#CCD0CF] transition-colors hover:border-[#4A5C6A]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    TikTok
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
