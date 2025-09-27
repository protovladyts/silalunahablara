'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function TarotPendingPage() {
  const searchParams = useSearchParams();
  const preferenceId = searchParams.get('preference_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.1)_0%,_transparent_70%)]" />
      </div>

      <div className="bg-slate-800/80 border-yellow-400/30 backdrop-blur-sm rounded-lg shadow-lg p-8 max-w-md w-full text-center relative z-10">
        <div className="mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-yellow-100 mb-2">
            Pago Pendiente
          </h1>
          <p className="text-yellow-300">
            Tu pago está siendo procesado. Te notificaremos cuando esté confirmado.
          </p>
        </div>

        {preferenceId && (
          <div className="p-4 bg-yellow-50 rounded-lg mb-6">
            <p className="text-sm text-yellow-700">
              Preference ID: {preferenceId}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-colors font-semibold text-center"
          >
            🔮 Verificar Estado
          </Link>
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