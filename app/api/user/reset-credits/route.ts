import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { API_CONFIG } from "@/app/api/config"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Reset credits request started")
    
    const body = await request.json()
    console.log("[v0] Request body:", body)
    
    const { email, paymentType } = body

    if (!email || !email.trim()) {
      console.log("[v0] Email validation failed:", { email })
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 })
    }

    if (!paymentType || !["additional_readings", "video_call"].includes(paymentType)) {
      console.log("[v0] Payment type validation failed:", { paymentType })
      return NextResponse.json({ error: "Tipo de pago inválido" }, { status: 400 })
    }

    console.log("[v0] Processing credit reset for:", { email: email.trim(), paymentType })

    // Verificar conexión a la base de datos
    try {
      await prisma.$connect()
      console.log("[v0] Database connection successful")
    } catch (dbError) {
      console.error("[v0] Database connection failed:", dbError)
      return NextResponse.json({ error: "Error de conexión a la base de datos" }, { status: 500 })
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: email.trim() }
    })

    if (!user) {
      console.log("[v0] User not found:", { email })
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    console.log("[v0] User found:", { userId: user.id, email: user.email, hasFreeTarot: user.hasFreeTarot })

    // Reiniciar créditos según el tipo de pago
    let creditsToAdd = 0
    let message = ""

    if (paymentType === "additional_readings") {
      creditsToAdd = API_CONFIG.ADDITIONAL_READINGS_COUNT
      message = `Créditos reiniciados. Ahora tienes ${creditsToAdd} consultas más.`
    } else if (paymentType === "video_call") {
      creditsToAdd = 1 // Una consulta por videollamada
      message = "Consulta por videollamada agendada. Revisa tu email para confirmar."
    }

    // Actualizar usuario
    // hasFreeTarot: true = Tiene créditos disponibles después del pago
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { 
        hasFreeTarot: true // Reiniciar a true para permitir nuevas consultas
      }
    })

    console.log("[v0] User credits reset:", { 
      userId: updatedUser.id, 
      email: updatedUser.email, 
      hasFreeTarot: updatedUser.hasFreeTarot,
      creditsAdded: creditsToAdd
    })

    console.log(`[v0] Credits reset completed successfully for: ${email}`)

    return NextResponse.json({
      success: true,
      message,
      hasFreeTarot: true,
      creditsAdded: creditsToAdd,
      paymentType
    })
  } catch (error) {
    console.error("[v0] Error resetting credits:", error)
    
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
