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

export default async function PreturiPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-[#06141B] text-[#CCD0CF]">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}`}
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
            Preturi transparente, fara costuri ascunse.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-6 ${
                  plan.featured
                    ? "border-[#FF4B04] bg-[#11212D]"
                    : "border-[#253745] bg-[#11212D]"
                }`}
              >
                <h2 className="text-lg font-bold text-[#CCD0CF]">{plan.name}</h2>
                <p className="mt-1 text-sm text-[#9BABAB]">{plan.description}</p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#CCD0CF]">
                      <Check className="h-4 w-4 text-[#FF4B04] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}