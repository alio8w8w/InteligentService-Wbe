"use client"

import { useEffect, useState, ChangeEvent } from "react"
import { supabase } from "@/lib/supabase"

type GalleryItem = {
  id: string
  type: "image" | "video"
  url: string
  created_at?: string
}

type PendingItem = {
  file: File
  preview: string
  type: "image" | "video"
}

const dark = "#3a2f2a"
const gold = "#c9a96e"
const bg = "#faf7f2"

// CONFIGURARE: Numele bucket-ului din Supabase Storage
const BUCKET_NAME = "gallery-media"

export default function GalerieAdmin() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [pending, setPending] = useState<PendingItem[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  /* ───────── FETCH EXISTING ───────── */
  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Eroare la preluare date:", error.message)
      setErrorMessage("Nu am putut încărca galeria: " + error.message)
      return
    }
    if (data) setItems(data as GalleryItem[])
  }

  useEffect(() => {
    fetchItems()
  }, [])

  /* ───────── ADD FILES ───────── */
  const handleAddFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)

    const mapped: PendingItem[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: (file.type.startsWith("video") ? "video" : "image") as "image" | "video",
    }))

    setPending((prev) => [...prev, ...mapped])
    setErrorMessage(null) // Resetăm erorile când adăugăm fișiere noi
  }

  /* ───────── DELETE EXISTING ───────── */
  const deleteExisting = async (item: GalleryItem) => {
    const fileName = item.url.split("/").pop()
    if (!fileName) return

    if (!confirm("Sigur vrei să ștergi acest element din galerie?")) return

    try {
      // Ștergem din Storage folosind bucket-ul corect: gallery-media
      const { error: storageError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([fileName])

      if (storageError) throw storageError

      // Ștergem din Database
      const { error: dbError } = await supabase
        .from("gallery")
        .delete()
        .eq("id", item.id)

      if (dbError) throw dbError

      fetchItems()
    } catch (err: any) {
      setErrorMessage("Eroare la ștergere: " + err.message)
    }
  }

  /* ───────── REMOVE PENDING ───────── */
  const removePending = (index: number) => {
    const itemToRemove = pending[index]
    if (itemToRemove) URL.revokeObjectURL(itemToRemove.preview)
    setPending((prev) => prev.filter((_, i) => i !== index))
  }

  /* ───────── SAVE ALL ───────── */
  const handleSave = async () => {
    if (!pending.length) return
    setLoading(true)
    setErrorMessage(null)

    try {
      for (const item of pending) {
        const fileExt = item.file.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        /* 1. Upload in Storage - folosind gallery-media */
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, item.file)

        if (uploadError) throw uploadError

        /* 2. Obținere URL Public */
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileName)

        /* 3. Salvare în Database */
        const { error: dbError } = await supabase.from("gallery").insert({
          type: item.type,
          url: urlData.publicUrl,
        })

        if (dbError) throw dbError

        URL.revokeObjectURL(item.preview)
      }

      setPending([])
      fetchItems()
    } catch (err: any) {
      console.error("Eroare salvare:", err.message)
      setErrorMessage("Eroare la salvare pe server: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-6xl mx-auto p-6 rounded-2xl shadow-sm border border-[#e8ddd0] my-10" style={{ background: bg }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: dark }}>Administrare Galerie</h2>
          <p className="text-sm text-[#706760]">Adaugă sau șterge poze și videoclipuri din portofoliu.</p>
        </div>

        <label className="cursor-pointer bg-[#706760] hover:bg-[#BFC08E] text-white px-6 py-2 rounded-full font-bold transition-all active:scale-95 shadow-md">
          SELECTEAZĂ FIȘIERE
          <input type="file" multiple accept="image/*,video/*" onChange={handleAddFiles} className="hidden" />
        </label>
      </div>

      {/* Mesaj de Eroare (Apare doar dacă ceva nu merge pe Vercel) */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm font-mono">
          <strong>Eroare detectată:</strong> {errorMessage}
        </div>
      )}

      {/* TABEL ELEMENTE */}
      <div className="overflow-x-auto rounded-xl border border-[#e8ddd0] bg-white">
        <table className="w-full text-left border-collapse">
          <thead style={{ background: "#f5efe8" }}>
            <tr>
              <th className="p-4 font-bold text-sm uppercase tracking-wider" style={{ color: dark }}>Previzualizare</th>
              <th className="p-4 font-bold text-sm uppercase tracking-wider" style={{ color: dark }}>Tip</th>
              <th className="p-4 font-bold text-sm uppercase tracking-wider" style={{ color: dark }}>Acțiuni</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#efe3d6]">
            {/* ELEMENTE EXISTENTE */}
            {items.length === 0 && !loading && (
              <tr>
                <td colSpan={3} className="p-10 text-center text-gray-400 italic">Nu există fișiere în galerie.</td>
              </tr>
            )}
            
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-[#faf7f2] transition-colors">
                <td className="p-4">
                  {item.type === "image" ? (
                    <img src={item.url} alt="Gallery" className="h-24 w-24 object-cover rounded-lg shadow-sm" />
                  ) : (
                    <video src={item.url} className="h-24 w-24 object-cover rounded-lg shadow-sm" />
                  )}
                </td>
                <td className="p-4 capitalize text-sm font-semibold" style={{ color: dark }}>{item.type}</td>
                <td className="p-4">
                  <button onClick={() => deleteExisting(item)} className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-all">
                    ȘTERGE
                  </button>
                </td>
              </tr>
            ))}

            {/* ELEMENTE ÎN AȘTEPTARE (PENDING) */}
            {pending.map((item, index) => (
              <tr key={index} className="bg-emerald-50/30 border-l-4 border-l-[#BFC08E]">
                <td className="p-4">
                  {item.type === "image" ? (
                    <img src={item.preview} alt="New" className="h-24 w-24 object-cover rounded-lg shadow-sm" />
                  ) : (
                    <video src={item.preview} className="h-24 w-24 object-cover rounded-lg shadow-sm" />
                  )}
                </td>
                <td className="p-4 text-sm font-bold text-emerald-700 italic">Nou ({item.type})</td>
                <td className="p-4">
                  <button onClick={() => removePending(index)} className="text-gray-500 hover:text-red-600 text-xs font-bold uppercase tracking-widest">
                    Elimină
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BUTON SALVARE FINALĂ */}
      {pending.length > 0 && (
        <div className="flex flex-col items-end mt-8">
          <p className="text-xs text-[#706760] mb-2 italic">Ai {pending.length} elemente noi pregătite pentru încărcare.</p>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95"
            style={{
              background: gold,
              color: "#1a1613",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "SE ÎNCARCĂ ÎN SUPABASE..." : "SALVEAZĂ TOT ÎN GALERIE"}
          </button>
        </div>
      )}
    </section>
  )
}