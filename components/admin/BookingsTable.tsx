"use client"

import { useEffect, useState, useMemo } from "react"
import { Trash2, CheckCircle, ArrowUpDown, Loader2, AlertCircle, Calendar, Phone, Mail } from "lucide-react"

type Booking = {
  id: string
  nume?: string
  prenume?: string
  email?: string
  telefon?: string
  serviciu?: string
  data_programare?: string
  ora?: string
  confirmed?: boolean
}

export default function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [error, setError] = useState<string | null>(null)

  const loadBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/bookings")
      if (!res.ok) throw new Error("Nu s-au putut încărca datele.")
      const data = await res.json()
      setBookings(data.bookings ?? [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadBookings() }, [])

  // --- FUNCȚIA DE ȘTERGERE (Cu Optimistic Update) ---
  const deleteBooking = async (id: string) => {
    if (!confirm("Sigur dorești să ștergi această programare?")) return

    const previousBookings = [...bookings]
    
    // 1. Actualizăm UI-ul instantaneu
    setBookings((prev) => prev.filter((b) => b.id !== id))

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, bookingId: id }),
      })

      if (!res.ok) {
        throw new Error("Eroare la ștergerea din baza de date.")
      }
    } catch (e) {
      console.error("Eroare la ștergere:", e)
      alert("Eroare de rețea. Programarea nu a fost ștearsă.")
      // 2. Restaurăm starea dacă API-ul dă fail
      setBookings(previousBookings)
    }
  }

  // --- FUNCȚIA DE CONFIRMARE (Cu Optimistic Update) ---
  const toggleConfirm = async (booking: Booking) => {
    const previousBookings = [...bookings]
    const newStatus = !booking.confirmed

    // 1. Actualizăm UI-ul instantaneu
    setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, confirmed: newStatus } : b))

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: booking.id, bookingId: booking.id, confirmed: newStatus }),
      })
      
      if (!res.ok) {
        throw new Error("Eroare la confirmare")
      }
    } catch (e) {
      alert("Eroare de rețea. Statusul nu a putut fi salvat.")
      // 2. Restaurăm starea în caz de eroare
      setBookings(previousBookings)
    }
  }

  const sortedData = useMemo(() => {
    return [...bookings].sort((a, b) => {
      const dateA = new Date(`${a.data_programare}T${a.ora}`).getTime()
      const dateB = new Date(`${b.data_programare}T${b.ora}`).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })
  }, [bookings, sortOrder])

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-[#706760]">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="italic font-medium">Se preiau datele din Supabase...</p>
    </div>
  )

  return (
    <div className="animate-in fade-in duration-500 w-full">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center gap-2">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#706760]">Programări Clienți</h1>
          <p className="text-[#706760]/60 italic uppercase text-[10px] tracking-widest mt-1 font-bold">Live Database Access</p>
        </div>

        <button 
          onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
          className="flex items-center justify-center gap-2 bg-[#EED5B9] text-[#706760] px-5 py-3 sm:py-2.5 rounded-full font-bold text-sm hover:shadow-md transition-all active:scale-95 w-full sm:w-auto"
        >
          <ArrowUpDown size={16} />
          {sortOrder === "asc" ? "Afișează cele mai îndepărtate" : "Afișează cele mai apropiate"}
        </button>
      </div>

      {/* VERSIUNEA MOBILĂ (CARDURI) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {sortedData.length === 0 ? (
           <div className="p-10 text-center text-[#706760]/40 italic font-medium bg-white rounded-3xl border border-[#706760]/5">
             Nu s-au găsit programări.
           </div>
        ) : (
          sortedData.map((b) => (
            <div key={b.id} className="bg-white rounded-3xl p-6 border border-[#706760]/10 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-[#706760] text-lg leading-tight">{b.nume} {b.prenume}</h3>
                  <span className="inline-block bg-[#EAA093]/10 text-[#EAA093] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter mt-2">
                    {b.serviciu}
                  </span>
                </div>
                <div className={`p-2 rounded-full ${b.confirmed ? 'bg-[#BFC08E]/20 text-[#BFC08E]' : 'bg-gray-100 text-gray-400'}`}>
                  <CheckCircle size={24} />
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-2 text-sm text-[#706760] font-medium">
                  <Phone size={14} className="opacity-50" /> {b.telefon}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#706760] font-medium">
                  <Mail size={14} className="opacity-50" /> <span className="opacity-60">{b.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#706760] font-bold mt-1">
                  <Calendar size={14} className="text-[#BFC08E]" /> 
                  {b.data_programare} la ora <span className="text-[#BFC08E]">{b.ora}</span>
                </div>
              </div>

              {/* BUTOANE ACȚIUNI MOBIL */}
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => toggleConfirm(b)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all ${b.confirmed ? 'bg-[#BFC08E] text-white shadow-md' : 'bg-gray-100 text-gray-500 active:bg-gray-200'}`}
                >
                  <CheckCircle size={18} /> {b.confirmed ? "Confirmată" : "Confirmă"}
                </button>
                <button 
                  onClick={() => deleteBooking(b.id)}
                  className="px-4 py-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition-all flex items-center justify-center"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* VERSIUNEA DESKTOP (TABEL) */}
      <div className="hidden md:block bg-white rounded-[2rem] border border-[#706760]/5 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fcfaf8] text-[#706760] text-[11px] uppercase tracking-widest font-black border-b border-gray-100">
              <th className="p-6">Client</th>
              <th className="p-6">Contact</th>
              <th className="p-6">Serviciu</th>
              <th className="p-6">Dată & Oră</th>
              <th className="p-6 text-center">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sortedData.map((b) => (
              <tr key={b.id} className="hover:bg-[#BFC08E]/5 transition-colors group">
                <td className="p-6 font-bold text-[#706760] text-sm">{b.nume} {b.prenume}</td>
                <td className="p-6">
                  <div className="text-sm text-[#706760] font-medium flex items-center gap-2">
                    <Phone size={12} className="opacity-40" /> {b.telefon}
                  </div>
                  <div className="text-xs opacity-40 lowercase flex items-center gap-2 mt-1">
                    <Mail size={12} /> {b.email}
                  </div>
                </td>
                <td className="p-6">
                   <span className="bg-[#EAA093]/10 text-[#EAA093] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                    {b.serviciu}
                  </span>
                </td>
                <td className="p-6 font-bold text-[#706760] text-sm">
                  {b.data_programare} <span className="text-[#BFC08E] ml-2 font-black">{b.ora}</span>
                </td>
                <td className="p-6">
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => toggleConfirm(b)}
                      className={`p-2.5 rounded-xl transition-all shadow-sm ${b.confirmed ? 'bg-[#BFC08E] text-white' : 'bg-gray-100 text-gray-400 hover:text-[#BFC08E] hover:bg-white'}`}
                      title={b.confirmed ? "Anulează confirmarea" : "Confirmă programarea"}
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button 
                      onClick={() => deleteBooking(b.id)}
                      className="p-2.5 rounded-xl bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
                      title="Șterge programarea"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortedData.length === 0 && (
          <div className="p-20 text-center text-[#706760]/30 italic font-medium">
            Nu s-au găsit programări în baza de date.
          </div>
        )}
      </div>
    </div>
  )
}