import { NextRequest, NextResponse } from "next/server"
import { assertAdminSession } from "../_shared"

type Block = {
  id: string
  data: string
  ora: string
}

const blockedSlots: Block[] = []

export async function GET() {
  if (!(await assertAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({ blocks: blockedSlots })
}

export async function POST(request: NextRequest) {
  if (!(await assertAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const block = {
    id: crypto.randomUUID(),
    data: body.data,
    ora: body.ora,
  }

  blockedSlots.push(block)
  return NextResponse.json({ block })
}

export async function DELETE(request: NextRequest) {
  if (!(await assertAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const index = blockedSlots.findIndex((item) => item.id === body.id)

  if (index === -1) {
    return NextResponse.json({ error: "Block not found" }, { status: 404 })
  }

  blockedSlots.splice(index, 1)
  return NextResponse.json({ success: true })
}
