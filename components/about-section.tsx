"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { CheckCircle, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

export function AboutSection() {
  const t = useTranslations("about")
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const images = [
    "/images/about-cctv.jpg",
    "/images/about-workshop.jpg",
    "/images/hero-service.jpg",
    "/images/hero-cctv.jpg",
  ]

  const advantages = [
    t("advantages.0"),
    t("advantages.1"),
    t("advantages.2"),
    t("advantages.3"),
    t("advantages.4"),
  ]

  const handleServicesClick = () => {
    const section = document.getElementById("services")
    section?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length)
    }, 4500)

    return () => window.clearInterval(intervalId)
  }, [images.length])

  return (
    <section id="about" className="relative scroll-mt-28 py-24 md:py-32 bg-[#11212D]">
      {/* Smooth transition from hero */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#253745] to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-4">
            <div className="h-0.5 w-10 bg-[#FF4B04]" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#FF4B04]">
              {t("badge")}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Text content */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#CCD0CF] leading-tight text-balance font-mono">
              {t("title")}
            </h2>
            <p className="mt-6 text-[#9BABAB] leading-relaxed">
              {t("description")}
            </p>

            {/* Advantages list */}
            <ul className="mt-8 flex flex-col gap-3">
              {advantages.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-[#9BABAB] shrink-0" />
                  <span className="text-sm text-[#CCD0CF]">{item}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={handleServicesClick}
              className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-[#FF4B04] border border-[#FF4B04]/30 transition-all duration-300 hover:bg-[#FF4B04]/85 hover:scale-[1.02] active:scale-[0.98]"
            >
              {t("allServices")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Right - Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-4/3 border border-[#9BABAB]/10">
            {images.map((imageSrc, index) => (
              <Image
                key={imageSrc}
                src={imageSrc}
                alt={t("imageAlt")}
                fill
                className={`object-cover transition-opacity duration-1000 ${
                  index === activeImageIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-linear-to-t from-[#11212D]/70 via-transparent to-transparent" />
            {/* Floating accent card - glass effect */}
            <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-[#9BABAB]/15 bg-[#06141B]/60 backdrop-blur-xl p-4 transition-all duration-300 hover:bg-[#06141B]/70 hover:border-[#9BABAB]/25">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#FF4B04] flex items-center justify-center shrink-0">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#CCD0CF]">{t("guarantee.title")}</p>
                  <p className="text-xs text-[#9BABAB]">{t("guarantee.description")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-b from-transparent to-[#06141B] pointer-events-none" />
    </section>
  )
}
