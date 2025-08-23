"use client"

import { StarsBackground } from "@/components/stars-background"
import { FloatingVideoCallButton } from "@/components/floating-video-call-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TarotCard } from "@/components/tarot-card"
import Link from "next/link"
import { TAROT_CARDS_CONFIG, testAllCards } from "@/lib/tarot-cards-config"

export default function DeckPage() {
  // Agrupar cartas por palo
  const cups = TAROT_CARDS_CONFIG.filter(card => card.suit === "cups")
  const coins = TAROT_CARDS_CONFIG.filter(card => card.suit === "coins")
  const wands = TAROT_CARDS_CONFIG.filter(card => card.suit === "wands")
  const swords = TAROT_CARDS_CONFIG.filter(card => card.suit === "swords")
  const major = TAROT_CARDS_CONFIG.filter(card => card.suit === "major")
  
  // Debug: verificar que se están filtrando correctamente
  console.log("Arcanos Mayores encontrados:", major.map(card => card.name))
  console.log("Total de cartas:", TAROT_CARDS_CONFIG.length)
  
  // Ejecutar test completo
  testAllCards()

  const suitNames = {
    cups: "Copas",
    coins: "Oros", 
    wands: "Bastos",
    swords: "Espadas",
    major: "Arcanos Mayores"
  }

  const suitColors = {
    cups: "from-amber-700 to-orange-600",
    coins: "from-yellow-500 to-amber-500",
    wands: "from-green-600 to-emerald-500", 
    swords: "from-slate-600 to-blue-600",
    major: "from-purple-600 to-indigo-600"
  }

  const renderSuitSection = (suit: string, cards: typeof TAROT_CARDS_CONFIG) => (
    <Card key={suit} className="bg-slate-800/80 border-violet-400/30 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-violet-100">
          Palo de {suitNames[suit as keyof typeof suitNames]}
        </CardTitle>
        <CardDescription className="text-violet-300">
          {cards.length} cartas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {cards.map((card, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <TarotCard
                name={card.name}
                isRevealed={true}
                onFlip={() => {}}
                delay={0}
                cardState="face-up"
                isReversed={false}
              />
              <div className="text-center">
                <p className="text-xs text-violet-200 font-medium">{card.name}</p>
                <p className="text-xs text-violet-400">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      <StarsBackground animated={false} />
      
      {/* Header */}
      <div className="relative z-10 pt-8 pb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Mazo Completo del Tarot
        </h1>
        <p className="text-violet-200 text-sm md:text-base">
          Explora todas las cartas y sus significados
        </p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-20 space-y-8">
        {/* Arcanos Mayores */}
        {renderSuitSection("major", major)}
        
        {/* Palo de Copas */}
        {renderSuitSection("cups", cups)}
        
        {/* Palo de Oros */}
        {renderSuitSection("coins", coins)}
        
        {/* Palo de Bastos */}
        {renderSuitSection("wands", wands)}
        
        {/* Palo de Espadas */}
        {renderSuitSection("swords", swords)}

        {/* Información del mazo */}
        <Card className="bg-slate-800/80 border-violet-400/30 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-violet-100">
              Sobre este mazo
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-violet-300">
              <div>
                <div className="font-semibold text-violet-200 mb-2">Arcanos Mayores</div>
                <p>22 cartas que representan arquetipos universales y lecciones de vida importantes</p>
              </div>
              <div>
                <div className="font-semibold text-violet-200 mb-2">Palo de Copas</div>
                <p>14 cartas relacionadas con emociones, amor, relaciones y creatividad</p>
              </div>
              <div>
                <div className="font-semibold text-violet-200 mb-2">Palo de Oros</div>
                <p>14 cartas que representan abundancia, trabajo, finanzas y manifestación material</p>
              </div>
              <div>
                <div className="font-semibold text-violet-200 mb-2">Palo de Bastos</div>
                <p>14 cartas asociadas con pasión, creatividad, acción y crecimiento espiritual</p>
              </div>
              <div>
                <div className="font-semibold text-violet-200 mb-2">Palo de Espadas</div>
                <p>14 cartas que simbolizan intelecto, comunicación, desafíos y claridad mental</p>
              </div>
              <div>
                <div className="font-semibold text-violet-200 mb-2">Total</div>
                <p>78 cartas que forman un sistema completo de sabiduría ancestral</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botón de regreso */}
        <div className="text-center pt-6">
          <Link href="/">
            <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
              ← Volver al inicio
            </Button>
          </Link>
        </div>
      </div>

      {/* Botón flotante de videollamada */}
      <FloatingVideoCallButton currentStep="deck" />
    </div>
  )
}
