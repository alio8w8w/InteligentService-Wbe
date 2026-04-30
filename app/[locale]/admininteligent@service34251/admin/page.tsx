"use client"

import { useState } from "react"
import AdminDashboard from "@/components/admin/admin-dashboard"
import BookingModal from "@/components/booking-modal"

export default function AdminPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

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