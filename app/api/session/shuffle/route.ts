import { type NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { prisma } from "@/lib/db"

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

    console.log(`[v0] Shuffling session: ${sessionId}`)

    // Buscar sesión en la base de datos
    const session = await prisma.tarotSession.findUnique({
      where: { id: sessionId },
      include: { user: true }
    })

    if (!session) {
      console.log(`[v0] Session not found: ${sessionId}`)
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    console.log(`[v0] Found session:`, { id: session.id, status: session.status, userId: session.userId })

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

    console.log(`[v0] Updating session with status: SHUFFLED`)

    // Update session in database
    const updatedSession = await prisma.tarotSession.update({
      where: { id: sessionId },
      data: {
        status: "SHUFFLED",
        question: question || session.question,
        shuffleSeed,
        deckOrder: cutDeck,
        cutIndex,
      }
    })

    console.log(`[v0] Session updated successfully:`, { 
      id: updatedSession.id, 
      status: updatedSession.status, 
      hasDeckOrder: !!updatedSession.deckOrder 
    })

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
