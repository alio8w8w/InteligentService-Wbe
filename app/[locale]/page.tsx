import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { BrandCard } from "@/components/brand-card"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <div className="py-12">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-8">Our Brands</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <BrandCard brand="hikvision" />
              <BrandCard brand="dahua" />
            </div>
          </div>
        </div>
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
