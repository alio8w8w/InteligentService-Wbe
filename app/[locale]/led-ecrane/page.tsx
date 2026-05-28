import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import LedEcranPage from '@/components/led-ecran-page' 

export const metadata = {
  title: 'Ecrane LED Profesionale | Calitate Superioară',
  description: 'Descoperă oferta noastră de ecrane LED pentru publicitate, evenimente și display-uri digitale de înaltă performanță.',
}

export default function LedEcranRoute() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EC]">
      <Navbar />
      
      <main className="flex-1 w-full pt-24">
        <LedEcranPage />
      </main>
      
      <Footer />
      
    </div>
  )
}