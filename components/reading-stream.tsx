"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ReadingStreamProps {
  reading: string
  loopsUsed: number
  maxLoops?: number
  onReask: () => void
  onFinish: () => void
}

export function ReadingStream({ reading, loopsUsed, maxLoops = 3, onReask, onFinish }: ReadingStreamProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < reading.length) {
        setDisplayedText(reading.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        setIsComplete(true)
      }
    }, 25)

    return () => clearInterval(timer)
  }, [reading])

  const canReask = loopsUsed < maxLoops

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card border-border">
        <CardHeader className="text-center">
          <motion.div
            className="text-4xl mb-2"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: isComplete ? 0 : Number.POSITIVE_INFINITY }}
          >
            ✨
          </motion.div>
          <CardTitle className="text-xl text-card-foreground">Tu lectura de tarot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-card-foreground leading-relaxed">
              {displayedText}
              {!isComplete && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                  className="inline-block w-2 h-5 bg-primary ml-1"
                />
              )}
            </div>
          </div>
          {isComplete && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-8">
              <div className="text-center text-muted-foreground text-sm">Lectura completada ✨</div>
              <div className="flex gap-3 justify-center">
                {canReask && (
                  <Button
                    onClick={onReask}
                    variant="outline"
                    className="border-border text-foreground hover:bg-accent bg-transparent"
                  >
                    Repreguntar ({maxLoops - loopsUsed} restantes)
                  </Button>
                )}
                <Button onClick={onFinish} className="bg-primary text-primary-foreground hover:bg-primary/90">
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
