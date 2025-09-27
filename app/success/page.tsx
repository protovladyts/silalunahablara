'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface OrderStatus {
  orderId: string;
  status: string;
  updatedAt: string;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const preferenceId = searchParams.get('preference_id');
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (preferenceId) {
      fetchOrderStatus(preferenceId);
    } else {
      setLoading(false);
    }
  }, [preferenceId]);

  const fetchOrderStatus = async (orderId: string) => {
    try {
      const response = await fetch(`/api/mp/order-status?orderId=${orderId}`);
      const data = await response.json();
      
      if (data.ok) {
        setOrderStatus(data);
      }
    } catch (error) {
      console.error('Error fetching order status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved':
        return '¡Pago aprobado exitosamente!';
      case 'pending':
        return 'Pago pendiente de confirmación';
      case 'rejected':
        return 'Pago rechazado';
      case 'refunded':
        return 'Pago reembolsado';
      default:
        return 'Estado del pago desconocido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      case 'refunded':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Pago Exitoso!
          </h1>
          <p className="text-gray-600">
            Tu pago ha sido procesado correctamente.
          </p>
        </div>

        {loading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        ) : orderStatus ? (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Estado del Pedido</h3>
              <p className={`font-medium ${getStatusColor(orderStatus.status)}`}>
                {getStatusMessage(orderStatus.status)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                ID: {orderStatus.orderId}
              </p>
              <p className="text-sm text-gray-500">
                Actualizado: {new Date(orderStatus.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-yellow-800">
              No se pudo obtener el estado del pedido.
            </p>
            {preferenceId && (
              <p className="text-sm text-yellow-700 mt-1">
                Preference ID: {preferenceId}
              </p>
            )}
          </div>
        )}

        <div className="mt-6">
          <a
            href="/example"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Ejemplo
          </a>
        </div>
      </div>
    </div>
  );
}
