"use client"

import { motion } from "framer-motion"

// Configuración de estrellas
const STARS_CONFIG = {
  // Tipo de estrellas
  type: {
    small: { size: 'w-1 h-1', count: 8 },
    medium: { size: 'w-1.5 h-1.5', count: 4 },
    bright: { size: 'w-2 h-2', count: 2 },
    slow: { size: 'w-1 h-1', count: 3 }
  },
  // Densidad (cantidad de estrellas por área)
  density: {
    mobile: { multiplier: 1.0 },
    desktop: { multiplier: 1.0 }
  },
  // Distribución (posiciones y colores)
  distribution: {
    colors: ['bg-white', 'bg-violet-300', 'bg-blue-300', 'bg-violet-200', 'bg-blue-200', 'bg-yellow-200', 'bg-yellow-100'],
    positions: [
      { top: '15%', left: '20%' }, { top: '25%', left: '80%' }, { top: '35%', left: '10%' },
      { top: '45%', left: '90%' }, { top: '55%', left: '5%' }, { top: '65%', left: '85%' },
      { top: '75%', left: '15%' }, { top: '85%', left: '75%' }, { top: '20%', left: '50%' },
      { top: '40%', left: '30%' }, { top: '60%', left: '70%' }, { top: '80%', left: '40%' },
      { top: '30%', left: '60%' }, { top: '70%', left: '25%' }, { top: '10%', left: '70%' },
      { top: '50%', left: '95%' }, { top: '90%', left: '60%' }
    ]
  }
}

interface StarsBackgroundProps {
  animated?: boolean
  className?: string
}

export function StarsBackground({ animated = true, className = "" }: StarsBackgroundProps) {
  // Detectar si es mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  if (animated) {
    return (
      <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ zIndex: -1 }}>
        {/* Estrellas pequeñas */}
        {Array.from({ length: Math.floor(STARS_CONFIG.type.small.count * STARS_CONFIG.density[isMobile ? 'mobile' : 'desktop'].multiplier) }).map((_, i) => (
          <motion.div 
            key={`small-${i}`}
            className={`absolute ${STARS_CONFIG.type.small.size} ${STARS_CONFIG.distribution.colors[i % STARS_CONFIG.distribution.colors.length]} rounded-full opacity-60`}
            style={STARS_CONFIG.distribution.positions[i % STARS_CONFIG.distribution.positions.length]}
            animate={{ opacity: [0.6, 0.3, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
        
        {/* Estrellas medianas */}
        {Array.from({ length: Math.floor(STARS_CONFIG.type.medium.count * STARS_CONFIG.density[isMobile ? 'mobile' : 'desktop'].multiplier) }).map((_, i) => (
          <motion.div 
            key={`medium-${i}`}
            className={`absolute ${STARS_CONFIG.type.medium.size} ${STARS_CONFIG.distribution.colors[(i + 2) % STARS_CONFIG.distribution.colors.length]} rounded-full opacity-70`}
            style={STARS_CONFIG.distribution.positions[(i + 8) % STARS_CONFIG.distribution.positions.length]}
            animate={{ opacity: [0.7, 0.4, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
        
        {/* Estrellas brillantes especiales */}
        {Array.from({ length: Math.floor(STARS_CONFIG.type.bright.count * STARS_CONFIG.density[isMobile ? 'mobile' : 'desktop'].multiplier) }).map((_, i) => (
          <motion.div 
            key={`bright-${i}`}
            className={`absolute ${STARS_CONFIG.type.bright.size} ${STARS_CONFIG.distribution.colors[(i + 5) % STARS_CONFIG.distribution.colors.length]} rounded-full opacity-85`}
            style={STARS_CONFIG.distribution.positions[(i + 12) % STARS_CONFIG.distribution.positions.length]}
            animate={{ opacity: [0.85, 0.6, 0.85] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
        
        {/* Estrellas que parpadean más lentamente */}
        {Array.from({ length: Math.floor(STARS_CONFIG.type.slow.count * STARS_CONFIG.density[isMobile ? 'mobile' : 'desktop'].multiplier) }).map((_, i) => (
          <motion.div 
            key={`slow-${i}`}
            className={`absolute ${STARS_CONFIG.type.slow.size} ${STARS_CONFIG.distribution.colors[(i + 3) % STARS_CONFIG.distribution.colors.length]} rounded-full opacity-35`}
            style={STARS_CONFIG.distribution.positions[(i + 14) % STARS_CONFIG.distribution.positions.length]}
            animate={{ opacity: [0.35, 0.1, 0.35] }}
            transition={{ duration: 3, repeat: Infinity, delay: 3 + i * 0.5 }}
          />
        ))}
      </div>
    )
  }

  // Estrellas estáticas
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ zIndex: -1 }}>
      {/* Estrellas pequeñas */}
      {Array.from({ length: Math.floor(STARS_CONFIG.type.small.count * STARS_CONFIG.density[isMobile ? 'mobile' : 'desktop'].multiplier) }).map((_, i) => (
        <div 
          key={`static-small-${i}`}
          className={`absolute ${STARS_CONFIG.type.small.size} ${STARS_CONFIG.distribution.colors[i % STARS_CONFIG.distribution.colors.length]} rounded-full opacity-60`}
          style={STARS_CONFIG.distribution.positions[i % STARS_CONFIG.distribution.positions.length]}
        />
      ))}
      
      {/* Estrellas medianas */}
      {Array.from({ length: Math.floor(STARS_CONFIG.type.medium.count * STARS_CONFIG.density[isMobile ? 'mobile' : 'desktop'].multiplier) }).map((_, i) => (
        <div 
          key={`static-medium-${i}`}
          className={`absolute ${STARS_CONFIG.type.medium.size} ${STARS_CONFIG.distribution.colors[(i + 2) % STARS_CONFIG.distribution.colors.length]} rounded-full opacity-70`}
          style={STARS_CONFIG.distribution.positions[(i + 8) % STARS_CONFIG.distribution.positions.length]}
        />
      ))}
      
      {/* Estrellas brillantes especiales */}
      {Array.from({ length: Math.floor(STARS_CONFIG.type.bright.count * STARS_CONFIG.density[isMobile ? 'mobile' : 'desktop'].multiplier) }).map((_, i) => (
        <div 
          key={`static-bright-${i}`}
          className={`absolute ${STARS_CONFIG.type.bright.size} ${STARS_CONFIG.distribution.colors[(i + 5) % STARS_CONFIG.distribution.colors.length]} rounded-full opacity-85`}
          style={STARS_CONFIG.distribution.positions[(i + 12) % STARS_CONFIG.distribution.positions.length]}
        />
      ))}
    </div>
  )
}
