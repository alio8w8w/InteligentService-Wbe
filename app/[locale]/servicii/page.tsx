import Link from "next/link"
import { ArrowLeft, Camera, MonitorSmartphone, Wifi, Settings, Eye, HardDrive } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const services = [
  {
    icon: Camera,
    title: "Instalare Camere CCTV",
    description: "Montaj profesional de camere IP si analogice pentru interior si exterior, gospodarii si companii.",
  },
  {
    icon: MonitorSmartphone,
    title: "Monitorizare Remota",
    description: "Configurare acces la camere de pe telefon, tableta sau computer, de oriunde din lume.",
  },
  {
    icon: Wifi,
    title: "Sisteme Wireless",
    description: "Camere si sisteme fara fir pentru spatii unde cablarea nu este posibila sau dorita.",
  },
  {
    icon: Settings,
    title: "Service si Reparatii",
    description: "Diagnosticare, reparatie si inlocuire componente pentru sisteme de supraveghere existente.",
  },
  {
    icon: Eye,
    title: "Consultanta Securitate",
    description: "Evaluarea spatiului si recomandari personalizate pentru sistem optim de supraveghere.",
  },
  {
    icon: HardDrive,
    title: "Stocare si Backup",
    description: "Configurare DVR/NVR, stocare cloud si sisteme de backup pentru inregistrari video.",
  },
]

export default function ServiciiPage() {
  return (
    <div className="min-h-screen bg-[#06141B] text-[#CCD0CF]">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-[#4A5C6A] hover:text-[#9BABAB] rounded-xl transition-all duration-300 hover:bg-[#9BABAB]/5 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Inapoi la Acasa
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-10 bg-[#FF4B04]" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#FF4B04]">
              Servicii
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#CCD0CF] font-mono text-balance">
            Serviciile noastre
          </h1>
          <p className="mt-4 text-[#9BABAB] leading-relaxed max-w-2xl">
            Oferim servicii complete de instalare, configurare si intretinere a sistemelor de supraveghere video.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="group p-6 rounded-2xl border border-[#9BABAB]/10 bg-[#9BABAB]/5 backdrop-blur-sm transition-all duration-300 hover:bg-[#9BABAB]/10 hover:border-[#9BABAB]/20 hover:shadow-lg hover:shadow-[#06141B]/20"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[#253745]/60 border border-[#9BABAB]/10 transition-all duration-300 group-hover:bg-[#253745] group-hover:border-[#9BABAB]/20 mb-4">
                  <service.icon className="h-6 w-6 text-[#9BABAB]" />
                </div>
                <h3 className="text-lg font-semibold text-[#CCD0CF]">{service.title}</h3>
                <p className="text-sm text-[#4A5C6A] mt-2 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-2xl border border-[#9BABAB]/10 bg-[#9BABAB]/5 backdrop-blur-sm text-center">
            <h3 className="text-xl font-bold text-[#CCD0CF] font-mono">Ai nevoie de un serviciu personalizat?</h3>
            <p className="text-sm text-[#9BABAB] mt-2">Contacteaza-ne si gasim solutia potrivita pentru tine.</p>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center mt-6 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-[#FF4B04]/90 border border-[#FF4B04]/30 transition-all duration-300 hover:bg-[#FF4B04] hover:shadow-lg hover:shadow-[#FF4B04]/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              Contacteaza-ne
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
