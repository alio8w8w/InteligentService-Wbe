// app/api/translate-and-add-product/route.ts
import { NextRequest, NextResponse } from 'next/server'

// 1. FORȚĂM RULAREA DINAMICĂ PENTRU A PREVENI ERORILE DE BUILD PE VERCEL
export const dynamic = 'force-dynamic'

// 2. IMPORTĂM INSTANȚA SIGURĂ (Nu mai instanțiem manual aici!)
import { supabase } from '@/lib/supabase'

// 3. FUNCȚIA REALĂ DE TRADUCERE AUTOMATĂ (Google API)
async function translateText(text: string, targetLang: string) {
  if (!text) return "";
  if (targetLang === 'ro') return text; // Nu traducem româna

  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ro&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await response.json();
    return data[0].map((item: any) => item[0]).join('');
  } catch (error) {
    console.error(`Eroare la traducere în ${targetLang}:`, error);
    return `[Traducere Eșuată] ${text}`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const name = form.get("name") as string
    const base_price = form.get("base_price") as string
    const brand = form.get("brand") as string
    const discount_percentage = form.get("discount_percentage") as string | null
    const is_featured_on_homepage = form.get("is_featured_on_homepage") === "true"
    const description = form.get("description") as string
    const imagesFiles = form.getAll("images") as File[]

    // 1. UPLOAD IMAGINI ÎN STORAGE
    const images: string[] = []
    for (const imageFile of imagesFiles) {
      const arrayBuffer = await imageFile.arrayBuffer()
      
      // Extragem extensia reală a fișierului
      const fileExt = imageFile.name.split(".").pop() || "jpg"
      const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from("products")
        .upload(fileName, arrayBuffer, {
          contentType: imageFile.type,
          upsert: false,
        })
        
      if (error) {
        return NextResponse.json({ message: "Upload imagine eșuat", details: error.message }, { status: 400 })
      }

      // Obținem link-ul public
      const { data: pub } = supabase.storage.from("products").getPublicUrl(data.path)
      if (pub?.publicUrl) images.push(pub.publicUrl)
    }

    // 2. VALIDARE MAX 6 PRODUSE FEATURED (Corectat numele tabelei din "products" în "produse")
    if (is_featured_on_homepage) {
      const { count, error: countErr } = await supabase
        .from("produse")
        .select("*", { count: "exact", head: true })
        .eq("is_featured_on_homepage", true)

      if (!countErr && count !== null && count >= 6) {
        return NextResponse.json({ message: "Sunt deja 6 produse pe homepage" }, { status: 400 })
      }
    }

    // Calculăm datele pentru discount
    const discountVal = discount_percentage ? parseFloat(discount_percentage) : 0;
    const hasDiscount = discountVal > 0;

    // 3. INSERARE PRODUS ÎN BAZA DE DATE (Tabela "produse")
    const { data: product, error: prodError } = await supabase
      .from("produse")
      .insert([{
        name,
        base_price: parseFloat(base_price),
        images,
        brand,
        has_discount: hasDiscount,
        discount_percentage: discountVal,
        is_featured_on_homepage,
      }])
      .select()
      .single()
      
    if (prodError) {
      return NextResponse.json({ message: "Adăugare produs eșuată", details: prodError.message }, { status: 400 })
    }

    // 4. TRADUCERI AUTOMATE (Dacă există o descriere)
    if (description && description.trim() !== "") {
      const languages = ["ro", "en", "ru"]
      
      const translations = await Promise.all(languages.map(async (lang) => ({
        product_id: product.id,
        language_code: lang,
        description: await translateText(description, lang), // Corectat din description_translated
      })))
      
      const { error: trErr } = await supabase.from("product_translations").insert(translations)
      if (trErr) {
        return NextResponse.json({ message: "Produsul a fost adăugat, dar inserarea traducerilor a eșuat", details: trErr.message }, { status: 400 })
      }
    }

    return NextResponse.json({ message: "Produs adăugat cu succes!", product_id: product.id })
    
  } catch (error: any) {
    console.error("Eroare server-side API:", error);
    return NextResponse.json({ message: "Eroare internă de server", details: error.message }, { status: 500 })
  }
}