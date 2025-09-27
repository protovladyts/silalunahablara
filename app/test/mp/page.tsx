'use client';

import { useState, useEffect } from 'react';
import PayWithMercadoPagoButton from '@/components/PayWithMercadoPagoButton';

interface ProductInfo {
  id: string;
  title: string;
  price: number;
  quantity: number;
  isSandbox: boolean;
  realPrice: number;
  sandboxPrice: number;
}

export default function TestMercadoPagoPage() {
  const [orderId, setOrderId] = useState(`test-${Date.now()}`);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductInfo = async () => {
      try {
        const tarotProductId = process.env.NEXT_PUBLIC_TAROT_PRODUCT_ID || 'tarot-reading';
        const response = await fetch(`/api/mp/product-info?itemId=${tarotProductId}`);
        const data = await response.json();
        
        if (data.ok) {
          setProductInfo(data.product);
        } else {
          setPaymentStatus(`Error: ${data.error}`);
        }
      } catch (error) {
        setPaymentStatus(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProductInfo();
  }, []);

  const handlePaymentStarted = (preferenceId: string) => {
    setPaymentStatus(`Pago iniciado. Preference ID: ${preferenceId}`);
    console.log('Payment started:', preferenceId);
  };

  const handlePaymentError = (error: Error) => {
    setPaymentStatus(`Error: ${error.message}`);
    console.error('Payment error:', error);
  };

  const generateNewOrderId = () => {
    setOrderId(`test-${Date.now()}`);
    setPaymentStatus('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Test Mercado Pago
          </h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order ID:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={generateNewOrderId}
                  className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Nuevo
                </button>
              </div>
            </div>

            <PayWithMercadoPagoButton
              orderId={orderId}
              itemId={process.env.NEXT_PUBLIC_TAROT_PRODUCT_ID || 'tarot-reading'}
              onStarted={handlePaymentStarted}
              onError={handlePaymentError}
              className="w-full"
            >
              💳 Pagar ${productInfo?.price || '...'} ARS
            </PayWithMercadoPagoButton>

            {paymentStatus && (
              <div className={`p-4 rounded-md ${
                paymentStatus.includes('Error') 
                  ? 'bg-red-50 text-red-800' 
                  : 'bg-green-50 text-green-800'
              }`}>
                <p className="text-sm font-medium">{paymentStatus}</p>
              </div>
            )}
            <div className="text-center">
              <a 
                href="/"
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                ← Volver al inicio
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
