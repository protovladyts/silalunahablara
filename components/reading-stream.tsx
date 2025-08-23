"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { APP_CONFIG } from "@/lib/config"
import { ClientOnly } from "./client-only"

interface ReadingStreamProps {
  reading: string
  loopsUsed: number
  maxLoops?: number
  onReask: () => void
  onFinish: () => void
  onVideoCallOffer: () => void
  onUpsell: () => void
}

function ReadingStreamContent({ reading, loopsUsed, maxLoops = 3, onReask, onFinish, onVideoCallOffer, onUpsell }: ReadingStreamProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [showVideoOffer, setShowVideoOffer] = useState(false)

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < reading.length) {
        setDisplayedText(reading.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        setIsComplete(true)
        // Después de completar la lectura, mostrar la oferta de videollamada
        setTimeout(() => setShowVideoOffer(true), 1000)
      }
    }, 25)

    return () => clearInterval(timer)
  }, [reading])

  const canReask = loopsUsed < maxLoops - 1
  const repreguntasRestantes = maxLoops - loopsUsed - 1

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

      <Card className="w-full max-w-2xl bg-slate-800/80 border-violet-400/30 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center">
          <motion.div
            className="text-4xl mb-2"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: isComplete ? 0 : Number.POSITIVE_INFINITY }}
          >
            ✨
          </motion.div>
          <CardTitle className="text-xl text-violet-100">Tu lectura de tarot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-violet-200 leading-relaxed text-lg">
              {displayedText}
              {!isComplete && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                  className="inline-block w-2 h-5 bg-violet-400 ml-1"
                />
              )}
            </div>
          </div>
          
          {isComplete && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-8">
              <div className="text-center text-violet-300 text-sm">Lectura completada ✨</div>
              
              {/* Oferta de videollamada */}
              {showVideoOffer && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-700/50 border border-violet-400/30 rounded-lg p-4 text-center"
                >
                  <div className="text-violet-200 text-sm mb-3">
                    <p className="mb-1">✨ ¿Querés una lectura más profunda?</p>
                    <p className="text-violet-300">${APP_CONFIG.VIDEO_CALL_PRICE} USD - {APP_CONFIG.VIDEO_CALL_DURATION}</p>
                  </div>
                  <Button
                    onClick={onVideoCallOffer}
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-2"
                  >
                    📅 Agendar Videollamada
                  </Button>
                </motion.div>
              )}
              
              <div className="flex gap-3 justify-center">
                {canReask ? (
                  <Button
                    onClick={onReask}
                    variant="outline"
                    className="border-violet-400/30 text-violet-300 hover:bg-violet-400/10 bg-transparent"
                  >
                    Repreguntar ({repreguntasRestantes} restantes)
                  </Button>
                ) : (
                  <Button
                    onClick={onUpsell}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                  >
                    💰 {APP_CONFIG.ADDITIONAL_READINGS_COUNT} Preguntas más por ${APP_CONFIG.ADDITIONAL_READINGS_PRICE} USD
                  </Button>
                )}
                <Button onClick={onFinish} className="bg-violet-600 hover:bg-violet-700 text-white">
                  Terminar
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ReadingStreamFallback({ reading }: ReadingStreamProps) {
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

      <Card className="w-full max-w-2xl bg-slate-800/80 border-violet-400/30 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">✨</div>
          <CardTitle className="text-xl text-violet-100">Tu lectura de tarot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-violet-200 leading-relaxed text-lg">
              {reading}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ReadingStream(props: ReadingStreamProps) {
  return (
    <ClientOnly fallback={<ReadingStreamFallback {...props} />}>
      <ReadingStreamContent {...props} />
    </ClientOnly>
  )
}
