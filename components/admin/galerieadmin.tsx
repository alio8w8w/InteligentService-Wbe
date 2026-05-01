"use client"

import { useEffect, useState, ChangeEvent } from "react"
import { supabase } from "@/lib/supabase"
import { Image as ImageIcon, Film, Trash2, ArrowLeft, ArrowRight, UploadCloud, Save, Loader2 } from "lucide-react"

type GalleryItem = {
  id: string
  type: "image" | "video"
  url: string
  position: number
  created_at?: string
}

type PendingItem = {
  file: File
  preview: string
  type: "image" | "video"
}

// CONFIGURARE BUCKET
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
      .order("position", { ascending: true }) // Sortăm după poziția aleasă de user
      .order("created_at", { ascending: false })

    if (error) {
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
    setErrorMessage(null)
  }

  /* ───────── MOVE ITEMS (Schimbă ordinea) ───────── */
  const moveItem = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === items.length - 1) return

    const newItems = [...items]
    const swapIndex = direction === "up" ? index - 1 : index + 1

    // Interschimbăm pozițiile vizual
    const tempPos = newItems[index].position || index
    newItems[index].position = newItems[swapIndex].position || swapIndex
    newItems[swapIndex].position = tempPos

    // Interschimbăm în array
    const tempItem = newItems[index]
    newItems[index] = newItems[swapIndex]
    newItems[swapIndex] = tempItem

    setItems(newItems)

    // Salvăm noua ordine în baza de date silențios
    await supabase.from("gallery").upsert([
      { id: newItems[index].id, position: newItems[index].position },
      { id: newItems[swapIndex].id, position: newItems[swapIndex].position }
    ])
  }

  /* ───────── DELETE EXISTING ───────── */
  const deleteExisting = async (item: GalleryItem) => {
    const fileName = item.url.split("/").pop()
    if (!fileName) return

    if (!confirm("Sigur vrei să ștergi acest element definitiv?")) return

    try {
      await supabase.storage.from(BUCKET_NAME).remove([fileName])
      await supabase.from("gallery").delete().eq("id", item.id)
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

  /* ───────── SAVE ALL PENDING ───────── */
  const handleSave = async () => {
    if (!pending.length) return
    setLoading(true)
    setErrorMessage(null)

    try {
      // Determinăm următoarea poziție disponibilă pentru a le pune la final
      const startingPosition = items.length > 0 ? Math.max(...items.map(i => i.position || 0)) + 1 : 0

      for (let i = 0; i < pending.length; i++) {
        const item = pending[i]
        const fileExt = item.file.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(fileName, item.file)
        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName)

        await supabase.from("gallery").insert({
          type: item.type,
          url: urlData.publicUrl,
          position: startingPosition + i // Setăm ordinea automat
        })

        URL.revokeObjectURL(item.preview)
      }

      setPending([])
      fetchItems()
    } catch (err: any) {
      setErrorMessage("Eroare la salvare: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-white rounded-[2rem] border border-[#283618]/10 shadow-sm p-6 lg:p-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#283618] flex items-center gap-2">
            <ImageIcon className="text-[#DDA15E]" size={32} />
            Media & Galerie
          </h2>
          <p className="text-[#606C38] text-sm mt-1">Gestionează pozele și videoclipurile afișate pe site.</p>
        </div>

        <label className="cursor-pointer flex items-center gap-2 bg-[#283618] hover:bg-[#606C38] text-[#FEFAE0] px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-md w-full sm:w-auto justify-center">
          <UploadCloud size={20} />
          Adaugă Fișiere
          <input type="file" multiple accept="image/*,video/*" onChange={handleAddFiles} className="hidden" />
        </label>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
          {errorMessage}
        </div>
      )}

      {/* GRID ELEMENTE ÎN AȘTEPTARE (PENDING) */}
      {pending.length > 0 && (
        <div className="mb-10 bg-[#FEFAE0]/50 p-6 rounded-3xl border border-[#DDA15E]/30">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[#BC6C25] flex items-center gap-2">
              <UploadCloud size={18} /> Fișiere noi gata de încărcare ({pending.length})
            </h3>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 bg-[#DDA15E] hover:bg-[#BC6C25] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loading ? "Se încarcă..." : "Salvează în Galerie"}
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {pending.map((item, index) => (
              <div key={index} className="relative group rounded-2xl overflow-hidden border-2 border-[#DDA15E] aspect-square bg-white shadow-sm">
                {item.type === "image" ? (
                  <img src={item.preview} alt="New" className="w-full h-full object-cover" />
                ) : (
                  <video src={item.preview} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => removePending(index)} className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 hover:scale-110 transition-all shadow-lg">
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="absolute top-2 left-2 bg-[#DDA15E] text-white text-[10px] font-black uppercase px-2 py-1 rounded-md">
                  Nou
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GRID ELEMENTE EXISTENTE */}
      <h3 className="font-bold text-[#283618] mb-4 border-b border-[#283618]/10 pb-2">Galeria ta publică</h3>
      
      {items.length === 0 && !loading && (
        <div className="p-20 text-center text-[#606C38]/50 italic font-medium bg-[#FEFAE0]/20 rounded-3xl border border-[#283618]/5">
          Nu există încă fișiere în galerie. Apasă pe "Adaugă Fișiere" pentru a începe.
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {items.map((item, index) => (
          <div key={item.id} className="relative group rounded-2xl overflow-hidden border border-[#283618]/10 aspect-square bg-gray-50 shadow-sm hover:shadow-md transition-all">
            
            {/* MEDIA */}
            {item.type === "image" ? (
              <img src={item.url} alt="Gallery" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full relative">
                <video src={item.url} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/50 text-white p-1.5 rounded-lg backdrop-blur-sm">
                  <Film size={14} />
                </div>
              </div>
            )}

            {/* OVERLAY CONTROALE (Apare la hover pe Desktop, e mereu un pic vizibil pe mobil) */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12 pb-3 px-3 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
              
              {/* BUTOANE MUTARE */}
              <div className="flex gap-1 bg-white/20 backdrop-blur-md rounded-lg p-1">
                <button 
                  onClick={() => moveItem(index, "up")} 
                  disabled={index === 0}
                  className="p-1.5 rounded-md text-white hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft size={16} className="sm:hidden" />
                  <ArrowLeft size={16} className="hidden sm:block" />
                </button>
                <button 
                  onClick={() => moveItem(index, "down")} 
                  disabled={index === items.length - 1}
                  className="p-1.5 rounded-md text-white hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowRight size={16} className="sm:hidden" />
                  <ArrowRight size={16} className="hidden sm:block" />
                </button>
              </div>

              {/* BUTON ȘTERGERE */}
              <button 
                onClick={() => deleteExisting(item)} 
                className="bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-lg backdrop-blur-md transition-all hover:scale-105"
                title="Șterge definitiv"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
          </div>
        ))}
      </div>

    </div>
  )
}