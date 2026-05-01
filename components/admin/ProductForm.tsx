"use client"

import { useState, useRef } from "react"
import { createClient } from "@supabase/supabase-js"
import { UploadCloud, Tag, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon } from "lucide-react"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ProductForm() {
  const [name, setName] = useState("")
  const [basePrice, setBasePrice] = useState("")
  const [brand, setBrand] = useState("Hikvision")
  
  // Stări pentru reducere
  const [hasDiscount, setHasDiscount] = useState(false)
  const [discount, setDiscount] = useState("")
  
  const [featured, setFeatured] = useState(false)
  const [description, setDescription] = useState("")
  const [images, setImages] = useState<File[]>([])
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Gestionare selecție fișiere
  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  // Funcție simulată de traducere (Aici va trebui conectat API-ul DeepL sau Google Translate)
  async function translateText(text: string, targetLang: string) {
    if (!text) return "";
    // TODO: Aici vei face fetch către API-ul tău de traducere. 
    // Momentan adăugăm un prefix ca să demonstrăm logica bazei de date.
    if (targetLang === 'ro') return text;
    if (targetLang === 'en') return `[EN Auto-Translated] ${text}`;
    if (targetLang === 'ru') return `[RU Auto-Translated] ${text}`;
    return text;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // 1. Validări de bază
    if (images.length === 0) {
      setError("Este obligatoriu să adaugi cel puțin o imagine!")
      setLoading(false)
      return
    }

    // 2. Verifică limita "Afișează pe homepage"
    if (featured) {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("is_featured_on_homepage", true)
      
      if (count !== null && count >= 6) {
        setError("Poți alege maxim 6 produse pe homepage!")
        setLoading(false)
        return
      }
    }

    try {
      // 3. Upload imagini în Storage
      let imageUrls: string[] = []
      for (const image of images) {
        const safeName = `${Date.now()}_${image.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`
        const { data, error: uploadErr } = await supabase.storage
          .from("products")
          .upload(safeName, image, { cacheControl: "3600", upsert: false })
        
        if (uploadErr) throw new Error(`Eroare imagine: ${uploadErr.message}`)
        
        const { data: pubData } = supabase.storage.from("products").getPublicUrl(data.path)
        imageUrls.push(pubData.publicUrl)
      }

      // 4. Adaugă produsul în DB
      const finalDiscount = hasDiscount && discount ? parseFloat(discount) : 0;
      
      const { data: product, error: prodErr } = await supabase
        .from("products")
        .insert([{
          name,
          base_price: parseFloat(basePrice),
          brand,
          has_discount: hasDiscount,
          discount_percentage: finalDiscount,
          images: imageUrls,
          is_featured_on_homepage: featured,
        }])
        .select()
        .single()
        
      if (prodErr) throw new Error(prodErr.message)

      // 5. Dacă există descriere, o traducem și o salvăm
      if (description.trim() !== "") {
        const descEn = await translateText(description, "en");
        const descRu = await translateText(description, "ru");

        const translations = [
          { product_id: product.id, language_code: "ro", description: description },
          { product_id: product.id, language_code: "en", description: descEn },
          { product_id: product.id, language_code: "ru", description: descRu },
        ]
        
        const { error: transErr } = await supabase.from("product_translations").insert(translations)
        if (transErr) throw new Error("Produsul s-a salvat, dar a apărut o eroare la traducere.")
      }

      // 6. Resetare formular după succes
      setSuccess("Produs adăugat cu succes!")
      setName("")
      setBasePrice("")
      setBrand("Hikvision")
      setHasDiscount(false)
      setDiscount("")
      setFeatured(false)
      setDescription("")
      setImages([])
      if (fileInputRef.current) fileInputRef.current.value = ""

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="bg-white p-8 rounded-3xl shadow-sm border border-[#283618]/10 max-w-2xl mx-auto text-[#283618] animate-in fade-in duration-500" onSubmit={handleSubmit} encType="multipart/form-data">
      
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#283618]/10">
        <Tag className="text-[#DDA15E]" size={28} />
        <div>
          <h2 className="text-2xl font-bold">Adaugă Produs Nou</h2>
          <p className="text-[#606C38] text-sm">Toate setările și prețurile vor fi aplicate imediat pe site.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2 text-sm font-bold">
          <AlertCircle size={18} /> {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-[#FEFAE0] border border-[#DDA15E]/30 text-[#606C38] rounded-xl flex items-center gap-2 text-sm font-bold">
          <CheckCircle2 size={18} className="text-[#BC6C25]" /> {success}
        </div>
      )}

      <div className="space-y-6">
        {/* Nume și Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">Nume Produs *</label>
            <input value={name} onChange={e => setName(e.target.value)} required placeholder="Ex: Cameră supraveghere IP" className="w-full bg-[#FEFAE0]/30 border border-[#283618]/10 rounded-xl px-4 py-3 outline-none focus:border-[#DDA15E] focus:ring-1 focus:ring-[#DDA15E] transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Brand *</label>
            <select value={brand} onChange={e => setBrand(e.target.value)} className="w-full bg-[#FEFAE0]/30 border border-[#283618]/10 rounded-xl px-4 py-3 outline-none focus:border-[#DDA15E] font-bold">
              <option value="Hikvision">Hikvision</option>
              <option value="Dahua">Dahua</option>
            </select>
          </div>
        </div>

        {/* Preț și Reduceri */}
        <div className="bg-[#FEFAE0]/20 p-5 rounded-2xl border border-[#283618]/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Preț de bază (MDL) *</label>
              <input type="number" min={0} step={0.01} value={basePrice} onChange={e => setBasePrice(e.target.value)} required placeholder="Ex: 1500" className="w-full bg-white border border-[#283618]/10 rounded-xl px-4 py-3 outline-none focus:border-[#DDA15E]" />
            </div>
            
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer mb-3 font-bold text-sm select-none">
                <input type="checkbox" checked={hasDiscount} onChange={e => {
                  setHasDiscount(e.target.checked);
                  if(!e.target.checked) setDiscount("");
                }} className="w-5 h-5 accent-[#BC6C25] rounded" />
                Aplică Reducere
              </label>
              {hasDiscount && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <input type="number" value={discount} min={1} max={99} step={1} onChange={e => setDiscount(e.target.value)} placeholder="Procent reducere (Ex: 20%)" required={hasDiscount} className="w-full bg-white border border-[#DDA15E] rounded-xl px-4 py-3 outline-none text-[#BC6C25] font-bold" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Imagini */}
        <div>
          <label className="block text-sm font-bold mb-2">Imagini Produs * (Minim 1)</label>
          <div className="relative border-2 border-dashed border-[#283618]/20 rounded-2xl p-8 text-center hover:bg-[#FEFAE0]/30 transition-colors cursor-pointer group">
            <input type="file" multiple accept="image/*" onChange={handleImagesChange} ref={fileInputRef} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="flex flex-col items-center gap-2 text-[#606C38]">
              <UploadCloud size={32} className="group-hover:text-[#BC6C25] transition-colors" />
              <span className="font-bold text-sm">Click sau trage pozele aici</span>
              <span className="text-xs opacity-70">Ai selectat {images.length} imagini</span>
            </div>
          </div>
        </div>

        {/* Descriere (Opțional) */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block text-sm font-bold">Descriere Produs</label>
            <span className="text-[10px] uppercase font-black tracking-widest text-[#DDA15E] bg-[#DDA15E]/10 px-2 py-1 rounded">Se traduce automat</span>
          </div>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descrierea completă a produsului în Limba Română..." className="w-full min-h-[120px] bg-[#FEFAE0]/30 border border-[#283618]/10 rounded-xl px-4 py-3 outline-none focus:border-[#DDA15E] resize-y" />
        </div>

        {/* Afișare Homepage */}
        <label className="flex items-center gap-3 cursor-pointer p-4 bg-[#FEFAE0]/50 rounded-xl border border-[#283618]/5 hover:border-[#DDA15E]/50 transition-colors">
          <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-5 h-5 accent-[#BC6C25] rounded" /> 
          <div>
            <span className="font-bold block text-sm">Afișează pe Homepage (Sticker Special)</span>
            <span className="text-xs text-[#606C38]">Maxim 6 produse permise în secțiunea principală.</span>
          </div>
        </label>

        {/* Submit */}
        <button type="submit" disabled={loading} className="w-full bg-[#BC6C25] hover:bg-[#283618] disabled:bg-[#FEFAE0] disabled:text-[#606C38] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <ImageIcon size={20} />}
          {loading ? "Se salvează produsul..." : "Salvează Produsul Nou"}
        </button>
      </div>
    </form>
  )
}