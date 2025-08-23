"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { APP_CONFIG } from "@/lib/config"

interface UpsellProps {
  userEmail: string
}

export function Upsell({ userEmail }: UpsellProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handlePurchase = async () => {
    setIsProcessing(true)
    setMessage("")

    try {
      const response = await fetch("/api/user/reset-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: userEmail, 
          paymentType: "additional_readings" 
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error procesando pago")
      }

      const { message: successMessage } = await response.json()
      setMessage(successMessage)
      
      // Limpiar localStorage y redirigir a la página de sesión para hacer nueva pregunta
      setTimeout(() => {
        localStorage.setItem("userEmail", userEmail) // Mantener el email
        localStorage.setItem("userName", "Usuario") // Nombre genérico
        router.push("/session")
      }, 2000)

    } catch (error) {
      console.error("Error processing purchase:", error)
      setMessage("Error procesando pago. Intentá de nuevo.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVideoCall = async () => {
    setIsProcessing(true)
    setMessage("")

    try {
      const response = await fetch("/api/user/reset-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: userEmail, 
          paymentType: "video_call" 
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error agendando videollamada")
      }

      const { message: successMessage } = await response.json()
      setMessage(successMessage)
      
      // Limpiar localStorage y redirigir a la página principal
      setTimeout(() => {
        localStorage.removeItem("userEmail")
        localStorage.removeItem("userName")
        router.push("/")
      }, 2000)

    } catch (error) {
      console.error("Error scheduling video call:", error)
      setMessage("Error agendando videollamada. Intentá de nuevo.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.1)_0%,_transparent_70%)]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(139,92,246,0.02) 10px, rgba(139,92,246,0.02) 20px),
                           repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(168,85,247,0.02) 10px, rgba(168,85,247,0.02) 20px)`,
          }}
        />
      </div>

      <Card className="w-full max-w-md bg-slate-800/80 border-violet-400/30 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center">
          <div className="text-4xl mb-4">💎</div>
          <CardTitle className="text-xl text-violet-100">¡Ups! Te quedaste sin lecturas gratis</CardTitle>
          <CardDescription className="text-violet-300">
            Pero no te preocupes, podés hacer {APP_CONFIG.ADDITIONAL_READINGS_COUNT} lecturas más por solo ${APP_CONFIG.ADDITIONAL_READINGS_PRICE} USD
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-violet-200 text-sm">
            <p className="mb-2">🔮 3 lecturas adicionales</p>
            <p className="mb-2">✨ Mismo nivel de calidad</p>
            <p className="mb-2">💎 Precio especial: $1 USD</p>
            <p className="text-violet-300 font-semibold">¡Aprovechá esta oferta!</p>
          </div>
          
          {message && (
            <div className={`text-center p-3 rounded-lg ${
              message.includes("Error") 
                ? "bg-red-500/20 text-red-300 border border-red-400/30" 
                : "bg-green-500/20 text-green-300 border border-green-400/30"
            }`}>
              {message}
            </div>
          )}

          <div className="flex flex-col space-y-3">
            <Button 
              onClick={handlePurchase}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "⏳ Procesando..." : `💰 Comprar ${APP_CONFIG.ADDITIONAL_READINGS_COUNT} Lecturas por $${APP_CONFIG.ADDITIONAL_READINGS_PRICE} USD`}
            </Button>
            
            <Button 
              onClick={handleVideoCall}
              disabled={isProcessing}
              variant="outline"
              className="w-full border-violet-400/30 text-violet-300 hover:bg-violet-400/10 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "⏳ Procesando..." : `📅 Agendar Videollamada ($${APP_CONFIG.VIDEO_CALL_PRICE} USD)`}
            </Button>
          </div>
          
          <div className="text-center text-xs text-violet-400 mt-4 space-y-2">
            <p>¿Tenés dudas? Contactanos:</p>
            <p className="font-semibold">silalunahablara@gmail.com</p>
            
            <div className="pt-2">
              <Link 
                href="/tyc" 
                className="text-violet-300/70 hover:text-violet-300 underline"
              >
                Términos y condiciones legales
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
