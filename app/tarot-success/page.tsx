'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderStatus {
  orderId: string;
  status: string;
  updatedAt: string;
}

function TarotSuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preferenceId = searchParams.get('preference_id');
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (preferenceId) {
      fetchOrderStatus(preferenceId);
    } else {
      setError('No se encontró el ID de la preferencia');
      setLoading(false);
    }
  }, [preferenceId])

  const fetchOrderStatus = async (orderId: string) => {
    try {
      const response = await fetch(`/api/mp/order-status?orderId=${orderId}`);
      const data = await response.json();
      
      if (data.ok) {
        setOrderStatus(data);
      } else {
        setError(data.error || 'No se pudo obtener el estado del pedido');
      }
    } catch (error) {
      console.error('Error fetching order status:', error);
      setError('Error al consultar el estado del pedido');
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

  const handleContinueToTarot = () => {
    // Solo permitir continuar si el pago fue aprobado
    if (orderStatus?.status === 'approved') {
      router.push('/session');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100';
      case 'pending':
        return 'bg-yellow-100';
      case 'rejected':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getTitle = (status: string) => {
    switch (status) {
      case 'approved':
        return '¡Pago Exitoso!';
      case 'pending':
        return 'Pago Pendiente';
      case 'rejected':
        return 'Pago Fallido';
      default:
        return 'Estado del Pago';
    }
  };

  const getSubtitle = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Tu consulta adicional de tarot ha sido procesada correctamente.';
      case 'pending':
        return 'Tu pago está siendo procesado. Te notificaremos cuando se complete.';
      case 'rejected':
        return 'Hubo un problema con tu pago. Por favor, intenta nuevamente.';
      default:
        return 'Verificando el estado de tu pago...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.1)_0%,_transparent_70%)]" />
      </div>

      <div className="bg-slate-800/80 border-violet-400/30 backdrop-blur-sm rounded-lg shadow-lg p-8 max-w-md w-full text-center relative z-10">
        <div className="mb-6">
          <div className={`w-16 h-16 ${orderStatus ? getStatusBgColor(orderStatus.status) : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {orderStatus ? getStatusIcon(orderStatus.status) : (
              <svg className="w-8 h-8 text-gray-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </div>
          <h1 className="text-2xl font-bold text-violet-100 mb-2">
            {orderStatus ? getTitle(orderStatus.status) : 'Verificando Pago...'}
          </h1>
          <p className="text-violet-300">
            {orderStatus ? getSubtitle(orderStatus.status) : 'Por favor espera mientras verificamos el estado de tu pago.'}
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

        <div className="mt-6 space-y-3">
          {orderStatus?.status === 'approved' && (
            <button
              onClick={handleContinueToTarot}
              className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-colors font-semibold"
            >
              🔮 Hacer Nueva Consulta de Tarot
            </button>
          )}
          
          {orderStatus?.status === 'rejected' && (
            <Link
              href="/session"
              className="block w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors text-center font-semibold"
            >
              🔄 Intentar Pago Nuevamente
            </Link>
          )}
          
          {orderStatus?.status === 'pending' && (
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800 text-sm">
                Tu pago está siendo procesado. Puedes cerrar esta ventana y te notificaremos cuando se complete.
              </p>
            </div>
          )}
          
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-center"
          >
            Volver al Inicio
          </Link>
        </div>

        <div className="mt-6 text-center text-xs text-violet-400">
          <p>¿Tenés dudas? Contactanos:</p>
          <p className="font-semibold">silalunahablara@gmail.com</p>
        </div>
      </div>
    </div>
  );
}

export default function TarotSuccessPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <TarotSuccessPageContent />
    </Suspense>
  );
}
