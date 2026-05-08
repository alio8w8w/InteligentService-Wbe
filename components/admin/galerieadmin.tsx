"use client"

import { useEffect, useState, ChangeEvent } from "react"
import { supabase } from "@/lib/supabase"
import { Image as ImageIcon, Film, Trash2, ArrowLeft, ArrowRight, UploadCloud, Save, Loader2, X } from "lucide-react"

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

// CONFIGURARE BUCKET - Asigură-te că acesta există în Supabase Storage și e PUBLIC
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
      .order("position", { ascending: true })
      .order("created_at", { ascending: false })

    if (error) {
      setErrorMessage("Nu am putut încărca galeria: " + error.message)
      return
    }
    if (data) setItems(data as GalleryItem[])
  }

  useEffect(() => {
    fetchItems()
    // Cleanup pentru URL-urile de preview la demontarea componentei
    return () => {
      pending.forEach(item => URL.revokeObjectURL(item.preview))
    }
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
    // Reset input value to allow selecting same file again
    e.target.value = ""
  }

  /* ───────── MOVE ITEMS ───────── */
  const moveItem = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === items.length - 1) return

    const newItems = [...items]
    const swapIndex = direction === "up" ? index - 1 : index + 1

    // Swap positions
    const currentItem = { ...newItems[index] }
    const siblingItem = { ...newItems[swapIndex] }

    const tempPos = currentItem.position
    currentItem.position = siblingItem.position
    siblingItem.position = tempPos

    newItems[index] = siblingItem
    newItems[swapIndex] = currentItem

    setItems(newItems)

    // Update silent în DB
    await supabase.from("gallery").upsert([
      { id: currentItem.id, position: currentItem.position },
      { id: siblingItem.id, position: siblingItem.position }
    ])
  }

  /* ───────── DELETE EXISTING ───────── */
  const deleteExisting = async (item: GalleryItem) => {
    if (!confirm("Sigur vrei să ștergi acest element definitiv din galerie și stocare?")) return

    try {
      // Extragem corect numele fișierului din URL-ul public
      const urlParts = item.url.split('/')
      const fileName = urlParts[urlParts.length - 1]

      if (!fileName) throw new Error("Numele fișierului nu a putut fi identificat.")

      // 1. Ștergere din Storage
      const { error: storageError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([fileName])

      if (storageError) throw storageError

      // 2. Ștergere din Database
      const { error: dbError } = await supabase
        .from("gallery")
        .delete()
        .eq("id", item.id)

      if (dbError) throw dbError

      // Update UI local
      setItems(prev => prev.filter(i => i.id !== item.id))
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
      // Determinăm ultima poziție
      let currentMaxPos = items.length > 0 ? Math.max(...items.map(i => i.position || 0)) : -1

      for (const item of pending) {
        const fileExt = item.file.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        // 1. Upload în Storage
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, item.file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw uploadError

        // 2. Obținere URL Public
        const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName)

        // 3. Insert în Database
        currentMaxPos++
        const { error: dbError } = await supabase.from("gallery").insert({
          type: item.type,
          url: urlData.publicUrl,
          position: currentMaxPos
        })

        if (dbError) throw dbError
        
        URL.revokeObjectURL(item.preview)
      }

      setPending([])
      fetchItems()
    } catch (err: any) {
      setErrorMessage("Eroare la salvare: " + err.message + ". Verifică dacă bucket-ul 'gallery-media' există și e public.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 lg:p-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-[#283618] flex items-center gap-3">
            <ImageIcon className="text-[#F26A1B]" size={32} />
            Galerie Media
          </h2>
          <p className="text-gray-500 font-medium mt-1">Administrează portofoliul vizual al companiei.</p>
        </div>

        <label className="cursor-pointer flex items-center gap-3 bg-[#0F2A4A] hover:bg-[#1a3a5f] text-white px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg w-full sm:w-auto justify-center">
          <UploadCloud size={20} />
          Încarcă Fișiere
          <input type="file" multiple accept="image/*,video/*" onChange={handleAddFiles} className="hidden" />
        </label>
      </div>

      {errorMessage && (
        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl flex justify-between items-center">
          <span className="font-medium">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)}><X size={18}/></button>
        </div>
      )}

      {/* PENDING ITEMS SECTION */}
      {pending.length > 0 && (
        <div className="mb-12 bg-orange-50/50 p-8 rounded-[2rem] border border-orange-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="font-black text-orange-800 flex items-center gap-2 text-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
              Fișiere noi ({pending.length})
            </h3>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 bg-[#F26A1B] hover:bg-[#d45a10] text-white px-8 py-3 rounded-xl font-bold shadow-xl shadow-orange-500/20 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              {loading ? "Se salvează..." : "Publică în Galerie"}
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pending.map((item, index) => (
              <div key={index} className="relative group rounded-2xl overflow-hidden aspect-square shadow-md border-2 border-orange-200">
                {item.type === "image" ? (
                  <img src={item.preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <video src={item.preview} className="w-full h-full object-cover" />
                )}
                <button 
                  onClick={() => removePending(index)} 
                  className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 hover:text-white text-red-500 p-2 rounded-lg transition-colors shadow-sm"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PUBLIC GALLERY GRID */}
      <h3 className="font-black text-[#0F2A4A] text-xl mb-6 flex items-center gap-2">
        Galeria Publică 
        <span className="text-sm font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{items.length} elemente</span>
      </h3>
      
      {items.length === 0 && !loading && (
        <div className="py-20 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
          <ImageIcon className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-400 font-bold text-lg">Nu ai încărcat niciun fișier.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {items.map((item, index) => (
          <div key={item.id} className="group relative rounded-2xl overflow-hidden aspect-square bg-gray-100 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            
            {item.type === "image" ? (
              <img src={item.url} alt="Gallery item" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : (
              <div className="w-full h-full relative">
                <video src={item.url} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                  <Film className="text-white drop-shadow-md" size={32} />
                </div>
              </div>
            )}

            {/* Overlay Control */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  <button 
                    onClick={() => moveItem(index, "up")} 
                    disabled={index === 0}
                    className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-[#F26A1B] disabled:opacity-20 transition-all"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button 
                    onClick={() => moveItem(index, "down")} 
                    disabled={index === items.length - 1}
                    className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-[#F26A1B] disabled:opacity-20 transition-all"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>

                <button 
                  onClick={() => deleteExisting(item)} 
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-transform hover:scale-110 shadow-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}