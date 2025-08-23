import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    console.log("[v0] Health check started")
    
    // Verificar conexión a la base de datos
    await prisma.$connect()
    console.log("[v0] Database connection successful")
    
    // Verificar que las tablas existen
    const userCount = await prisma.user.count()
    const otpCount = await prisma.otpEntry.count()
    const sessionCount = await prisma.tarotSession.count()
    
    console.log("[v0] Database tables accessible:", { userCount, otpCount, sessionCount })
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      status: "healthy",
      database: "connected",
      tables: {
        users: userCount,
        otpCount: otpCount,
        tarotSessions: sessionCount
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("[v0] Health check failed:", error)
    
    return NextResponse.json({
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
