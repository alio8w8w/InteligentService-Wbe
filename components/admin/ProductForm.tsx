"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ProductForm() {
  const [name, setName] = useState("")
  const [basePrice, setBasePrice] = useState("")
  const [brand, setBrand] = useState("Hikvision")
  const [discount, setDiscount] = useState("")
  const [featured, setFeatured] = useState(false)
  const [description, setDescription] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  // Upload handler
  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // 1. Check "featured" limit
    if (featured) {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("is_featured_on_homepage", true)
      if (count! >= 6) {
        setError("Poți alege maxim 6 produse pe homepage!")
        setLoading(false)
        return
      }
    }

    // 2. Upload imagini
    let imageUrls: string[] = []
    for (const image of images) {
      const { data, error } = await supabase.storage
        .from("products")
        .upload(`product_${Date.now()}_${image.name}`, image, {
          cacheControl: "3600",
          upsert: false,
        })
      if (error) {
        setError(`Eroare la încărcare imagine: ${error.message}`)
        setLoading(false)
        return
      }
      // Get Public URL
      const { data: pub } = supabase.storage.from("products").getPublicUrl(data.path)
      imageUrls.push(pub.publicUrl)
    }

    // 3. Adaugă produsul
    const { data: product, error: prodErr } = await supabase
      .from("products")
      .insert([{
        name,
        base_price: parseFloat(basePrice),
        brand,
        discount_percentage: discount !== "" ? parseFloat(discount) : null,
        images: imageUrls,
        is_featured_on_homepage: featured,
      }])
      .select()
      .single()
    if (prodErr) {
      setError(prodErr.message)
      setLoading(false)
      return
    }

    // 4. Auto-traducere "description" (mock rapid – folosește API de traducere real dacă vrei)
    const translations = [
      { product_id: product.id, language_code: "ro", description_translated: description },
      { product_id: product.id, language_code: "en", description_translated: `[en] ${description}` },
      { product_id: product.id, language_code: "ru", description_translated: `[ru] ${description}` },
    ]
    await supabase.from("product_translations").insert(translations)

    setSuccess("Produs adăugat cu succes!")
    setLoading(false)
    setName("")
    setBasePrice("")
    setBrand("Hikvision")
    setDiscount("")
    setFeatured(false)
    setDescription("")
    setImages([])
    // Poți da refresh la listă sau redirect dacă vrei: router.refresh()
  }

  return (
    <form className="space-y-4 bg-white p-8 rounded-xl shadow-xl max-w-lg mx-auto" onSubmit={handleSubmit} encType="multipart/form-data">
      <h2 className="text-lg font-bold">Adaugă produs nou</h2>
      <input value={name} onChange={e => setName(e.target.value)} required placeholder="Nume produs" className="input" />
      <input type="number" value={basePrice} onChange={e => setBasePrice(e.target.value)} required placeholder="Preț (MDL)" className="input" />
      <select value={brand} onChange={e => setBrand(e.target.value)} className="input">
        <option value="Hikvision">Hikvision</option>
        <option value="Dahua">Dahua</option>
      </select>
      <input type="number" value={discount} min={0} max={100} step={0.01} onChange={e => setDiscount(e.target.value)} placeholder="Reducere (%)" className="input" />
      <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} /> <span>Afișează pe homepage</span>
      <textarea value={description} onChange={e => setDescription(e.target.value)} required placeholder="Descriere produs (în RO)" className="input" />
      <input type="file" multiple onChange={handleImagesChange} className="input" />
      {error && <span className="text-red-600">{error}</span>}
      {success && <span className="text-green-600">{success}</span>}
      <button type="submit" className="btn" disabled={loading}>{loading ? "Salvez..." : "Adaugă produs"}</button>
    </form>
  )
}