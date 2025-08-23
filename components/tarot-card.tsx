"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

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
  cardState = "face-down",
  isReversed = false,
}: TarotCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (cardState === "hidden") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0, scale: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="w-20 h-28 md:w-24 md:h-36"
      />
    )
  }

  const shouldShowFront = isRevealed || cardState === "face-up"

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateZ: -5 + Math.random() * 10 }}
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
        className="relative w-20 h-28 md:w-24 md:h-36 cursor-pointer"
        animate={{
          rotateY: shouldShowFront ? 180 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{
          rotateY: { duration: 0.8, type: "spring", stiffness: 80 },
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
        <Card
          className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 border-2 border-violet-400/30 flex flex-col items-center justify-center overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Geometric pattern background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_rgba(139,92,246,0.3)_0%,_transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,_rgba(168,85,247,0.3)_0%,_transparent_50%)]" />
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="geometric" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <polygon
                    points="10,0 20,10 10,20 0,10"
                    fill="rgba(139,92,246,0.1)"
                    stroke="rgba(139,92,246,0.2)"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#geometric)" />
            </svg>
          </div>

          {/* Central moon symbol */}
          <div className="text-3xl md:text-4xl mb-2 relative z-10">🌙</div>

          {/* Brand name */}
          <div className="text-[8px] md:text-[10px] font-bold text-violet-200 text-center leading-tight relative z-10">
            SILA LUNA
            <br />
            HABLARA
          </div>

          {/* Decorative elements */}
          <div className="absolute top-2 left-2 w-2 h-2 border border-violet-400/50 rotate-45" />
          <div className="absolute top-2 right-2 w-2 h-2 border border-violet-400/50 rotate-45" />
          <div className="absolute bottom-2 left-2 w-2 h-2 border border-violet-400/50 rotate-45" />
          <div className="absolute bottom-2 right-2 w-2 h-2 border border-violet-400/50 rotate-45" />
        </Card>

        <Card
          className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-violet-400/50 p-2 flex flex-col items-center justify-center text-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            transformOrigin: "center",
          }}
        >
          {/* Card symbol */}
          <div
            className={`text-2xl md:text-3xl mb-2 transition-transform duration-300 ${isReversed ? "rotate-180" : ""}`}
          >
            ✨
          </div>

          {/* Card name */}
          <p className="text-[10px] md:text-xs font-bold text-violet-100 leading-tight mb-1">{name}</p>

          {/* Reversed indicator */}
          {isReversed && <p className="text-[8px] md:text-[10px] text-violet-300 font-medium">(invertida)</p>}

          {/* Decorative border */}
          <div className="absolute inset-1 border border-violet-400/30 rounded pointer-events-none" />
        </Card>
      </motion.div>
    </motion.div>
  )
}
