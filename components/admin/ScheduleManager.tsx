"use client"

import { useState, useEffect } from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { Clock, Trash2, ShieldAlert, Loader2, CalendarX } from "lucide-react"

const ORE_SISTEM = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
]

type BlockedSlot = {
  id: string
  data: string
  ora: string
}

export default function ScheduleManager() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date())
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const selectedDateStr = selectedDay ? selectedDay.toISOString().split("T")[0] : ""

  // 1. Încărcăm toate blocările existente
  const fetchBlocks = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/blocks")
      const data = await res.json()
      if (data.blocks) setBlockedSlots(data.blocks)
    } catch (e) {
      console.error("Eroare la preluare blocări:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBlocks() }, [])

  // 2. Funcție pentru blocare/deblocare oră sau zi întreagă
  const toggleBlock = async (ora: string) => {
    if (!selectedDateStr) return
    setActionLoading(ora)

    const isAlreadyBlocked = blockedSlots.find(
      (b) => b.data === selectedDateStr && b.ora === ora
    )

    try {
      if (isAlreadyBlocked) {
        // Deblocare (DELETE)
        await fetch("/api/admin/blocks", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: isAlreadyBlocked.id }),
        })
      } else {
        // Blocare (POST)
        await fetch("/api/admin/blocks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: selectedDateStr, ora }),
        })
      }
      await fetchBlocks()
    } catch (e) {
      alert("Eroare la procesare.")
    } finally {
      setActionLoading(null)
    }
  }

  // Filtrăm blocările pentru ziua selectată
  const currentDayBlocks = blockedSlots.filter(b => b.data === selectedDateStr)
  const isAllDayBlocked = currentDayBlocks.some(b => b.ora === "ALL_DAY")

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#706760]">Gestionare Program</h1>
        <p className="text-[#706760]/60 italic text-sm">Blochează zilele de concediu sau orele indisponibile</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* CALENDAR */}
        <div className="bg-white p-6 rounded-3xl border border-[#706760]/5 shadow-sm flex justify-center">
          <DayPicker
            mode="single"
            selected={selectedDay}
            onSelect={setSelectedDay}
            disabled={{ before: new Date() }}
            classNames={{
              selected: "!bg-[#BFC08E] !text-[#1a1613] !rounded-full font-bold",
              today: "!text-[#EAA093] font-black underline",
            }}
          />
        </div>

        {/* SELECTOR ORE */}
        <div className="bg-white p-8 rounded-3xl border border-[#706760]/5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-[#706760] font-bold">
              <Clock size={20} className="text-[#BFC08E]" />
              <span>Intervale pentru {selectedDateStr}</span>
            </div>
            
            <button
              onClick={() => toggleBlock("ALL_DAY")}
              className={`px-4 py-2 rounded-full text-xs font-black tracking-widest transition-all ${
                isAllDayBlocked 
                ? "bg-[#EAA093] text-white" 
                : "bg-gray-100 text-gray-400 hover:bg-red-50"
              }`}
            >
              {isAllDayBlocked ? "DEBLOCHEAZĂ ZIUA" : "BLOCHEAZĂ TOATĂ ZIUA"}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ORE_SISTEM.map((ora) => {
              const isBlocked = isAllDayBlocked || currentDayBlocks.some(b => b.ora === ora)
              const isLoading = actionLoading === ora

              return (
                <button
                  key={ora}
                  disabled={isAllDayBlocked && ora !== "ALL_DAY"}
                  onClick={() => toggleBlock(ora)}
                  className={`group relative flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                    isBlocked 
                    ? "bg-[#706760] border-[#706760] text-[#EED5B9]" 
                    : "bg-white border-gray-100 text-[#706760] hover:border-[#BFC08E]"
                  } ${(isAllDayBlocked && ora !== "ALL_DAY") && "opacity-30"}`}
                >
                  <span className="text-sm font-bold">{ora}</span>
                  {isLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : isBlocked ? (
                    <CalendarX size={14} />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-[#BFC08E] opacity-0 group-hover:opacity-100" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-8 p-4 bg-[#fcfaf8] rounded-2xl border border-[#EED5B9]/30">
            <div className="flex items-start gap-3">
              <ShieldAlert className="text-[#EAA093] mt-1" size={18} />
              <p className="text-[11px] text-[#706760]/70 leading-relaxed font-medium">
                <b>Notă:</b> Orele marcate cu cafeniu vor fi dezactivate automat în formularul de rezervare al clienților. Clienții nu vor putea trimite cereri pentru aceste intervale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}