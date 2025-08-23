import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] OTP request started")
    
    const body = await request.json()
    console.log("[v0] Request body:", body)
    
    const { email, name } = body

    if (!email || !email.trim()) {
      console.log("[v0] Email validation failed:", { email })
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 })
    }

    if (!name || !name.trim()) {
      console.log("[v0] Name validation failed:", { name })
      return NextResponse.json({ error: "Nombre es requerido" }, { status: 400 })
    }

    console.log("[v0] Processing user:", { email: email.trim(), name: name.trim() })

    // Verificar conexión a la base de datos
    try {
      await prisma.$connect()
      console.log("[v0] Database connection successful")
    } catch (dbError) {
      console.error("[v0] Database connection failed:", dbError)
      return NextResponse.json({ error: "Error de conexión a la base de datos" }, { status: 500 })
    }

    // Crear o actualizar usuario
    console.log("[v0] Creating/updating user...")
    const user = await prisma.user.upsert({
      where: { email: email.trim() },
      update: { name: name.trim() }, // Actualizar nombre si el usuario ya existe
      create: { 
        email: email.trim(),
        name: name.trim()
      }
    })
    console.log("[v0] User processed:", { userId: user.id, email: user.email, name: user.name })

    // Generar código OTP (mock por ahora)
    const otpCode = "123456"
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutos

    // Guardar OTP en la base de datos
    console.log("[v0] Creating OTP entry...")
    const otpEntry = await prisma.otpEntry.create({
      data: {
        email: email.trim(),
        code: otpCode,
        expiresAt
      }
    })
    console.log("[v0] OTP entry created:", { otpId: otpEntry.id, email: otpEntry.email })

    console.log(`[v0] OTP request completed successfully for: ${email}`)

    return NextResponse.json({
      success: true,
      message: "Código enviado",
    })
  } catch (error) {
    console.error("[v0] Error requesting OTP:", error)
    
    // Log más detalles del error
    if (error instanceof Error) {
      console.error("[v0] Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }
    
    return NextResponse.json({ 
      error: "Se cortó. Intentá otra vez.",
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
    }, { status: 500 })
  } finally {
    try {
      await prisma.$disconnect()
      console.log("[v0] Database connection closed")
    } catch (disconnectError) {
      console.error("[v0] Error disconnecting from database:", disconnectError)
    }
  }
}
