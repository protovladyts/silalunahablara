// Configuración de colores y símbolos para las cartas de tarot
export interface TarotCardConfig {
  key: string // Clave única para búsqueda (nombres originales)
  name: string // Nombre de display (lo que se muestra al usuario)
  suit: "cups" | "coins" | "wands" | "swords" | "major"
  color: string
  textColor: string
  symbol: string
  description: string
  imageUrl?: string // URL de la imagen de la carta
}

export const TAROT_CARDS_CONFIG: TarotCardConfig[] = [
  // PALO DE COPAS (Cobrizo)
  { key: "As de Copas", name: "As de Copas", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", textColor: "text-white", symbol: "🏺", description: "Cáliz sagrado" },
  { key: "Dos de Copas", name: "2", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", textColor: "text-white", symbol: "🏺", description: "Dos corazones unidos" },
  { key: "Tres de Copas", name: "3", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", textColor: "text-white", symbol: "🏺", description: "Celebración" },
  { key: "Cuatro de Copas", name: "4", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", textColor: "text-white", symbol: "🏺", description: "Meditación" },
  { key: "Cinco de Copas", name: "5", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", textColor: "text-white", symbol: "🏺", description: "Pérdida" },
  { key: "Seis de Copas", name: "6", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", textColor: "text-white", symbol: "🏺", description: "Nostalgia" },
  { key: "Siete de Copas", name: "7", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", textColor: "text-white", symbol: "🏺", description: "Opciones" },
  { key: "Ocho de Copas", name: "8", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", textColor: "text-white", symbol: "🏺", description: "Partida" },
  { key: "Nueve de Copas", name: "9", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", textColor: "text-white", symbol: "🏺", description: "Satisfacción" },
  { key: "Diez de Copas", name: "10", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", textColor: "text-white", symbol: "🏺", description: "Familia" },
  { key: "Paje de Copas", name: "Paje de Copas", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", textColor: "text-white", symbol: "🧒🏺", description: "Mensajero" },
  { key: "Caballero de Copas", name: "Caballero de Copas", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", textColor: "text-white", symbol: "🐎🏺", description: "Romántico" },
  { key: "Reina de Copas", name: "Reina de Copas", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", textColor: "text-white", symbol: "👸🏺", description: "Intuición" },
  { key: "Rey de Copas", name: "Rey de Copas", suit: "cups", color: "background: linear-gradient(to bottom right, #b45309, #ea580c)", textColor: "text-white", symbol: "🤴🏺", description: "Sabiduría" },

  // PALO DE OROS (Dorado)
  { key: "As de Oros", name: "As de Oros", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", textColor: "text-slate-800", symbol: "🟡", description: "Moneda dorada" },
  { key: "Dos de Oros", name: "2", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", textColor: "text-slate-800", symbol: "🟡", description: "Equilibrio" },
  { key: "Tres de Oros", name: "3", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", textColor: "text-slate-800", symbol: "🟡", description: "Construcción" },
  { key: "Cuatro de Oros", name: "4", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", textColor: "text-slate-800", symbol: "🟡", description: "Ahorro" },
  { key: "Cinco de Oros", name: "5", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", textColor: "text-slate-800", symbol: "🟡", description: "Pobreza" },
  { key: "Seis de Oros", name: "6", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", textColor: "text-slate-800", symbol: "🟡", description: "Generosidad" },
  { key: "Siete de Oros", name: "7", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", textColor: "text-slate-800", symbol: "🟡", description: "Crecimiento" },
  { key: "Ocho de Oros", name: "8", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", textColor: "text-slate-800", symbol: "🟡", description: "Aprendizaje" },
  { key: "Nueve de Oros", name: "9", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", textColor: "text-slate-800", symbol: "🟡", description: "Lujo" },
  { key: "Diez de Oros", name: "10", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", textColor: "text-slate-800", symbol: "🟡", description: "Legado" },
  { key: "Paje de Oros", name: "Paje de Oros", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", textColor: "text-slate-800", symbol: "🧒🟡", description: "Estudiante" },
  { key: "Caballero de Oros", name: "Caballero de Oros", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", textColor: "text-slate-800", symbol: "🐎🟡", description: "Ambicioso" },
  { key: "Reina de Oros", name: "Reina de Oros", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", textColor: "text-slate-800", symbol: "👸🟡", description: "Práctica" },
  { key: "Rey de Oros", name: "Rey de Oros", suit: "coins", color: "background: linear-gradient(to bottom right, #fbbf24, #f59e0b)", textColor: "text-slate-800", symbol: "🤴🟡", description: "Éxito" },

  // PALO DE BASTOS (Verde)
  { key: "As de Bastos", name: "As de Bastos", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", textColor: "text-slate-800", symbol: "🌱", description: "Nuevo comienzo" },
  { key: "Dos de Bastos", name: "2", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", textColor: "text-slate-800", symbol: "🌱", description: "Planificación" },
  { key: "Tres de Bastos", name: "3", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", textColor: "text-slate-800", symbol: "🌱", description: "Expansión" },
  { key: "Cuatro de Bastos", name: "4", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", textColor: "text-slate-800", symbol: "🌱", description: "Fundación" },
  { key: "Cinco de Bastos", name: "5", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", textColor: "text-slate-800", symbol: "🌱", description: "Conflicto" },
  { key: "Seis de Bastos", name: "6", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", textColor: "text-slate-800", symbol: "🌱", description: "Victoria" },
  { key: "Siete de Bastos", name: "7", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", textColor: "text-slate-800", symbol: "🌱", description: "Defensa" },
  { key: "Ocho de Bastos", name: "8", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", textColor: "text-slate-800", symbol: "🌱", description: "Rapidez" },
  { key: "Nueve de Bastos", name: "9", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", textColor: "text-slate-800", symbol: "🌱", description: "Preparación" },
  { key: "Diez de Bastos", name: "10", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", textColor: "text-slate-800", symbol: "🌱", description: "Carga" },
  { key: "Paje de Bastos", name: "Paje de Bastos", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", textColor: "text-slate-800", symbol: "🧒🌱", description: "Explorador" },
  { key: "Caballero de Bastos", name: "Caballero de Bastos", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", textColor: "text-slate-800", symbol: "🐎🌱", description: "Aventurero" },
  { key: "Reina de Bastos", name: "Reina de Bastos", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", textColor: "text-slate-800", symbol: "👸🌱", description: "Independiente" },
  { key: "Rey de Bastos", name: "Rey de Bastos", suit: "wands", color: "background: linear-gradient(to bottom right, #16a34a, #10b981)", textColor: "text-slate-800", symbol: "🤴🌱", description: "Líder" },

  // PALO DE ESPADAS (Azul acero)
  { key: "As de Espadas", name: "As de Espadas", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", textColor: "text-white", symbol: "⚔️", description: "Claridad mental" },
  { key: "Dos de Espadas", name: "2", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", textColor: "text-white", symbol: "⚔️", description: "Decisión" },
  { key: "Tres de Espadas", name: "3", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", textColor: "text-white", symbol: "⚔️", description: "Dolor" },
  { key: "Cuatro de Espadas", name: "4", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", textColor: "text-white", symbol: "⚔️", description: "Descanso" },
  { key: "Cinco de Espadas", name: "5", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", textColor: "text-white", symbol: "⚔️", description: "Derrota" },
  { key: "Seis de Espadas", name: "6", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", textColor: "text-white", symbol: "⚔️", description: "Transición" },
  { key: "Siete de Espadas", name: "7", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", textColor: "text-white", symbol: "⚔️", description: "Engaño" },
  { key: "Ocho de Espadas", name: "8", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", textColor: "text-white", symbol: "⚔️", description: "Atrapado" },
  { key: "Nueve de Espadas", name: "9", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", textColor: "text-white", symbol: "⚔️", description: "Ansiedad" },
  { key: "Diez de Espadas", name: "10", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", textColor: "text-white", symbol: "⚔️", description: "Final" },
  { key: "Paje de Espadas", name: "Paje de Espadas", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", textColor: "text-white", symbol: "🧒⚔️", description: "Mensajero" },
  { key: "Caballero de Espadas", name: "Caballero de Espadas", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", textColor: "text-white", symbol: "🐎⚔️", description: "Acción" },
  { key: "Reina de Espadas", name: "Reina de Espadas", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", textColor: "text-white", symbol: "👸⚔️", description: "Intelecto" },
  { key: "Rey de Espadas", name: "Rey de Espadas", suit: "swords", color: "background: linear-gradient(to bottom right, #475569, #2563eb)", textColor: "text-white", symbol: "🤴⚔️", description: "Autoridad" },

  // ARCANOS MAYORES (Colores únicos por carta)
  { key: "El Loco", name: "El Loco", suit: "major", color: "background: linear-gradient(to bottom right, #fbbf24, #fb923c)", textColor: "text-white", symbol: "🤪", description: "Inocencia" },
  { key: "El Mago", name: "El Mago", suit: "major", color: "background: linear-gradient(to bottom right, #9333ea, #4f46e5)", textColor: "text-white", symbol: "🔮", description: "Manifestación" },
  { key: "La Sacerdotisa", name: "La Sacerdotisa", suit: "major", color: "background: linear-gradient(to bottom right, #1e40af, #3730a3)", textColor: "text-white", symbol: "🌙", description: "Intuición" },
  { key: "La Emperatriz", name: "La Emperatriz", suit: "major", color: "background: linear-gradient(to bottom right, #ec4899, #f43f5e)", textColor: "text-white", symbol: "👸", description: "Fertilidad" },
  { key: "El Emperador", name: "El Emperador", suit: "major", color: "background: linear-gradient(to bottom right, #b91c1c, #be123c)", textColor: "text-white", symbol: "👑", description: "Autoridad" },
  { key: "El Hierofante", name: "El Hierofante", suit: "major", color: "background: linear-gradient(to bottom right, #7c3aed, #7c2d12)", textColor: "text-white", symbol: "⛪", description: "Tradición" },
  { key: "Los Enamorados", name: "Los Enamorados", suit: "major", color: "background: linear-gradient(to bottom right, #f472b6, #f87171)", textColor: "text-white", symbol: "💕", description: "Amor" },
  { key: "El Carro", name: "El Carro", suit: "major", color: "background: linear-gradient(to bottom right, #2563eb, #0891b2)", textColor: "text-white", symbol: "🏎️", description: "Victoria" },
  { key: "La Fuerza", name: "La Fuerza", suit: "major", color: "background: linear-gradient(to bottom right, #f97316, #ef4444)", textColor: "text-white", symbol: "🦁", description: "Coraje" },
  { key: "El Ermitaño", name: "El Ermitaño", suit: "major", color: "background: linear-gradient(to bottom right, #4b5563, #475569)", textColor: "text-white", symbol: "🧙", description: "Sabiduría" },
  { key: "La Rueda de la Fortuna", name: "La Rueda de la Fortuna", suit: "major", color: "background: linear-gradient(to bottom right, #eab308, #f97316)", textColor: "text-white", symbol: "🎡", description: "Cambio" },
  { key: "La Justicia", name: "La Justicia", suit: "major", color: "background: linear-gradient(to bottom right, #22c55e, #10b981)", textColor: "text-white", symbol: "⚖️", description: "Equilibrio" },
  { key: "El Colgado", name: "El Colgado", suit: "major", color: "background: linear-gradient(to bottom right, #3b82f6, #6366f1)", textColor: "text-white", symbol: "🦅", description: "Sacrificio" },
  { key: "La Muerte", name: "La Muerte", suit: "major", color: "background: linear-gradient(to bottom right, #1f2937, #000000)", textColor: "text-white", symbol: "💀", description: "Transformación" },
  { key: "La Templanza", name: "La Templanza", suit: "major", color: "background: linear-gradient(to bottom right, #60a5fa, #22d3ee)", textColor: "text-slate-800", symbol: "🍶", description: "Moderación" },
  { key: "El Diablo", name: "El Diablo", suit: "major", color: "background: linear-gradient(to bottom right, #991b1b, #000000)", textColor: "text-white", symbol: "👹", description: "Tentación" },
  { key: "La Torre", name: "La Torre", suit: "major", color: "background: linear-gradient(to bottom right, #ea580c, #dc2626)", textColor: "text-white", symbol: "🗼", description: "Destrucción" },
  { key: "La Estrella", name: "La Estrella", suit: "major", color: "background: linear-gradient(to bottom right, #93c5fd, #67e8f9)", textColor: "text-slate-800", symbol: "⭐", description: "Esperanza" },
  { key: "La Luna", name: "La Luna", suit: "major", color: "background: linear-gradient(to bottom right, #818cf8, #a78bfa)", textColor: "text-white", symbol: "🌙", description: "Ilusión" },
  { key: "El Sol", name: "El Sol", suit: "major", color: "background: linear-gradient(to bottom right, #fde047, #fdba74)", textColor: "text-slate-800", symbol: "☀️", description: "Alegría" },
  { key: "El Juicio", name: "El Juicio", suit: "major", color: "background: linear-gradient(to bottom right, #ffffff, #e5e7eb)", textColor: "text-slate-800", symbol: "👼", description: "Renacimiento" },
  { key: "El Mundo", name: "El Mundo", suit: "major", color: "background: linear-gradient(to bottom right, #4ade80, #34d399)", textColor: "text-white", symbol: "🌍", description: "Completitud" }
]

// Función para obtener la configuración de una carta por nombre
export function getTarotCardConfig(cardName: string): TarotCardConfig | undefined {
  const config = TAROT_CARDS_CONFIG.find(card => card.key === cardName)
  if (!config) {
    console.warn(`⚠️ Carta no encontrada: "${cardName}"`)
    console.log("Cartas disponibles:", TAROT_CARDS_CONFIG.map(card => card.key))
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

// Función para obtener el color del texto de una carta
export function getCardTextColor(cardName: string): string {
  const config = getTarotCardConfig(cardName)
  return config ? config.textColor : "text-white" // Color por defecto
}

// Función para obtener el nombre de display de una carta
export function getCardDisplayName(cardName: string): string {
  const config = getTarotCardConfig(cardName)
  return config ? config.name : cardName // Si no se encuentra, devolver el nombre original
}

// Función para obtener la descripción de una carta
export function getCardDescription(cardName: string): string {
  const config = getTarotCardConfig(cardName)
  return config ? config.description : "Carta de tarot" // Descripción por defecto
}

// Función para obtener la URL de la imagen de una carta
export function getCardImageUrl(cardName: string): string | undefined {
  const config = getTarotCardConfig(cardName)
  if (config?.imageUrl) {
    return config.imageUrl
  }
  
  // Mapeo especial para nombres que no coinciden exactamente con los archivos
  const specialMappings: { [key: string]: string } = {
    "El Ermitaño": "elermitaño",
  }
  
  // Verificar si hay un mapeo especial
  if (specialMappings[cardName]) {
    const fileName = specialMappings[cardName]
    if (config?.suit === "major") {
      return `/tarot-cards/major/${fileName}.png`
    } else if (config?.suit) {
      return `/tarot-cards/minor/${config.suit}/${fileName}.png`
    }
  }
  
  // Generar URL basada en el nombre de la carta si no está configurada
  // Remover espacios y caracteres especiales para coincidir con los nombres de archivo
  const fileName = cardName.toLowerCase()
    .replace(/\s+/g, '') // Sin espacios ni guiones
    .replace(/[áéíóú]/g, (match) => {
      const accents: { [key: string]: string } = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u'
      }
      return accents[match]
    })
    .replace(/[^a-z0-9]/g, '')
  
  if (config?.suit === "major") {
    return `/tarot-cards/major/${fileName}.png`
  } else if (config?.suit) {
    return `/tarot-cards/minor/${config.suit}/${fileName}.png`
  }
  
  return undefined
}

// Función para verificar si una carta tiene imagen
export function hasCardImage(cardName: string): boolean {
  return getCardImageUrl(cardName) !== undefined
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
}

// Función de test para verificar URLs de imágenes
export function testImageUrls(): void {
  console.log("=== TESTING IMAGE URLS ===")
  
  const testCards = [
    "El Loco", "El Mago", "La Sacerdotisa", "La Emperatriz", "El Emperador",
    "El Ermitaño", "La Rueda de la Fortuna", "La Luna", "El Sol",
    "As de Copas", "Dos de Copas", "Paje de Copas", "Reina de Copas",
    "As de Oros", "Cinco de Oros", "Caballero de Oros",
    "As de Bastos", "Tres de Bastos",
    "As de Espadas", "Cinco de Espadas"
  ]
  
  testCards.forEach(name => {
    const url = getCardImageUrl(name)
    console.log(`"${name}" -> ${url}`)
  })
}

// Función de test específica para las cartas problemáticas
export function testProblematicCards(): void {
  console.log("=== TESTING PROBLEMATIC CARDS ===")
  
  const problematicCards = [
    "El Ermitaño",
    "Paje de Copas", 
    "Cinco de Oros"
  ]
  
  problematicCards.forEach(name => {
    const config = getTarotCardConfig(name)
    const url = getCardImageUrl(name)
    console.log(`"${name}":`)
    console.log(`  - Config found: ${!!config}`)
    console.log(`  - URL: ${url}`)
    console.log(`  - Suit: ${config?.suit}`)
    console.log("")
  })
}
