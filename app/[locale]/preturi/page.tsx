import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const plans = [
  {
    name: "Rezidential",
    description: "Pentru case, apartamente si gospodarii.",
    featured: false,
    features: [
      "Evaluare gratuita a spatiului",
      "Pana la 4 camere IP",
      "Configurare vizualizare mobil",
      "Garantie 12 luni",
      "Suport tehnic telefonic",
    ],
  },
  {
    name: "Business",
    description: "Solutii complete pentru companii si spatii comerciale.",
    featured: true,
    features: [
      "Evaluare gratuita a spatiului",
      "Pana la 16 camere IP/analogice",
      "DVR/NVR inclus",
      "Monitorizare remota completa",
      "Garantie 24 luni",
      "Suport tehnic prioritar",
      "Mentenanta trimestriala",
    ],
  },
  {
    name: "Enterprise",
    description: "Contracte pe termen lung, securitate avansata.",
    featured: false,
    features: [
      "Audit complet de securitate",
      "Numar nelimitat de camere",
      "Stocare cloud inclusa",
      "Interventie in 4 ore",
      "Manager de cont dedicat",
      "Mentenanta lunara",
      "Rapoarte de securitate",
    ],
  },
]

export default function PreturiPage() {
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
              Preturi
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#CCD0CF] font-mono text-balance">
            Pachete si preturi
          </h1>
          <p className="mt-4 text-[#9BABAB] leading-relaxed max-w-2xl">
            Preturi transparente, fara costuri ascunse. Contacteaza-ne pentru o evaluare gratuita a spatiului tau.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`group p-6 rounded-2xl border flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-[#06141B]/20 ${
                  plan.featured
                    ? "border-[#FF4B04]/30 bg-[#FF4B04]/5 backdrop-blur-sm hover:border-[#FF4B04]/50"
                    : "border-[#9BABAB]/10 bg-[#9BABAB]/5 backdrop-blur-sm hover:bg-[#9BABAB]/10 hover:border-[#9BABAB]/20"
                }`}
              >
                {plan.featured && (
                  <span className="inline-flex self-start px-3 py-1 text-xs font-semibold rounded-full bg-[#FF4B04] text-white mb-4">
                    Recomandat
                  </span>
                )}
                <h3 className="text-xl font-bold text-[#CCD0CF] font-mono">{plan.name}</h3>
                <p className="text-sm text-[#9BABAB] mt-2">{plan.description}</p>

                <ul className="mt-6 flex flex-col gap-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className={`h-4 w-4 flex-shrink-0 ${plan.featured ? "text-[#FF4B04]" : "text-[#9BABAB]"}`} />
                      <span className="text-sm text-[#CCD0CF]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/#contact"
                  className={`mt-8 w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                    plan.featured
                      ? "text-white bg-[#FF4B04]/90 border border-[#FF4B04]/30 hover:bg-[#FF4B04] hover:shadow-lg hover:shadow-[#FF4B04]/20"
                      : "text-[#CCD0CF] border border-[#9BABAB]/15 bg-[#9BABAB]/5 hover:bg-[#9BABAB]/15 hover:border-[#9BABAB]/25"
                  }`}
                >
                  Solicita Oferta
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-[#4A5C6A]">
              Preturile finale depind de configuratia sistemului si complexitatea instalarii.
              Contacteaza-ne pentru o evaluare gratuita.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
