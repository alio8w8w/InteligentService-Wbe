"use client"

import { useEffect, useState, ChangeEvent, DragEvent } from "react"
import { supabase } from "@/lib/supabase"
import { Image as ImageIcon, Film, Trash2, UploadCloud, Save, Loader2, X, GripVertical } from "lucide-react"

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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

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
    e.target.value = ""
  }

  /* ───────── DRAG AND DROP LOGIC ───────── */
  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index)
    // Efect vizual pentru elementul tras
    e.dataTransfer.effectAllowed = "move"
    // Setăm datele (chiar dacă folosim state local, e o bună practică)
    e.dataTransfer.setData("text/plain", index.toString())
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault() // Necesare pentru a permite "Drop"
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newItems = [...items]
    const draggedItem = newItems[draggedIndex]

    // Eliminăm elementul din poziția veche
    newItems.splice(draggedIndex, 1)
    // Îl adăugăm în poziția nouă
    newItems.splice(dropIndex, 0, draggedItem)

    // Actualizăm "position" pentru toate elementele ca să fie secvențial (0, 1, 2, 3...)
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      position: index,
    }))

    setItems(updatedItems) // Update UI instantaneu
    setDraggedIndex(null)

    // Update bulk în DB pentru toate pozițiile modificate
    const updatesForDb = updatedItems.map(({ id, position }) => ({ id, position }))
    
    const { error } = await supabase.from("gallery").upsert(updatesForDb)
    if (error) {
      setErrorMessage("Eroare la salvarea noii ordini: " + error.message)
      fetchItems() // Revert la datele din baza de date în caz de eroare
    }
  }

  /* ───────── DELETE EXISTING ───────── */
  const deleteExisting = async (item: GalleryItem) => {
    if (!confirm("Sigur vrei să ștergi acest element definitiv din galerie și stocare?")) return

    try {
      const urlParts = item.url.split('/')
      const fileName = urlParts[urlParts.length - 1]

      if (!fileName) throw new Error("Numele fișierului nu a putut fi identificat.")

      const { error: storageError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([fileName])

      if (storageError) throw storageError

      const { error: dbError } = await supabase
        .from("gallery")
        .delete()
        .eq("id", item.id)

      if (dbError) throw dbError

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
      let currentMaxPos = items.length > 0 ? Math.max(...items.map(i => i.position || 0)) : -1

      for (const item of pending) {
        const fileExt = item.file.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, item.file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName)

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
        <span className="text-xs font-normal text-gray-400 ml-auto hidden sm:block">Trage de imagini pentru a le reordona</span>
      </h3>
      
      {items.length === 0 && !loading && (
        <div className="py-20 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
          <ImageIcon className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-400 font-bold text-lg">Nu ai încărcat niciun fișier.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            draggable // Face elementul "trăgabil"
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`group relative rounded-2xl overflow-hidden aspect-square bg-gray-100 border border-gray-100 shadow-sm transition-all duration-300 cursor-grab active:cursor-grabbing ${draggedIndex === index ? 'opacity-50 scale-95 border-[#F26A1B] border-2' : 'hover:shadow-xl'}`}
          >
            
            {item.type === "image" ? (
              <img src={item.url} alt="Gallery item" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none" />
            ) : (
              <div className="w-full h-full relative pointer-events-none">
                <video src={item.url} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                  <Film className="text-white drop-shadow-md" size={32} />
                </div>
              </div>
            )}

            {/* Overlay Control */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
              
              {/* Iconiță Drag */}
              <div className="flex justify-end">
                 <div className="p-1.5 bg-black/40 backdrop-blur-md rounded-lg text-white">
                    <GripVertical size={16} />
                 </div>
              </div>

              <div className="flex justify-end items-center">
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