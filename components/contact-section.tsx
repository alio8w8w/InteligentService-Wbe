import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react"

const contactItems = [
  {
    icon: MapPin,
    label: "Adresa",
    content: (
      <p className="text-sm text-[#9BABAB] mt-1 leading-relaxed">
        Str. Exemplu Nr. 123,<br />
        Oras, Judet, Romania
      </p>
    ),
  },
  {
    icon: Phone,
    label: "Telefon",
    content: (
      <div className="mt-1 flex flex-col gap-1">
        <a href="tel:+40700000000" className="text-sm text-[#CCD0CF] hover:text-[#FF4B04] transition-colors duration-300">
          +40 700 000 000
        </a>
        <a href="tel:+40700000001" className="text-sm text-[#9BABAB] hover:text-[#CCD0CF] transition-colors duration-300">
          +40 700 000 001
        </a>
      </div>
    ),
  },
  {
    icon: Mail,
    label: "Email",
    content: (
      <a href="mailto:contact@inteligentservice.ro" className="text-sm text-[#CCD0CF] hover:text-[#FF4B04] transition-colors duration-300 mt-1 block">
        contact@inteligentservice.ro
      </a>
    ),
  },
  {
    icon: Clock,
    label: "Program",
    content: (
      <div className="mt-1 flex flex-col gap-1.5">
        <div className="flex justify-between gap-6">
          <span className="text-sm text-[#4A5C6A]">Luni - Vineri</span>
          <span className="text-sm text-[#CCD0CF] font-medium">08:00 - 18:00</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-sm text-[#4A5C6A]">Sambata</span>
          <span className="text-sm text-[#CCD0CF] font-medium">09:00 - 14:00</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-sm text-[#4A5C6A]">Duminica</span>
          <span className="text-sm text-[#FF4B04] font-medium">Inchis</span>
        </div>
      </div>
    ),
  },
]

export function ContactSection() {
  return (
    <section id="contact" className="relative py-24 md:py-32 bg-[#06141B]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-[2px] w-10 bg-[#FF4B04]" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#FF4B04]">
            Contact & Locatie
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-[#CCD0CF] leading-tight text-balance font-mono">
          Unde ne gasesti
        </h2>
        <p className="mt-4 text-[#9BABAB] leading-relaxed max-w-2xl">
          Suntem disponibili pentru consultanta gratuita. Viziteaza-ne la sediu sau
          contacteaza-ne prin orice metoda de mai jos.
        </p>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Contact info cards - glass */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {contactItems.map((item) => (
              <div
                key={item.label}
                className="p-5 rounded-2xl border border-[#9BABAB]/10 bg-[#9BABAB]/5 backdrop-blur-sm flex items-start gap-4 transition-all duration-300 hover:bg-[#9BABAB]/10 hover:border-[#9BABAB]/20"
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#253745]/60 border border-[#9BABAB]/10 flex-shrink-0">
                  <item.icon className="h-5 w-5 text-[#9BABAB]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#CCD0CF]">{item.label}</p>
                  {item.content}
                </div>
              </div>
            ))}
          </div>

          {/* Map embed area - glass frame */}
          <div className="lg:col-span-3 rounded-2xl border border-[#9BABAB]/10 overflow-hidden min-h-[420px] flex flex-col bg-[#9BABAB]/5 backdrop-blur-sm">
            <div className="flex-1 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.862646818427!2d26.1025!3d44.4268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDI1JzM2LjUiTiAyNsKwMDYnMDkuMCJF!5e0!3m2!1sro!2sro!4v1"
                className="absolute inset-0 w-full h-full border-0 opacity-80"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Locatia Inteligent Service pe harta"
              />
            </div>
            <div className="p-4 flex items-center justify-between border-t border-[#9BABAB]/10 bg-[#06141B]/40 backdrop-blur-md">
              <p className="text-sm text-[#4A5C6A]">Obtine directii catre noi</p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#CCD0CF] border border-[#9BABAB]/15 bg-[#9BABAB]/5 backdrop-blur-sm transition-all duration-300 hover:bg-[#9BABAB]/15 hover:border-[#9BABAB]/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Deschide Harta
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
