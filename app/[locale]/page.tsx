"use client"

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/hero-section'
import { BrandShowcase } from '@/components/brand-comp'
import { FeaturedProducts } from '@/components/featured-products'
import { GalleryPreview } from '@/components/Gallerypreview'
import { FeaturedLedScreens } from '@/components/FeaturedLedScreens'
import { ContactSection } from '@/components/contact-section'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EC]">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <BrandShowcase />
        
        {/* Aici se afișează produsele obișnuite (Dahua, Hikvision, etc.) */}
        <FeaturedProducts />
        
        <GalleryPreview />
        
        {/* Aici se afișează DOAR Ecranele LED, cu designul separat */}
        <FeaturedLedScreens />

        <ContactSection />
      </main>
      
      <Footer />
    </div>
  )
}