import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    console.log(`[v0] Checking tarot usage for user: ${email}`)

    // Buscar usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ hasUsedFreeTarot: false })
    }

    // hasFreeTarot: true = Tiene créditos disponibles, hasFreeTarot: false = No tiene créditos
    // hasUsedFreeTarot: true = Ya usó todos sus créditos, hasUsedFreeTarot: false = Aún tiene créditos
    const hasUsedFreeTarot = !user.hasFreeTarot
    
    console.log(`[v0] User ${user.id} - hasFreeTarot: ${user.hasFreeTarot}, hasUsedFreeTarot: ${hasUsedFreeTarot}`)

    return NextResponse.json({
      hasUsedFreeTarot
    })
  } catch (error) {
    console.error("[v0] Error checking tarot usage:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
