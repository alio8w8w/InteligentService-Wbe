import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import BrandPageClient from '@/components/brand/BrandPageClient'

export default async function SpecificBrandPage({ params }: { params: Promise<{ locale: string, brand: string }> }) {
  const resolved = await params;
  const brandKey = resolved.brand.toLowerCase();

  return (
    <main className="min-h-screen bg-[#F5F2EC] flex flex-col selection:bg-[#F26A1B] selection:text-white">
      <Navbar  />
      
      <div className="flex-grow pt-20">
        <BrandPageClient locale={resolved.locale} brandName={brandKey} />
      </div>

      <Footer  />
    </main>
  )
}