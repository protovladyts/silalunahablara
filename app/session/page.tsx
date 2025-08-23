"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { IntakeForm } from "@/components/intake-form"
import { ReaskForm } from "@/components/reask-form"
import { TarotTable } from "@/components/tarot-table"
import { ReadingStream } from "@/components/reading-stream"
import { Upsell } from "@/components/upsell"
import { ProgressIndicator } from "@/components/progress-indicator"
import { APP_CONFIG } from "@/lib/config"
import { StarsBackground } from "@/components/stars-background"
import { FloatingVideoCallButton } from "@/components/floating-video-call-button"
import Link from "next/link"

type SessionStep = "intake" | "reask" | "shuffle" | "draw" | "reading" | "upsell"

export default function SessionPage() {
  const [step, setStep] = useState<SessionStep>("intake")
  const [question, setQuestion] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [cards, setCards] = useState<any[]>([])
  const [reading, setReading] = useState("")
  const [loopsUsed, setLoopsUsed] = useState(0)
  const [userEmail, setUserEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const MAX_LOOPS = APP_CONFIG.MAX_TAROT_READINGS // Número total de preguntas (1 inicial + 2 repreguntas)

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    const userVerified = sessionStorage.getItem("userVerified")
    const savedSessionId = localStorage.getItem("sessionId")
    const savedStep = localStorage.getItem("sessionStep") as SessionStep
    const savedLoopsUsed = localStorage.getItem("loopsUsed")

    console.log("[v0] Session page loaded, checking auth state")
    console.log("[v0] Auth state:", { email, userVerified, savedSessionId, savedStep, savedLoopsUsed })

    if (!email || !userVerified) {
      console.log("[v0] No auth found, redirecting to home")
      router.push("/")
      return
    }

    setUserEmail(email)

    // Verificar si el usuario ya usó su tarot gratuito
    checkUserTarotUsage(email)

    // Limpiar estado anterior si existe
    if (savedSessionId) {
      console.log("[v0] Found old sessionId, clearing localStorage")
      localStorage.removeItem("sessionId")
      localStorage.removeItem("sessionStep")
      localStorage.removeItem("loopsUsed")
    }

    console.log("[v0] Starting fresh session")
  }, [router])

  const checkUserTarotUsage = async (email: string) => {
    try {
      const response = await fetch("/api/user/check-tarot-usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        const { hasUsedFreeTarot } = await response.json()
        if (hasUsedFreeTarot) {
          console.log("[v0] User already used free tarot, showing upsell")
          setStep("upsell")
        }
      }
    } catch (error) {
      console.error("[v0] Error checking tarot usage:", error)
    }
  }

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("sessionId", sessionId)
    }
  }, [sessionId])

  useEffect(() => {
    if (step !== "intake") {
      localStorage.setItem("sessionStep", step)
    }
  }, [step])

  useEffect(() => {
    localStorage.setItem("loopsUsed", loopsUsed.toString())
  }, [loopsUsed])

  const startNewSession = async (userQuestion: string) => {
    setIsLoading(true)
    setError("")
    setQuestion(userQuestion)

    console.log("[v0] Frontend - Starting new session with question:", userQuestion)

    try {
      console.log("[v0] Frontend - Calling /api/session/start")
      
      const startResponse = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion }),
      })

      if (!startResponse.ok) {
        throw new Error("Failed to start session")
      }

      const { sessionId: newSessionId } = await startResponse.json()
      console.log("[v0] Frontend - Got sessionId from start:", newSessionId)
      
      setSessionId(newSessionId)

      // Ahora hacer shuffle inmediatamente con el sessionId
      console.log("[v0] Frontend - Calling /api/session/shuffle with sessionId:", newSessionId)
      
      const shuffleResponse = await fetch("/api/session/shuffle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: newSessionId }),
      })

      if (!shuffleResponse.ok) {
        throw new Error("Failed to shuffle")
      }

      console.log("[v0] Frontend - Shuffle successful, setting step to shuffle")
      setStep("shuffle")
      // El draw ahora se maneja automáticamente en el callback onShuffleComplete
    } catch (error) {
      console.error("[v0] Frontend - Error starting session:", error)
      setError("Se cortó. Intentá otra vez.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuestionSubmit = (userQuestion: string) => {
    startNewSession(userQuestion)
  }

  const handleReaskSubmit = (userQuestion: string) => {
    const newLoopsUsed = loopsUsed + 1
    setLoopsUsed(newLoopsUsed)

    if (newLoopsUsed >= MAX_LOOPS) {
      // Marcar tarot como usado cuando se agotan los loops
      if (userEmail) {
        fetch("/api/user/mark-tarot-used", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail }),
        }).catch(console.error)
      }
      setStep("upsell")
      return
    }

    startNewSession(userQuestion)
  }

  const handleAllCardsRevealed = async () => {
    try {
      const response = await fetch("/api/session/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, question }),
      })

      if (!response.ok) {
        throw new Error("Failed to get reading")
      }

      const { reading: newReading } = await response.json()
      setReading(newReading)
      
      // Después de obtener la lectura, mostrar directamente la lectura
      setStep("reading")
    } catch (error) {
      console.error("[v0] Error getting reading:", error)
      setError("Se cortó. Intentá otra vez.")
    }
  }

  const handleVideoCallOffer = () => {
    // Aquí iría la lógica para agendar videollamada
    alert("Funcionalidad de videollamada en desarrollo. Contactá a silalunahablara@gmail.com")
  }

  const handleReask = () => {
    if (loopsUsed < MAX_LOOPS) {
      setStep("reask")
    } else {
      handleFinish()
    }
  }

  const handleFinish = () => {
    if (userEmail) {
      // Ahora usamos Prisma para marcar el tarot como usado
      fetch("/api/user/mark-tarot-used", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      }).catch(console.error)
      
      localStorage.removeItem("sessionId")
      localStorage.removeItem("sessionStep")
      localStorage.removeItem("loopsUsed")
    }
    setStep("upsell")
  }

  const getProgressStep = (): "intake" | "shuffle" | "draw" | "reading" => {
    if (step === "intake" || step === "reask") return "intake"
    if (step === "shuffle") return "shuffle"
    if (step === "draw") return "draw"
    if (step === "reading") return "reading"
    return "intake"
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
        <StarsBackground animated={true} />
        <div className="text-center relative z-10">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => {
              setError("")
              setStep("intake")
            }}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden" suppressHydrationWarning>
      <StarsBackground animated={true} />
      
      {step !== "upsell" && (
        <ProgressIndicator currentStep={getProgressStep()} loopsUsed={loopsUsed} maxLoops={MAX_LOOPS} />
      )}

      {(() => {
        switch (step) {
          case "intake":
            return <IntakeForm onSubmit={handleQuestionSubmit} isLoading={isLoading} />

          case "reask":
            return (
              <ReaskForm
                onSubmit={handleReaskSubmit}
                isLoading={isLoading}
                loopsUsed={loopsUsed}
                maxLoops={MAX_LOOPS}
              />
            )

          case "shuffle":
            return (
              <TarotTable 
                cards={cards} 
                onAllRevealed={handleAllCardsRevealed} 
                isShuffling 
                onShuffleComplete={() => {
                  console.log("[v0] Frontend - onShuffleComplete called")
                  console.log("[v0] Frontend - Current sessionId:", sessionId)
                  
                  // Después de completar el shuffle, hacer el draw automáticamente
                  if (sessionId) {
                    console.log("[v0] Frontend - Calling /api/session/draw with sessionId:", sessionId)
                    
                    fetch("/api/session/draw", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ sessionId }),
                    })
                    .then(response => {
                      console.log("[v0] Frontend - Draw response status:", response.status)
                      if (response.ok) {
                        return response.json()
                      }
                      throw new Error("Failed to draw cards")
                    })
                    .then(({ cards: drawnCards }) => {
                      console.log("[v0] Frontend - Draw successful, got cards:", drawnCards)
                      setCards(drawnCards)
                      setStep("draw")
                    })
                    .catch(error => {
                      console.error("[v0] Frontend - Error drawing cards:", error)
                      setError("Error al obtener las cartas. Intentá otra vez.")
                      setStep("intake")
                    })
                  } else {
                    console.error("[v0] Frontend - No sessionId available for draw")
                    setError("Error de sesión. Intentá otra vez.")
                    setStep("intake")
                  }
                }}
              />
            )

          case "draw":
            return <TarotTable cards={cards} onAllRevealed={handleAllCardsRevealed} />

          case "reading":
            return (
              <ReadingStream
                reading={reading}
                question={question}
                loopsUsed={loopsUsed}
                maxLoops={MAX_LOOPS}
                cards={cards}
                onReask={handleReask}
                onFinish={handleFinish}
                onVideoCallOffer={handleVideoCallOffer}
                onUpsell={() => setStep("upsell")}
              />
            )

          case "upsell":
            return <Upsell userEmail={userEmail} />

          default:
            return null
        }
      })()}

      {/* Botón de videollamada siempre visible, excepto en lectura */}
      <FloatingVideoCallButton currentStep={step} />
    </div>
  )
}
