"use client"

import { TarotCard } from "@/components/tarot-card"

export default function TestElLoco() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-4">
      <div className="space-y-8">
        <h1 className="text-2xl text-white text-center">Test: El Loco con imagen PNG</h1>
        
        <div className="flex space-x-4 justify-center">
          {/* El Loco normal */}
          <TarotCard
            name="El Loco"
            isRevealed={true}
            onFlip={() => {}}
            cardState="face-up"
            isReversed={false}
          />
          
          {/* El Loco invertido */}
          <TarotCard
            name="El Loco"
            isRevealed={true}
            onFlip={() => {}}
            cardState="face-up"
            isReversed={true}
          />
          
          {/* Otra carta para comparar */}
          <TarotCard
            name="El Mago"
            isRevealed={true}
            onFlip={() => {}}
            cardState="face-up"
            isReversed={false}
          />
        </div>
        
        <div className="text-center text-white">
          <p>Izquierda: El Loco normal</p>
          <p>Centro: El Loco invertido</p>
          <p>Derecha: El Mago (para comparar)</p>
        </div>
      </div>
    </div>
  )
}


