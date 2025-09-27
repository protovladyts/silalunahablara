"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { IntakeForm } from "@/components/intake-form"
import { ReaskForm } from "@/components/reask-form"
import { TarotTable } from "@/components/tarot-table"
import { ReadingStream } from "@/components/reading-stream"
import { Upsell } from "@/components/upsell"
import { SessionCard } from "@/components/session-card"
import { StarsBackground } from "@/components/stars-background"
import { FloatingVideoCallButton } from "@/components/floating-video-call-button"
import { useSession } from "@/lib/hooks/useSession"

type SessionStep = "intake" | "reask" | "shuffle" | "draw" | "reading" | "upsell"

export default function SessionPage() {
  const [step, setStep] = useState<SessionStep>("intake")
  const [question, setQuestion] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [cards, setCards] = useState<any[]>([])
  const [reading, setReading] = useState("")
  const [hasUsedFreeReading, setHasUsedFreeReading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isDrawingCards, setIsDrawingCards] = useState(false)
  const router = useRouter()
  const { sessionData, isLoading: sessionLoading, updateSession, clearSession, isSessionValid } = useSession()


  useEffect(() => {
    console.log("[v0] Session page loaded, checking auth state")
    console.log("[v0] Session loading:", sessionLoading)
    console.log("[v0] Session data:", sessionData)
    console.log("[v0] Is session valid:", isSessionValid())

    if (sessionLoading) {
      return // Esperar a que termine de cargar
    }

    if (!sessionData || !isSessionValid()) {
      console.log("[v0] No valid session found, redirecting to home")
      router.push("/")
      return
    }

    console.log("[v0] Valid session found:", sessionData.email)

    // Verificar si el usuario ya usó su tarot gratuito
    // Solo verificar si no estamos ya en el paso de lectura
    if (step !== "reading") {
      checkUserTarotUsage(sessionData.email)
    }

    // Limpiar estado anterior si existe
    const savedSessionId = localStorage.getItem("sessionId")
    if (savedSessionId) {
      console.log("[v0] Found old sessionId, clearing localStorage")
      localStorage.removeItem("sessionId")
      localStorage.removeItem("sessionStep")
    }

    // Si hay una pregunta validada, continuar directamente con la sesión
    const validatedQuestion = localStorage.getItem("validatedQuestion")
    if (validatedQuestion) {
      console.log("[v0] Found validated question, starting session directly:", validatedQuestion)
      setQuestion(validatedQuestion)
      startNewSession(validatedQuestion)
      localStorage.removeItem("validatedQuestion") // Limpiar después de usar
    } else {
      console.log("[v0] No validated question found, starting fresh")
    }
  }, [sessionLoading, sessionData, isSessionValid, router, step])

  const checkUserTarotUsage = async (email: string) => {
    try {
      const response = await fetch("/api/user/check-tarot-usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        const { hasUsedFreeTarot } = await response.json()
        setHasUsedFreeReading(hasUsedFreeTarot)
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


  const startNewSession = async (userQuestion?: string) => {
    setIsLoading(true)
    setError("")
    
    const questionToUse = userQuestion || question
    if (!questionToUse) {
      setError("No hay pregunta para procesar")
      setIsLoading(false)
      return
    }
    
    setQuestion(questionToUse)

    console.log("[v0] Frontend - Starting new session with question:", questionToUse)

    try {
      console.log("[v0] Frontend - Calling /api/session/start")
      
      const startResponse = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionToUse }),
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
    setQuestion(userQuestion)
    startNewSession(userQuestion)
  }

  const handleReaskSubmit = (userQuestion: string) => {
    setHasUsedFreeReading(true)
    setStep("upsell")
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
      
      // Marcar que el usuario ya usó su consulta gratuita
      setHasUsedFreeReading(true)
      
      // Actualizar la sesión para reflejar que ya no tiene créditos
      if (sessionData) {
        updateSession({ hasFreeTarot: false })
      }
      
      // Después de obtener la lectura, mostrar directamente la lectura
      // NO llamar a checkUserTarotUsage aquí para evitar mostrar upsell inmediatamente
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
    if (!hasUsedFreeReading) {
      setStep("reask")
    } else {
      handleFinish()
    }
  }

  const handleFinish = () => {
    if (sessionData?.email) {
      localStorage.removeItem("sessionId")
      localStorage.removeItem("sessionStep")
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
      

      {(() => {
        switch (step) {
          case "intake":
            return <IntakeForm 
              onSubmit={handleQuestionSubmit}
              isLoading={isLoading}
              initialQuestion={question}
              sessionCard={sessionData && isSessionValid() ? <SessionCard /> : null}
            />

          case "reask":
            return (
              <ReaskForm
                onSubmit={handleReaskSubmit}
                isLoading={isLoading}
                hasUsedFreeReading={hasUsedFreeReading}
              />
            )

          case "shuffle":
            return (
              <TarotTable 
                cards={cards} 
                onAllRevealed={handleAllCardsRevealed} 
                isShuffling 
                currentStep="shuffle"
                onShuffleComplete={() => {
                  console.log("[v0] Frontend - onShuffleComplete called")
                  console.log("[v0] Frontend - Current sessionId:", sessionId)
                  console.log("[v0] Frontend - isDrawingCards:", isDrawingCards)
                  
                  // Prevenir llamadas duplicadas
                  if (isDrawingCards) {
                    console.log("[v0] Frontend - Already drawing cards, skipping duplicate call")
                    return
                  }
                  
                  // Después de completar el shuffle, hacer el draw automáticamente
                  if (sessionId) {
                    console.log("[v0] Frontend - Calling /api/session/draw with sessionId:", sessionId)
                    setIsDrawingCards(true)
                    
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
                    .finally(() => {
                      setIsDrawingCards(false)
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
            return <TarotTable cards={cards} onAllRevealed={handleAllCardsRevealed} currentStep="draw" />

          case "reading":
            return (
              <ReadingStream
                reading={reading}
                question={question}
                hasUsedFreeReading={hasUsedFreeReading}
                cards={cards}
                onReask={handleReask}
                onFinish={handleFinish}
                onVideoCallOffer={handleVideoCallOffer}
                onUpsell={() => setStep("upsell")}
                sessionCard={sessionData && isSessionValid() ? <SessionCard /> : null}
              />
            )

          case "upsell":
            return sessionData ? 
              <Upsell
                userEmail={sessionData.email}
                sessionCard={sessionData && isSessionValid() ? <SessionCard /> : null}
              /> 
              : null

          default:
            return null
        }
      })()}

      {/* Botón de videollamada siempre visible, excepto en lectura */}
      <FloatingVideoCallButton currentStep={step} />

    </div>
  )
}
