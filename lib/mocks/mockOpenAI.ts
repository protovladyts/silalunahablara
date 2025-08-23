const tarotCards = [
  "El Loco",
  "El Mago",
  "La Sacerdotisa",
  "La Emperatriz",
  "El Emperador",
  "El Hierofante",
  "Los Enamorados",
  "El Carro",
  "La Justicia",
  "El Ermitaño",
  "La Rueda de la Fortuna",
  "La Fuerza",
  "El Colgado",
  "La Muerte",
  "La Templanza",
  "El Diablo",
  "La Torre",
  "La Estrella",
  "La Luna",
  "El Sol",
  "El Juicio",
  "El Mundo",
]

const getRandomCards = (count = 3): { name: string; upright: boolean }[] => {
  const shuffled = [...tarotCards].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count).map((card) => ({
    name: card,
    upright: Math.random() > 0.5,
  }))
}

export const getMockReading = async (question: string): Promise<string> => {
  const cards = getRandomCards(3)

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const readings = [
    `Vamos paso a paso. La primera carta habla de lo que traés hoy. La segunda, de lo que está en juego. La tercera, del movimiento posible. No hay certezas, hay orientación. Vos decidís.

${cards[0].name} ${cards[0].upright ? "(derecha)" : "(invertida)"}: Esta carta te muestra el punto de partida. ${cards[0].upright ? "La energía fluye a tu favor" : "Hay resistencias que considerar"}. Es lo que tenés como base para moverte.

${cards[1].name} ${cards[1].upright ? "(derecha)" : "(invertida)"}: Acá está el núcleo de tu consulta. ${cards[1].upright ? "Las fuerzas trabajan contigo" : "Necesitás revisar tu enfoque"}. Es lo que realmente está en juego ahora.

${cards[2].name} ${cards[2].upright ? "(derecha)" : "(invertida)"}: Esta carta señala hacia dónde podés ir. ${cards[2].upright ? "El camino se abre" : "Hay obstáculos que sortear"}. Recordá: el futuro lo construís vos.

Las cartas no predicen. Te muestran posibilidades. La decisión siempre es tuya.`,

    `Te voy a contar lo que veo en estas tres cartas. No es magia, es lectura de símbolos que hablan de tu momento.

Primera posición - ${cards[0].name} ${cards[0].upright ? "(derecha)" : "(invertida)"}: Esto representa tu situación actual. ${cards[0].upright ? "Hay claridad en tu posición" : "Algo necesita ser revisado"}. Es tu punto de partida.

Segunda posición - ${cards[1].name} ${cards[1].upright ? "(derecha)" : "(invertida)"}: Acá está el desafío o la oportunidad central. ${cards[1].upright ? "Tenés herramientas para avanzar" : "Hay aspectos internos que trabajar"}. Es lo que más peso tiene ahora.

Tercera posición - ${cards[2].name} ${cards[2].upright ? "(derecha)" : "(invertida)"}: Esta carta habla del potencial de movimiento. ${cards[2].upright ? "Las condiciones están dadas" : "Necesitás paciencia y estrategia"}. Es hacia dónde podés dirigirte.

El tarot no te dice qué hacer. Te da perspectiva para que vos elijas mejor.`,

    `Miremos estas cartas con calma. Cada una tiene algo que decirte sobre tu consulta.

${cards[0].name} en primera posición ${cards[0].upright ? "(derecha)" : "(invertida)"}: Representa tu estado interno actual. ${cards[0].upright ? "Estás en sintonía con tus recursos" : "Hay algo que necesitás integrar mejor"}. Es tu base emocional.

${cards[1].name} en el centro ${cards[1].upright ? "(derecha)" : "(invertida)"}: Esta es la carta clave de tu tirada. ${cards[1].upright ? "La situación tiene potencial positivo" : "Hay aspectos que requieren tu atención"}. Es el corazón de tu pregunta.

${cards[2].name} como resultado ${cards[2].upright ? "(derecha)" : "(invertida)"}: Muestra la tendencia si seguís como vas. ${cards[2].upright ? "El panorama es favorable" : "Conviene ajustar el rumbo"}. Pero recordá: vos tenés la última palabra.

Las cartas reflejan energías, no destinos fijos. Usá esta información como una brújula, no como una orden.`,
  ]

  return readings[Math.floor(Math.random() * readings.length)]
}
