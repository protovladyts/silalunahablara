"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { APP_CONFIG } from "@/lib/config"

interface FloatingVideoCallButtonProps {
  currentStep?: "intake" | "reask" | "shuffle" | "draw" | "reading" | "upsell" | "verify" | "tyc" | "deck"
}

export function FloatingVideoCallButton({ currentStep }: FloatingVideoCallButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  const handleVideoCall = async () => {
    setIsProcessing(true)
    setShowMessage(false)

    try {
      // Por ahora solo mostrar mensaje, después se integrará con el sistema de pagos
      setShowMessage(true)
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setShowMessage(false)
      }, 3000)

    } catch (error) {
      console.error("Error scheduling video call:", error)
      setShowMessage(true)
      setTimeout(() => {
        setShowMessage(false)
      }, 3000)
    } finally {
      setIsProcessing(false)
    }
  }

  // Ocultar el botón cuando esté en el paso de lectura (ya tiene su propio botón de videollamada)
  if (currentStep === "reading") {
    return null
  }

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6">
        <Button
          onClick={handleVideoCall}
          disabled={isProcessing}
          className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-7 px-5 md:py-3 md:px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs md:text-sm"
        >
          {isProcessing ? (
            "⏳ Procesando..."
          ) : (
            <>
              {/* Mobile: Layout vertical */}
              <div className="md:hidden flex flex-col items-center text-center space-y-0.5">
                <span className="text-[10px]">📅 Agendar</span>
                <span className="text-[10px]">videollamada</span>
                <span className="text-[10px] opacity-90">${APP_CONFIG.VIDEO_CALL_PRICE} USD</span>
              </div>
              
              {/* Desktop: Layout horizontal */}
              <div className="hidden md:flex items-center">
                📅 Agendar Videollamada
                <span className="ml-2 text-sm opacity-90">
                  ${APP_CONFIG.VIDEO_CALL_PRICE} USD
                </span>
              </div>
            </>
          )}
        </Button>
      </div>

      {/* Mensaje flotante */}
      {showMessage && (
        <div className="fixed top-20 right-4 md:top-6 md:right-6 z-50 bg-green-500/90 text-white px-3 py-2 md:px-4 md:py-3 rounded-lg shadow-lg border border-green-400/30 backdrop-blur-sm text-xs md:text-sm">
          <div className="flex items-center space-x-2">
            <span>✨</span>
            <span>Contactá a silalunahablara@gmail.com para agendar</span>
          </div>
        </div>
      )}
    </>
  )
}
