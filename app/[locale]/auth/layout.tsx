import type { ReactNode } from "react"
import { Navbar } from "@/components/navbar"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#06141B] text-[#CCD0CF]">
      <Navbar />
      <main className="pt-20">{children}</main>
    </div>
  )
}