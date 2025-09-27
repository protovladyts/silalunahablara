"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { getCardColor, getCardSymbol, getCardTextColor, getCardDisplayName, getCardImageUrl, hasCardImage } from "@/lib/tarot-cards-config"

interface TarotCardProps {
  name: string
  isRevealed: boolean
  onFlip: () => void
  delay?: number
  cardState?: "hidden" | "face-down" | "face-up"
  isReversed?: boolean
}

export function TarotCard({
  name,
  isRevealed,
  onFlip,
  delay = 0,
  cardState = "hidden",
  isReversed = false,
}: TarotCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Obtener el color y símbolo únicos de la carta
  const cardColor = getCardColor(name)
  const cardSymbol = getCardSymbol(name)
  const cardTextColor = getCardTextColor(name)
  
  // Obtener la URL de la imagen si está disponible
  const cardImageUrl = getCardImageUrl(name)
  const hasImage = hasCardImage(name)
  
  // Determinar si es un arcano mayor para aplicar la fuente apropiada
  const isMajorArcana = name.includes("El ") || name.includes("La ") || name.includes("Los ")
  const fontClass = isMajorArcana ? "tarot-card-font-major" : "tarot-card-font"
  

  // Si la carta está oculta, no renderizarla
  if (cardState === "hidden") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0, scale: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="w-24 h-36"
      />
    )
  }

  const shouldShowFront = isRevealed || cardState === "face-up"

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateZ: -5 }}
      animate={{
        opacity: 1,
        y: 0,
        rotateZ: isHovered ? 0 : -2 + Math.random() * 4,
      }}
      transition={{
        delay,
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      className="perspective-1000"
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div
        className="relative w-24 h-36 cursor-pointer"
        animate={{
          rotateY: shouldShowFront ? 180 : 0,
          rotateZ: isReversed ? 180 : 0, // Rotar verticalmente si está invertida
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{
          rotateY: { duration: 0.8, type: "spring", stiffness: 80 },
          rotateZ: { duration: 0.8, type: "spring", stiffness: 80 },
          scale: { duration: 0.2 },
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onFlip}
        whileTap={{ scale: 0.95 }}
        role="button"
        tabIndex={0}
        aria-label={
          shouldShowFront
            ? `Carta revelada: ${name}${isReversed ? " (invertida)" : ""}`
            : "Carta oculta, presiona para revelar"
        }
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onFlip()
          }
        }}
        style={{
          transformStyle: "preserve-3d",
          filter: isHovered
            ? "drop-shadow(0 10px 20px rgba(139, 92, 246, 0.3))"
            : "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
        }}
      >
        {/* Mostrar solo el lado correspondiente basado en si está revelada o no */}
        {!shouldShowFront ? (
          /* Dorso de la carta usando imagen dorso.png */
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            <img 
              src="/tarot-cards/dorso.png" 
              alt="Dorso de carta de tarot" 
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                // Fallback al diseño original si la imagen del dorso falla
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = `
                    <div class="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 flex flex-col items-center justify-center overflow-hidden rounded-lg">
                      <div class="absolute inset-0 opacity-20">
                        <div class="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_rgba(139,92,246,0.3)_0%,_transparent_50%)]"></div>
                        <div class="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,_rgba(168,85,247,0.3)_0%,_transparent_50%)]"></div>
                      </div>
                      <div class="text-4xl mb-2 relative z-10">🌙</div>
                      <div class="text-[10px] font-bold text-violet-200 text-center leading-tight relative z-10">
                        SILA LUNA<br/>HABLARA
                      </div>
                    </div>
                  `
                }
              }}
            />
          </div>
        ) : (
          /* Reverso de la carta (con nombre y símbolo únicos) */
          <div 
            className="absolute inset-0 p-2 flex flex-col items-center justify-center text-center rounded-lg overflow-hidden"
            style={{
              transform: "rotateY(180deg)", // Compensar la rotación del contenedor padre
              transformOrigin: "center center",
              ...(cardColor.startsWith('background:') ? { background: cardColor.replace('background: ', '') } : {})
            }}
          >
            {hasImage && cardImageUrl ? (
              /* Usar imagen de la carta si está disponible */
              <img 
                src={cardImageUrl} 
                alt={name} 
                className="absolute inset-0 w-full h-full object-cover rounded"
                onError={(e) => {
                  // Fallback a emoji si la imagen falla
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = `
                      <div class="text-3xl mb-2 transition-transform duration-300">${cardSymbol}</div>
                      <p class="text-xs font-bold leading-tight mb-1 ${cardTextColor} ${fontClass}">${getCardDisplayName(name)}</p>
                    `
                  }
                }}
              />
            ) : (
              /* Fallback a emoji y texto si no hay imagen */
              <>
                {/* Card symbol único */}
                <div className="text-3xl mb-2 transition-transform duration-300">
                  {cardSymbol}
                </div>

                {/* Card name */}
                <p className={`text-xs font-bold leading-tight mb-1 ${cardTextColor} ${fontClass}`}>{getCardDisplayName(name)}</p>
              </>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
