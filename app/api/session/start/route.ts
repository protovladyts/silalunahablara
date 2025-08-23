import { type NextRequest, NextResponse } from "next/server"
import { createTarotSession } from "@/lib/mocks/mockDb"

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json()

    if (!question) {
      return NextResponse.json({ error: "La pregunta es requerida" }, { status: 400 })
    }

    const email = request.cookies.get("session")?.value
    if (!email) {
      return NextResponse.json({ error: "Sesión no válida" }, { status: 401 })
    }

    const session = createTarotSession(email)

    console.log(`[v0] Created tarot session ${session.id} for user ${email}`)

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      status: session.status,
      loopsUsed: session.loopsUsed,
    })
  } catch (error) {
    console.error("[v0] Error creating tarot session:", error)
    return NextResponse.json({ error: "Se cortó. Intentá otra vez." }, { status: 500 })
  }
}
