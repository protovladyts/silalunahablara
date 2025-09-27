'use client';

import { useState, useEffect } from 'react';

interface UserSession {
  email: string;
  name: string;
  expiresAt: number;
}

const SESSION_KEY = 'tarot_user_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

export function useUserSession() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar sesión desde localStorage
    const loadSession = () => {
      try {
        const stored = localStorage.getItem(SESSION_KEY);
        if (stored) {
          const sessionData: UserSession = JSON.parse(stored);
          
          // Verificar si la sesión no ha expirado
          if (sessionData.expiresAt > Date.now()) {
            setSession(sessionData);
          } else {
            // Sesión expirada, limpiar
            localStorage.removeItem(SESSION_KEY);
            setSession(null);
          }
        }
      } catch (error) {
        console.error('Error loading session:', error);
        localStorage.removeItem(SESSION_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const createSession = (email: string, name: string) => {
    const sessionData: UserSession = {
      email,
      name,
      expiresAt: Date.now() + SESSION_DURATION,
    };
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    setSession(sessionData);
  };

  const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  const isSessionValid = () => {
    return session && session.expiresAt > Date.now();
  };

  const getTimeUntilExpiry = () => {
    if (!session) return 0;
    return Math.max(0, session.expiresAt - Date.now());
  };

  const formatTimeRemaining = () => {
    const timeLeft = getTimeUntilExpiry();
    if (timeLeft === 0) return 'Expirada';
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return {
    session,
    isLoading,
    createSession,
    clearSession,
    isSessionValid,
    formatTimeRemaining,
  };
}
