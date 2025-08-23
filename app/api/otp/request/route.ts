import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 })
    }

    // Mock OTP request - always succeeds for non-empty email
    console.log(`[v0] Mock OTP sent to: ${email}`)

    return NextResponse.json({
      success: true,
      message: "Código enviado",
    })
  } catch (error) {
    return NextResponse.json({ error: "Se cortó. Intentá otra vez." }, { status: 500 })
  }
}
