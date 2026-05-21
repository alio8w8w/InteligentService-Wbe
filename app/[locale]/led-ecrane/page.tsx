import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
// Importă componenta interactivă creată anterior
// (Asigură-te că numele fișierului se potrivește cu cel pe care l-ai salvat în folderul components)
import LedEcranPage from '@/components/led-ecran-page' 

// Setăm datele SEO (titlul și descrierea din tab-ul browserului)
export const metadata = {
  title: 'Ecrane LED Profesionale | Calitate Superioară',
  description: 'Descoperă oferta noastră de ecrane LED pentru publicitate, evenimente și display-uri digitale de înaltă performanță.',
}

export default function LedEcranRoute() {
  return (
    // min-h-screen și flex-col asigură că pagina ocupă tot ecranul
    // și că footer-ul stă mereu frumos la baza paginii
    <div className="min-h-screen flex flex-col bg-[#F5F2EC]">
      
      {/* 1. Meniul de Navigare */}
      <Navbar />
      
      {/* 2. Conținutul Principal (Bannerul și Produsele LED) */}
      {/* flex-1 forțează conținutul să ocupe tot spațiul rămas între Navbar și Footer */}
      {/* pt-20 previne ascunderea bannerului sub Navbar, în cazul în care Navbar-ul tău e fixed */}
      <main className="flex-1 w-full pt-20">
        <LedEcranPage />
      </main>
      
      {/* 3. Subsolul Paginii */}
      <Footer />
      
    </div>
  )
}