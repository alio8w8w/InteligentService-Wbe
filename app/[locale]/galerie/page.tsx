import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

// Importăm componenta pe care ai creat-o la pasul anterior
// Numele importat depinde de cum ai exportat-o (ca default)
import PageGalerie from '@/components/gallery-page'

// Poți adăuga și metadata pentru SEO (Titlul paginii în tab-ul browserului)
export const metadata = {
  title: 'Galeria Noastră | Proiecte și Instalări',
  description: 'Explorează portofoliul nostru vizual de proiecte și instalări de sisteme de securitate.',
}

export default function GalerieRoute() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EC]">
      {/* 1. Meniul de navigare sus */}
      <Navbar />
      
      {/* 2. Conținutul principal (Galeria interactivă) */}
      {/* flex-1 asigură că footer-ul e mereu împins jos dacă galeria e goală */}
      <main className="flex-1 w-full">
        <PageGalerie />
      </main>
      
      {/* 3. Subsolul paginii */}
      <Footer />
    </div>
  )
}