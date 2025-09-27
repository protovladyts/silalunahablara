import { TarotReadingRequest, TarotReadingResponse, QuestionValidationRequest, QuestionValidationResponse } from "./index"

/**
 * Mock responses para desarrollo
 */

export const MOCK_TAROT_READING: TarotReadingResponse = {
  reading: `Las cartas revelan una energía de transformación profunda en tu camino. La sabiduría ancestral se manifiesta a través de estas señales, indicando que estás en un momento crucial de tu evolución personal.

Las energías que rodean tu consulta muestran claridad en la dirección que debes tomar. Los arcanos hablan de cambios necesarios y oportunidades que se presentan ante ti. Es momento de confiar en tu intuición y tomar las decisiones que tu alma ya conoce.

El universo conspira para guiarte hacia tu propósito más elevado. Las cartas confirman que tienes la fuerza interior necesaria para enfrentar cualquier desafío que se presente. Tu determinación y sabiduría interna serán tus mejores aliados en este momento de transición.

Recuerda que cada paso que das está alineado con tu crecimiento espiritual. Las energías del tarot te acompañan en este viaje de autodescubrimiento y transformación personal.`,
  interpretation: "Lectura mock generada para desarrollo"
}

export const MOCK_QUESTION_VALIDATION: QuestionValidationResponse = {
  isValid: true,
  reason: "Pregunta validada (modo desarrollo)"
}

/**
 * Funciones mock para desarrollo
 */

export function getMockTarotReading(request: TarotReadingRequest): TarotReadingResponse {
  console.log("[v0] Development mode: returning mock tarot reading")
  return {
    ...MOCK_TAROT_READING,
    interpretation: `Lectura mock generada para desarrollo: ${request.question}`
  }
}

export function getMockQuestionValidation(request: QuestionValidationRequest): QuestionValidationResponse {
  console.log("[v0] Development mode: validating question as true")
  return MOCK_QUESTION_VALIDATION
}
