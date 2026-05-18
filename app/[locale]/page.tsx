"use client"

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/hero-section'
import { BrandShowcase } from '@/components/brand-comp'
// IMPORTĂM NOUA COMPONENTĂ DE PRODUSE
import { FeaturedProducts } from '@/components/featured-products'
// IMPORTĂM NOUA COMPONENTĂ DE GALERIE
import { GalleryPreview } from '@/components/Gallerypreview'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EC]">
      <Navbar />
      
      <main className="flex-1">
        {/* 1. Secțiunea Principală (Imaginea mare și textul de bun venit) */}
        <HeroSection />

        {/* 2. Componenta de Branduri (Hikvision & Dahua) */}
        <BrandShowcase />

        {/* 3. Produsele Recomandate/Cu Reducere (Noua componentă, în loc de CTA-ul vechi) */}
        <FeaturedProducts />

        {/* 4. Galeria - Acum componenta este chemată efectiv să se afișeze pe ecran */}
        <GalleryPreview />

      </main>
      
      <Footer />
    </div>
  )
}