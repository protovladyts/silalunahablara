"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { Upsell } from "@/components/upsell"

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (email: string) => void
}

export function EmailModal({ isOpen, onClose, onSuccess }: EmailModalProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showUpsell, setShowUpsell] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !name.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/otp/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.log("[EmailModal] Error response:", { status: response.status, errorData })
        
        // Si no tiene créditos gratuitos, mostrar upsell
        if (errorData.error === "NO_FREE_CREDITS") {
          console.log("[EmailModal] User has no free credits, showing upsell")
          setShowUpsell(true)
          return
        }
        
        throw new Error(errorData.message || "Error enviando código")
      }

      localStorage.setItem("userEmail", email.trim())
      localStorage.setItem("userName", name.trim())

      // Cerrar modal y continuar con OTP
      onSuccess(email.trim())
    } catch (error) {
      console.error("Error sending OTP:", error)
      setError("Error enviando código. Intentá de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setEmail("")
    setName("")
    setError("")
    setShowUpsell(false)
    onClose()
  }

  // Si debe mostrar upsell, renderizar el componente Upsell
  if (showUpsell) {
    return (
      <div className="fixed inset-0 z-50">
        <Upsell userEmail={email} sessionCard={<div />} />
      </div>
    )
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
                  <div className="text-4xl">📧</div>
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
                    Ingresá tu email para continuar con la consulta
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Tu nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  {error && (
                    <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isLoading || !email.trim() || !name.trim()}
                  >
                    {isLoading ? "Enviando código..." : "Enviar código de verificación"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
