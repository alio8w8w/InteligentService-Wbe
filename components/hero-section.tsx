"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { ArrowRight, Camera, Shield, MapPin } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const t = useTranslations("hero")
  const locale = useLocale()
  const router = useRouter()
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Imaginea specifică pentru mobil
  const mobileImage = "/images/hero-cctv-mobil.jpg"

  // Imaginile pentru slider-ul de pe desktop
  const bgImagesDesktop = [
    "/images/hero-cctv.jpg",
    "/images/hero-cctv2.jpg",
    "/images/hero-cctv3.jpg",
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
      icon: MapPin,
      title: t("features.intervention.title"),
      description: t("features.intervention.description"),
    },
  ]

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % bgImagesDesktop.length)
    }, 5000)

    return () => window.clearInterval(intervalId)
  }, [bgImagesDesktop.length])

  return (
    <section id="intro" className="relative min-h-screen flex items-center overflow-hidden bg-[#F5F2EC]">
      <div className="absolute inset-0 z-0">
        
        {/* IMAGINEA PENTRU MOBIL (Vizibilă doar pe ecrane mici) */}
        <Image
          src={mobileImage}
          alt={t("imageAlt")}
          fill
          className="block md:hidden object-cover object-center"
          priority
        />

        {/* SLIDER-UL PENTRU DESKTOP (Vizibil doar de la tablete în sus) */}
        {bgImagesDesktop.map((imageSrc, index) => (
          <Image
            key={imageSrc}
            src={imageSrc}
            alt={t("imageAlt")}
            fill
            className={`hidden md:block object-cover object-center transition-opacity duration-1000 ${
              index === activeImageIndex ? "opacity-100" : "opacity-0"
            }`}
            priority={index === 0}
          />
        ))}

        {/* Gradienți pentru lizibilitate */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5F2EC] via-[#F5F2EC]/90 to-[#F5F2EC]/40 md:to-transparent" />
        <div className="absolute inset-0 bg-[#F5F2EC]/40 md:bg-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6 animate-fade-in-down">
            <div className="h-0.5 w-10 bg-[#F26A1B]" />
            <span className="text-sm font-bold tracking-[0.15em] uppercase text-[#F26A1B]">
              {t("badge")}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F2A4A] leading-[1.1] tracking-tight text-balance">
            {t("title.before")}{" "}
            <span className="text-[#F26A1B] relative inline-block">
              {t("title.highlight")}
              <span className="absolute -bottom-1 left-0 w-full h-2 bg-[#F26A1B]/20 rounded-full -z-10" />
            </span>{" "}
            {t("title.after")}
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-[#7A8CA5] leading-relaxed max-w-xl font-medium">
            {t("description")}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-5">
            <button
              type="button"
              onClick={() => router.push(`/${locale}/produse`)}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold text-white bg-[#F26A1B] shadow-[0_8px_25px_-8px_rgba(242,106,27,0.6)] transition-all duration-300 hover:bg-[#C24C0F] hover:shadow-[0_8px_25px_-8px_rgba(194,76,15,0.6)] hover:-translate-y-1"
            >
              {t("ctaServices")}
              <ArrowRight className="h-5 w-5" />
            </button>
            
            <button
              type="button"
              onClick={() => router.push(`/${locale}/contacte`)}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-bold text-white bg-[#0F2A4A] border-2 border-[#0F2A4A] transition-all duration-300 hover:bg-[#0F2A4A]/80 hover:border-[#0F2A4A]/80 hover:-translate-y-1"
            >
              {t("ctaContact")}
            </button>
          </div>
        </div>

        <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_15px_35px_-15px_rgba(15,42,74,0.1)] transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(15,42,74,0.15)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-[#F26A1B]/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-150" />
              
              <div className="flex items-center justify-center h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-[#0F2A4A] text-white transition-transform duration-300 group-hover:scale-110 mb-4 md:mb-5 shadow-lg shadow-[#0F2A4A]/20">
                <feature.icon className="h-5 w-5 md:h-6 md:w-6 stroke-[1.5px]" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-[#0F2A4A] mb-1 md:mb-2">{feature.title}</h3>
              <p className="text-sm text-[#7A8CA5] font-medium leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}