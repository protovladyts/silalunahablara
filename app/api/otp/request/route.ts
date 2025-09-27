import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendOtpEmail } from "@/lib/clients/resend"

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
        name: name.trim(),
        hasFreeTarot: true // Usuarios nuevos tienen créditos gratuitos
      }
    })
    console.log("[v0] User processed:", { userId: user.id, email: user.email, name: user.name, hasFreeTarot: user.hasFreeTarot })

    // DEBUGGING: Verificar cuántas sesiones completadas tiene este usuario
    const completedSessions = await prisma.tarotSession.count({
      where: { 
        userId: user.id,
        status: "READING"
      }
    })
    console.log(`[v0] DEBUGGING OTP - User ${email} has ${completedSessions} completed sessions`)
    console.log(`[v0] DEBUGGING OTP - User hasFreeTarot: ${user.hasFreeTarot}`)
    
    // Verificar si el usuario ya usó todos sus créditos gratuitos
    // hasFreeTarot: false = No tiene créditos, hasFreeTarot: true = Sí tiene créditos
    if (!user.hasFreeTarot) {
      console.log(`[v0] User ${email} has no free credits (hasFreeTarot: false), showing paywall`)
      return NextResponse.json({
        error: "NO_FREE_CREDITS",
        message: "Ya has usado todas tus consultas gratuitas de tarot",
        hasFreeTarot: false,
        options: {
          additionalReadings: {
            price: 1,
            count: 3,
            description: "3 preguntas más por $1 USD"
          },
          videoCall: {
            price: 15,
            duration: "30 minutos",
            description: "Lectura personalizada por videollamada"
          }
        }
      }, { status: 402 }) // 402 Payment Required
    }

    console.log(`[v0] User ${email} has free credits (hasFreeTarot: true), proceeding with OTP`)

    // Verificar si es un dominio de prueba
    const testDomain = process.env.OTP_TEST_DOMAIN
    const emailDomain = email.split('@')[1]?.toLowerCase()
    const isTestDomain = testDomain && emailDomain === testDomain.toLowerCase()

    if (isTestDomain) {
      console.log(`[v0] Test domain detected (${testDomain}), skipping email send for: ${email}`)
      
      // Para dominios de prueba, usar código fijo
      const otpCode = "123456"
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutos

      // Guardar OTP en la base de datos
      console.log("[v0] Creating OTP entry for test domain...")
      const otpEntry = await prisma.otpEntry.create({
        data: {
          email: email.trim(),
          code: otpCode,
          expiresAt
        }
      })
      console.log("[v0] OTP entry created for test domain:", { otpId: otpEntry.id, email: otpEntry.email })

      return NextResponse.json({
        success: true,
        message: "Código enviado (modo prueba)",
      })
    }

    // Para dominios normales, generar código OTP y enviar por Resend
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString() // Código de 6 dígitos
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutos

    // Guardar OTP en la base de datos primero
    console.log("[v0] Creating OTP entry...")
    const otpEntry = await prisma.otpEntry.create({
      data: {
        email: email.trim(),
        code: otpCode,
        expiresAt
      }
    })
    console.log("[v0] OTP entry created:", { otpId: otpEntry.id, email: otpEntry.email })

    // Enviar email por Resend
    try {
      console.log(`[v0] Sending OTP ${otpCode} to ${email} via Resend`)
      await sendOtpEmail({
        email: email.trim(),
        name: name.trim(),
        otpCode
      })
      console.log(`[v0] Email sent successfully to: ${email}`)
    } catch (emailError) {
      console.error(`[v0] Failed to send email to ${email}:`, emailError)
      // No fallar la operación si el email falla, el usuario puede solicitar reenvío
      return NextResponse.json({
        success: false,
        error: "Error enviando el código. Probá de nuevo.",
        details: process.env.NODE_ENV === 'development' ? emailError instanceof Error ? emailError.message : 'Email send failed' : undefined
      }, { status: 500 })
    }

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
