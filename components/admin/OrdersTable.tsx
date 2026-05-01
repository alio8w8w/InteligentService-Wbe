"use client"

import { useEffect, useState, useMemo } from "react"
import { Trash2, CheckCircle, ArrowUpDown, Loader2, AlertCircle, Phone, Mail, DollarSign, Filter, PhoneCall } from "lucide-react"

// Tipul de date adaptat noului model
type Order = {
  id: string
  created_at: string
  nume: string
  prenume: string
  email: string
  telefon: string
  suma_totala: number
  doreste_telefon: boolean
  status: 'noua' | 'procesata' // Am înlocuit "confirmed" boolean cu un status clar
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Stări pentru Sortare și Filtrare
  const [sortField, setSortField] = useState<"data" | "pret" | "nume">("data")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc") // Default: cele mai noi primele
  const [filterPhoneCall, setFilterPhoneCall] = useState<boolean | null>(null) // null = toate, true = doar cei ce vor apel

  const loadOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      // Notă: Va trebui să actualizezi și API-ul tău să citească din tabela 'orders'
      const res = await fetch("/api/admin/orders") 
      if (!res.ok) throw new Error("Nu s-au putut încărca datele.")
      const data = await res.json()
      setOrders(data.orders ?? [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrders() }, [])

  // --- FUNCȚIA DE ȘTERGERE ---
  const deleteOrder = async (id: string) => {
    if (!confirm("Sigur dorești să ștergi această comandă?")) return
    const previousOrders = [...orders]
    setOrders((prev) => prev.filter((o) => o.id !== id))

    try {
      const res = await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error("Eroare la ștergerea din baza de date.")
    } catch (e) {
      alert("Eroare de rețea. Comanda nu a fost ștearsă.")
      setOrders(previousOrders)
    }
  }

  // --- FUNCȚIA DE ACTUALIZARE STATUS ---
  const toggleStatus = async (order: Order) => {
    const previousOrders = [...orders]
    const newStatus = order.status === 'noua' ? 'procesata' : 'noua'

    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o))

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status: newStatus }),
      })
      if (!res.ok) throw new Error("Eroare la modificare status")
    } catch (e) {
      alert("Eroare de rețea. Statusul nu a putut fi salvat.")
      setOrders(previousOrders)
    }
  }

  // --- LOGICA DE FILTRARE ȘI SORTARE ---
  const processedData = useMemo(() => {
    let result = [...orders];

    // 1. Filtrare
    if (filterPhoneCall !== null) {
      result = result.filter(o => o.doreste_telefon === filterPhoneCall);
    }

    // 2. Sortare
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "data") {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortField === "pret") {
        comparison = (a.suma_totala || 0) - (b.suma_totala || 0);
      } else if (sortField === "nume") {
        comparison = (a.nume || "").localeCompare(b.nume || "");
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [orders, sortField, sortOrder, filterPhoneCall])

  // Funcție helper pentru formatarea datei
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' });
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-[#283618]">
      <Loader2 className="animate-spin mb-4 text-[#DDA15E]" size={40} />
      <p className="italic font-medium">Se preiau comenzile din Supabase...</p>
    </div>
  )

  return (
    <div className="animate-in fade-in duration-500 w-full">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center gap-2">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* HEADER & FILTRE */}
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-end gap-6 mb-8 bg-white p-6 rounded-3xl border border-[#283618]/10 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#283618]">Comenzi & Coșuri</h1>
          <p className="text-[#606C38] italic uppercase text-[10px] tracking-widest mt-1 font-bold">Gestiune clienți logați</p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          {/* Filtru Apel Telefonic */}
          <div className="flex items-center gap-2 bg-[#FEFAE0] p-1 rounded-xl border border-[#283618]/10">
            <button 
              onClick={() => setFilterPhoneCall(null)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${filterPhoneCall === null ? 'bg-[#283618] text-[#FEFAE0]' : 'text-[#606C38] hover:bg-[#DDA15E]/20'}`}
            >
              Toate
            </button>
            <button 
              onClick={() => setFilterPhoneCall(true)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1 ${filterPhoneCall === true ? 'bg-[#BC6C25] text-white shadow-sm' : 'text-[#606C38] hover:bg-[#DDA15E]/20'}`}
            >
              <PhoneCall size={14} /> Necesită Apel
            </button>
          </div>

          {/* Sortare Câmp */}
          <select 
            value={sortField}
            onChange={(e) => setSortField(e.target.value as any)}
            className="bg-[#FEFAE0] text-[#283618] px-4 py-2 rounded-xl font-bold text-sm border border-[#283618]/10 outline-none focus:border-[#DDA15E]"
          >
            <option value="data">Sortează după Dată</option>
            <option value="pret">Sortează după Valoare</option>
            <option value="nume">Sortează după Nume (A-Z)</option>
          </select>

          {/* Sortare Direcție */}
          <button 
            onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
            className="flex items-center justify-center gap-2 bg-[#DDA15E] text-[#283618] px-5 py-2 rounded-xl font-bold text-sm hover:bg-[#BC6C25] hover:text-white transition-all shadow-sm"
          >
            <ArrowUpDown size={16} />
            {sortOrder === "asc" ? "Crescător" : "Descrescător"}
          </button>
        </div>
      </div>

      {/* VERSIUNEA DESKTOP (TABEL) */}
      <div className="hidden lg:block bg-white rounded-[2rem] border border-[#283618]/10 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FEFAE0]/50 text-[#606C38] text-[11px] uppercase tracking-widest font-black border-b border-[#283618]/10">
              <th className="p-6">Client</th>
              <th className="p-6">Contact & Status</th>
              <th className="p-6">Data Înregistrării</th>
              <th className="p-6 text-right">Valoare Coș</th>
              <th className="p-6 text-center">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FEFAE0]">
            {processedData.map((o) => (
              <tr key={o.id} className="hover:bg-[#FEFAE0]/30 transition-colors group">
                {/* Nume Client */}
                <td className="p-6">
                  <div className="font-bold text-[#283618] text-sm">{o.nume} {o.prenume}</div>
                </td>
                
                {/* Contact & Status */}
                <td className="p-6">
                  <div className="text-sm text-[#606C38] font-medium flex items-center gap-2">
                    <Phone size={12} className="opacity-60" /> {o.telefon}
                  </div>
                  <div className="text-xs text-[#606C38] opacity-70 lowercase flex items-center gap-2 mt-1 mb-2">
                    <Mail size={12} /> {o.email}
                  </div>
                  {o.doreste_telefon && (
                    <span className="inline-flex items-center gap-1 bg-[#BC6C25]/10 text-[#BC6C25] px-2 py-0.5 rounded text-[10px] font-black uppercase">
                      <PhoneCall size={10} /> De contactat
                    </span>
                  )}
                </td>

                {/* Data */}
                <td className="p-6 text-[#606C38] text-sm font-medium">
                  {formatDate(o.created_at)}
                </td>

                {/* Pret */}
                <td className="p-6 text-right">
                   <span className="inline-flex items-center bg-[#DDA15E]/10 text-[#283618] px-3 py-1.5 rounded-xl font-black text-sm">
                    {o.suma_totala} Lei
                  </span>
                </td>

                {/* Actiuni */}
                <td className="p-6">
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => toggleStatus(o)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all shadow-sm flex items-center gap-1 ${o.status === 'procesata' ? 'bg-[#606C38] text-white' : 'bg-[#FEFAE0] text-[#606C38] hover:bg-[#DDA15E] hover:text-[#283618]'}`}
                    >
                      <CheckCircle size={14} />
                      {o.status === 'procesata' ? "Procesată" : "Marchează Procesată"}
                    </button>
                    <button 
                      onClick={() => deleteOrder(o.id)}
                      className="p-1.5 rounded-lg bg-[#FEFAE0] text-[#BC6C25] hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                      title="Șterge comanda"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {processedData.length === 0 && (
          <div className="p-20 text-center text-[#606C38]/50 italic font-medium">
            Nu s-au găsit comenzi care să corespundă filtrelor.
          </div>
        )}
      </div>

      {/* VERSIUNEA MOBILĂ - Va trebui adaptată similar dacă ai nevoie, am păstrat structura curată momentan pentru focus pe funcționalități */}
    </div>
  )
}