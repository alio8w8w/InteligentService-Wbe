import { NextRequest, NextResponse } from "next/server"
import { assertAdminSession } from "../_shared"

export async function POST(request: NextRequest) {
  if (!(await assertAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  return NextResponse.json({
    success: true,
    sentTo: Array.isArray(body.emails) ? body.emails.length : 0,
  })
}