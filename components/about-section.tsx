import Image from "next/image"
import { CheckCircle, Camera, MonitorSmartphone, Wifi, Settings, ArrowRight } from "lucide-react"
import Link from "next/link"

const advantages = [
  "Personal calificat si certificat",
  "Echipamente de ultima generatie",
  "Preturi transparente, fara costuri ascunse",
  "Garantie pentru toate lucrarile efectuate",
  "Suport tehnic si post-instalare",
]

const services = [
  {
    icon: Camera,
    title: "Instalare CCTV",
    description: "Montaj camere IP si analogice pentru interior si exterior.",
  },
  {
    icon: MonitorSmartphone,
    title: "Monitorizare Remota",
    description: "Acces la camere de pe telefon sau computer, oricand.",
  },
  {
    icon: Wifi,
    title: "Sisteme Wireless",
    description: "Camere fara fir pentru spatii unde cablarea nu este posibila.",
  },
  {
    icon: Settings,
    title: "Service si Intretinere",
    description: "Mentenanta preventiva si reparatii pentru sisteme existente.",
  },
]

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 md:py-32 bg-[#11212D]">
      {/* Smooth transition from hero */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#253745] to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-[2px] w-10 bg-[#FF4B04]" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#FF4B04]">
            Despre Noi
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Text content */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#CCD0CF] leading-tight text-balance font-mono">
              Experienta si dedicare in securitate video
            </h2>
            <p className="mt-6 text-[#9BABAB] leading-relaxed">
              Inteligent Service este partenerul tau de incredere in instalarea
              si deservirea camerelor de supraveghere. Lucram atat cu gospodarii
              individuale cat si cu companii, oferind solutii personalizate de
              securitate video adaptate fiecarui spatiu si nevoie.
            </p>

            {/* Advantages list */}
            <ul className="mt-8 flex flex-col gap-3">
              {advantages.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-[#9BABAB] flex-shrink-0" />
                  <span className="text-sm text-[#CCD0CF]">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/servicii"
              className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-xl text-sm font-medium text-[#CCD0CF] border border-[#9BABAB]/15 bg-[#9BABAB]/5 backdrop-blur-sm transition-all duration-300 hover:bg-[#9BABAB]/15 hover:border-[#9BABAB]/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              Toate Serviciile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right - Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-[#9BABAB]/10">
            <Image
              src="/images/about-cctv.jpg"
              alt="Centru profesional de monitorizare video"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#11212D]/70 via-transparent to-transparent" />
            {/* Floating accent card - glass effect */}
            <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-[#9BABAB]/15 bg-[#06141B]/60 backdrop-blur-xl p-4 transition-all duration-300 hover:bg-[#06141B]/70 hover:border-[#9BABAB]/25">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#FF4B04] flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#CCD0CF]">100% Lucrari Garantate</p>
                  <p className="text-xs text-[#9BABAB]">Calitate verificata la fiecare proiect</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service cards row - glass style */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="group p-6 rounded-2xl border border-[#9BABAB]/10 bg-[#9BABAB]/5 backdrop-blur-sm transition-all duration-300 hover:bg-[#9BABAB]/10 hover:border-[#9BABAB]/20 hover:shadow-lg hover:shadow-[#06141B]/20"
            >
              <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-[#253745]/60 border border-[#9BABAB]/10 transition-all duration-300 group-hover:bg-[#253745] group-hover:border-[#9BABAB]/20 mb-4">
                <service.icon className="h-5 w-5 text-[#9BABAB]" />
              </div>
              <h3 className="text-base font-semibold text-[#CCD0CF]">{service.title}</h3>
              <p className="text-sm text-[#4A5C6A] mt-2 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#06141B] pointer-events-none" />
    </section>
  )
}
