"use client"

import { useState } from "react"
import Image from "next/image"
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Users, 
  BarChart3, 
  Package,
  LogOut, 
  Menu, 
  X 
} from "lucide-react"

// Importuri componente
import BookingsTable from "./BookingsTable"
import GalleryManager from "./galerieadmin" 
import ClientManager from "./ClientManager" 
import AnalyticsManager from "./AnalyticsManager" 
import ProductForm from "@/components/admin/ProductForm"

interface AdminDashboardProps {
  onOpenBooking: () => void;
}

type TabType = "acasa" | "galerie" | "clienti" | "statistici" | "produse";

export default function AdminDashboard({ onOpenBooking }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("acasa")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const switchTab = (tab: TabType) => {
    setActiveTab(tab)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#FEFAE0]/40 font-sans text-[#283618]">
      {/* HEADER MOBIL */}
      <header className="lg:hidden bg-[#283618] p-4 flex items-center justify-between sticky top-0 z-[100] shadow-md">
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-[#FEFAE0]"><Menu size={28} /></button>
        <div className="relative h-8 w-32">
          <Image src="/images/logo.png" alt="Logo" fill className="brightness-0 invert object-contain" />
        </div>
        <div className="w-7" />
      </header>

      <div className="mx-auto max-w-[1440px] md:p-8">
        <div className="bg-white md:rounded-[40px] shadow-2xl overflow-hidden flex min-h-[90vh] border border-[#283618]/10 relative">
          
          {/* SIDEBAR DESKTOP */}
          <aside className="hidden lg:flex w-64 bg-[#283618] p-8 flex flex-col text-[#FEFAE0]">
            <div className="mb-12 relative h-16 w-full">
              <Image src="/images/logo.png" alt="Logo" fill className="brightness-0 invert object-contain object-left" priority />
            </div>
            <nav className="flex-1 space-y-3">
              <SidebarContent activeTab={activeTab} switchTab={switchTab} />
            </nav>
            <button 
              onClick={() => window.location.href = "/"} 
              className="mt-auto flex items-center gap-3 px-5 py-4 text-[#BC6C25] hover:bg-[#BC6C25]/10 rounded-2xl font-bold transition-colors"
            >
              <LogOut size={20} /> Ieșire
            </button>
          </aside>

          {/* MENIU MOBIL OVERLAY */}
          <aside className={`fixed top-0 left-0 bottom-0 z-[120] w-72 bg-[#283618] p-8 flex flex-col text-[#FEFAE0] transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex justify-between items-center mb-10">
              <div className="relative h-10 w-32"><Image src="/images/logo.png" alt="Logo" fill className="brightness-0 invert object-contain object-left" /></div>
              <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
            </div>
            <nav className="flex-1 space-y-4">
              <SidebarContent activeTab={activeTab} switchTab={switchTab} />
            </nav>
          </aside>

          {/* CONȚINUT PRINCIPAL */}
          <main className="flex-1 p-5 md:p-10 bg-[#FEFAE0]/10 overflow-y-auto">
            {activeTab === "acasa" && <div className="animate-in fade-in duration-500"><BookingsTable /></div>}
            {activeTab === "galerie" && <div className="animate-in fade-in slide-in-from-right-4 duration-500"><GalleryManager /></div>}
            {activeTab === "clienti" && <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full"><ClientManager /></div>}
            {activeTab === "statistici" && <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full"><AnalyticsManager /></div>}
            {activeTab === "produse" && <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full"><ProductForm /></div>}
          </main>
        </div>
      </div>
    </div>
  )
}

function SidebarContent({ activeTab, switchTab }: { activeTab: TabType, switchTab: (tab: TabType) => void }) {
  const btnClass = (tab: TabType) => `w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${
    activeTab === tab 
    ? "bg-[#DDA15E] text-[#283618] font-black shadow-lg" 
    : "hover:bg-white/5 text-[#FEFAE0]/80"
  }`;
  
  return (
    <>
      <button onClick={() => switchTab("acasa")} className={btnClass("acasa")}>
        <LayoutDashboard size={20} /> Dashboard
      </button>
      <button onClick={() => switchTab("galerie")} className={btnClass("galerie")}>
        <ImageIcon size={20} /> Galerie Foto
      </button>
      <button onClick={() => switchTab("clienti")} className={btnClass("clienti")}>
        <Users size={20} /> Clienți & Marketing
      </button>
      <button onClick={() => switchTab("statistici")} className={btnClass("statistici")}>
        <BarChart3 size={20} /> Statistici Web
      </button>
      <button onClick={() => switchTab("produse")} className={btnClass("produse")}>
        <Package size={20} /> Gestionare Produse
      </button>
    </>
  )
}