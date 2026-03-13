import { Navbar } from "@/components/navbar"

export default async function ContPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-[#06141B] text-[#CCD0CF]">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="text-3xl font-bold font-mono">Contul Meu</h1>
        <p className="mt-3 text-[#9BABAB]">
          Bine ai venit in zona de cont. Aici vom afisa cosul, serviciile selectate,
          recomandari si setarile profilului.
        </p>

        <div className="mt-8 rounded-2xl border border-[#253745] bg-[#11212D] p-6">
          <p className="text-sm text-[#9BABAB]">Locale curenta: {locale}</p>
          <p className="mt-2 text-sm text-[#CCD0CF]">
            Sectiunea este activa si pregatita pentru urmatoarele functionalitati.
          </p>
        </div>
      </main>
    </div>
  )
}
