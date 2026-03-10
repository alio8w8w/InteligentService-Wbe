import Link from "next/link"
import { ArrowLeft, Camera, MonitorSmartphone, Wifi, Settings, Eye, HardDrive } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

// ... (restul codului rămâne identic, doar schimbăm href-ul)

export default async function ServiciiPage({
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
          {/* ✅ href include locale-ul */}
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-[#4A5C6A] hover:text-[#9BABAB] rounded-xl transition-all duration-300 hover:bg-[#9BABAB]/5 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Înapoi la Acasă
          </Link>
          {/* ... restul JSX-ului */}
        </div>
      </main>
      <Footer />
    </div>
  )
}