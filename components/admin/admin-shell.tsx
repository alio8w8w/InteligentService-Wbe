"use client"

import { useState } from "react"
import AdminDashboard from "./admin-dashboard"
import BookingModal from "@/components/booking-modal"

export default function AdminShell() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  return (
    <>
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
      <AdminDashboard onOpenBooking={() => setIsBookingOpen(true)} />
    </>
  )
}