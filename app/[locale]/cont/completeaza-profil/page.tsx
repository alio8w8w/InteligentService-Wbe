import { Navbar } from "@/components/navbar"

export default function CompleteazaProfilPage() {
  return (
    <div className="min-h-screen bg-[#06141B] text-[#CCD0CF]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="text-3xl font-bold font-mono">Completeaza Profilul</h1>
        <p className="mt-3 text-[#9BABAB]">
          Pentru a continua, completeaza datele de profil lipsa. In etapa urmatoare
          vom conecta aceasta pagina la tabelul <code>profiles</code> din Supabase.
        </p>

        <div className="mt-8 rounded-2xl border border-[#253745] bg-[#11212D] p-6">
          <p className="text-sm text-[#CCD0CF]">Profil incomplet detectat.</p>
          <p className="mt-2 text-sm text-[#9BABAB]">
            Te rugam sa completezi nume, prenume si telefon pentru activarea completa a contului.
          </p>
        </div>
      </main>
    </div>
  )
}
