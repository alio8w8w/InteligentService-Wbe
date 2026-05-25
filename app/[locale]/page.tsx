"use client"

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/hero-section'
import { BrandShowcase } from '@/components/brand-comp'
import { FeaturedProducts } from '@/components/featured-products'
import { GalleryPreview } from '@/components/Gallerypreview'

// IMPORTĂM NOUA COMPONENTĂ
import { FeaturedLedScreens } from '@/components/FeaturedLedScreens'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EC]">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <BrandShowcase />
        <FeaturedProducts />
        <GalleryPreview />
        
        {/* 5. Aici adăugăm componenta pentru Ecrane LED sub galerie */}
        <FeaturedLedScreens />
      </main>
      
      <Footer />
    </div>
  )
}