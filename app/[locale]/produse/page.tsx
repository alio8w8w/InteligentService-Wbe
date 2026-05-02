import { Navbar } from '@/components/navbar' // Ajustează calea
import { Footer } from '@/components/footer' // Ajustează calea
import ProductsClient from '@/components/products/ProductsClient'

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolved = await params;

  return (
    <main className="min-h-screen bg-[#F5F2EC] flex flex-col selection:bg-[#F26A1B] selection:text-white">
      {/* Bara de navigare */}
      <Navbar  />

      {/* Componenta principală care conține filtrele și produsele */}
      <div className="flex-grow pt-24 pb-12">
        <ProductsClient locale={resolved.locale} />
      </div>

      {/* Subsolul paginii */}
      <Footer  />
    </main>
  )
}