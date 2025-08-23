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
  const [isGeneratingReading, setIsGeneratingReading] = useState(false)

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
      // Mostrar estado de carga esotérico
      setIsGeneratingReading(true)
      setTimeout(() => {
        setIsGeneratingReading(false)
        onAllRevealed()
      }, 3000) // Mostrar por 3 segundos antes de generar la lectura
    }
  }

  const allRevealed = revealedCards.every((revealed) => revealed)

  // Solo mostrar el estado de generación de lectura si todas las cartas están reveladas
  if (isGeneratingReading && allRevealed) {
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

        {/* Mostrar las cartas reveladas arriba */}
        <Card className="w-full max-w-md bg-slate-800/80 border-violet-400/30 backdrop-blur-sm relative z-10">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-violet-100">Tus cartas reveladas</CardTitle>
            <CardDescription className="text-violet-300">
              Las cartas que has elegido
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center space-x-4">
            {cards.map((card, index: number) => (
              <TarotCard
                key={index}
                name={card.name}
                isRevealed={true}
                onFlip={() => {}}
                delay={0}
                cardState="face-up"
                isReversed={!card.upright}
              />
            ))}
          </CardContent>
        </Card>

        {/* Estado de carga esotérico debajo */}
        <Card className="w-full max-w-2xl bg-slate-800/80 border-violet-400/30 backdrop-blur-sm relative z-10">
          <CardHeader className="text-center">
            <motion.div
              className="text-6xl mb-4"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              🔮
            </motion.div>
            <CardTitle className="text-2xl text-violet-100 mb-2">Las energías se están alineando...</CardTitle>
            <CardDescription className="text-violet-300 text-lg">
              El universo está interpretando el mensaje de tus cartas
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <motion.div
              className="flex justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-violet-400 rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
            
            <motion.div
              className="text-violet-200 text-sm space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p>✨ Las cartas revelan sus secretos</p>
              <p>🌙 Los arcanos se conectan con tu pregunta</p>
              <p>💫 Preparando tu lectura personalizada...</p>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    )
  }

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
            <motion.div
              className="text-4xl mb-2"
              animate={{ 
                rotate: shufflePhase === "shuffling" ? [0, 360] : 0,
                scale: shufflePhase === "cutting" ? [1, 1.2, 1] : 1
              }}
              transition={{ 
                rotate: { duration: 1, repeat: shufflePhase === "shuffling" ? Infinity : 0 },
                scale: { duration: 0.8, repeat: shufflePhase === "cutting" ? Infinity : 0 }
              }}
            >
              {shufflePhase === "shuffling" ? "🃏" : shufflePhase === "cutting" ? "✂️" : "🔮"}
            </motion.div>
            <CardTitle className="text-xl text-violet-100">
              {shufflePhase === "shuffling" ? "Revolviendo las cartas..." : 
               shufflePhase === "cutting" ? "Cortando el mazo..." : 
               "Reagrupando las energías..."}
            </CardTitle>
            <CardDescription className="text-violet-300">
              {shufflePhase === "shuffling" ? "Las energías se están mezclando" : 
               shufflePhase === "cutting" ? "Separando lo que debe separarse" : 
               "Las energías se están alineando"}
            </CardDescription>
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

             {allRevealed && !isGeneratingReading && (
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center relative z-10"
         >
           <motion.p 
             className="text-violet-300 mb-4"
             animate={{ 
               scale: [1, 1.05, 1],
               opacity: [0.8, 1, 0.8]
             }}
             transition={{ 
               duration: 3, 
               repeat: Infinity, 
               ease: "easeInOut" 
             }}
           >
             ✨ Todas las cartas han sido reveladas
           </motion.p>
           <div className="text-violet-200 text-sm">
             Preparando tu lectura
             <motion.span
               animate={{ opacity: [0, 1, 0] }}
               transition={{ 
                 duration: 1.5, 
                 repeat: Infinity, 
                 ease: "easeInOut" 
               }}
               className="inline-block ml-1"
             >
               ...
             </motion.span>
           </div>
         </motion.div>
       )}
    </div>
  )
}
