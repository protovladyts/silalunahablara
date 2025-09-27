"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

interface OTPModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (email: string, name?: string) => void
  email: string
}

export function OTPModal({ isOpen, onClose, onSuccess, email }: OTPModalProps) {
  const [otpCode, setOtpCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isResending, setIsResending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpCode.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: otpCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Código incorrecto. Probá de nuevo.")
        return
      }

      sessionStorage.setItem("userVerified", "true")
      console.log("[v0] User verified successfully, now validating question")

      // Obtener la pregunta pendiente
      const pendingQuestion = localStorage.getItem("pendingQuestion")
      if (!pendingQuestion) {
        console.log("[v0] No pending question found")
        setError("No se encontró la pregunta. Volvé a intentar.")
        return
      }

      // Validar la pregunta
      console.log("[v0] Validating pending question:", pendingQuestion)
      const validationResponse = await fetch("/api/session/validate-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: pendingQuestion }),
      })

      const validationData = await validationResponse.json()

      if (!validationResponse.ok || !validationData.isValid) {
        console.log("[v0] Question validation failed:", validationData.reason)
        setError(validationData.reason || "La pregunta no es válida. Probá con otra pregunta.")
        // Limpiar la pregunta pendiente para que el usuario pueda volver a intentar
        localStorage.removeItem("pendingQuestion")
        return
      }

      console.log("[v0] Question validated successfully, proceeding to session")
      
      // Limpiar la pregunta pendiente
      localStorage.removeItem("pendingQuestion")
      
      // Guardar la pregunta válida para la sesión
      localStorage.setItem("validatedQuestion", pendingQuestion)
      
      // Cerrar modal y continuar con los datos del usuario
      onSuccess(data.user.email, data.user.name)
    } catch (error) {
      console.error("[v0] Error verifying OTP:", error)
      setError("Se cortó. Intentá otra vez.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    setError("")

    try {
      const response = await fetch("/api/otp/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Código reenviado")
      } else {
        setError(data.error || "Se cortó. Intentá otra vez.")
      }
    } catch (error) {
      console.error("[v0] Error resending OTP:", error)
      setError("Se cortó. Intentá otra vez.")
    } finally {
      setIsResending(false)
    }
  }

  const handleClose = () => {
    setOtpCode("")
    setError("")
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-card border-border">
              <CardHeader className="text-center space-y-4">
                <div className="flex justify-between items-start">
                  <div className="text-4xl">🔐</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <CardTitle className="text-xl text-card-foreground">Verificación</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Ingresá el código que enviamos a {email}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Código de 6 dígitos"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="text-center text-lg tracking-widest"
                      maxLength={6}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  {error && (
                    <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={isLoading || !otpCode.trim()}
                    >
                      {isLoading ? "Verificando..." : "Verificar código"}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResend}
                      disabled={isResending}
                      className="w-full"
                    >
                      {isResending ? "Reenviando..." : "Reenviar código"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
