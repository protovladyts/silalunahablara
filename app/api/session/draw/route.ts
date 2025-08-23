import { type NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { prisma } from "@/lib/db"

// 78 Tarot cards (Major + Minor Arcana)
const TAROT_DECK = [
  // Major Arcana (0-21)
  "El Loco",
  "El Mago",
  "La Sacerdotisa",
  "La Emperatriz",
  "El Emperador",
  "El Hierofante",
  "Los Enamorados",
  "El Carro",
  "La Fuerza",
  "El Ermitaño",
  "La Rueda de la Fortuna",
  "La Justicia",
  "El Colgado",
  "La Muerte",
  "La Templanza",
  "El Diablo",
  "La Torre",
  "La Estrella",
  "La Luna",
  "El Sol",
  "El Juicio",
  "El Mundo",

  // Minor Arcana - Copas (22-35)
  "As de Copas",
  "Dos de Copas",
  "Tres de Copas",
  "Cuatro de Copas",
  "Cinco de Copas",
  "Seis de Copas",
  "Siete de Copas",
  "Ocho de Copas",
  "Nueve de Copas",
  "Diez de Copas",
  "Sota de Copas",
  "Caballero de Copas",
  "Reina de Copas",
  "Rey de Copas",

  // Minor Arcana - Espadas (36-49)
  "As de Espadas",
  "Dos de Espadas",
  "Tres de Espadas",
  "Cuatro de Espadas",
  "Cinco de Espadas",
  "Seis de Espadas",
  "Siete de Espadas",
  "Ocho de Espadas",
  "Nueve de Espadas",
  "Diez de Espadas",
  "Sota de Espadas",
  "Caballero de Espadas",
  "Reina de Espadas",
  "Rey de Espadas",

  // Minor Arcana - Bastos (50-63)
  "As de Bastos",
  "Dos de Bastos",
  "Tres de Bastos",
  "Cuatro de Bastos",
  "Cinco de Bastos",
  "Seis de Bastos",
  "Siete de Bastos",
  "Ocho de Bastos",
  "Nueve de Bastos",
  "Diez de Bastos",
  "Sota de Bastos",
  "Caballero de Bastos",
  "Reina de Bastos",
  "Rey de Bastos",

  // Minor Arcana - Oros (64-77)
  "As de Oros",
  "Dos de Oros",
  "Tres de Oros",
  "Cuatro de Oros",
  "Cinco de Oros",
  "Seis de Oros",
  "Siete de Oros",
  "Ocho de Oros",
  "Nueve de Oros",
  "Diez de Oros",
  "Sota de Oros",
  "Caballero de Oros",
  "Reina de Oros",
  "Rey de Oros",
]

export async function POST(request: NextRequest) {
  try {
    const { sessionId, count = 3 } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 })
    }

    console.log(`[v0] Drawing cards for session: ${sessionId}`)

    // Buscar sesión en la base de datos
    const session = await prisma.tarotSession.findUnique({
      where: { id: sessionId },
      include: { user: true }
    })

    if (!session) {
      console.log(`[v0] Session not found: ${sessionId}`)
      return NextResponse.json({ error: "Session not found or not shuffled" }, { status: 404 })
    }

    console.log(`[v0] Found session:`, { 
      id: session.id, 
      status: session.status, 
      hasDeckOrder: !!session.deckOrder,
      userId: session.userId 
    })

    if (session.status !== "SHUFFLED") {
      console.log(`[v0] Session status is not shuffled: ${session.status}`)
      return NextResponse.json({ error: "Session not found or not shuffled" }, { status: 404 })
    }

    if (!session.deckOrder) {
      console.log(`[v0] Session has no deckOrder`)
      return NextResponse.json({ error: "Deck not shuffled" }, { status: 400 })
    }

    // Draw the first 'count' cards from shuffled deck
    const drawnCardIndices = session.deckOrder.slice(0, count)

    // Generate upright/reversed using CSPRNG (50% chance each)
    const orientationBytes = randomBytes(count)

    const drawnCards = drawnCardIndices.map((cardIndex, i) => {
      // Generar cartas invertidas aleatoriamente (50% chance)
      const upright = orientationBytes[i] >= 128 // 50% chance
      const cardName = TAROT_DECK[cardIndex]

      return {
        id: cardIndex,
        name: cardName, // Nombre limpio, la rotación se maneja en el frontend
        upright,
      }
    })

    console.log(`[v0] Drawing ${drawnCards.length} cards`)

    // Update session in database
    const updatedSession = await prisma.tarotSession.update({
      where: { id: sessionId },
      data: {
        status: "DRAWN",
        drawnCards,
      }
    })

    console.log(`[v0] Session updated to drawn status`)

    return NextResponse.json({
      success: true,
      cards: drawnCards, // Retornar la estructura completa de las cartas
    })
  } catch (error) {
    console.error("Error drawing cards:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
