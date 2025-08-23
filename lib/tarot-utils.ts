// Utilidades para manejar el estado de las consultas de tarot
import { SHARED_CONFIG } from "./shared-config"

export interface TarotReadingState {
  currentReading: number
  totalReadings: number
  remainingReadings: number
  isFirstReading: boolean
  isLastFreeReading: boolean
  hasMoreFreeReadings: boolean
}

/**
 * Calcula el estado actual de las consultas de tarot
 * @param loopsUsed - Número de consultas ya utilizadas (0 = primera consulta)
 * @returns Estado completo de las consultas
 */
export function calculateTarotReadingState(loopsUsed: number): TarotReadingState {
  const totalReadings = SHARED_CONFIG.MAX_TAROT_READINGS
  const currentReading = loopsUsed + 1
  
  // Las consultas restantes se basan en las consultas completadas, no en la actual
  // loopsUsed = 0 (ninguna consulta completada) → 3 restantes
  // loopsUsed = 1 (una consulta completada) → 2 restantes  
  // loopsUsed = 2 (dos consultas completadas) → 1 restante
  // loopsUsed = 3 (tres consultas completadas) → 0 restantes
  const remainingReadings = totalReadings - loopsUsed
  
  const isFirstReading = loopsUsed === 0
  const isLastFreeReading = currentReading === totalReadings
  const hasMoreFreeReadings = remainingReadings > 0

  return {
    currentReading,
    totalReadings,
    remainingReadings,
    isFirstReading,
    isLastFreeReading,
    hasMoreFreeReadings
  }
}

/**
 * Genera mensajes consistentes para mostrar el estado de las consultas
 */
export function getTarotReadingMessages(loopsUsed: number) {
  const state = calculateTarotReadingState(loopsUsed)
  
  return {
    // Para el ProgressIndicator principal
    progressMessage: `Consulta ${state.currentReading} de ${state.totalReadings}`,
    
    // Para el contador de consultas restantes
    remainingMessage: state.remainingReadings > 0 
      ? `${state.remainingReadings} consulta${state.remainingReadings !== 1 ? 's' : ''} restante${state.remainingReadings !== 1 ? 's' : ''}`
      : "Sin consultas restantes",
    
    // Para el botón de repreguntar
    reaskButtonText: state.remainingReadings > 0 
      ? `Repreguntar (${state.remainingReadings} restante${state.remainingReadings !== 1 ? 's' : ''})`
      : "Sin más repreguntas",
    
    // Para mensajes informativos - REMOVIDO: solo se muestra en el ProgressIndicator
    infoMessage: "",
    
    // Para validaciones
    canReask: state.hasMoreFreeReadings
  }
}
