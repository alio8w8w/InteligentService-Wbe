"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminDashboard from "@/components/admin/admin-dashboard"
import BookingModal from "@/components/booking-modal"

export default function AdminPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    // Verificăm biletul de acces direct prin cookie
    const hasSession = document.cookie.includes("admin_session=true")

    if (!hasSession) {
      const locale = window.location.pathname.split("/")[1] || "ro"
      router.replace(`/${locale}/vbadmin224334beauty@12`)
    } else {
      setIsAuthorized(true)
    }
  }, [router])

  // Prevenim sclipirea interfeței până la autorizare
  if (!isAuthorized) {
    return <div className="min-h-screen bg-[#706760]" />
  }

  return (
    <>
      {/* Modalul de rezervare pentru adăugare manuală de clienți */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />

      {/* Frame-ul de Admin cu tab-urile Acasa și Ore Rezervate */}
      <AdminDashboard onOpenBooking={() => setIsBookingOpen(true)} />
    </>
  )
}