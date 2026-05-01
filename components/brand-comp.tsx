import { getTranslations } from 'next-intl/server'
import { BrandCard, type Brand } from '@/components/brand-card'
import { createClient } from '@supabase/supabase-js'

// Inițializăm Supabase doar pentru citire (pe server)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Datele de bază
const brandsData: { id: Brand; logoUrl: string }[] = [
  { id: 'hikvision', logoUrl: '/images/hikvision-logo.png' },
  { id: 'dahua', logoUrl: '/images/dahua-logo.png' }
]

export async function BrandComp() {
  // Deoarece suntem într-un Server Component, folosim getTranslations
  const t = await getTranslations('homePage')

  // Extragem numărul de produse pentru fiecare brand din Supabase
  // Folosim Promise.all pentru a face interogările simultan (mai rapid)
  const productCounts = await Promise.all(
    brandsData.map(async (brand) => {
      // Căutăm în tabelul "produse" unde coloana "brand" este egală cu numele brandului (case-insensitive)
      const { count } = await supabase
        .from('produse')
        .select('*', { count: 'exact', head: true })
        .ilike('brand', brand.id) 

      return { id: brand.id, count: count || 0 }
    })
  )

  // Combinăm datele statice (logo-urile) cu numărul de produse
  const brandsWithCounts = brandsData.map(brand => {
    const countData = productCounts.find(c => c.id === brand.id)
    return {
      ...brand,
      productCount: countData?.count || 0
    }
  })

  return (
    <section className="py-20 md:py-28 relative">
      {/* Poți adăuga un fundal discret dacă dorești, decomentând linia de mai jos */}
      {/* <div className="absolute inset-0 bg-[#f9fafb] z-0" /> */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Antetul secțiunii */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F2A4A] mb-5 tracking-tight">
            {t('brands.title')} <span className="text-[#F26A1B]">{t('brands.titleHighlight')}</span>
          </h2>
          <p className="text-[#7A8CA5] font-medium max-w-2xl mx-auto text-lg md:text-xl">
            {t('brands.description')}
          </p>
        </div>
        
        {/* Grid-ul de carduri */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {brandsWithCounts.map((brand) => (
            <BrandCard 
              key={brand.id} 
              brand={brand.id} 
              logoUrl={brand.logoUrl}
              productCount={brand.productCount}
            />
          ))}
        </div>
        
      </div>
    </section>
  )
}