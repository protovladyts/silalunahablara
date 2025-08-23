"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TarotCard } from "./tarot-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TarotTableProps {
  cards: Array<{ name: string; upright: boolean }>
  onAllRevealed: () => void
  isShuffling?: boolean
  isDealingCards?: boolean
  onShuffleComplete?: () => void
}

export function TarotTable({ 
  cards, 
  onAllRevealed, 
  isShuffling = false, 
  isDealingCards = false,
  onShuffleComplete 
}: TarotTableProps) {
  const [revealedCards, setRevealedCards] = useState<boolean[]>([false, false, false])
  const [canReveal, setCanReveal] = useState(false)
  const [cardStates, setCardStates] = useState<("hidden" | "face-down" | "face-up")[]>(["hidden", "hidden", "hidden"])
  const [shufflePhase, setShufflePhase] = useState<"shuffling" | "cutting" | "reassembling">("shuffling")

  useEffect(() => {
    if (isShuffling) {
      const shuffleSequence = async () => {
        setShufflePhase("shuffling")
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setShufflePhase("cutting")
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setShufflePhase("reassembling")
        await new Promise((resolve) => setTimeout(resolve, 1500))
        
        // Después de completar el shuffle, llamar al callback
        if (onShuffleComplete) {
          onShuffleComplete()
        }
      }
      shuffleSequence()
    } else if (isDealingCards && !isShuffling) {
      const dealCards = async () => {
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            setCardStates((prev) => {
              const newStates = [...prev]
              newStates[i] = "face-down"
              return newStates
            })
          }, i * 600)
        }

        setTimeout(() => setCanReveal(true), 2000)
      }

      dealCards()
    } else if (!isShuffling && !isDealingCards && cards.length > 0) {
      // Cuando no está shuffling y hay cartas, mostrar las cartas face-down
      setCardStates(["face-down", "face-down", "face-down"])
      const timer = setTimeout(() => setCanReveal(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [isShuffling, isDealingCards, onShuffleComplete, cards.length])

  const handleCardFlip = (index: number) => {
    if (!canReveal || revealedCards[index] || cardStates[index] === "hidden") return

    const newRevealed = [...revealedCards]
    newRevealed[index] = true
    setRevealedCards(newRevealed)

    setCardStates((prev) => {
      const newStates = [...prev]
      newStates[index] = "face-up"
      return newStates
    })

    if (newRevealed.every((revealed) => revealed)) {
      setTimeout(onAllRevealed, 1000)
    }
  }

  const allRevealed = revealedCards.every((revealed) => revealed)

  if (isShuffling) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.1)_0%,_transparent_70%)]" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(139,92,246,0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(168,85,247,0.1) 0%, transparent 50%)`,
            }}
          />
        </div>

        <Card className="w-full max-w-md bg-slate-800/80 border-violet-400/30 backdrop-blur-sm relative z-10">
          <CardHeader className="text-center">
            <div className="relative mb-4">
              <AnimatePresence mode="wait">
                {shufflePhase === "shuffling" && (
                  <motion.div
                    key="shuffle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center space-x-2"
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-16 h-24 bg-gradient-to-br from-violet-900 to-purple-800 rounded-lg border border-violet-400/30"
                        animate={{
                          y: [0, -20, 0],
                          rotateZ: [0, 10, -10, 0],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                )}

                {shufflePhase === "cutting" && (
                  <motion.div
                    key="cut"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center"
                  >
                    <motion.div
                      className="w-16 h-24 bg-gradient-to-br from-violet-900 to-purple-800 rounded-lg border border-violet-400/30"
                      animate={{ x: [-20, 20, -20] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    />
                  </motion.div>
                )}

                {shufflePhase === "reassembling" && (
                  <motion.div
                    key="reassemble"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center"
                  >
                    <motion.div
                      className="w-16 h-24 bg-gradient-to-br from-violet-900 to-purple-800 rounded-lg border border-violet-400/30"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <CardTitle className="text-xl text-violet-100">
              {shufflePhase === "shuffling" && "Barajando las cartas..."}
              {shufflePhase === "cutting" && "Cortando el mazo..."}
              {shufflePhase === "reassembling" && "Reagrupando..."}
            </CardTitle>
            <CardDescription className="text-violet-300">Las energías se están alineando</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (isDealingCards) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-violet-500/20 to-transparent rounded-full" />
        </div>

        <Card className="w-full max-w-md bg-slate-800/80 border-violet-400/30 backdrop-blur-sm relative z-10">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-violet-100">Repartiendo las cartas...</CardTitle>
            <CardDescription className="text-violet-300">Tu tirada está lista</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center space-x-4">
            {[0, 1, 2].map((index) => (
              <TarotCard
                key={index}
                name={cards[index]?.name || ""}
                isRevealed={false}
                onFlip={() => {}}
                delay={index * 0.6}
                cardState={cardStates[index]}
                isReversed={!cards[index]?.upright}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Solo mostrar las cartas si hay cartas y no están en estado hidden
  if (cards.length === 0 || cardStates.every(state => state === "hidden")) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <Card className="w-full max-w-md bg-slate-800/80 border-violet-400/30 backdrop-blur-sm relative z-10">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-violet-100">Preparando las cartas...</CardTitle>
            <CardDescription className="text-violet-300">Espera un momento</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Debug: mostrar la estructura de las cartas
  console.log("[v0] TarotTable - Cards received:", cards)
  console.log("[v0] TarotTable - Card states:", cardStates)
  console.log("[v0] TarotTable - Can reveal:", canReveal)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
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
          <CardTitle className="text-xl text-violet-100">Tu tirada de cartas</CardTitle>
          <CardDescription className="text-violet-300">
            {canReveal ? "Tocá cada carta para revelarla" : "Preparando las cartas..."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center space-x-4">
          {cards.map((card, index: number) => {
            return (
              <TarotCard
                key={index}
                name={card.name}
                isRevealed={revealedCards[index]}
                onFlip={() => handleCardFlip(index)}
                delay={index * 0.2}
                cardState={cardStates[index]}
                isReversed={!card.upright}
              />
            )
          })}
        </CardContent>
      </Card>

      {allRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative z-10"
        >
          <p className="text-violet-300 mb-4">Todas las cartas han sido reveladas</p>
        </motion.div>
      )}
    </div>
  )
}
