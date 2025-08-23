"use client"

import type React from "react"

import { useState } from "react"
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim()) {
      onSubmit(question.trim())
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
            <Textarea
              placeholder="Ej: ¿Cómo encarar este cambio de laburo?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="bg-input border-border text-foreground min-h-[100px] resize-none"
              disabled={isLoading}
              maxLength={200}
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading || !question.trim()}
              >
                {isLoading ? "Preparando..." : "Seguir a la tirada"}
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
        </CardContent>
      </Card>
    </div>
  )
}
