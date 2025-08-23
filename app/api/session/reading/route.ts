import { type NextRequest, NextResponse } from "next/server"
import { getMockReading } from "@/lib/mocks/mockOpenAI"
import { getSession, updateSessionReading } from "@/lib/mocks/mockDb"

export async function POST(request: NextRequest) {
  try {
    const { sessionId, question } = await request.json()

    if (!sessionId || !question) {
      return NextResponse.json({ error: "Session ID and question required" }, { status: 400 })
    }

    const session = getSession(sessionId)
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    if (!session.cards || session.cards.length === 0) {
      return NextResponse.json({ error: "No cards drawn yet" }, { status: 400 })
    }

    const reading = await getMockReading(question, session.cards)
    updateSessionReading(sessionId, reading)

    return NextResponse.json({ reading })
  } catch (error) {
    console.error("Error generating reading:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
