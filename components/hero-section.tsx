"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, Camera, Shield, Clock } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

export function HeroSection() {
  const t = useTranslations("hero")
  const locale = useLocale()
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const bgImages = [
    "/images/hero-cctv.jpg",
    "/images/hero-service.jpg",
    "/images/about-cctv.jpg",
    "/images/about-workshop.jpg",
  ]

  const features = [
    {
      icon: Camera,
      title: t("features.installation.title"),
      description: t("features.installation.description"),
    },
    {
      icon: Shield,
      title: t("features.security.title"),
      description: t("features.security.description"),
    },
    {
      icon: Clock,
      title: t("features.intervention.title"),
      description: t("features.intervention.description"),
    },
  ]

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % bgImages.length)
    }, 5000)

    return () => window.clearInterval(intervalId)
  }, [bgImages.length])

  const handleContactClick = () => {
    const section = document.getElementById("contact")
    section?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section id="intro" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image with deep overlays */}
      <div className="absolute inset-0">
        {bgImages.map((imageSrc, index) => (
          <Image
            key={imageSrc}
            src={imageSrc}
            alt={t("imageAlt")}
            fill
            className={`object-cover transition-opacity duration-1000 ${
              index === activeImageIndex ? "opacity-100" : "opacity-0"
            }`}
            priority={index === 0}
          />
        ))}
        <div className="absolute inset-0 bg-linear-to-b from-[#06141B]/70 via-[#06141B]/50 to-[#06141B]" />
        <div className="absolute inset-0 bg-linear-to-r from-[#06141B]/80 via-transparent to-[#06141B]/40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-2xl">
          {/* Small accent tag */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-0.5 w-10 bg-[#FF4B04]" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#FF4B04]">
              {t("badge")}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance font-mono">
            {t("title.before")} <span className="text-[#9BABAB]">{t("title.highlight")}</span>{" "}
            {t("title.after")}
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#9BABAB] leading-relaxed max-w-xl">
            {t("description")}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href={`/${locale}/servicii`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-base font-medium text-white bg-[#FF4B04]/90 border border-[#FF4B04]/30 transition-all duration-300 hover:bg-[#FF4B04] hover:shadow-lg hover:shadow-[#FF4B04]/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              {t("ctaServices")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={handleContactClick}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-base font-medium text-[#CCD0CF] border border-[#9BABAB]/15 bg-[#9BABAB]/5 backdrop-blur-sm transition-all duration-300 hover:bg-[#9BABAB]/15 hover:border-[#9BABAB]/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              {t("ctaContact")}
            </button>
          </div>
        </div>

        {/* Feature cards - glass effect */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-5 rounded-2xl border border-[#9BABAB]/10 bg-[#9BABAB]/5 backdrop-blur-md transition-all duration-300 hover:bg-[#9BABAB]/10 hover:border-[#9BABAB]/20 hover:shadow-lg hover:shadow-[#06141B]/30"
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#253745]/60 border border-[#9BABAB]/10 transition-all duration-300 group-hover:bg-[#253745] group-hover:border-[#9BABAB]/20 mb-3">
                <feature.icon className="h-5 w-5 text-[#9BABAB]" />
              </div>
              <h3 className="text-sm font-semibold text-[#CCD0CF]">{feature.title}</h3>
              <p className="text-sm text-[#4A5C6A] mt-1.5 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
