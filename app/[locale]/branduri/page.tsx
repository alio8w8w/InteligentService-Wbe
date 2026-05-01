import { Navbar } from '@/components/navbar' // Ajustează calea dacă e nevoie
import { Footer } from '@/components/footer' // Ajustează calea dacă e nevoie
import BrandsCatalog from '@/components/brand/BrandsCatalog'

export default async function BrandsPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;

  return (
    <main className="min-h-screen bg-[#0F2A4A] flex flex-col selection:bg-[#F26A1B] selection:text-white">
      {/* Bara de navigare */}
      <Navbar />

      {/* Componenta principală care conține toată interactivitatea și design-ul */}
      <div className="flex-grow">
        <BrandsCatalog locale={resolvedParams.locale} />
      </div>

      {/* Subsolul paginii */}
      <Footer />
    </main>
  )
}