import { type NextRequest, NextResponse } from "next/server"
import { validateQuestion } from "@/lib/clients/openai"

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json()

    if (!question) {
      return NextResponse.json({ error: "question is required" }, { status: 400 })
    }

    console.log(`[v0] Validating question: ${question}`)

    // Validar la pregunta usando OpenAI o fallback local
    const validation = await validateQuestion({ question })

    console.log(`[v0] Question validation result:`, validation)

    return NextResponse.json({
      success: true,
      ...validation
    })

  } catch (error) {
    console.error("Error validating question:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
