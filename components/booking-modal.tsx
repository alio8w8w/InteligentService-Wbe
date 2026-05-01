"use client"

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { X, Loader2, User, Phone, Mail, ShieldCheck } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (orderId: string) => void // Returnează ID-ul comenzii create
}

export default function BookingModal({ isOpen, onClose, onSuccess }: BookingModalProps) {
  const [nume, setNume] = useState('')
  const [prenume, setPrenume] = useState('')
  const [telefon, setTelefon] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(true)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Creăm comanda inițială (Coșul) în tabelul tău `orders`
      const { data, error: dbError } = await supabase
        .from('orders')
        .insert([{ 
          nume, 
          prenume, 
          telefon, 
          email, 
          doreste_telefon: consent, // Mapat pe coloana ta din baza de date
          status: 'cart',           // Status inițial
          suma_totala: 0            // O vom actualiza pe parcurs sau la checkout
        }])
        .select()
        .single()

      if (dbError) throw new Error(dbError.message)

      // 2. Salvăm ID-ul Comenzii în memoria browser-ului
      localStorage.setItem('inteligent_order_id', data.id)

      // 3. Anunțăm componenta părinte și dăm ID-ul mai departe
      onSuccess(data.id)
      
    } catch (err: any) {
      setError("A apărut o eroare la salvarea datelor. Te rugăm să încerci din nou.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-[#0F2A4A]/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-lg rounded-[2rem] bg-[#F5F2EC] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-[#0F2A4A] p-6 sm:p-8 text-[#F5F2EC] relative">
          <button onClick={onClose} className="absolute right-4 top-4 text-[#7A8CA5] hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all">
            <X size={20} />
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F26A1B]/20 text-[#F26A1B] font-bold text-xs mb-4 border border-[#F26A1B]/30">
            <ShieldCheck size={14} /> Date Securizate
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Date de Contact</h2>
          <p className="mt-2 text-sm text-[#7A8CA5] font-medium leading-relaxed">
            Pentru a putea adăuga produse în coș, te rugăm să ne lași câteva detalii. Îți vom cere aceste date o singură dată!
          </p>
        </div>

        <div className="p-6 sm:p-8 bg-white">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#7A8CA5] mb-1.5 uppercase">Nume *</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8CA5]" />
                  <input required value={nume} onChange={e => setNume(e.target.value)} type="text" placeholder="Popescu" className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#7A8CA5]/20 focus:border-[#F26A1B] focus:ring-1 focus:ring-[#F26A1B] outline-none transition-all text-[#0F2A4A] bg-[#F5F2EC]/50" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#7A8CA5] mb-1.5 uppercase">Prenume *</label>
                <input required value={prenume} onChange={e => setPrenume(e.target.value)} type="text" placeholder="Ion" className="w-full px-4 py-3 rounded-xl border border-[#7A8CA5]/20 focus:border-[#F26A1B] focus:ring-1 focus:ring-[#F26A1B] outline-none transition-all text-[#0F2A4A] bg-[#F5F2EC]/50" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#7A8CA5] mb-1.5 uppercase">Telefon *</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8CA5]" />
                <input required value={telefon} onChange={e => setTelefon(e.target.value)} type="tel" placeholder="068 123 456" className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#7A8CA5]/20 focus:border-[#F26A1B] focus:ring-1 focus:ring-[#F26A1B] outline-none transition-all text-[#0F2A4A] bg-[#F5F2EC]/50" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#7A8CA5] mb-1.5 uppercase">Email (Opțional)</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8CA5]" />
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="ion.popescu@email.com" className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#7A8CA5]/20 focus:border-[#F26A1B] focus:ring-1 focus:ring-[#F26A1B] outline-none transition-all text-[#0F2A4A] bg-[#F5F2EC]/50" />
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer p-4 bg-[#F5F2EC]/50 rounded-xl border border-[#7A8CA5]/10 mt-2">
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="w-5 h-5 accent-[#F26A1B] rounded mt-0.5 flex-shrink-0" />
              <span className="text-sm text-[#0F2A4A] font-medium">
                Doresc să fiu contactat telefonic în legătură cu comanda mea.
              </span>
            </label>

            <button type="submit" disabled={loading} className="w-full bg-[#F26A1B] hover:bg-[#C24C0F] disabled:bg-[#7A8CA5] text-white font-bold text-lg py-4 rounded-xl transition-all shadow-md hover:shadow-xl active:scale-[0.98] flex justify-center items-center gap-2 mt-6">
              {loading ? <Loader2 className="animate-spin" size={24} /> : "Salvează și Adaugă în Coș"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}