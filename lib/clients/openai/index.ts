import OpenAI from "openai";
import { getMockTarotReading, getMockQuestionValidation } from "./mocks";

// Inicializar cliente de OpenAI solo si la API key está disponible
let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export interface TarotReadingRequest {
  question: string;
  cards: Array<{ name: string; upright: boolean }>;
  userName?: string;
  previousReadings?: Array<{
    question: string;
    reading: string;
    date: string;
  }>;
}

export interface TarotReadingResponse {
  reading: string;
  interpretation: string;
}

export interface QuestionValidationRequest {
  question: string;
}

export interface QuestionValidationResponse {
  isValid: boolean;
  reason: string;
}

export async function validateQuestion(request: QuestionValidationRequest): Promise<QuestionValidationResponse> {
  // En desarrollo, usar mock
  if (process.env.SKIP_OPEN_AI === "true") {
    return getMockQuestionValidation(request);
  }

  // Verificar si OpenAI está disponible
  if (!openai) {
    // Si OpenAI no está disponible, hacer validación básica local
    return validateQuestionLocally(request.question);
  }

  try {
    const { question } = request;

    const systemPrompt = `Eres un experto en validar preguntas para lecturas de tarot. Tu tarea es determinar si una pregunta es válida y significativa para una consulta espiritual.

**Criterios para una pregunta válida:**
1. **Claridad**: La pregunta debe ser clara y comprensible
2. **Relevancia**: Debe estar relacionada con aspectos de la vida personal, relaciones, trabajo, decisiones, etc.
3. **Seriedad**: Debe mostrar intención genuina de obtener orientación
4. **Específica**: Debe ser lo suficientemente específica para permitir una interpretación significativa
5. **Respetuosa**: Debe ser respetuosa hacia la práctica espiritual

**Ejemplos de preguntas VÁLIDAS:**
- "¿Debería cambiar de trabajo este año?"
- "¿Cómo puedo mejorar mi relación con mi pareja?"
- "¿Qué me depara el futuro en el amor?"
- "¿Cuál es el mejor momento para tomar esta decisión importante?"

**Ejemplos de preguntas INVÁLIDAS:**
- "lalala", "abc123", "hola mundo" (sin sentido)
- "¿Cuándo me voy a morir?" (demasiado específico sobre muerte)
- "¿Ganará mi equipo de fútbol?" (deportes/resultados específicos)
- "¿Qué número de la lotería debo jugar?" (juegos de azar)

**IMPORTANTE**: Responde ÚNICAMENTE con un JSON válido en este formato exacto:
{"isValid": true/false, "reason": "explicación en español"}

No agregues texto adicional, solo el JSON.`

    const userPrompt = `Por favor valida esta pregunta para una lectura de tarot:

**Pregunta:** "${question}"

Responde solo con el JSON en el formato especificado.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 200
    });

    const responseText = completion.choices[0]?.message?.content || "";
    
    try {
      // Intentar extraer JSON del texto de respuesta
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const validation = JSON.parse(jsonMatch[0]) as QuestionValidationResponse;
        return validation;
      } else {
        console.error("No JSON found in OpenAI response:", responseText);
        // Fallback a validación local si no se encuentra JSON
        return validateQuestionLocally(question);
      }
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      // Fallback a validación local si el parsing falla
      return validateQuestionLocally(question);
    }

  } catch (error) {
    console.error("Error calling OpenAI for validation:", error);
    // Fallback a validación local si OpenAI falla
    return validateQuestionLocally(request.question);
  }
}

// Validación local como fallback
function validateQuestionLocally(question: string): QuestionValidationResponse {
  const trimmedQuestion = question.trim();
  
  // Validaciones básicas
  if (trimmedQuestion.length < 10) {
    return {
      isValid: false,
      reason: "La pregunta es demasiado corta. Por favor, formula una pregunta más detallada y específica.",
    };
  }

  if (trimmedQuestion.length > 500) {
    return {
      isValid: false,
      reason: "La pregunta es demasiado larga. Por favor, sé más conciso y directo.",
    };
  }

  // Detectar preguntas sin sentido (patrones básicos)
  const nonsensePatterns = [
    /^[a-z\s]+$/i, // Solo letras repetidas
    /^(.)\1+$/i,   // Caracteres repetidos
    /^[0-9\s]+$/,  // Solo números
    /^(lalala|abc|123|hola mundo|test|prueba)$/i // Palabras específicas sin sentido
  ];

  for (const pattern of nonsensePatterns) {
    if (pattern.test(trimmedQuestion)) {
      return {
        isValid: false,
        reason: "La pregunta no parece tener sentido. Por favor, formula una pregunta real sobre algún aspecto de tu vida que te preocupe o sobre el que quieras orientación.",
      };
    }
  }

  // Si pasa todas las validaciones básicas
  return {
    isValid: true,
    reason: "La pregunta es válida y puede ser interpretada por el tarot.",
  };
}

export async function generateTarotReading(
  request: TarotReadingRequest
): Promise<TarotReadingResponse> {
  // En desarrollo, usar mock
  if (process.env.SKIP_OPEN_AI === "true") {
    return getMockTarotReading(request);
  }

  // Verificar si OpenAI está disponible
  if (!openai) {
    throw new Error("OpenAI service not available - API key not configured");
  }

  try {
    const { question, cards, userName, previousReadings } = request;

    // Construir el contexto de lecturas anteriores
    let previousContext = "";
    if (previousReadings && previousReadings.length > 0) {
      previousContext = "\n\n**Lecturas anteriores para contexto:**\n";
      previousReadings.forEach((prev, index) => {
        previousContext += `${index + 1}. **Pregunta:** ${
          prev.question
        }\n   **Respuesta:** ${prev.reading}\n   **Fecha:** ${prev.date}\n\n`;
      });
    }

    // Construir descripción de las cartas
    const cardsDescription = cards
      .map((card) => {
        const orientation = card.upright ? "derecha" : "invertida";
        return `- ${card.name} (${orientation})`;
      })
      .join("\n");

    const systemPrompt = `Eres un oráculo ancestral del tarot que habla directamente desde la sabiduría de los arcanos. Tu voz es la voz de las cartas mismas.

**Estilo del oráculo:**
- Hablas con autoridad mística y conocimiento ancestral
- Usas un lenguaje evocativo pero directo
- Interpretas las cartas como revelaciones del destino
- Te enfocas en insights profundos y orientación espiritual
- Nunca predices muerte, desastres o fechas específicas

**Estructura de la lectura:**
- Ve directo al significado sin saludos ni presentaciones
- Interpreta cada carta en relación con la pregunta
- Conecta las energías entre las cartas para crear un mensaje unificado
- Ofrece orientación práctica desde la sabiduría esotérica
- Cierra con una reflexión poderosa, NO con despedida

**Tono requerido:**
- Místico pero claro y accesible
- Autoritativo sin ser condescendiente  
- Sabio y contemplativo
- SIN saludos ("Hola", "Querido/a")
- SIN despedidas ("Con cariño", "Te acompaño", etc.)
- SIN firmas de vidente o nombres

**Importante:**
- Si recibes un nombre de usuario, úsalo máximo 1-2 veces de forma natural
- Si hay lecturas anteriores, menciona sutilmente la evolución o patrones
- La respuesta debe ser 250-350 palabras
- Termina con un insight poderoso, no con despedida personal`;

    const userPrompt = `**Pregunta del consultante:** ${question}

**Cartas reveladas:**
${cardsDescription}

${previousContext}

${userName ? `**Nombre del consultante:** ${userName}` : ""}

Interpreta estas cartas como oráculo. Ve directo al significado y la orientación sin saludos ni despedidas.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const reading =
      completion.choices[0]?.message?.content ||
      "No se pudo generar la lectura en este momento.";

    return {
      reading,
      interpretation: `Lectura generada para: ${question}`,
    };
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw new Error("Error generando la lectura de tarot");
  }
}

// Función para verificar si OpenAI está disponible
export function isOpenAIAvailable(): boolean {
  return openai !== null;
}
