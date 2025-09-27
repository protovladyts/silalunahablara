'use client';

import { useState, useRef, useCallback } from 'react';

interface UseSpeechToTextOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
}

interface UseSpeechToTextReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechToText({
  language = 'es-ES',
  continuous = false,
  interimResults = true,
  onResult,
  onError
}: UseSpeechToTextOptions = {}): UseSpeechToTextReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Verificar si el navegador soporta Speech Recognition
  const isSupported = typeof window !== 'undefined' && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Tu navegador no soporta reconocimiento de voz');
      return;
    }

    if (isListening) {
      return;
    }

    setError(null);
    setIsListening(true);

    try {
      // Usar la API correcta según el navegador
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = language;

      recognition.onstart = () => {
        console.log('[SpeechToText] Reconocimiento iniciado');
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);
        
        if (onResult && fullTranscript) {
          onResult(fullTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('[SpeechToText] Error:', event.error);
        
        let errorMessage = 'Error en el reconocimiento de voz';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No se detectó voz. Intenta hablar más cerca del micrófono.';
            break;
          case 'audio-capture':
            errorMessage = 'No se pudo acceder al micrófono. Verifica los permisos.';
            break;
          case 'not-allowed':
            errorMessage = 'Permisos de micrófono denegados. Permite el acceso al micrófono.';
            break;
          case 'network':
            errorMessage = 'Error de red. Verifica tu conexión a internet.';
            break;
          case 'aborted':
            errorMessage = 'Reconocimiento cancelado';
            break;
          case 'language-not-supported':
            errorMessage = 'Idioma no soportado';
            break;
          default:
            errorMessage = `Error desconocido: ${event.error}`;
        }
        
        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log('[SpeechToText] Reconocimiento terminado');
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();

    } catch (err) {
      console.error('[SpeechToText] Error al inicializar:', err);
      setError('Error al inicializar el reconocimiento de voz');
      setIsListening(false);
    }
  }, [isSupported, isListening, language, continuous, interimResults, onResult, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript
  };
}
