import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: "Email y código son requeridos" }, { status: 400 })
    }

    // Verificar si es un dominio de prueba
    const testDomain = process.env.OTP_TEST_DOMAIN
    const emailDomain = email.split('@')[1]?.toLowerCase()
    const isTestDomain = testDomain && emailDomain === testDomain.toLowerCase()

    if (isTestDomain && code.trim() === "123456") {
      console.log(`[v0] Test domain verification successful for: ${email}`)
      
      // Para dominios de prueba, crear una entrada OTP temporal para mantener consistencia
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutos
      await prisma.otpEntry.create({
        data: {
          email: email.trim(),
          code: "123456",
          expiresAt
        }
      })

      // Buscar o crear usuario para obtener el nombre
      let user = await prisma.user.findUnique({
        where: { email: email.trim() }
      })

      if (!user) {
        user = await prisma.user.create({
          data: { 
            email: email.trim(),
            hasFreeTarot: true
          }
        })
      }

      const response = NextResponse.json({
        success: true,
        message: "Código verificado correctamente (modo prueba)",
        sessionId: email,
        user: {
          email: user.email,
          name: user.name
        }
      })

      // Set session cookie for 24 hours
      response.cookies.set("session", email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
      })

      return response
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

    // Buscar usuario para obtener el nombre
    const user = await prisma.user.findUnique({
      where: { email: email.trim() }
    })

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
      user: user ? {
        email: user.email,
        name: user.name
      } : {
        email: email.trim(),
        name: null
      }
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
