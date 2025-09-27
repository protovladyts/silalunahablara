// Utilidades para manejar el estado de las consultas de tarot
import { SHARED_CONFIG } from "./shared-config"

export interface TarotReadingState {
  isFirstReading: boolean
  hasUsedFreeReading: boolean
}

/**
 * Calcula el estado actual de las consultas de tarot
 * @param hasUsedFreeReading - Si el usuario ya usó su lectura gratuita
 * @returns Estado completo de las consultas
 */
export function calculateTarotReadingState(hasUsedFreeReading: boolean): TarotReadingState {
  const isFirstReading = !hasUsedFreeReading
  
  return {
    isFirstReading,
    hasUsedFreeReading
  }
}

/**
 * Genera mensajes consistentes para mostrar el estado de las consultas
 */
export function getTarotReadingMessages(hasUsedFreeReading: boolean) {
  const state = calculateTarotReadingState(hasUsedFreeReading)
  
  return {
    // Para el botón de repreguntar
    reaskButtonText: state.isFirstReading 
      ? "Hacer otra consulta"
      : "Sin más consultas gratuitas",
    
    // Para validaciones
    canReask: state.isFirstReading
  }
}
