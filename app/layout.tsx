import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { Inter, Space_Grotesk } from "next/font/google"
import ViewTracker from "@/components/ViewTracker"
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
  themeColor: "#F5F2EC", 
}

export default function RootLayout({ 
  children,
  params: { locale } 
}: { 
  children: ReactNode
  params: { locale: string }
}) {
  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-background text-foreground min-h-screen`}>
        <ViewTracker />
        {children}
      </body>
    </html>
  )
}