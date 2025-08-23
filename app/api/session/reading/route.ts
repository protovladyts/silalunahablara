import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { sessionId, question } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 })
    }

    console.log(`[v0] Generating reading for session: ${sessionId}`)

    // Buscar sesión en la base de datos
    const session = await prisma.tarotSession.findUnique({
      where: { id: sessionId },
      include: { user: true }
    })

    if (!session) {
      console.log(`[v0] Session not found: ${sessionId}`)
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    if (session.status !== "DRAWN") {
      console.log(`[v0] Session status is not drawn: ${session.status}`)
      return NextResponse.json({ error: "Cards not drawn yet" }, { status: 400 })
    }

    if (!session.drawnCards) {
      console.log(`[v0] Session has no drawn cards`)
      return NextResponse.json({ error: "No cards drawn" }, { status: 400 })
    }

    console.log(`[v0] Generating reading for cards:`, session.drawnCards)

    // Mock reading generation (por ahora)
    const reading = `Basándome en las cartas que has sacado, puedo ver que ${question} tiene una respuesta compleja. Las energías están alineándose de una manera muy interesante. Te recomiendo meditar sobre esto y confiar en tu intuición.`

    // Actualizar sesión con el reading
    const updatedSession = await prisma.tarotSession.update({
      where: { id: sessionId },
      data: {
        status: "READING",
        reading
      }
    })

    console.log(`[v0] Session updated with reading`)

    return NextResponse.json({
      success: true,
      reading
    })
  } catch (error) {
    console.error("Error generating reading:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
