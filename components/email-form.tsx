"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface EmailFormProps {
  onSubmit: (email: string) => void
  isLoading?: boolean
}

export function EmailForm({ onSubmit, isLoading = false }: EmailFormProps) {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      onSubmit(email.trim())
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center space-y-4">
          <div className="text-6xl">🌙</div>
          <CardTitle className="title-rose-garden text-card-foreground">Si la Luna Hablara</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sesión de tarot gratis. Dejá tu mail y arrancamos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-input border-border text-foreground"
              disabled={isLoading}
            />
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? "Enviando..." : "Comenzar sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
