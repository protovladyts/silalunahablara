'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Volume2, CheckCircle, XCircle, Info } from 'lucide-react';

interface VoiceFeatureInfoProps {
  isSupported: boolean;
  onClose: () => void;
}

export function VoiceFeatureInfo({ isSupported, onClose }: VoiceFeatureInfoProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className="w-full max-w-md bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-blue-900 dark:text-blue-100 flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Funcionalidad de Voz
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Estado de soporte */}
        <div className="flex items-center gap-2">
          {isSupported ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700 dark:text-green-300">
                Tu navegador soporta reconocimiento de voz
              </span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700 dark:text-red-300">
                Tu navegador no soporta reconocimiento de voz
              </span>
            </>
          )}
        </div>

        {/* Instrucciones básicas */}
        <div className="text-sm text-blue-800 dark:text-blue-200">
          <p className="font-medium mb-2">Cómo usar:</p>
          <ul className="space-y-1 text-xs">
            <li>• Haz clic en el ícono del micrófono</li>
            <li>• Permite el acceso al micrófono cuando se solicite</li>
            <li>• Habla claramente y pausadamente</li>
            <li>• Haz clic nuevamente para detener la grabación</li>
          </ul>
        </div>

        {/* Detalles adicionales */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/30"
          >
            <Info className="h-3 w-3 mr-1" />
            {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
          </Button>

          {showDetails && (
            <div className="text-xs text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800/30 p-3 rounded-md">
              <div className="space-y-2">
                <div>
                  <strong>Navegadores compatibles:</strong>
                  <ul className="ml-2 mt-1 space-y-1">
                    <li>• Chrome (recomendado)</li>
                    <li>• Edge</li>
                    <li>• Safari (iOS 14.5+)</li>
                  </ul>
                </div>
                
                <div>
                  <strong>Consejos para mejor reconocimiento:</strong>
                  <ul className="ml-2 mt-1 space-y-1">
                    <li>• Habla en un ambiente silencioso</li>
                    <li>• Mantén el micrófono cerca de tu boca</li>
                    <li>• Pronuncia las palabras claramente</li>
                    <li>• Evita hablar muy rápido</li>
                  </ul>
                </div>

                <div>
                  <strong>Privacidad:</strong>
                  <p className="ml-2 mt-1">
                    El reconocimiento de voz se procesa localmente en tu navegador. 
                    No enviamos tu voz a nuestros servidores.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botón de cerrar */}
        <div className="flex justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800/30"
          >
            Entendido
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
