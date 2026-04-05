"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { ArrowRight, Camera, Shield, MapPin } from "lucide-react"
import { useTranslations } from "next-intl"

export function HeroSection() {
  const t = useTranslations("hero")
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const bgImages = [
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
      setActiveImageIndex((prev) => (prev + 1) % bgImages.length)
    }, 5000)

    return () => window.clearInterval(intervalId)
  }, [bgImages.length])

  const handleServicesClick = () => {
    const section = document.getElementById("services")
    section?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleContactClick = () => {
    const section = document.getElementById("contact")
    section?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section id="intro" className="relative min-h-screen flex items-center overflow-hidden bg-[#F5F2EC]">
      {/* Background image with modern light gradient overlays */}
      <div className="absolute inset-0 z-0">
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
        {/* Gradient principal care face trecerea de la culoarea de bază la imagine */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5F2EC] via-[#F5F2EC]/90 to-[#F5F2EC]/30 md:to-transparent" />
        {/* Un strat fin general pentru a asigura lizibilitatea pe ecrane mici */}
        <div className="absolute inset-0 bg-[#F5F2EC]/60 md:bg-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-2xl">
          
          {/* Small accent tag */}
          <div className="flex items-center gap-3 mb-6 animate-fade-in-down">
            <div className="h-0.5 w-10 bg-[#F26A1B]" />
            <span className="text-sm font-bold tracking-[0.15em] uppercase text-[#F26A1B]">
              {t("badge")}
            </span>
          </div>

          {/* Title - Fără font-mono pentru un aspect mai curat, folosind culorile din paletă */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F2A4A] leading-[1.1] tracking-tight text-balance">
            {t("title.before")} <span className="text-[#F26A1B] relative inline-block">
              {t("title.highlight")}
              {/* Linie decorativă subtilă sub highlight */}
              <span className="absolute -bottom-1 left-0 w-full h-2 bg-[#F26A1B]/20 rounded-full -z-10"></span>
            </span>{" "}
            {t("title.after")}
          </h1>

          {/* Description - Folosind Slate Blue pentru un contrast plăcut cu titlul */}
          <p className="mt-6 text-lg sm:text-xl text-[#7A8CA5] leading-relaxed max-w-xl font-medium">
            {t("description")}
          </p>

          {/* CTA Buttons - Stilate și moderne */}
          <div className="mt-10 flex flex-col sm:flex-row gap-5">
            <button
              type="button"
              onClick={handleServicesClick}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold text-white bg-[#F26A1B] shadow-[0_8px_25px_-8px_rgba(242,106,27,0.6)] transition-all duration-300 hover:bg-[#C24C0F] hover:shadow-[0_8px_25px_-8px_rgba(194,76,15,0.6)] hover:-translate-y-1"
            >
              {t("ctaServices")}
              <ArrowRight className="h-5 w-5" />
            </button>
            
            <button
              type="button"
              onClick={handleContactClick}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-bold text-[#0F2A4A] border-2 border-[#0F2A4A]/20 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-[#0F2A4A] hover:bg-[#0F2A4A] hover:text-white hover:-translate-y-1"
            >
              {t("ctaContact")}
            </button>
          </div>
        </div>

        {/* Feature cards - Light Glassmorphism Effect */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_15px_35px_-15px_rgba(15,42,74,0.1)] transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(15,42,74,0.15)] overflow-hidden"
            >
              {/* Element decorativ de fundal la hover */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#F26A1B]/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-150"></div>
              
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-[#0F2A4A] text-white transition-transform duration-300 group-hover:scale-110 mb-5 shadow-lg shadow-[#0F2A4A]/20">
                <feature.icon className="h-6 w-6 stroke-[1.5px]" />
              </div>
              <h3 className="text-lg font-bold text-[#0F2A4A] mb-2">{feature.title}</h3>
              <p className="text-sm text-[#7A8CA5] font-medium leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}