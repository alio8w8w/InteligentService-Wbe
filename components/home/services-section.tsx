import Link from "next/link"
import { Camera, MonitorSmartphone, Settings, Wifi } from "lucide-react"

const services = [
  {
    icon: Camera,
    title: "Instalare CCTV",
    text: "Montaj camere IP/analogice pentru casa, bloc si business.",
  },
  {
    icon: MonitorSmartphone,
    title: "Monitorizare Remota",
    text: "Acces din telefon, notificari instant si arhiva video.",
  },
  {
    icon: Wifi,
    title: "Sisteme Wireless",
    text: "Implementari rapide in spatii unde cablarea e limitata.",
  },
  {
    icon: Settings,
    title: "Mentenanta",
    text: "Service periodic, update firmware si optimizare retea.",
  },
]

export function ServicesSection({ locale }: { locale: string }) {
  return (
    <section id="services" className="bg-[#11212D] py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#FF4B04]">Servicii</p>
            <h2 className="mt-2 text-3xl font-bold text-[#CCD0CF] font-mono">
              Ce servicii oferim
            </h2>
          </div>
          <Link
            href={`/${locale}/servicii`}
            className="rounded-xl border border-[#253745] bg-[#06141B]/60 px-4 py-2 text-sm font-medium text-[#CCD0CF] transition-colors hover:border-[#4A5C6A]"
          >
            Vezi toate serviciile
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <article
              key={service.title}
              className="rounded-2xl border border-[#253745] bg-[#06141B]/50 p-5"
            >
              <div className="h-10 w-10 rounded-xl border border-[#253745] bg-[#11212D] flex items-center justify-center">
                <service.icon className="h-5 w-5 text-[#9BABAB]" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#CCD0CF]">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#9BABAB]">{service.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
