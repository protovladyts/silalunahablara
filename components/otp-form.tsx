"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface OtpFormProps {
  email: string
  onSubmit: (code: string) => void
  onResend: () => void
  isLoading?: boolean
}

export function OtpForm({ email, onSubmit, onResend, isLoading = false }: OtpFormProps) {
  const [code, setCode] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim()) {
      onSubmit(code.trim())
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center space-y-4">
          <div className="text-6xl">📧</div>
          <CardTitle className="text-2xl font-bold text-card-foreground">Verificación</CardTitle>
          <CardDescription className="text-muted-foreground">
            Te mandamos un código a <strong>{email}</strong>. Ponelo acá y seguimos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              className="bg-input border-border text-foreground text-center text-2xl tracking-widest"
              disabled={isLoading}
              maxLength={6}
            />
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? "Verificando..." : "Continuar"}
            </Button>
          </form>
          <Button
            variant="ghost"
            onClick={onResend}
            className="w-full text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            Reenviar código
          </Button>
          
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
