"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ProgressIndicator } from "@/components/progress-indicator"

interface ReaskFormProps {
  onSubmit: (question: string) => void
  isLoading?: boolean
  hasUsedFreeReading: boolean
}

export function ReaskForm({ onSubmit, isLoading = false, hasUsedFreeReading }: ReaskFormProps) {
  const [question, setQuestion] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim()) {
      onSubmit(question.trim())
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ProgressIndicator currentStep="intake" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-card border-border">
          <CardHeader className="text-center space-y-3">
            <div className="text-4xl">🔄</div>
            <CardTitle className="text-xl text-card-foreground">¿Qué te gustaría aclarar?</CardTitle>
            <p className="text-sm text-muted-foreground">
              {hasUsedFreeReading ? "Ya usaste tu consulta gratuita" : "Esta es tu consulta gratuita"}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="Ej: ¿Y si no me animo a dar ese paso?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                className="bg-input border-border text-foreground min-h-[80px] resize-none"
                disabled={isLoading}
                maxLength={150}
              />
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading || !question.trim()}
              >
                {isLoading ? "Preparando..." : "Nueva tirada"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">{question.length}/150 caracteres</p>
            </form>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    </div>
  )
}
