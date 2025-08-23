"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface VideoCallOfferProps {
  onScheduleCall: () => void
  onContinue: () => void
  question: string
}

export function VideoCallOffer({ onScheduleCall, onContinue, question }: VideoCallOfferProps) {
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
          <div className="text-4xl mb-4">📞</div>
          <CardTitle className="text-xl text-violet-100">¿Querés una lectura más profunda?</CardTitle>
          <CardDescription className="text-violet-300">
            Tu pregunta: "{question}"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-violet-200 text-sm">
            <p className="mb-2">✨ Lectura personalizada en videollamada</p>
            <p className="mb-2">🔮 Interpretación detallada de tus cartas</p>
            <p className="mb-2">💫 Respuestas específicas a tu consulta</p>
            <p className="text-violet-300">$15 USD - 30 minutos</p>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={onScheduleCall}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-3"
            >
              📅 Agendar Videollamada
            </Button>
            
            <Button 
              onClick={onContinue}
              variant="outline"
              className="w-full border-violet-400/30 text-violet-300 hover:bg-violet-400/10"
            >
              Continuar con la lectura gratis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
