"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface UpsellProps {
  userEmail?: string
}

export function Upsell({ userEmail }: UpsellProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="bg-card border-border">
          <CardHeader className="text-center space-y-4">
            <div className="text-6xl">🌟</div>
            <CardTitle className="text-2xl text-card-foreground">
              ¿Querés seguir con una lectura más profunda?
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {userEmail && <div className="text-sm mb-2 opacity-75">Email detectado: {userEmail}</div>}
              Explorá más aspectos de tu consulta con opciones personalizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <a href="https://pay.example.com/silalunahablara/1usd" target="_blank" rel="noopener noreferrer">
                Pagar 1 USD y seguir
              </a>
            </Button>
            <Button
              variant="outline"
              className="w-full border-border text-foreground hover:bg-accent bg-transparent"
              asChild
            >
              <a href="https://calendly.com/silalunahablara/30min" target="_blank" rel="noopener noreferrer">
                Agendar videollamada
              </a>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
