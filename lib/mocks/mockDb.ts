export interface User {
  id: string
  email: string
  createdAt: Date
  hasFreeTarot: boolean
}

export interface Session {
  id: string
  userId: string
  question: string
  cards: string[]
  reading: string
  createdAt: Date
}

export interface OtpEntry {
  email: string
  code: string
  expiresAt: Date
}

// Added TarotSession interface
export interface TarotSession {
  id: string
  userId: string
  status: "intake" | "shuffled" | "drawn" | "reading" | "complete"
  loopsUsed: number
  question?: string
  shuffleSeed?: string
  deckOrder?: number[]
  cutIndex?: number
  drawnCards?: Array<{
    id: number
    name: string
    upright: boolean
  }>
  reading?: string
  createdAt: Date
}

// In-memory storage
export const mockUsers: User[] = []
export const mockSessions: Session[] = []
export const mockOtps: OtpEntry[] = []
export const mockTarotSessions: TarotSession[] = []

export const users: Record<string, { hasFreeTarot: boolean }> = {}
export const sessions: Record<string, TarotSession> = {}

export const createUser = (email: string): User => {
  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    createdAt: new Date(),
    hasFreeTarot: false,
  }
  mockUsers.push(user)

  if (!users[email]) {
    users[email] = { hasFreeTarot: false }
  }

  return user
}

export const findUserByEmail = (email: string): User | undefined => {
  return mockUsers.find((user) => user.email === email)
}

export const createSession = (userId: string, question: string, cards: string[], reading: string): Session => {
  const session: Session = {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    question,
    cards,
    reading,
    createdAt: new Date(),
  }
  mockSessions.push(session)
  return session
}

// 78 Tarot cards (Major + Minor Arcana)
export const TAROT_DECK = [
  // Major Arcana (0-21)
  "El Loco",
  "El Mago",
  "La Sacerdotisa",
  "La Emperatriz",
  "El Emperador",
  "El Hierofante",
  "Los Enamorados",
  "El Carro",
  "La Fuerza",
  "El Ermitaño",
  "La Rueda de la Fortuna",
  "La Justicia",
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

  // Minor Arcana - Copas (22-35)
  "As de Copas",
  "Dos de Copas",
  "Tres de Copas",
  "Cuatro de Copas",
  "Cinco de Copas",
  "Seis de Copas",
  "Siete de Copas",
  "Ocho de Copas",
  "Nueve de Copas",
  "Diez de Copas",
  "Sota de Copas",
  "Caballero de Copas",
  "Reina de Copas",
  "Rey de Copas",

  // Minor Arcana - Espadas (36-49)
  "As de Espadas",
  "Dos de Espadas",
  "Tres de Espadas",
  "Cuatro de Espadas",
  "Cinco de Espadas",
  "Seis de Espadas",
  "Siete de Espadas",
  "Ocho de Espadas",
  "Nueve de Espadas",
  "Diez de Espadas",
  "Sota de Espadas",
  "Caballero de Espadas",
  "Reina de Espadas",
  "Rey de Espadas",

  // Minor Arcana - Bastos (50-63)
  "As de Bastos",
  "Dos de Bastos",
  "Tres de Bastos",
  "Cuatro de Bastos",
  "Cinco de Bastos",
  "Seis de Bastos",
  "Siete de Bastos",
  "Ocho de Bastos",
  "Nueve de Bastos",
  "Diez de Bastos",
  "Sota de Bastos",
  "Caballero de Bastos",
  "Reina de Bastos",
  "Rey de Bastos",

  // Minor Arcana - Oros (64-77)
  "As de Oros",
  "Dos de Oros",
  "Tres de Oros",
  "Cuatro de Oros",
  "Cinco de Oros",
  "Seis de Oros",
  "Siete de Oros",
  "Ocho de Oros",
  "Nueve de Oros",
  "Diez de Oros",
  "Sota de Oros",
  "Caballero de Oros",
  "Reina de Oros",
  "Rey de Oros",
]

export const markFreeTarotUsed = (email: string): void => {
  if (!users[email]) {
    users[email] = { hasFreeTarot: true }
  } else {
    users[email].hasFreeTarot = true
  }

  // Also update in mockUsers array
  const user = mockUsers.find((u) => u.email === email)
  if (user) {
    user.hasFreeTarot = true
  }
}

export const hasUsedFreeTarot = (email: string): boolean => {
  return users[email]?.hasFreeTarot || false
}

export const createTarotSession = (userId: string): TarotSession => {
  const session: TarotSession = {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    status: "intake",
    loopsUsed: 0,
    createdAt: new Date(),
  }
  mockTarotSessions.push(session)
  sessions[session.id] = session
  return session
}

export const findTarotSession = (sessionId: string): TarotSession | undefined => {
  return sessions[sessionId] || mockTarotSessions.find((session) => session.id === sessionId)
}

export const updateTarotSession = (sessionId: string, updates: Partial<TarotSession>): TarotSession | null => {
  const session = sessions[sessionId]
  if (!session) return null

  const updatedSession = { ...session, ...updates }
  sessions[sessionId] = updatedSession

  const sessionIndex = mockTarotSessions.findIndex((s) => s.id === sessionId)
  if (sessionIndex !== -1) {
    mockTarotSessions[sessionIndex] = updatedSession
  }

  return updatedSession
}

export const getSession = (sessionId: string): TarotSession | undefined => {
  return mockTarotSessions.find((session) => session.id === sessionId)
}

export const updateSessionReading = (sessionId: string, reading: string): void => {
  const session = findTarotSession(sessionId)
  if (session) {
    session.reading = reading
    session.status = "complete"
  }
}
