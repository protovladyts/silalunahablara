import { type NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { findTarotSession, updateTarotSession, TAROT_DECK } from "@/lib/mocks/mockDb"

export async function POST(request: NextRequest) {
  try {
    const { sessionId, count = 3 } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 })
    }

    const session = findTarotSession(sessionId)
    if (!session || session.status !== "shuffled") {
      return NextResponse.json({ error: "Session not found or not shuffled" }, { status: 404 })
    }

    if (!session.deckOrder) {
      return NextResponse.json({ error: "Deck not shuffled" }, { status: 400 })
    }

    // Draw the first 'count' cards from shuffled deck
    const drawnCardIndices = session.deckOrder.slice(0, count)

    // Generate upright/reversed using CSPRNG (50% chance each)
    const orientationBytes = randomBytes(count)

    const drawnCards = drawnCardIndices.map((cardIndex, i) => {
      const upright = orientationBytes[i] >= 128 // 50% chance
      const cardName = TAROT_DECK[cardIndex]

      return {
        id: cardIndex,
        name: upright ? cardName : `${cardName} (invertida)`,
        upright,
      }
    })

    // Update session
    const updatedSession = updateTarotSession(sessionId, {
      status: "drawn",
      drawnCards,
    })

    if (!updatedSession) {
      return NextResponse.json({ error: "Failed to update session" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      cards: drawnCards.map((card) => card.name),
    })
  } catch (error) {
    console.error("Error drawing cards:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
