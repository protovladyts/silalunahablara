import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { generateTarotReading } from "@/lib/openai"

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
      include: { 
        user: {
          include: {
            tarotSessions: {
              where: {
                status: "READING",
                id: { not: sessionId } // Excluir la sesión actual
              },
              orderBy: { createdAt: 'desc' },
              take: 3 // Últimas 3 lecturas para contexto
            }
          }
        }
      }
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

    // Preparar datos para OpenAI
    const previousReadings = session.user?.tarotSessions?.map(prevSession => ({
      question: prevSession.question || "",
      reading: prevSession.reading || "",
      date: prevSession.createdAt.toISOString().split('T')[0] // Solo la fecha
    })) || []

    // Usar el nombre real del usuario
    const userName = session.user?.name || undefined

    try {
      // Generar lectura con OpenAI
      const aiReading = await generateTarotReading({
        question,
        cards: session.drawnCards as Array<{ name: string; upright: boolean }>,
        userName,
        previousReadings
      })

      console.log(`[v0] AI reading generated successfully`)

      // Actualizar sesión con el reading
      const updatedSession = await prisma.tarotSession.update({
        where: { id: sessionId },
        data: {
          status: "READING",
          reading: aiReading.reading
        }
      })

      console.log(`[v0] Session updated with AI reading`)

      return NextResponse.json({
        success: true,
        reading: aiReading.reading
      })

    } catch (aiError) {
      console.error("[v0] Error calling OpenAI:", aiError)
      
      // Fallback a lectura mock si OpenAI falla
      console.log(`[v0] Falling back to mock reading`)
      const fallbackReading = `Basándome en las cartas que has sacado, puedo ver que ${question} tiene una respuesta compleja. Las energías están alineándose de una manera muy interesante. Te recomiendo meditar sobre esto y confiar en tu intuición.`

      const updatedSession = await prisma.tarotSession.update({
        where: { id: sessionId },
        data: {
          status: "READING",
          reading: fallbackReading
        }
      })

      return NextResponse.json({
        success: true,
        reading: fallbackReading,
        warning: "Lectura generada con respaldo (OpenAI no disponible)"
      })
    }

  } catch (error) {
    console.error("Error generating reading:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
