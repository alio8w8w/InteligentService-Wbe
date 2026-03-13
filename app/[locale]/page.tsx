import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/home/services-section"
import { RecommendedProductsSection } from "@/components/home/recommended-products-section"
import { AboutSection } from "@/components/about-section"
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
        <ServicesSection locale={locale} />
        <RecommendedProductsSection locale={locale} />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
