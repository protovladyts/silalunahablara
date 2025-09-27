"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, MicOff, Volume2, Info } from "lucide-react"
import { ProgressIndicator } from "@/components/progress-indicator"
import { useSpeechToText } from "@/lib/hooks/useSpeechToText"
import { VoiceFeatureInfo } from "@/components/voice-feature-info"

interface IntakeFormProps {
  onSubmit: (question: string) => void
  isLoading?: boolean
  initialQuestion?: string
  sessionCard?: React.ReactNode
}

export function IntakeForm({
  onSubmit,
  isLoading = false,
  initialQuestion = "",
  sessionCard = null,
}: IntakeFormProps) {
  const [question, setQuestion] = useState(initialQuestion)
  const [validationError, setValidationError] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [speechError, setSpeechError] = useState<string | null>(null)
  const [showVoiceInfo, setShowVoiceInfo] = useState(false)

  // Hook de speech-to-text
  const {
    isListening,
    isSupported,
    transcript,
    error: speechRecognitionError,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechToText({
    language: 'es-ES',
    continuous: false,
    interimResults: true,
    onResult: (text) => {
      // Actualizar la pregunta con el texto reconocido
      setQuestion(text)
      setSpeechError(null)
    },
    onError: (error) => {
      setSpeechError(error)
    }
  })

  // Actualizar el estado cuando cambie la pregunta inicial
  useEffect(() => {
    if (initialQuestion) {
      setQuestion(initialQuestion)
    }
  }, [initialQuestion])

  // Limpiar errores cuando el usuario empiece a escribir
  useEffect(() => {
    if (question && (validationError || speechError)) {
      setValidationError("")
      setSpeechError(null)
    }
  }, [question, validationError, speechError])

  const handleProceedToOTP = () => {
    if (!question.trim()) {
      setValidationError("Por favor, escribí tu pregunta antes de continuar")
      return
    }
    
    // Usar la función onSubmit que viene como prop
    onSubmit(question.trim())
  }

  const validateQuestion = async (questionText: string) => {
    if (!questionText.trim()) return false

    setIsValidating(true)
    setValidationError("")

    try {
      const response = await fetch("/api/session/validate-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: questionText.trim() }),
      })

      if (!response.ok) {
        throw new Error("Error validando la pregunta")
      }

      const data = await response.json()
      
      if (!data.isValid) {
        setValidationError(data.reason)
        return false
      }

      return true
    } catch (error) {
      console.error("Error validating question:", error)
      // Si falla la validación, permitir continuar
      return true
    } finally {
      setIsValidating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!question.trim()) return

    const isValid = await validateQuestion(question.trim())
    
    if (isValid) {
      console.log("[v0] IntakeForm - Question validated, submitting:", question.trim())
      onSubmit(question.trim())
    }
  }

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value)
    // Limpiar errores cuando el usuario empiece a escribir
    if (validationError) {
      setValidationError("")
    }
    if (speechError) {
      setSpeechError(null)
    }
  }

  const handleSpeechToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      resetTranscript()
      startListening()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ProgressIndicator currentStep="intake" />
        <Card className="bg-card border-border">
        <CardHeader className="text-center space-y-4">
          <div className="text-6xl">🔮</div>
          <CardTitle className="text-2xl font-bold text-card-foreground">Si la Luna Hablara</CardTitle>
          <CardDescription className="text-muted-foreground">
            ¿Qué querés preguntar? Escribí breve y al punto o usá el micrófono.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Ej: ¿Cómo encarar este cambio de laburo?"
                value={question}
                onChange={handleQuestionChange}
                required
                className={`bg-input border-border text-foreground min-h-[100px] resize-none ${
                  validationError ? 'border-red-500 focus:border-red-500' : ''
                }`}
                disabled={isLoading || isValidating}
                maxLength={200}
              />
              {/* Indicador de grabación */}
              {isListening && (
                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-1">
                    <Volume2 className="h-4 w-4 animate-pulse" />
                    <span className="font-medium">Escuchando...</span>
                  </div>
                  <div className="text-xs text-blue-500">
                    Habla claramente hacia el micrófono
                  </div>
                </div>
              )}

              {/* Error de speech-to-text */}
              {speechError && (
                <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
                  <div className="font-medium mb-1">🎤 Error de voz</div>
                  <div>{speechError}</div>
                  <div className="text-xs mt-2 text-red-600 dark:text-red-400">
                    <strong>Consejo:</strong> Verifica que el micrófono esté conectado y que hayas permitido el acceso.
                  </div>
                </div>
              )}

              {/* Error de validación */}
              {validationError && (
                <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
                  <div className="font-medium mb-1">⚠️ Pregunta no válida</div>
                  <div>{validationError}</div>
                  <div className="text-xs mt-2 text-red-600 dark:text-red-400">
                    <strong>Consejo:</strong> Piensa en algo que realmente te preocupe o sobre lo que quieras orientación espiritual.
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleProceedToOTP}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading || isValidating || !question.trim()}
              >
                {isLoading ? "Preparando..." : isValidating ? "Validando..." : "Seguir a la tirada"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSpeechToggle}
                disabled={!isSupported || isLoading || isValidating}
                className={`border-border bg-transparent transition-colors ${
                  isListening 
                    ? 'text-red-600 border-red-300 bg-red-50 hover:bg-red-100' 
                    : isSupported 
                      ? 'text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400' 
                      : 'text-muted-foreground'
                }`}
                title={
                  !isSupported 
                    ? "Tu navegador no soporta reconocimiento de voz" 
                    : isListening 
                      ? "Detener grabación" 
                      : "Comenzar grabación de voz"
                }
              >
                {isListening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {isListening ? "Detener grabación" : "Comenzar grabación de voz"}
                </span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowVoiceInfo(true)}
                className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                title="Información sobre reconocimiento de voz"
              >
                <Info className="h-4 w-4" />
                <span className="sr-only">Información sobre reconocimiento de voz</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">{question.length}/200 caracteres</p>
          </form>
          
          {/* Enlace a Términos y Condiciones */}
          <div className="text-center pt-4">
            <Link 
              href="/tyc" 
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Términos y condiciones legales
            </Link>
          </div>
        </CardContent>
      {sessionCard}
      </Card>
      </div>

      {/* Modal de información de voz */}
      {showVoiceInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="relative">
            <VoiceFeatureInfo 
              isSupported={isSupported}
              onClose={() => setShowVoiceInfo(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
