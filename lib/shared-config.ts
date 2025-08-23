// Configuración compartida entre frontend y backend
export const SHARED_CONFIG = {
  // Número total de preguntas permitidas (1 inicial + repreguntas)
  MAX_TAROT_READINGS: 3,
  
  // Precio del paquete de preguntas adicionales
  ADDITIONAL_READINGS_PRICE: 1, // USD
  
  // Número de preguntas en el paquete adicional
  ADDITIONAL_READINGS_COUNT: 3,
  
  // Precio de la videollamada
  VIDEO_CALL_PRICE: 15, // USD
  
  // Duración de la videollamada
  VIDEO_CALL_DURATION: "30 minutos",
} as const
