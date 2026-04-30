import { NextRequest, NextResponse } from "next/server"
import { assertAdminSession } from "../_shared"

type Booking = {
  id: string
  nume: string
  prenume: string
  email: string
  telefon: string
  serviciu: string
  data_programare: string
  ora: string
  confirmed: boolean
}

const bookings: Booking[] = []

export async function GET() {
  if (!(await assertAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({ bookings })
}

export async function PATCH(request: NextRequest) {
  if (!(await assertAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const bookingId = body.bookingId ?? body.id
  const booking = bookings.find((item) => item.id === bookingId)

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 })
  }

  if (typeof body.confirmed === "boolean") {
    booking.confirmed = body.confirmed
  }

  return NextResponse.json({ booking })
}

export async function DELETE(request: NextRequest) {
  if (!(await assertAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const bookingId = body.bookingId ?? body.id
  const index = bookings.findIndex((item) => item.id === bookingId)

  if (index === -1) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 })
  }

  bookings.splice(index, 1)
  return NextResponse.json({ success: true })
}
