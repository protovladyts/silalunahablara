'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SessionData {
  email: string;
  name?: string;
  hasFreeTarot: boolean;
  expiresAt: number;
}

export function useSession() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay una sesión válida en localStorage
    const checkSession = () => {
      try {
        const storedSession = localStorage.getItem('userSession');
        if (storedSession) {
          const session: SessionData = JSON.parse(storedSession);
          
          // Verificar si la sesión no ha expirado
          if (session.expiresAt > Date.now()) {
            setSessionData(session);
            setIsLoading(false);
            return;
          } else {
            // Sesión expirada, limpiar
            localStorage.removeItem('userSession');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            sessionStorage.removeItem('userVerified');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // Limpiar datos corruptos
        localStorage.removeItem('userSession');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        sessionStorage.removeItem('userVerified');
      }
      
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const createSession = (email: string, name?: string, hasFreeTarot: boolean = true) => {
    const session: SessionData = {
      email,
      name,
      hasFreeTarot,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    };

    localStorage.setItem('userSession', JSON.stringify(session));
    localStorage.setItem('userEmail', email);
    if (name) {
      localStorage.setItem('userName', name);
    }
    sessionStorage.setItem('userVerified', 'true');
    
    setSessionData(session);
  };

  const updateSession = (updates: Partial<SessionData>) => {
    if (sessionData) {
      const updatedSession = { ...sessionData, ...updates };
      localStorage.setItem('userSession', JSON.stringify(updatedSession));
      setSessionData(updatedSession);
    }
  };

  const clearSession = () => {
    localStorage.removeItem('userSession');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    sessionStorage.removeItem('userVerified');
    setSessionData(null);
    router.push('/');
  };

  const isSessionValid = () => {
    return sessionData && sessionData.expiresAt > Date.now();
  };

  return {
    sessionData,
    isLoading,
    createSession,
    updateSession,
    clearSession,
    isSessionValid
  };
}
