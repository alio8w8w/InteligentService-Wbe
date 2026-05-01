"use client"

import { useState, useEffect, useMemo } from "react"
import { Users, Mail, Send, CheckSquare, Square, Loader2, Search, CheckCircle2, AlertCircle, Smartphone, MessageSquare } from "lucide-react"

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
  
  // Starea pentru selecția clienților
  const [selectedClientIds, setSelectedClientIds] = useState<Set<string>>(new Set())
  
  // Starea pentru metodele de trimitere (Email / SMS)
  const [sendMethod, setSendMethod] = useState({ email: true, sms: false })
  
  // Datele formularului
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error" | null; msg: string }>({ type: null, msg: "" })

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // Extragem datele din noul API de comenzi
        const res = await fetch("/api/admin/orders")
        if (!res.ok) throw new Error("Nu am putut încărca clienții.")
        const data = await res.json()
        
        // Filtrăm clienții pentru a evita duplicatele (după email sau telefon)
        const uniqueClients: Client[] = []
        const seenContacts = new Set<string>()
        
        data.orders?.forEach((o: any) => {
          // Creăm o cheie unică din email și telefon pentru a nu adăuga aceeași persoană de 2 ori
          const contactKey = `${o.email}-${o.telefon}`
          if (!seenContacts.has(contactKey)) {
            seenContacts.add(contactKey)
            uniqueClients.push({
              id: o.id,
              nume: o.nume || "",
              prenume: o.prenume || "",
              email: o.email || "",
              telefon: o.telefon || ""
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

  // Căutare live
  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      c.nume.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.prenume.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.telefon.includes(searchTerm)
    )
  }, [clients, searchTerm])

  // Selectare / Deselectare toți clienții din lista filtrată
  const handleSelectAll = () => {
    if (selectedClientIds.size === filteredClients.length) {
      setSelectedClientIds(new Set())
    } else {
      setSelectedClientIds(new Set(filteredClients.map(c => c.id)))
    }
  }

  // Selectare individuală
  const handleToggleClient = (id: string) => {
    const newSelected = new Set(selectedClientIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedClientIds(newSelected)
  }

  // Trimiterea mesajului
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedClientIds.size === 0) {
      setStatus({ type: "error", msg: "Selectează cel puțin un client." })
      return
    }
    if (!sendMethod.email && !sendMethod.sms) {
      setStatus({ type: "error", msg: "Alege cel puțin o metodă de trimitere (Email sau SMS)." })
      return
    }

    setSending(true)
    setStatus({ type: null, msg: "" })

    // Extragem doar contactele selectate
    const selectedClientsData = clients.filter(c => selectedClientIds.has(c.id))
    const emails = selectedClientsData.map(c => c.email).filter(Boolean)
    const phones = selectedClientsData.map(c => c.telefon).filter(Boolean)

    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sendEmail: sendMethod.email,
          sendSms: sendMethod.sms,
          emails: emails,
          phones: phones,
          subject: subject,
          message: message
        })
      })

      if (!res.ok) throw new Error("Eroare la trimiterea mesajelor.")
      
      setStatus({ type: "success", msg: `Mesaj trimis cu succes către ${selectedClientIds.size} clienți!` })
      setSubject("")
      setMessage("")
      setSelectedClientIds(new Set()) // Resetăm selecția
    } catch (error: any) {
      setStatus({ type: "error", msg: error.message || "A apărut o eroare." })
    } finally {
      setSending(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-[#283618]">
      <Loader2 className="animate-spin mb-4 text-[#DDA15E]" size={40} />
      <p className="italic font-medium">Se încarcă baza de date clienți...</p>
    </div>
  )

  return (
    <div className="relative min-h-[80vh] w-full rounded-[2rem] overflow-hidden flex flex-col xl:flex-row gap-6 p-6">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#FEFAE0]/30" />
      </div>

      {/* SECȚIUNEA STÂNGA: LISTA CLIENȚI */}
      <div className="relative z-10 w-full xl:w-1/2 bg-white rounded-3xl p-6 border border-[#283618]/10 shadow-sm flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#283618] flex items-center gap-2">
            <Users className="text-[#DDA15E]" /> Baza de Clienți
          </h2>
          <span className="bg-[#FEFAE0] text-[#606C38] px-3 py-1 rounded-full text-xs font-black border border-[#283618]/5">
            Total: {clients.length}
          </span>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#606C38]/50" size={18} />
          <input 
            type="text" 
            placeholder="Caută după nume, email sau telefon..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FEFAE0]/30 border border-[#283618]/10 rounded-xl pl-10 pr-4 py-3 text-sm text-[#283618] focus:ring-2 focus:ring-[#DDA15E] outline-none"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-[#FEFAE0]/50 rounded-xl mb-2 text-sm font-bold text-[#606C38]">
          <button onClick={handleSelectAll} className="flex items-center gap-2 hover:text-[#BC6C25] transition-colors">
            {selectedClientIds.size === filteredClients.length && filteredClients.length > 0 
              ? <CheckSquare size={18} className="text-[#BC6C25]" /> 
              : <Square size={18} className="opacity-50" />
            }
            Selectează Toți
          </button>
          <span className="text-xs opacity-70">{selectedClientIds.size} selectați</span>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2 max-h-[500px]">
          {filteredClients.map(client => (
            <div 
              key={client.id} 
              onClick={() => handleToggleClient(client.id)}
              className={`p-4 rounded-2xl cursor-pointer transition-all border flex items-start gap-4 ${
                selectedClientIds.has(client.id) 
                  ? 'bg-[#FEFAE0] border-[#DDA15E] shadow-sm' 
                  : 'bg-white border-[#283618]/5 hover:border-[#DDA15E]/50'
              }`}
            >
              <div className="mt-0.5 text-[#283618]">
                {selectedClientIds.has(client.id) ? <CheckSquare size={20} className="text-[#BC6C25]" /> : <Square size={20} className="opacity-20" />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[#283618] text-sm">{client.nume} {client.prenume}</h4>
                <div className="flex flex-col gap-1 mt-1">
                  {client.email && (
                    <span className="text-xs text-[#606C38] flex items-center gap-1"><Mail size={12} /> {client.email}</span>
                  )}
                  {client.telefon && (
                    <span className="text-xs text-[#606C38] flex items-center gap-1"><Smartphone size={12} /> {client.telefon}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredClients.length === 0 && (
            <p className="text-center text-sm opacity-50 italic mt-10 text-[#606C38]">Nu s-au găsit clienți.</p>
          )}
        </div>
      </div>

      {/* SECȚIUNEA DREAPTA: COMPUNERE MESAJ */}
      <div className="relative z-10 w-full xl:w-1/2 bg-white rounded-3xl p-6 border border-[#283618]/10 shadow-sm flex flex-col">
        <h2 className="text-2xl font-bold text-[#283618] flex items-center gap-2 mb-6">
          <MessageSquare className="text-[#BC6C25]" /> Trimite Mesaj
        </h2>

        {status.msg && (
          <div className={`p-4 rounded-xl mb-6 flex items-center gap-2 text-sm font-bold ${
            status.type === 'success' ? 'bg-[#FEFAE0] text-[#606C38] border border-[#DDA15E]/30' : 'bg-red-50 text-red-500 border border-red-100'
          }`}>
            {status.type === 'success' ? <CheckCircle2 size={18} className="text-[#606C38]" /> : <AlertCircle size={18} />}
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex flex-col flex-1 gap-5">
          {/* ALEGEREA METODEI DE TRIMITERE */}
          <div className="bg-[#FEFAE0]/30 p-4 rounded-2xl border border-[#283618]/5">
            <label className="block text-sm font-bold text-[#283618] mb-3">Alege metoda de trimitere:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-[#606C38] font-medium text-sm hover:text-[#BC6C25] transition-colors">
                <input 
                  type="checkbox" 
                  checked={sendMethod.email} 
                  onChange={(e) => setSendMethod(prev => ({ ...prev, email: e.target.checked }))}
                  className="w-4 h-4 accent-[#BC6C25]"
                />
                <Mail size={16} /> Email
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[#606C38] font-medium text-sm hover:text-[#BC6C25] transition-colors">
                <input 
                  type="checkbox" 
                  checked={sendMethod.sms} 
                  onChange={(e) => setSendMethod(prev => ({ ...prev, sms: e.target.checked }))}
                  className="w-4 h-4 accent-[#BC6C25]"
                />
                <Smartphone size={16} /> SMS
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#283618] mb-2">Destinatari:</label>
            <div className="w-full bg-[#FEFAE0]/30 border border-[#283618]/10 rounded-xl px-4 py-3 text-sm text-[#606C38]">
              {selectedClientIds.size === 0 
                ? <span className="opacity-50 italic">Niciun client selectat</span>
                : <span className="font-bold text-[#BC6C25]">{selectedClientIds.size} clienți selectați</span>
              }
            </div>
          </div>

          {/* Subiectul apare doar dacă metoda 'Email' este selectată */}
          {sendMethod.email && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-bold text-[#283618] mb-2">Subiect Email:</label>
              <input 
                type="text" 
                required={sendMethod.email}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Oferte noi pe site!" 
                className="w-full bg-white border border-[#283618]/20 rounded-xl px-4 py-3 text-sm text-[#283618] focus:ring-2 focus:ring-[#DDA15E] outline-none transition-all"
              />
            </div>
          )}

          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-bold text-[#283618] mb-2">Mesajul tău:</label>
            <textarea 
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={sendMethod.sms ? "Scrie mesajul (atenție la numărul de caractere pentru SMS)..." : "Scrie mesajul aici..."} 
              className="w-full flex-1 min-h-[150px] bg-white border border-[#283618]/20 rounded-xl px-4 py-3 text-sm text-[#283618] focus:ring-2 focus:ring-[#DDA15E] outline-none transition-all resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={sending || selectedClientIds.size === 0 || (!sendMethod.email && !sendMethod.sms)}
            className="mt-auto w-full bg-[#BC6C25] hover:bg-[#283618] disabled:bg-[#FEFAE0] disabled:text-[#606C38] disabled:border disabled:border-[#283618]/10 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
          >
            {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            {sending ? "Se procesează..." : "Trimite Acum"}
          </button>
        </form>
      </div>
    </div>
  )
}