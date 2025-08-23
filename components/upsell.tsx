"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { APP_CONFIG } from "@/lib/config"

interface UpsellProps {
  userEmail: string
}

export function Upsell({ userEmail }: UpsellProps) {
  const handlePurchase = () => {
    // Aquí iría la lógica de compra
    console.log("Usuario quiere comprar más lecturas:", userEmail)
    // Por ahora solo mostramos un alert
    alert("Funcionalidad de compra en desarrollo. Contactá a silalunahablara@gmail.com")
  }

  const handleVideoCall = () => {
    // Aquí iría la lógica para agendar videollamada
    console.log("Usuario quiere agendar videollamada:", userEmail)
    // Por ahora solo mostramos un alert
    alert("Funcionalidad de videollamada en desarrollo. Contactá a silalunahablara@gmail.com")
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
          
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={handlePurchase}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3"
            >
              💰 Comprar {APP_CONFIG.ADDITIONAL_READINGS_COUNT} Lecturas por ${APP_CONFIG.ADDITIONAL_READINGS_PRICE} USD
            </Button>
            
            <Button 
              onClick={handleVideoCall}
              variant="outline"
              className="w-full border-violet-400/30 text-violet-300 hover:bg-violet-400/10 bg-transparent"
            >
              📅 Agendar Videollamada (${APP_CONFIG.VIDEO_CALL_PRICE} USD)
            </Button>
          </div>
          
          <div className="text-center text-xs text-violet-400 mt-4">
            <p>¿Tenés dudas? Contactanos:</p>
            <p className="font-semibold">silalunahablara@gmail.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
