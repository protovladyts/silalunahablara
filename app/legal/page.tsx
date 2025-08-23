import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { StarsBackground } from "@/components/stars-background"

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden p-4">
      <StarsBackground animated={true} />
      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-card-foreground">Términos y Condiciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-card-foreground">
            <p>Bienvenido a Si la Luna Hablara. Al usar nuestro servicio, aceptás los siguientes términos:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Este es un servicio de entretenimiento únicamente</li>
              <li>Las lecturas de tarot no constituyen asesoramiento profesional</li>
              <li>No nos hacemos responsables por decisiones tomadas basadas en las lecturas</li>
              <li>Respetamos tu privacidad y no compartimos tu información personal</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-card-foreground">Política de Privacidad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-card-foreground">
            <p>Tu privacidad es importante para nosotros:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Solo recopilamos tu email para enviarte el código de verificación</li>
              <li>No vendemos ni compartimos tu información con terceros</li>
              <li>Podés solicitar la eliminación de tus datos en cualquier momento</li>
              <li>Usamos cookies solo para mejorar tu experiencia de usuario</li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button asChild variant="outline" className="border-border text-foreground bg-transparent">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
