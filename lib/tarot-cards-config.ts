// Configuración de colores y símbolos para las cartas de tarot
export interface TarotCardConfig {
  name: string
  suit: "cups" | "coins" | "wands" | "swords" | "major"
  color: string
  symbol: string
  description: string
}

export const TAROT_CARDS_CONFIG: TarotCardConfig[] = [
  // PALO DE COPAS (Cobrizo)
  { name: "As de Copas", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", symbol: "🏺", description: "Cáliz sagrado" },
  { name: "Dos de Copas", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", symbol: "🏺", description: "Dos corazones unidos" },
  { name: "Tres de Copas", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", symbol: "🏺", description: "Celebración" },
  { name: "Cuatro de Copas", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", symbol: "🏺", description: "Meditación" },
  { name: "Cinco de Copas", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", symbol: "🏺", description: "Pérdida" },
  { name: "Seis de Copas", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", symbol: "🏺", description: "Nostalgia" },
  { name: "Siete de Copas", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", symbol: "🏺", description: "Opciones" },
  { name: "Ocho de Copas", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", symbol: "🏺", description: "Partida" },
  { name: "Nueve de Copas", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", symbol: "🏺", description: "Satisfacción" },
  { name: "Diez de Copas", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", symbol: "🏺", description: "Familia" },
  { name: "Paje de Copas", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", symbol: "🧒🏺", description: "Mensajero" },
  { name: "Caballero de Copas", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", symbol: "🐎🏺", description: "Romántico" },
  { name: "Reina de Copas", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", symbol: "👸🏺", description: "Intuición" },
  { name: "Rey de Copas", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", symbol: "🤴🏺", description: "Sabiduría" },

  // PALO DE OROS (Dorado)
  { name: "As de Oros", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", symbol: "🟡", description: "Moneda dorada" },
  { name: "Dos de Oros", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", symbol: "🟡", description: "Equilibrio" },
  { name: "Tres de Oros", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", symbol: "🟡", description: "Construcción" },
  { name: "Cuatro de Oros", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", symbol: "🟡", description: "Ahorro" },
  { name: "Cinco de Oros", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", symbol: "🟡", description: "Pobreza" },
  { name: "Seis de Oros", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", symbol: "🟡", description: "Generosidad" },
  { name: "Siete de Oros", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", symbol: "🟡", description: "Crecimiento" },
  { name: "Ocho de Oros", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", symbol: "🟡", description: "Aprendizaje" },
  { name: "Nueve de Oros", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", symbol: "🟡", description: "Lujo" },
  { name: "Diez de Oros", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", symbol: "🟡", description: "Legado" },
  { name: "Paje de Oros", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", symbol: "🧒🟡", description: "Estudiante" },
  { name: "Caballero de Oros", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", symbol: "🐎🟡", description: "Ambicioso" },
  { name: "Reina de Oros", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", symbol: "👸🟡", description: "Práctica" },
  { name: "Rey de Oros", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", symbol: "🤴🟡", description: "Éxito" },

  // PALO DE BASTOS (Verde)
  { name: "As de Bastos", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", symbol: "🌱", description: "Nuevo comienzo" },
  { name: "Dos de Bastos", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", symbol: "🌱", description: "Planificación" },
  { name: "Tres de Bastos", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", symbol: "🌱", description: "Expansión" },
  { name: "Cuatro de Bastos", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", symbol: "🌱", description: "Fundación" },
  { name: "Cinco de Bastos", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", symbol: "🌱", description: "Conflicto" },
  { name: "Seis de Bastos", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", symbol: "🌱", description: "Victoria" },
  { name: "Siete de Bastos", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", symbol: "🌱", description: "Defensa" },
  { name: "Ocho de Bastos", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", symbol: "🌱", description: "Rapidez" },
  { name: "Nueve de Bastos", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", symbol: "🌱", description: "Preparación" },
  { name: "Diez de Bastos", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", symbol: "🌱", description: "Carga" },
  { name: "Paje de Bastos", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", symbol: "🧒🌱", description: "Explorador" },
  { name: "Caballero de Bastos", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", symbol: "🐎🌱", description: "Aventurero" },
  { name: "Reina de Bastos", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", symbol: "👸🌱", description: "Independiente" },
  { name: "Rey de Bastos", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", symbol: "🤴🌱", description: "Líder" },

  // PALO DE ESPADAS (Azul acero)
  { name: "As de Espadas", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", symbol: "⚔️", description: "Claridad mental" },
  { name: "Dos de Espadas", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", symbol: "⚔️", description: "Decisión" },
  { name: "Tres de Espadas", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", symbol: "⚔️", description: "Dolor" },
  { name: "Cuatro de Espadas", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", symbol: "⚔️", description: "Descanso" },
  { name: "Cinco de Espadas", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", symbol: "⚔️", description: "Derrota" },
  { name: "Seis de Espadas", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", symbol: "⚔️", description: "Transición" },
  { name: "Siete de Espadas", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", symbol: "⚔️", description: "Engaño" },
  { name: "Ocho de Espadas", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", symbol: "⚔️", description: "Atrapado" },
  { name: "Nueve de Espadas", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", symbol: "⚔️", description: "Ansiedad" },
  { name: "Diez de Espadas", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", symbol: "⚔️", description: "Final" },
  { name: "Paje de Espadas", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", symbol: "🧒⚔️", description: "Mensajero" },
  { name: "Caballero de Espadas", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", symbol: "🐎⚔️", description: "Acción" },
  { name: "Reina de Espadas", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", symbol: "👸⚔️", description: "Intelecto" },
  { name: "Rey de Espadas", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", symbol: "🤴⚔️", description: "Autoridad" },

  // ARCANOS MAYORES (Colores únicos por carta)
  { name: "El Loco", suit: "major", color: "background: linear-gradient(to bottom right, #fbbf24, #fb923c)", symbol: "🤪", description: "Inocencia" },
  { name: "El Mago", suit: "major", color: "background: linear-gradient(to bottom right, #9333ea, #4f46e5)", symbol: "🔮", description: "Manifestación" },
  { name: "La Sacerdotisa", suit: "major", color: "background: linear-gradient(to bottom right, #1e40af, #3730a3)", symbol: "🌙", description: "Intuición" },
  { name: "La Emperatriz", suit: "major", color: "background: linear-gradient(to bottom right, #ec4899, #f43f5e)", symbol: "👸", description: "Fertilidad" },
  { name: "El Emperador", suit: "major", color: "background: linear-gradient(to bottom right, #b91c1c, #be123c)", symbol: "👑", description: "Autoridad" },
  { name: "El Hierofante", suit: "major", color: "background: linear-gradient(to bottom right, #7c3aed, #7c2d12)", symbol: "⛪", description: "Tradición" },
  { name: "Los Enamorados", suit: "major", color: "background: linear-gradient(to bottom right, #f472b6, #f87171)", symbol: "💕", description: "Amor" },
  { name: "El Carro", suit: "major", color: "background: linear-gradient(to bottom right, #2563eb, #0891b2)", symbol: "🏎️", description: "Victoria" },
  { name: "La Fuerza", suit: "major", color: "background: linear-gradient(to bottom right, #f97316, #ef4444)", symbol: "🦁", description: "Coraje" },
  { name: "El Ermitaño", suit: "major", color: "background: linear-gradient(to bottom right, #4b5563, #475569)", symbol: "🧙", description: "Sabiduría" },
  { name: "La Rueda de la Fortuna", suit: "major", color: "background: linear-gradient(to bottom right, #eab308, #f97316)", symbol: "🎡", description: "Cambio" },
  { name: "La Justicia", suit: "major", color: "background: linear-gradient(to bottom right, #22c55e, #10b981)", symbol: "⚖️", description: "Equilibrio" },
  { name: "El Colgado", suit: "major", color: "background: linear-gradient(to bottom right, #3b82f6, #6366f1)", symbol: "🦅", description: "Sacrificio" },
  { name: "La Muerte", suit: "major", color: "background: linear-gradient(to bottom right, #1f2937, #000000)", symbol: "💀", description: "Transformación" },
  { name: "La Templanza", suit: "major", color: "background: linear-gradient(to bottom right, #60a5fa, #22d3ee)", symbol: "🍶", description: "Moderación" },
  { name: "El Diablo", suit: "major", color: "background: linear-gradient(to bottom right, #991b1b, #000000)", symbol: "👹", description: "Tentación" },
  { name: "La Torre", suit: "major", color: "background: linear-gradient(to bottom right, #ea580c, #dc2626)", symbol: "🗼", description: "Destrucción" },
  { name: "La Estrella", suit: "major", color: "background: linear-gradient(to bottom right, #93c5fd, #67e8f9)", symbol: "⭐", description: "Esperanza" },
  { name: "La Luna", suit: "major", color: "background: linear-gradient(to bottom right, #818cf8, #a78bfa)", symbol: "🌙", description: "Ilusión" },
  { name: "El Sol", suit: "major", color: "background: linear-gradient(to bottom right, #fde047, #fdba74)", symbol: "☀️", description: "Alegría" },
  { name: "El Juicio", suit: "major", color: "background: linear-gradient(to bottom right, #ffffff, #e5e7eb)", symbol: "👼", description: "Renacimiento" },
  { name: "El Mundo", suit: "major", color: "background: linear-gradient(to bottom right, #4ade80, #34d399)", symbol: "🌍", description: "Completitud" }
]

// Función para obtener la configuración de una carta por nombre
export function getTarotCardConfig(cardName: string): TarotCardConfig | undefined {
  const config = TAROT_CARDS_CONFIG.find(card => card.name === cardName)
  if (!config) {
    console.warn(`⚠️ Carta no encontrada: "${cardName}"`)
    console.log("Cartas disponibles:", TAROT_CARDS_CONFIG.map(card => card.name))
  }
  return config
}

// Función para obtener el color de una carta
export function getCardColor(cardName: string): string {
  const config = getTarotCardConfig(cardName)
  return config ? config.color : "from-slate-700 to-slate-600" // Color por defecto
}

// Función para obtener el símbolo de una carta
export function getCardSymbol(cardName: string): string {
  const config = getTarotCardConfig(cardName)
  return config ? config.symbol : "✨" // Símbolo por defecto
}

// Función para obtener la descripción de una carta
export function getCardDescription(cardName: string): string {
  const config = getTarotCardConfig(cardName)
  return config ? config.description : "Carta de tarot" // Descripción por defecto
}

// Función de test para verificar que todas las cartas se encuentran correctamente
export function testAllCards(): void {
  console.log("=== TESTING ALL TAROT CARDS ===")
  
  const major = TAROT_CARDS_CONFIG.filter(card => card.suit === "major")
  const cups = TAROT_CARDS_CONFIG.filter(card => card.suit === "cups")
  const coins = TAROT_CARDS_CONFIG.filter(card => card.suit === "coins")
  const wands = TAROT_CARDS_CONFIG.filter(card => card.suit === "wands")
  const swords = TAROT_CARDS_CONFIG.filter(card => card.suit === "swords")
  
  console.log(`Arcanos Mayores: ${major.length}/22 cartas`)
  console.log(`Palo de Copas: ${cups.length}/14 cartas`)
  console.log(`Palo de Oros: ${coins.length}/14 cartas`)
  console.log(`Palo de Bastos: ${wands.length}/14 cartas`)
  console.log(`Palo de Espadas: ${swords.length}/14 cartas`)
  console.log(`Total: ${TAROT_CARDS_CONFIG.length}/78 cartas`)
  
  // Test de búsqueda por nombre
  const testCards = ["El Mago", "La Rueda de la Fortuna", "El Loco"]
  testCards.forEach(name => {
    const config = getTarotCardConfig(name)
    if (config) {
      console.log(`✅ "${name}" encontrada: color="${config.color}", symbol="${config.symbol}"`)
    } else {
      console.log(`❌ "${name}" NO encontrada`)
    }
  })
}
