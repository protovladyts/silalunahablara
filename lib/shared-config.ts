// Configuración compartida entre frontend y backend
export const SHARED_CONFIG = {
  // Número de lecturas gratuitas permitidas
  FREE_READINGS: 1,
  
  // Número de lecturas adicionales por pago
  PAID_READINGS: 1,
  
  // Precio de la lectura adicional
  ADDITIONAL_READING_PRICE: 10000, // ARS
  
  // Precio de la videollamada
  VIDEO_CALL_PRICE: 15, // USD
  
  // Duración de la videollamada
  VIDEO_CALL_DURATION: "30 minutos",
} as const
