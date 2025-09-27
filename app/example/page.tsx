'use client';

import PayWithMercadoPagoButton from '@/components/PayWithMercadoPagoButton';

export default function ExamplePage() {
  const handlePaymentStarted = (preferenceId: string) => {
    console.log('Payment started with preference ID:', preferenceId);
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error);
    alert('Error al procesar el pago: ' + error.message);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Ejemplo de Pago
        </h1>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold text-lg mb-2">Suscripción Premium</h2>
            <p className="text-gray-600 mb-4">
              Acceso completo a todas las funciones premium por un mes.
            </p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">Precio:</span>
              <span className="text-xl font-bold text-green-600">$19.999 ARS</span>
            </div>
            
            <PayWithMercadoPagoButton
              orderId="ORDER-123"
              title="Suscripción Premium"
              amount={19999}
              currencyId="ARS"
              payerEmail="test_user_123456@testuser.com"
              onStarted={handlePaymentStarted}
              onError={handlePaymentError}
              className="w-full"
            />
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="font-semibold text-lg mb-2">Producto Digital</h2>
            <p className="text-gray-600 mb-4">
              Descarga de ebook premium con contenido exclusivo.
            </p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">Precio:</span>
              <span className="text-xl font-bold text-green-600">$5.000 ARS</span>
            </div>
            
            <PayWithMercadoPagoButton
              orderId="ORDER-456"
              title="Ebook Premium"
              amount={5000}
              quantity={1}
              currencyId="ARS"
              onStarted={handlePaymentStarted}
              onError={handlePaymentError}
              className="w-full"
            >
              Comprar Ebook
            </PayWithMercadoPagoButton>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Información de Testing</h3>
          <p className="text-sm text-blue-800">
            Usa las tarjetas de prueba de Mercado Pago para simular pagos:
          </p>
          <ul className="text-xs text-blue-700 mt-2 space-y-1">
            <li>• Visa: 4509 9535 6623 3704</li>
            <li>• Mastercard: 5031 7557 3453 0604</li>
            <li>• CVV: 123, Vencimiento: 11/25</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
