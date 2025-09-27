"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { IntakeForm } from "@/components/intake-form"
import { EmailModal } from "@/components/email-modal"
import { OTPModal } from "@/components/otp-modal"
import { SessionCard } from "@/components/session-card"
import { StarsBackground } from "@/components/stars-background"
import { FloatingVideoCallButton } from "@/components/floating-video-call-button"
import { useSession } from "@/lib/hooks/useSession"

export default function HomePage() {
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [pendingQuestion, setPendingQuestion] = useState("")
  const router = useRouter()
  const { sessionData, isLoading, createSession, isSessionValid } = useSession()

  // Si hay una sesión válida, redirigir directamente a la sesión
  useEffect(() => {
    if (!isLoading && isSessionValid()) {
      router.push("/session")
    }
  }, [isLoading, isSessionValid, router])

  // Cargar pregunta pendiente al montar el componente
  useEffect(() => {
    const savedQuestion = localStorage.getItem("pendingQuestion")
    if (savedQuestion) {
      setPendingQuestion(savedQuestion)
    }
  }, [])

  const handleQuestionSubmit = (question: string) => {
    // Guardar la pregunta en localStorage
    localStorage.setItem("pendingQuestion", question.trim())
    
    // Solo mostrar modal de email si no hay sesión válida
    if (!isSessionValid()) {
      setShowEmailModal(true)
    } else {
      // Si hay sesión válida, redirigir directamente a la sesión
      router.push("/session")
    }
  }

  const handleEmailSuccess = (email: string) => {
    setUserEmail(email)
    setShowEmailModal(false)
    setShowOTPModal(true)
  }

  const handleOTPSuccess = (email: string, name?: string) => {
    // Crear sesión después del OTP exitoso
    createSession(email, name, true)
    setShowOTPModal(false)
    // Limpiar pregunta pendiente ya que se va a procesar
    localStorage.removeItem("pendingQuestion")
    setPendingQuestion("")
    // Redirigir a la sesión
    router.push("/session")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      <StarsBackground animated={true} />
      
      <IntakeForm
        onSubmit={handleQuestionSubmit}
        isLoading={false}
        initialQuestion={pendingQuestion}
        sessionCard={sessionData && isSessionValid() ? <SessionCard /> : null}
      />
      
      <FloatingVideoCallButton currentStep="home" />

      {/* Modales */}
      <EmailModal 
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSuccess={handleEmailSuccess}
      />
      
      <OTPModal 
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onSuccess={handleOTPSuccess}
        email={userEmail}
      />
    </div>
  )
}