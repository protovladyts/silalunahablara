"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { IntakeForm } from "@/components/intake-form"
import { ReaskForm } from "@/components/reask-form"
import { TarotTable } from "@/components/tarot-table"
import { ReadingStream } from "@/components/reading-stream"
import { Upsell } from "@/components/upsell"
import { ProgressIndicator } from "@/components/progress-indicator"
import { hasUsedFreeTarot, markFreeTarotUsed } from "@/lib/mocks/mockDb"

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

  const MAX_LOOPS = 3

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    const userVerified = sessionStorage.getItem("userVerified")
    const savedSessionId = localStorage.getItem("sessionId")
    const savedStep = localStorage.getItem("sessionStep") as SessionStep
    const savedLoopsUsed = localStorage.getItem("loopsUsed")

    console.log("[v0] Session page loaded, checking auth state")

    if (!email || !userVerified) {
      console.log("[v0] No auth found, redirecting to home")
      router.push("/")
      return
    }

    setUserEmail(email)

    // Check if user has already used free tarot
    if (hasUsedFreeTarot(email)) {
      console.log("[v0] User already used free tarot, showing upsell")
      setStep("upsell")
      return
    }

    if (savedSessionId && savedStep && savedLoopsUsed) {
      console.log("[v0] Rehydrating session state")
      setSessionId(savedSessionId)
      setStep(savedStep)
      setLoopsUsed(Number.parseInt(savedLoopsUsed))

      // If user was in middle of session, check if they exceeded loops
      if (Number.parseInt(savedLoopsUsed) >= MAX_LOOPS) {
        setStep("upsell")
        markFreeTarotUsed(email)
      }
    }
  }, [router])

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

    try {
      const startResponse = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion }),
      })

      if (!startResponse.ok) {
        throw new Error("Failed to start session")
      }

      const { sessionId: newSessionId } = await startResponse.json()
      setSessionId(newSessionId)

      const shuffleResponse = await fetch("/api/session/shuffle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: newSessionId }),
      })

      if (!shuffleResponse.ok) {
        throw new Error("Failed to shuffle")
      }

      setStep("shuffle")

      setTimeout(async () => {
        try {
          const drawResponse = await fetch("/api/session/draw", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: newSessionId }),
          })

          if (!drawResponse.ok) {
            throw new Error("Failed to draw cards")
          }

          const { cards: drawnCards } = await drawResponse.json()
          setCards(drawnCards)
          setStep("draw")
        } catch (error) {
          console.error("[v0] Error drawing cards:", error)
          setError("Se cortó. Intentá otra vez.")
          setStep("intake")
        }
      }, 3000)
    } catch (error) {
      console.error("[v0] Error starting session:", error)
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
      markFreeTarotUsed(userEmail)
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
      setStep("reading")
    } catch (error) {
      console.error("[v0] Error getting reading:", error)
      setError("Se cortó. Intentá otra vez.")
    }
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
      markFreeTarotUsed(userEmail)
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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-purple-900 flex items-center justify-center p-4">
        <div className="text-center">
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
    <>
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
            return <TarotTable cards={cards} onAllRevealed={handleAllCardsRevealed} isShuffling />

          case "draw":
            return <TarotTable cards={cards} onAllRevealed={handleAllCardsRevealed} />

          case "reading":
            return (
              <ReadingStream
                reading={reading}
                loopsUsed={loopsUsed}
                maxLoops={MAX_LOOPS}
                onReask={handleReask}
                onFinish={handleFinish}
              />
            )

          case "upsell":
            return <Upsell userEmail={userEmail} />

          default:
            return null
        }
      })()}
    </>
  )
}
