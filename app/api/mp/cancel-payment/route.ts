import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { orderId, reason } = await request.json();

    if (!orderId) {
      return NextResponse.json({
        ok: false,
        error: 'orderId is required',
      }, { status: 400 });
    }

    console.log('[Cancel Payment] Canceling payment:', { orderId, reason });

    // Actualizar el estado del pago a failed
    const updatedPayment = await prisma.tarotPayment.updateMany({
      where: {
        orderId: orderId
      },
      data: {
        status: 'failed',
        updatedAt: new Date()
      }
    });

    if (updatedPayment.count === 0) {
      return NextResponse.json({
        ok: false,
        error: 'Payment not found',
      }, { status: 404 });
    }

    console.log('[Cancel Payment] Payment canceled successfully:', {
      orderId,
      updatedCount: updatedPayment.count
    });

    return NextResponse.json({
      ok: true,
      message: 'Payment canceled successfully',
      orderId,
      status: 'failed'
    });

  } catch (error) {
    console.error('[Cancel Payment] Error canceling payment:', error);
    return NextResponse.json({
      ok: false,
      error: 'Failed to cancel payment',
    }, { status: 500 });
  }
}
