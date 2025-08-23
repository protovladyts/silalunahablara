import { type NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { findTarotSession, updateTarotSession } from "@/lib/mocks/mockDb"

// Fisher-Yates shuffle using CSPRNG
function shuffleArray<T>(array: T[], seed: Buffer): T[] {
  const shuffled = [...array]
  let seedIndex = 0

  for (let i = shuffled.length - 1; i > 0; i--) {
    // Use crypto bytes for randomness
    const randomValue = seed[seedIndex % seed.length] / 255
    seedIndex++

    const j = Math.floor(randomValue * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, question } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 })
    }

    const session = findTarotSession(sessionId)
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Generate cryptographically secure random seed
    const shuffleSeed = randomBytes(32).toString("hex")
    const seedBuffer = Buffer.from(shuffleSeed, "hex")

    // Create deck with indices
    const deckIndices = Array.from({ length: 78 }, (_, i) => i)

    // Shuffle the deck using CSPRNG
    const shuffledIndices = shuffleArray(deckIndices, seedBuffer)

    // Simulate "cut" - use another random byte for cut position
    const cutSeed = randomBytes(1)[0]
    const cutIndex = Math.floor((cutSeed / 255) * shuffledIndices.length)

    // Apply the cut
    const cutDeck = [...shuffledIndices.slice(cutIndex), ...shuffledIndices.slice(0, cutIndex)]

    // Update session
    const updatedSession = updateTarotSession(sessionId, {
      status: "shuffled",
      question: question || session.question,
      shuffleSeed,
      deckOrder: cutDeck,
      cutIndex,
    })

    if (!updatedSession) {
      return NextResponse.json({ error: "Failed to update session" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      shuffled: true,
      cutIndex,
      // Don't expose the actual deck order to client
      message: "Cartas barajadas y cortadas",
    })
  } catch (error) {
    console.error("Error shuffling cards:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
