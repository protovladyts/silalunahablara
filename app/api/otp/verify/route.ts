import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: "Email y código son requeridos" }, { status: 400 })
    }

    // Mock OTP verification - only accepts "123456"
    if (code !== "123456") {
      return NextResponse.json({ error: "Código incorrecto. Probá de nuevo." }, { status: 400 })
    }

    console.log(`[v0] Mock OTP verified for: ${email}`)

    const response = NextResponse.json({
      success: true,
      message: "Código verificado correctamente",
      sessionId: email,
    })

    // Set session cookie for 24 hours
    response.cookies.set("session", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Se cortó. Intentá otra vez." }, { status: 500 })
  }
}
