"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic } from "lucide-react"

interface IntakeFormProps {
  onSubmit: (question: string) => void
  isLoading?: boolean
}

export function IntakeForm({ onSubmit, isLoading = false }: IntakeFormProps) {
  const [question, setQuestion] = useState("")
  const [validationError, setValidationError] = useState("")
  const [isValidating, setIsValidating] = useState(false)

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
    // Limpiar error de validación cuando el usuario empiece a escribir
    if (validationError) {
      setValidationError("")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center space-y-4">
          <div className="text-6xl">🔮</div>
          <CardTitle className="text-2xl font-bold text-card-foreground">Tu consulta</CardTitle>
          <CardDescription className="text-muted-foreground">
            ¿Qué querés preguntar? Escribí breve y al punto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                type="submit"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading || isValidating || !question.trim()}
              >
                {isLoading ? "Preparando..." : isValidating ? "Validando..." : "Seguir a la tirada"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled
                className="border-border text-muted-foreground bg-transparent"
                title="Función de voz próximamente"
              >
                <Mic className="h-4 w-4" />
                <span className="sr-only">Hablar (próximamente)</span>
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
      </Card>
    </div>
  )
}
