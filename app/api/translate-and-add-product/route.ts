// app/api/translate-and-add-product/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Dacă folosești upload imagini, vezi și cu 'formidable' sau 'busboy'. Pentru simplu: JSON direct
// Dacă ai upload, adaptează la File/Blob – sau spune-mi ce folosești!

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Dummy translate (înlocuiești ulterior cu API Google Translate real)
async function translate(text: string, lang: string) {
  return `[${lang}] ${text}`
}

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const name = form.get("name") as string
  const base_price = form.get("base_price") as string
  const brand = form.get("brand") as string
  const discount_percentage = form.get("discount_percentage") as string | null
  const is_featured_on_homepage = form.get("is_featured_on_homepage") === "true"
  const description = form.get("description") as string
  const imagesFiles = form.getAll("images") as File[]

  // 1. Upload images (dacă sunt), adaugă-le în Supabase Storage și colectează URL-urile publice
  const images: string[] = []
  for (const imageFile of imagesFiles) {
    const arrayBuffer = await imageFile.arrayBuffer()
    const fileExt = imageFile.type.split("/")[1]
    const fileName = `product_${Date.now()}_${Math.random()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from("products")
      .upload(fileName, arrayBuffer, {
        contentType: imageFile.type,
        upsert: false,
      })
    if (error) return NextResponse.json({ message: "Upload imagine eșuat", details: error.message }, { status: 400 })

    // Obține publicUrl
    const { data: pub } = supabase.storage.from("products").getPublicUrl(data.path)
    if (pub?.publicUrl) images.push(pub.publicUrl)
  }

  // 2. Validare max 6 produse featured
  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("is_featured_on_homepage", true)
  if (is_featured_on_homepage && count! >= 6) {
    return NextResponse.json({ message: "Sunt deja 6 produse pe homepage" }, { status: 400 })
  }

  // 3. Inserează produsul
  const { data: product, error: prodError } = await supabase
    .from("products")
    .insert([{
      name,
      base_price: parseFloat(base_price),
      images,
      brand,
      discount_percentage: discount_percentage ? parseFloat(discount_percentage) : null,
      is_featured_on_homepage,
    }])
    .select()
    .single()
  if (prodError) {
    return NextResponse.json({ message: "Adăugare produs eșuată", details: prodError.message }, { status: 400 })
  }

  // 4. Traduceri automate și inserare în 'product_translations'
  const languages = ["ro", "en", "ru"]
  const translations = await Promise.all(languages.map(async (lang) => ({
    product_id: product.id,
    language_code: lang,
    description_translated: await translate(description, lang),
  })))
  const { error: trErr } = await supabase.from("product_translations").insert(translations)
  if (trErr) return NextResponse.json({ message: "Inserare traduceri eșuată", details: trErr.message }, { status: 400 })

  return NextResponse.json({ message: "Produs adăugat cu succes!" })
}