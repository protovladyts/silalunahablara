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

// Singleton Database Class
class MockDatabase {
  private static instance: MockDatabase
  private mockUsers: User[] = []
  private mockSessions: Session[] = []
  private mockOtps: OtpEntry[] = []
  private mockTarotSessions: TarotSession[] = []
  private users: Record<string, { hasFreeTarot: boolean }> = {}
  private sessions: Record<string, TarotSession> = {}

  private constructor() {}

  public static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase()
    }
    return MockDatabase.instance
  }

  public createUser(email: string): User {
    // Usar timestamp + email hash para generar ID determinístico
    const timestamp = Date.now()
    const emailHash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const userId = `user_${timestamp}_${emailHash}`
    
    const user: User = {
      id: userId,
      email,
      createdAt: new Date(),
      hasFreeTarot: false,
    }
    this.mockUsers.push(user)

    if (!this.users[email]) {
      this.users[email] = { hasFreeTarot: false }
    }

    return user
  }

  public findUserByEmail(email: string): User | undefined {
    return this.mockUsers.find((user) => user.email === email)
  }

  public createSession(userId: string, question: string, cards: string[], reading: string): Session {
    // Usar timestamp + userId hash para generar ID determinístico
    const timestamp = Date.now()
    const userIdHash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const sessionId = `old_session_${timestamp}_${userIdHash}`
    
    const session: Session = {
      id: sessionId,
      userId,
      question,
      cards,
      reading,
      createdAt: new Date(),
    }
    this.mockSessions.push(session)
    return session
  }

  public markFreeTarotUsed(email: string): void {
    if (!this.users[email]) {
      this.users[email] = { hasFreeTarot: true }
    } else {
      this.users[email].hasFreeTarot = true
    }

    // Also update in mockUsers array
    const user = this.mockUsers.find((u) => u.email === email)
    if (user) {
      user.hasFreeTarot = true
    }
  }

  public hasUsedFreeTarot(email: string): boolean {
    return this.users[email]?.hasFreeTarot || false
  }

  public createTarotSession(userId: string): TarotSession {
    console.log(`[v0] createTarotSession called for userId: ${userId}`)
    console.log(`[v0] Current state - sessions count:`, Object.keys(this.sessions).length)
    console.log(`[v0] Current state - mockTarotSessions count:`, this.mockTarotSessions.length)
    
    // Usar timestamp + userId hash para generar ID determinístico
    const timestamp = Date.now()
    const userIdHash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const sessionId = `session_${timestamp}_${userIdHash}`
    
    const session: TarotSession = {
      id: sessionId,
      userId,
      status: "intake",
      loopsUsed: 0,
      createdAt: new Date(),
    }
    
    console.log(`[v0] Created session object:`, { id: session.id, userId: session.userId, status: session.status })
    
    this.mockTarotSessions.push(session)
    this.sessions[session.id] = session
    
    console.log(`[v0] After saving - sessions count:`, Object.keys(this.sessions).length)
    console.log(`[v0] After saving - mockTarotSessions count:`, this.mockTarotSessions.length)
    console.log(`[v0] After saving - sessions keys:`, Object.keys(this.sessions))
    
    return session
  }

  public findTarotSession(sessionId: string): TarotSession | undefined {
    // Buscar en ambos lugares
    let session = this.sessions[sessionId] || this.mockTarotSessions.find((s) => s.id === sessionId)
    
    // Si encontramos la sesión en mockTarotSessions pero no en sessions, sincronizar
    if (session && !this.sessions[sessionId]) {
      this.sessions[sessionId] = session
    }
    
    return session
  }

  public updateTarotSession(sessionId: string, updates: Partial<TarotSession>): TarotSession | null {
    console.log(`[v0] updateTarotSession called for: ${sessionId}`)
    console.log(`[v0] Updates:`, updates)
    
    // Buscar la sesión en ambos lugares
    let session = this.sessions[sessionId] || this.mockTarotSessions.find((s) => s.id === sessionId)
    
    if (!session) {
      console.log(`[v0] No session found for: ${sessionId}`)
      console.log(`[v0] sessions keys:`, Object.keys(this.sessions))
      console.log(`[v0] mockTarotSessions count:`, this.mockTarotSessions.length)
      return null
    }

    console.log(`[v0] Found session:`, { id: session.id, status: session.status })

    const updatedSession = { ...session, ...updates }
    
    // Actualizar en ambos lugares
    this.sessions[sessionId] = updatedSession
    
    const sessionIndex = this.mockTarotSessions.findIndex((s) => s.id === sessionId)
    if (sessionIndex !== -1) {
      this.mockTarotSessions[sessionIndex] = updatedSession
      console.log(`[v0] Updated in mockTarotSessions at index: ${sessionIndex}`)
    } else {
      // Si no estaba en mockTarotSessions, agregarlo
      this.mockTarotSessions.push(updatedSession)
      console.log(`[v0] Added to mockTarotSessions`)
    }

    console.log(`[v0] Final session state:`, { 
      id: updatedSession.id, 
      status: updatedSession.status,
      hasDeckOrder: !!updatedSession.deckOrder 
    })

    return updatedSession
  }

  public getSession(sessionId: string): TarotSession | undefined {
    return this.mockTarotSessions.find((session) => session.id === sessionId)
  }

  public updateSessionReading(sessionId: string, reading: string): void {
    const session = this.findTarotSession(sessionId)
    if (session) {
      session.reading = reading
      session.status = "complete"
    }
  }

  // Debug methods
  public getDebugInfo() {
    return {
      sessionsCount: Object.keys(this.sessions).length,
      mockTarotSessionsCount: this.mockTarotSessions.length,
      sessionsKeys: Object.keys(this.sessions),
      mockTarotSessionsIds: this.mockTarotSessions.map(s => s.id)
    }
  }
}

// Export singleton instance
const db = MockDatabase.getInstance()

// Export functions that use the singleton
export const createUser = (email: string): User => db.createUser(email)
export const findUserByEmail = (email: string): User | undefined => db.findUserByEmail(email)
export const createSession = (userId: string, question: string, cards: string[], reading: string): Session => db.createSession(userId, question, cards, reading)
export const markFreeTarotUsed = (email: string): void => db.markFreeTarotUsed(email)
export const hasUsedFreeTarot = (email: string): boolean => db.hasUsedFreeTarot(email)
export const createTarotSession = (userId: string): TarotSession => db.createTarotSession(userId)
export const findTarotSession = (sessionId: string): TarotSession | undefined => db.findTarotSession(sessionId)
export const updateTarotSession = (sessionId: string, updates: Partial<TarotSession>): TarotSession | null => db.updateTarotSession(sessionId, updates)
export const getSession = (sessionId: string): TarotSession | undefined => db.getSession(sessionId)
export const updateSessionReading = (sessionId: string, reading: string): void => db.updateSessionReading(sessionId, reading)

// Export debug function
export const getDebugInfo = () => db.getDebugInfo()
