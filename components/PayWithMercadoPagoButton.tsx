'use client';

import { useState } from 'react';

type PayWithMercadoPagoButtonProps = {
  orderId: string;
  itemId: string; // ID del producto que quiere comprar
  userEmail: string; // Email del usuario para crear el registro de pago
  className?: string;
  onStarted?: (preferenceId: string) => void;
  onError?: (err: Error) => void;
  children?: React.ReactNode;
};

export default function PayWithMercadoPagoButton({
  orderId,
  itemId,
  userEmail,
  className = '',
  onStarted,
  onError,
  children,
}: PayWithMercadoPagoButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/mp/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          itemId,
          userEmail,
        }),
      });

      const data = await response.json();

      if (!data.ok) {
        throw new Error(data.error || 'Failed to create preference');
      }

      onStarted?.(data.preference_id);

      // Usar init_point de producción para pagos reales
      const initPoint = data.init_point;
      window.location.href = initPoint;

    } catch (error) {
      console.error('Payment error:', error);
      onError?.(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {isLoading ? 'Procesando...' : (children || 'Pagar con Mercado Pago')}
    </button>
  );
}