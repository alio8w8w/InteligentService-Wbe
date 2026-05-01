"use client"

import { useState, useRef, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { UploadCloud, Tag, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon, Plus, Trash2, Edit3, Star, Percent, ArrowLeft, Square, CheckSquare } from "lucide-react"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Product = {
  id: string;
  name: string;
  brand: string;
  base_price: number;
  has_discount: boolean;
  discount_percentage: number;
  is_featured_on_homepage: boolean;
  images: string[];
}

export default function ProductManager() {
  const [view, setView] = useState<"list" | "add">("list")
  const [products, setProducts] = useState<Product[]>([])
  const [loadingList, setLoadingList] = useState(true)
  
  // Stări pentru acțiuni în masă (Bulk Actions)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkAction, setBulkAction] = useState<"price" | "discount" | null>(null)
  const [bulkValue, setBulkValue] = useState("")
  const [bulkLoading, setBulkLoading] = useState(false)

  // Stări pentru formularul de adăugare
  const [name, setName] = useState("")
  const [basePrice, setBasePrice] = useState("")
  const [brand, setBrand] = useState("Hikvision")
  const [hasDiscount, setHasDiscount] = useState(false)
  const [discount, setDiscount] = useState("")
  const [featured, setFeatured] = useState(false)
  const [description, setDescription] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [loadingAdd, setLoadingAdd] = useState(false)
  
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- 1. ÎNCĂRCARE PRODUSE ---
  const fetchProducts = async () => {
    setLoadingList(true)
    const { data, error } = await supabase
      .from("produse")
      .select("*")
      .order("created_at", { ascending: false })
    
    if (data) setProducts(data as Product[])
    if (error) console.error("Eroare la extragere:", error.message)
    setLoadingList(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // --- 2. SELECȚIE MULTIPLĂ ---
  const toggleSelectAll = () => {
    if (selectedIds.size === products.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(products.map(p => p.id)))
  }

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedIds(newSet)
  }

  // --- 3. ACȚIUNI ÎN MASĂ (BULK) ---
  const handleBulkDelete = async () => {
    if (!confirm(`Sigur vrei să ștergi cele ${selectedIds.size} produse selectate?`)) return
    
    setBulkLoading(true)
    const { error } = await supabase.from("produse").delete().in("id", Array.from(selectedIds))
    
    if (!error) {
      setProducts(prev => prev.filter(p => !selectedIds.has(p.id)))
      setSelectedIds(new Set())
    } else {
      alert("Eroare la ștergere: " + error.message)
    }
    setBulkLoading(false)
  }

  const handleBulkUpdate = async () => {
    if (!bulkValue || isNaN(Number(bulkValue))) {
      alert("Te rog introdu o valoare numerică validă!")
      return
    }

    setBulkLoading(true)
    const val = parseFloat(bulkValue)
    let updateData = {}

    if (bulkAction === "price") {
      updateData = { base_price: val }
    } else if (bulkAction === "discount") {
      updateData = { 
        has_discount: val > 0, 
        discount_percentage: val > 0 ? val : 0 
      }
    }

    const { error } = await supabase.from("produse").update(updateData).in("id", Array.from(selectedIds))

    if (!error) {
      setSuccess(`Am actualizat cu succes ${selectedIds.size} produse!`)
      setBulkAction(null)
      setBulkValue("")
      setSelectedIds(new Set())
      fetchProducts() // Reîncărcăm lista pentru a vedea noile valori
      setTimeout(() => setSuccess(""), 3000)
    } else {
      alert("Eroare la actualizare: " + error.message)
    }
    setBulkLoading(false)
  }

  // --- 4. TOGGLE HOMEPAGE ---
  const toggleHomepage = async (product: Product) => {
    const isCurrentlyFeatured = product.is_featured_on_homepage;
    
    // Verificăm limita de 6 doar dacă încercăm să ACTIVĂM un produs nou pe homepage
    if (!isCurrentlyFeatured) {
      const currentlyFeaturedCount = products.filter(p => p.is_featured_on_homepage).length;
      if (currentlyFeaturedCount >= 6) {
        alert("Ai atins limita maximă! Poți afișa maxim 6 produse pe homepage. Debifează altul mai întâi.");
        return;
      }
    }

    // Actualizare Optimistică (UI-ul se schimbă instant, fără să aștepte baza de date)
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_featured_on_homepage: !isCurrentlyFeatured } : p))

    const { error } = await supabase.from("produse").update({ is_featured_on_homepage: !isCurrentlyFeatured }).eq("id", product.id)
    if (error) {
      // Revert dacă dă eroare
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_featured_on_homepage: isCurrentlyFeatured } : p))
      alert("Eroare la actualizare: " + error.message)
    }
  }

  // --- 5. FUNCȚII PENTRU FORMULAR (Traducere & Submit) ---
  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) setImages(Array.from(e.target.files))
  }

  async function translateText(text: string, targetLang: string) {
    if (!text) return "";
    if (targetLang === 'ro') return text;
    if (targetLang === 'en') return `[EN Auto-Translated] ${text}`;
    if (targetLang === 'ru') return `[RU Auto-Translated] ${text}`;
    return text;
  }

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoadingAdd(true)
    setError("")
    setSuccess("")

    if (images.length === 0) {
      setError("Este obligatoriu să adaugi cel puțin o imagine!")
      setLoadingAdd(false); return
    }

    if (featured) {
      const currentlyFeaturedCount = products.filter(p => p.is_featured_on_homepage).length;
      if (currentlyFeaturedCount >= 6) {
        setError("Poți alege maxim 6 produse pe homepage! Ai atins deja limita.")
        setLoadingAdd(false); return
      }
    }

    try {
      let imageUrls: string[] = []
      for (const image of images) {
        const safeName = `${Date.now()}_${image.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`
        const { data, error: uploadErr } = await supabase.storage.from("products").upload(safeName, image, { cacheControl: "3600", upsert: false })
        if (uploadErr) throw new Error(`Eroare imagine: ${uploadErr.message}`)
        const { data: pubData } = supabase.storage.from("products").getPublicUrl(data.path)
        imageUrls.push(pubData.publicUrl)
      }

      const finalDiscount = hasDiscount && discount ? parseFloat(discount) : 0;
      
      const { data: product, error: prodErr } = await supabase.from("produse").insert([{
        name, base_price: parseFloat(basePrice), brand, has_discount: hasDiscount,
        discount_percentage: finalDiscount, images: imageUrls, is_featured_on_homepage: featured,
      }]).select().single()
        
      if (prodErr) throw new Error(prodErr.message)

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

      setSuccess("Produs adăugat cu succes!")
      // Resetare & Întoarcere la listă
      setName(""); setBasePrice(""); setBrand("Hikvision"); setHasDiscount(false); setDiscount(""); setFeatured(false); setDescription(""); setImages([]);
      if (fileInputRef.current) fileInputRef.current.value = ""
      fetchProducts()
      setTimeout(() => { setView("list"); setSuccess("") }, 1500)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoadingAdd(false)
    }
  }

  // ============================================================================
  // RENDER PENTRU LISTA DE PRODUSE (MANAGERUL)
  // ============================================================================
  if (view === "list") {
    return (
      <div className="bg-white rounded-[2rem] border border-[#283618]/10 shadow-sm p-6 lg:p-8 animate-in fade-in duration-500 w-full max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#283618] flex items-center gap-2">
              <Tag className="text-[#DDA15E]" size={32} /> Management Produse
            </h2>
            <p className="text-[#606C38] text-sm mt-1">Gestionează catalogul, aplică reduceri și alege produsele de pe prima pagină.</p>
          </div>
          <button onClick={() => setView("add")} className="flex items-center gap-2 bg-[#283618] hover:bg-[#606C38] text-[#FEFAE0] px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 w-full sm:w-auto justify-center">
            <Plus size={20} /> Adaugă Produs Nou
          </button>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-[#FEFAE0] border border-[#DDA15E]/30 text-[#606C38] rounded-xl flex items-center gap-2 text-sm font-bold">
            <CheckCircle2 size={18} className="text-[#BC6C25]" /> {success}
          </div>
        )}

        {/* BULK ACTIONS BAR (Apare doar dacă ai selectat produse) */}
        {selectedIds.size > 0 && (
          <div className="mb-6 p-4 bg-[#FEFAE0]/50 border border-[#DDA15E]/30 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 animate-in slide-in-from-top-2">
            <span className="font-bold text-[#BC6C25]">{selectedIds.size} produse selectate</span>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {/* MODAL PENTRU INTRODUCERE VALOARE BULK */}
              {bulkAction ? (
                <div className="flex items-center gap-2 w-full md:w-auto bg-white p-1 rounded-xl border border-[#283618]/20">
                  <input 
                    type="number" 
                    placeholder={bulkAction === "price" ? "Preț nou (MDL)" : "Reducere % (ex: 20)"} 
                    value={bulkValue} 
                    onChange={e => setBulkValue(e.target.value)}
                    className="px-3 py-1.5 outline-none text-sm font-bold text-[#283618] w-40 bg-transparent"
                  />
                  <button onClick={handleBulkUpdate} disabled={bulkLoading} className="bg-[#283618] text-[#FEFAE0] px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-[#BC6C25] transition-colors disabled:opacity-50">
                    {bulkLoading ? "Se aplică..." : "Aplică"}
                  </button>
                  <button onClick={() => {setBulkAction(null); setBulkValue("")}} className="text-[#606C38] px-2 hover:text-red-500 transition-colors">Anulează</button>
                </div>
              ) : (
                <>
                  <button onClick={() => setBulkAction("price")} className="flex items-center gap-2 bg-white text-[#283618] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#DDA15E]/20 transition-colors border border-[#283618]/10 shadow-sm flex-1 md:flex-none justify-center">
                    <Edit3 size={16} /> Modifică Preț
                  </button>
                  <button onClick={() => setBulkAction("discount")} className="flex items-center gap-2 bg-white text-[#283618] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#DDA15E]/20 transition-colors border border-[#283618]/10 shadow-sm flex-1 md:flex-none justify-center">
                    <Percent size={16} /> Modifică Reduceri
                  </button>
                  <button onClick={handleBulkDelete} disabled={bulkLoading} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition-all border border-red-100 shadow-sm flex-1 md:flex-none justify-center">
                    <Trash2 size={16} /> {bulkLoading ? "Se șterge..." : "Șterge"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* TABEL PRODUSE */}
        <div className="overflow-x-auto rounded-2xl border border-[#283618]/10 bg-white">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FEFAE0]/50 text-[#606C38] text-[11px] uppercase tracking-widest font-black border-b border-[#283618]/10">
              <tr>
                <th className="p-4 text-center w-10">
                  <button onClick={toggleSelectAll} className="hover:text-[#BC6C25] transition-colors">
                    {selectedIds.size === products.length && products.length > 0 ? <CheckSquare size={18} className="text-[#BC6C25]" /> : <Square size={18} />}
                  </button>
                </th>
                <th className="p-4">Imagine</th>
                <th className="p-4">Nume Produs</th>
                <th className="p-4">Preț</th>
                <th className="p-4">Reducere</th>
                <th className="p-4 text-center" title="Afișează pe pagina principală (Maxim 6)">Homepage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FEFAE0]">
              {loadingList ? (
                <tr><td colSpan={6} className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-[#DDA15E]" size={30} /></td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="p-10 text-center text-[#606C38]/50 font-medium italic">Niciun produs în baza de date.</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className={`transition-colors ${selectedIds.has(p.id) ? 'bg-[#FEFAE0]/40' : 'hover:bg-[#FEFAE0]/20'}`}>
                    <td className="p-4 text-center">
                      <button onClick={() => toggleSelect(p.id)} className="text-[#283618] opacity-50 hover:opacity-100 transition-opacity">
                        {selectedIds.has(p.id) ? <CheckSquare size={18} className="text-[#BC6C25] opacity-100" /> : <Square size={18} />}
                      </button>
                    </td>
                    <td className="p-4">
                      {p.images && p.images[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-lg object-cover border border-[#283618]/10 shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400"><ImageIcon size={20} /></div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-[#283618] text-sm">{p.name}</div>
                      <div className="text-xs text-[#606C38] font-black uppercase tracking-wider">{p.brand}</div>
                    </td>
                    <td className="p-4 font-bold text-[#283618]">
                      {p.has_discount ? (
                        <div>
                          <span className="line-through text-xs text-gray-400 mr-2">{p.base_price}</span>
                          <span className="text-red-500">{p.base_price - (p.base_price * p.discount_percentage / 100)} MDL</span>
                        </div>
                      ) : (
                        <span>{p.base_price} MDL</span>
                      )}
                    </td>
                    <td className="p-4">
                      {p.has_discount ? (
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-xs font-black">-{p.discount_percentage}%</span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleHomepage(p)}
                        className={`p-2 rounded-xl transition-all ${p.is_featured_on_homepage ? 'text-[#BC6C25] bg-[#FEFAE0] shadow-sm border border-[#DDA15E]/30' : 'text-gray-300 hover:text-[#DDA15E] hover:bg-gray-50'}`}
                        title={p.is_featured_on_homepage ? "Scoate de pe Homepage" : "Afișează pe Homepage"}
                      >
                        <Star size={20} fill={p.is_featured_on_homepage ? "currentColor" : "none"} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // ============================================================================
  // RENDER PENTRU ADAUGARE PRODUS NOU (FORMULARUL)
  // ============================================================================
  return (
    <div className="w-full max-w-2xl mx-auto">
      <button onClick={() => setView("list")} className="flex items-center gap-2 text-[#606C38] hover:text-[#283618] font-bold mb-6 transition-colors">
        <ArrowLeft size={20} /> Înapoi la listă
      </button>

      <form className="bg-white p-8 rounded-3xl shadow-sm border border-[#283618]/10 text-[#283618] animate-in fade-in duration-500" onSubmit={handleAddSubmit} encType="multipart/form-data">
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

          <div className="bg-[#FEFAE0]/20 p-5 rounded-2xl border border-[#283618]/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Preț de bază (MDL) *</label>
                <input type="number" min={0} step={0.01} value={basePrice} onChange={e => setBasePrice(e.target.value)} required placeholder="Ex: 1500" className="w-full bg-white border border-[#283618]/10 rounded-xl px-4 py-3 outline-none focus:border-[#DDA15E]" />
              </div>
              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 cursor-pointer mb-3 font-bold text-sm select-none">
                  <input type="checkbox" checked={hasDiscount} onChange={e => { setHasDiscount(e.target.checked); if(!e.target.checked) setDiscount(""); }} className="w-5 h-5 accent-[#BC6C25] rounded" />
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

          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm font-bold">Descriere Produs</label>
              <span className="text-[10px] uppercase font-black tracking-widest text-[#DDA15E] bg-[#DDA15E]/10 px-2 py-1 rounded">Se traduce automat</span>
            </div>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descrierea completă a produsului în Limba Română..." className="w-full min-h-[120px] bg-[#FEFAE0]/30 border border-[#283618]/10 rounded-xl px-4 py-3 outline-none focus:border-[#DDA15E] resize-y" />
          </div>

          <label className="flex items-center gap-3 cursor-pointer p-4 bg-[#FEFAE0]/50 rounded-xl border border-[#283618]/5 hover:border-[#DDA15E]/50 transition-colors">
            <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-5 h-5 accent-[#BC6C25] rounded" /> 
            <div>
              <span className="font-bold block text-sm">Afișează pe Homepage (Sticker Special)</span>
              <span className="text-xs text-[#606C38]">Maxim 6 produse permise în secțiunea principală.</span>
            </div>
          </label>

          <button type="submit" disabled={loadingAdd} className="w-full bg-[#BC6C25] hover:bg-[#283618] disabled:bg-[#FEFAE0] disabled:text-[#606C38] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]">
            {loadingAdd ? <Loader2 className="animate-spin" size={20} /> : <ImageIcon size={20} />}
            {loadingAdd ? "Se salvează produsul..." : "Salvează Produsul Nou"}
          </button>
        </div>
      </form>
    </div>
  )
}