import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: "Email y código son requeridos" }, { status: 400 })
    }

    // Buscar OTP válido en la base de datos
    const otpEntry = await prisma.otpEntry.findFirst({
      where: {
        email: email.trim(),
        code: code.trim(),
        expiresAt: {
          gt: new Date() // No expirado
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!otpEntry) {
      return NextResponse.json({ error: "Código incorrecto o expirado. Probá de nuevo." }, { status: 400 })
    }

    console.log(`[v0] OTP verified for: ${email}`)

    // Limpiar OTPs expirados
    await prisma.otpEntry.deleteMany({
      where: {
        email: email.trim(),
        expiresAt: {
          lte: new Date()
        }
      }
    })

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
    console.error("[v0] Error verifying OTP:", error)
    return NextResponse.json({ error: "Se cortó. Intentá otra vez." }, { status: 500 })
  }
}
