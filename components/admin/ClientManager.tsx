"use client"

import { useState, useEffect, useMemo } from "react"
import { Users, Mail, Send, CheckSquare, Square, Loader2, Search, CheckCircle2, AlertCircle } from "lucide-react"

type Client = {
  id: string
  nume: string
  prenume: string
  email: string
  telefon: string
}

export default function ClientManager() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Starea pentru email
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set())
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error" | null; msg: string }>({ type: null, msg: "" })

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // Luăm datele din programări (reutilizăm API-ul)
        const res = await fetch("/api/admin/bookings")
        if (!res.ok) throw new Error("Nu am putut încărca clienții.")
        const data = await res.json()
        
        // Filtrăm clienții pentru a avea doar email-uri unice
        const uniqueClients: Client[] = []
        const seenEmails = new Set<string>()
        
        data.bookings?.forEach((b: any) => {
          if (b.email && !seenEmails.has(b.email)) {
            seenEmails.add(b.email)
            uniqueClients.push({
              id: b.id,
              nume: b.nume || "",
              prenume: b.prenume || "",
              email: b.email,
              telefon: b.telefon || ""
            })
          }
        })
        
        setClients(uniqueClients)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchClients()
  }, [])

  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      c.nume.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.prenume.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [clients, searchTerm])

  const handleSelectAll = () => {
    if (selectedEmails.size === filteredClients.length) {
      setSelectedEmails(new Set()) // Deselectează tot
    } else {
      setSelectedEmails(new Set(filteredClients.map(c => c.email))) // Selectează tot
    }
  }

  const handleToggleEmail = (email: string) => {
    const newSelected = new Set(selectedEmails)
    if (newSelected.has(email)) {
      newSelected.delete(email)
    } else {
      newSelected.add(email)
    }
    setSelectedEmails(newSelected)
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedEmails.size === 0) {
      setStatus({ type: "error", msg: "Selectează cel puțin un client." })
      return
    }

    setSending(true)
    setStatus({ type: null, msg: "" })

    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails: Array.from(selectedEmails),
          subject,
          message
        })
      })

      if (!res.ok) throw new Error("Eroare la trimiterea emailurilor.")
      
      setStatus({ type: "success", msg: `Mesaj trimis cu succes către ${selectedEmails.size} clienți!` })
      setSubject("")
      setMessage("")
      setSelectedEmails(new Set()) // Resetăm selecția după trimitere
    } catch (error: any) {
      setStatus({ type: "error", msg: error.message || "A apărut o eroare." })
    } finally {
      setSending(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-[#706760]">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="italic font-medium">Se încarcă baza de date clienți...</p>
    </div>
  )

  return (
    <div className="relative min-h-[80vh] w-full rounded-[2rem] overflow-hidden flex flex-col xl:flex-row gap-6 p-6">
      {/* Background Image cu Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
        />
        {/* Overlay alb semi-transparent pentru a putea citi textul */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]" />
      </div>

      {/* SECȚIUNEA STÂNGA: LISTA CLIENȚI */}
      <div className="relative z-10 w-full xl:w-1/2 bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-[#706760]/10 shadow-xl flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#706760] flex items-center gap-2">
            <Users className="text-[#BFC08E]" /> Baza de Clienți
          </h2>
          <span className="bg-[#EAA093]/20 text-[#EAA093] px-3 py-1 rounded-full text-xs font-bold">
            Total: {clients.length}
          </span>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#706760]/40" size={18} />
          <input 
            type="text" 
            placeholder="Caută client sau email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/80 border-none rounded-xl pl-10 pr-4 py-3 text-sm text-[#706760] focus:ring-2 focus:ring-[#BFC08E] outline-none"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl mb-2 text-sm font-bold text-[#706760]">
          <button onClick={handleSelectAll} className="flex items-center gap-2 hover:text-[#BFC08E] transition-colors">
            {selectedEmails.size === filteredClients.length && filteredClients.length > 0 
              ? <CheckSquare size={18} className="text-[#BFC08E]" /> 
              : <Square size={18} />
            }
            Selectează Toți
          </button>
          <span className="text-xs opacity-60">{selectedEmails.size} selectați</span>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2 max-h-[400px]">
          {filteredClients.map(client => (
            <div 
              key={client.email} 
              onClick={() => handleToggleEmail(client.email)}
              className={`p-4 rounded-2xl cursor-pointer transition-all border flex items-center gap-4 ${
                selectedEmails.has(client.email) 
                  ? 'bg-[#BFC08E]/10 border-[#BFC08E] shadow-sm' 
                  : 'bg-white border-transparent hover:border-[#EED5B9]'
              }`}
            >
              <div className="text-[#706760]">
                {selectedEmails.has(client.email) ? <CheckSquare size={20} className="text-[#BFC08E]" /> : <Square size={20} className="opacity-30" />}
              </div>
              <div>
                <h4 className="font-bold text-[#706760] text-sm">{client.nume} {client.prenume}</h4>
                <p className="text-xs text-[#706760]/60">{client.email}</p>
              </div>
            </div>
          ))}
          {filteredClients.length === 0 && (
            <p className="text-center text-sm opacity-50 italic mt-10">Nu s-au găsit clienți.</p>
          )}
        </div>
      </div>

      {/* SECȚIUNEA DREAPTA: COMPUNERE EMAIL */}
      <div className="relative z-10 w-full xl:w-1/2 bg-white rounded-3xl p-6 border border-[#706760]/10 shadow-xl flex flex-col">
        <h2 className="text-2xl font-bold text-[#706760] flex items-center gap-2 mb-6">
          <Mail className="text-[#EAA093]" /> Trimite Mesaj
        </h2>

        {status.msg && (
          <div className={`p-4 rounded-xl mb-6 flex items-center gap-2 text-sm font-bold ${
            status.type === 'success' ? 'bg-[#BFC08E]/20 text-[#706760]' : 'bg-red-50 text-red-500'
          }`}>
            {status.type === 'success' ? <CheckCircle2 size={18} className="text-[#BFC08E]" /> : <AlertCircle size={18} />}
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSendEmail} className="flex flex-col flex-1 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#706760] mb-2">Către:</label>
            <div className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-[#706760]">
              {selectedEmails.size === 0 
                ? <span className="opacity-50 italic">Niciun client selectat</span>
                : <span className="font-bold text-[#EAA093]">{selectedEmails.size} clienți selectați</span>
              }
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#706760] mb-2">Subiect:</label>
            <input 
              type="text" 
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Reduceri de Primăvară la Beauty Space!" 
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-[#706760] focus:ring-2 focus:ring-[#EAA093] outline-none transition-all"
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-bold text-[#706760] mb-2">Mesajul tău:</label>
            <textarea 
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Scrie mesajul aici..." 
              className="w-full flex-1 min-h-[200px] bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-[#706760] focus:ring-2 focus:ring-[#EAA093] outline-none transition-all resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={sending || selectedEmails.size === 0}
            className="mt-auto w-full bg-[#706760] hover:bg-[#EAA093] disabled:bg-gray-200 disabled:text-gray-400 text-[#EED5B9] disabled:cursor-not-allowed font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
          >
            {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            {sending ? "Se trimite..." : "Trimite Email"}
          </button>
        </form>
      </div>
    </div>
  )
}