import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('[Tarot Payment Success] Starting payment processing');
    const { orderId, userEmail } = await request.json();
    console.log('[Tarot Payment Success] Request data:', { orderId, userEmail });

    if (!orderId || !userEmail) {
      console.log('[Tarot Payment Success] Missing required fields');
      return NextResponse.json({
        ok: false,
        error: 'orderId and userEmail are required',
      }, { status: 400 });
    }

    // Buscar el usuario por email
    console.log('[Tarot Payment Success] Looking for user:', userEmail);
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      console.log('[Tarot Payment Success] User not found:', userEmail);
      return NextResponse.json({
        ok: false,
        error: 'User not found',
      }, { status: 404 });
    }

    console.log('[Tarot Payment Success] User found:', { 
      id: user.id, 
      email: user.email, 
      hasFreeTarot: user.hasFreeTarot 
    });

    // Verificar si ya se procesó este pago (evitar duplicados)
    const existingPayment = await prisma.tarotPayment.findFirst({
      where: {
        orderId: orderId,
        userId: user.id,
        status: 'completed'
      }
    });

    if (existingPayment) {
      console.log('[Tarot Payment Success] Payment already processed:', existingPayment.id);
      return NextResponse.json({
        ok: true,
        message: 'Payment already processed',
        hasFreeTarot: user.hasFreeTarot,
      });
    }

    // Crear registro de pago
    console.log('[Tarot Payment Success] Creating payment record');
    const paymentRecord = await prisma.tarotPayment.create({
      data: {
        orderId: orderId,
        userId: user.id,
        amount: 10000, // 10,000 ARS
        currency: 'ARS',
        status: 'completed',
        paymentType: 'additional_reading',
      }
    });
    console.log('[Tarot Payment Success] Payment record created:', paymentRecord.id);

    // Actualizar el usuario para darle créditos adicionales
    console.log('[Tarot Payment Success] Updating user credits');
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { 
        hasFreeTarot: true, // Restaurar crédito para nueva lectura
      }
    });
    console.log('[Tarot Payment Success] User updated:', { 
      id: updatedUser.id, 
      hasFreeTarot: updatedUser.hasFreeTarot 
    });

    console.log(`[Tarot Payment Success] Payment processed successfully for user ${userEmail}, orderId: ${orderId}`);

    return NextResponse.json({
      ok: true,
      message: 'Payment processed successfully. You can now make a new tarot reading!',
      hasFreeTarot: true,
    });

  } catch (error) {
    console.error('[Tarot Payment Success] Error processing payment:', error);
    
    return NextResponse.json({
      ok: false,
      error: 'Failed to process payment',
    }, { status: 500 });
  }
}
