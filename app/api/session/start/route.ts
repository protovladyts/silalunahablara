import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

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

    console.log(`[v0] Creating tarot session for user: ${email}`)

    // Buscar o crear usuario
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      user = await prisma.user.create({
        data: { email }
      })
      console.log(`[v0] Created new user: ${user.id}`)
    }

    // Crear sesión de tarot
    const session = await prisma.tarotSession.create({
      data: {
        userId: user.id,
        status: "INTAKE",
        loopsUsed: 0,
        question: question
      }
    })

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
