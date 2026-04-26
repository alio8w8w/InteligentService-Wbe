"use client"

import { useState } from "react"
import Image from "next/image"
import { 
  LayoutDashboard, 
  CalendarClock, 
  Image as ImageIcon, 
  Users, 
  BarChart3, // Iconița nouă pentru statistici
  LogOut, 
  Menu, 
  X 
} from "lucide-react"
import BookingsTable from "./BookingsTable"
import ScheduleManager from "./ScheduleManager"
import GalleryManager from "./galerieadmin" 
import ClientManager from "./ClientManager" 
import AnalyticsManager from "./AnalyticsManager" // Importăm componenta nouă
import ProductForm from "@/components/admin/ProductForm"

interface AdminDashboardProps {
  onOpenBooking: () => void;
}

export default function AdminDashboard({ onOpenBooking }: AdminDashboardProps) {
  // Am adăugat "statistici" la starea activă
  const [activeTab, setActiveTab] = useState<"acasa" | "orar" | "galerie" | "clienti" | "statistici" | "produse">("acasa")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const switchTab = (tab: "acasa" | "orar" | "galerie" | "clienti" | "statistici" | "produse") => {
    setActiveTab(tab)
    setIsMobileMenuOpen(false)
  }
  

  return (
    <div className="min-h-screen bg-[#EED5B9]/20 font-sans text-[#706760]">
      {/* HEADER MOBIL */}
      <header className="lg:hidden bg-[#706760] p-4 flex items-center justify-between sticky top-0 z-[100] shadow-md">
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-[#EED5B9]"><Menu size={28} /></button>
        <div className="relative h-8 w-32">
          <Image src="/images/logo.png" alt="Logo" fill className="brightness-0 invert object-contain" />
        </div>
        <div className="w-7" />
      </header>

      <div className="mx-auto max-w-[1440px] md:p-8">
        <div className="bg-white md:rounded-[40px] shadow-2xl overflow-hidden flex min-h-[90vh] border border-[#706760]/10 relative">
          
          {/* SIDEBAR DESKTOP */}
          <aside className="hidden lg:flex w-64 bg-[#706760] p-8 flex flex-col text-[#EED5B9]">
            <div className="mb-12 relative h-16 w-full">
              <Image src="/images/logo.png" alt="Logo" fill className="brightness-0 invert object-contain object-left" priority />
            </div>
            <nav className="flex-1 space-y-3">
              <SidebarContent activeTab={activeTab} switchTab={switchTab} />
            </nav>
            <button onClick={() => window.location.href = "/"} className="mt-auto flex items-center gap-3 px-5 py-4 text-[#EAA093] hover:bg-[#EAA093]/10 rounded-2xl font-bold transition-colors">
              <LogOut size={20} /> Ieșire
            </button>
          </aside>

          {/* MENIU MOBIL OVERLAY */}
          <aside className={`fixed top-0 left-0 bottom-0 z-[120] w-72 bg-[#706760] p-8 flex flex-col text-[#EED5B9] transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex justify-between items-center mb-10">
              <div className="relative h-10 w-32"><Image src="/images/logo.png" alt="Logo" fill className="brightness-0 invert object-contain object-left" /></div>
              <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
            </div>
            <nav className="flex-1 space-y-4">
              <SidebarContent activeTab={activeTab} switchTab={switchTab} />
            </nav>
          </aside>

          {/* CONȚINUT PRINCIPAL */}
          <main className="flex-1 p-5 md:p-10 bg-[#fafafa] overflow-y-auto">
            {activeTab === "acasa" && <div className="animate-in fade-in duration-500"><BookingsTable /></div>}
            {activeTab === "orar" && <div className="animate-in fade-in slide-in-from-right-4 duration-500"><ScheduleManager /></div>}
            {activeTab === "galerie" && <div className="animate-in fade-in slide-in-from-right-4 duration-500"><GalleryManager /></div>}
            {activeTab === "clienti" && <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full"><ClientManager /></div>}
            {/* Rutează către noul tab de statistici */}
            {activeTab === "statistici" && <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full"><AnalyticsManager /></div>}
            {activeTab === "produse" && <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full"><ProductForm /></div>}
          </main>
        </div>
      </div>
    </div>
  )
}


function SidebarContent({ activeTab, switchTab }: any) {
  const btnClass = (tab: string) => `w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${activeTab === tab ? "bg-[#BFC08E] text-[#1a1613] font-black shadow-lg" : "hover:bg-white/5 opacity-70"}`;
  
  return (
    <>
      <button onClick={() => switchTab("acasa")} className={btnClass("acasa")}><LayoutDashboard size={20} /> Acasă</button>
      <button onClick={() => switchTab("orar")} className={btnClass("orar")}><CalendarClock size={20} /> Ore Rezervate</button>
      <button onClick={() => switchTab("galerie")} className={btnClass("galerie")}><ImageIcon size={20} /> Galerie</button>
      <button onClick={() => switchTab("clienti")} className={btnClass("clienti")}><Users size={20} /> Marketing</button>
      
      {/* Butonul de Statistici care înlocuiește Setările */}
      <button onClick={() => switchTab("statistici")} className={btnClass("statistici")}><BarChart3 size={20} /> Statistici Web</button>
      <button onClick={() => switchTab("produse")} className={btnClass("produse")}><BarChart3 size={20} /> Produse</button>
    </>
  )
}