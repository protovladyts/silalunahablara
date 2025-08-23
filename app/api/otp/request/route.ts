import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 })
    }

    // Crear o actualizar usuario
    const user = await prisma.user.upsert({
      where: { email: email.trim() },
      update: {},
      create: { email: email.trim() }
    })

    // Generar código OTP (mock por ahora)
    const otpCode = "123456"
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutos

    // Guardar OTP en la base de datos
    await prisma.otpEntry.create({
      data: {
        email: email.trim(),
        code: otpCode,
        expiresAt
      }
    })

    console.log(`[v0] OTP sent to: ${email} for user: ${user.id}`)

    return NextResponse.json({
      success: true,
      message: "Código enviado",
    })
  } catch (error) {
    console.error("[v0] Error requesting OTP:", error)
    return NextResponse.json({ error: "Se cortó. Intentá otra vez." }, { status: 500 })
  }
}
