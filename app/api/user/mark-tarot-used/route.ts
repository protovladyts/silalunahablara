import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    console.log(`[v0] Marking tarot as used for user: ${email}`)

    // Buscar y actualizar usuario
    const user = await prisma.user.update({
      where: { email },
      data: { hasFreeTarot: true }
    })

    console.log(`[v0] User ${user.id} marked as used free tarot`)

    return NextResponse.json({
      success: true,
      message: "Tarot marked as used"
    })
  } catch (error) {
    console.error("[v0] Error marking tarot as used:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
