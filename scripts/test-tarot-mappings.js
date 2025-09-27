// Script para testear los mapeos de cartas de tarot
// Ejecutar con: node scripts/test-tarot-mappings.js

// Simulamos las funciones principales
const specialMappings = {
  "El Ermitaño": "elermitaño",
  "Paje de Copas": "pajerdecopas", 
  "Cinco de Oros": "cicnodeoros",
  "Ciclo de Oros": "cicnodeoros",
}

function getCardImageUrl(cardName) {
  // Verificar si hay un mapeo especial
  if (specialMappings[cardName]) {
    const fileName = specialMappings[cardName]
    if (cardName.includes("El ") || cardName.includes("La ") || cardName.includes("Los ")) {
      return `/tarot-cards/major/${fileName}.png`
    } else if (cardName.includes("de Copas")) {
      return `/tarot-cards/minor/cups/${fileName}.png`
    } else if (cardName.includes("de Oros")) {
      return `/tarot-cards/minor/coins/${fileName}.png`
    }
  }
  
  // Generar URL normal
  const fileName = cardName.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[áéíóú]/g, (match) => {
      const accents = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u' }
      return accents[match]
    })
    .replace(/[^a-z0-9]/g, '')
  
  if (cardName.includes("El ") || cardName.includes("La ") || cardName.includes("Los ")) {
    return `/tarot-cards/major/${fileName}.png`
  } else if (cardName.includes("de Copas")) {
    return `/tarot-cards/minor/cups/${fileName}.png`
  } else if (cardName.includes("de Oros")) {
    return `/tarot-cards/minor/coins/${fileName}.png`
  }
  
  return undefined
}

// Test de las cartas problemáticas
console.log("=== TESTING PROBLEMATIC CARDS ===")
const problematicCards = [
  "El Ermitaño",
  "Paje de Copas", 
  "Cinco de Oros"
]

problematicCards.forEach(name => {
  const url = getCardImageUrl(name)
  console.log(`"${name}" -> ${url}`)
})

// Test de algunas cartas normales
console.log("\n=== TESTING NORMAL CARDS ===")
const normalCards = [
  "El Mago",
  "As de Copas",
  "Dos de Oros"
]

normalCards.forEach(name => {
  const url = getCardImageUrl(name)
  console.log(`"${name}" -> ${url}`)
})
