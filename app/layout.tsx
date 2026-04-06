import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { Inter, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "Inteligent Service - Soluții de Securitate",
  description:
    "Inteligent Service oferă servicii profesionale de cea mai înaltă calitate în domeniul securității și instalării sistemelor de supraveghere.",
}

export const viewport: Viewport = {
  // Am schimbat culoarea temei browserului (pe mobil) cu noul tău fundal bej
  themeColor: "#F5F2EC", 
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ro">
      {/* Am adăugat bg-background și text-foreground pentru a ne asigura 
        că folosește noile variabile de culori (#F5F2EC și #0F2A4A) definite în globals.css 
      */}
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-background text-foreground min-h-screen`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}