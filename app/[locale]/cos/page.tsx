import { Navbar } from '@/components/navbar' // Ajustează calea
import { Footer } from '@/components/footer' // Ajustează calea
import CartClient from '@/components/cart/CartClient'

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;

  return (
    <main className="min-h-screen bg-[#F5F2EC] flex flex-col selection:bg-[#F26A1B] selection:text-white">
      {/* Bara de navigare */}
      <Navbar />

      {/* Componenta principală a coșului */}
      <div className="flex-grow pt-24 pb-12">
        <CartClient locale={resolvedParams.locale} />
      </div>

      {/* Subsolul paginii */}
      <Footer  />
    </main>
  )
}