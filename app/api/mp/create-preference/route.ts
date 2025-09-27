import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createPreference } from '@/lib/mercadopago-official';
import { prisma } from '@/lib/db';

const CreatePreferenceRequestSchema = z.object({
  orderId: z.string(),
  itemId: z.string(), // ID del producto que quiere comprar
  userEmail: z.string().email(), // Email del usuario para crear el registro de pago
});

// Definir productos disponibles
const TAROT_PRODUCT_ID = process.env.TAROT_PRODUCT_ID || 'tarot-reading';

const PRODUCTS = {
  [TAROT_PRODUCT_ID]: {
    id: TAROT_PRODUCT_ID,
    title: 'Lectura Adicional de Tarot',
    price: parseInt(process.env.TAROT_READING_PRICE || '10000'), // Precio real en ARS
    quantity: 1,
    sandboxPrice: parseInt(process.env.TAROT_READING_SANDBOX_PRICE || '100'), // Precio para sandbox/testing
  }
};

export async function POST(request: NextRequest) {
  try {
    console.log('[MP Create Preference] Starting request processing');
    
    const body = await request.json();
    console.log('[MP Create Preference] Request body:', JSON.stringify(body, null, 2));
    
    const validatedBody = CreatePreferenceRequestSchema.parse(body);
    console.log('[MP Create Preference] Validated body:', JSON.stringify(validatedBody, null, 2));
    
    // Verificar que el producto existe
    const product = PRODUCTS[validatedBody.itemId as keyof typeof PRODUCTS];
    if (!product) {
      console.log('[MP Create Preference] Product not found:', validatedBody.itemId);
      console.log('[MP Create Preference] Available products:', Object.keys(PRODUCTS));
      return NextResponse.json({
        ok: false,
        error: 'Product not found',
      }, { status: 400 });
    }
    
    console.log('[MP Create Preference] Product found:', JSON.stringify(product, null, 2));
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    console.log('[MP Create Preference] Base URL:', baseUrl);
    console.log('[MP Create Preference] NODE_ENV:', process.env.NODE_ENV);
    
    // Usar precio real para pagos de prueba en producción
    const unitPrice = product.price;
    console.log('[MP Create Preference] Using price:', unitPrice, '(sandbox:', product.sandboxPrice, ', real:', product.price, ')');
    
    const preferencePayload = {
      items: [{
        id: product.id,
        title: product.title,
        unit_price: unitPrice,
        quantity: 1,
        currency_id: 'ARS',
      }],
      external_reference: validatedBody.orderId,
      auto_return: "approved",
      back_urls: {
        success: `${baseUrl}/tarot-success`,
        failure: `${baseUrl}/tarot-failure`,
        pending: `${baseUrl}/tarot-pending`,
      },
      notification_url: `${baseUrl}/api/mp/webhook`,
      binary_mode: false,
      expires: false
    };

    console.log('[MP Create Preference] Preference payload:', JSON.stringify(preferencePayload, null, 2));

    const preference = await createPreference(preferencePayload);
    
    console.log('[MP Create Preference] Preference created successfully:', JSON.stringify({
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
      status: (preference as any).status || 'unknown'
    }, null, 2));

    // Crear registro de pago en estado pending
    console.log('[MP Create Preference] Creating payment record in pending status');
    try {
      // Buscar o crear el usuario
      let user = await prisma.user.findUnique({
        where: { email: validatedBody.userEmail }
      });

      if (!user) {
        console.log('[MP Create Preference] User not found, creating new user:', validatedBody.userEmail);
        user = await prisma.user.create({
          data: {
            email: validatedBody.userEmail,
            hasFreeTarot: false // Ya usó su consulta gratuita
          }
        });
      }

      // Crear registro de pago en estado pending
      const paymentRecord = await prisma.tarotPayment.create({
        data: {
          orderId: validatedBody.orderId,
          userId: user.id,
          amount: unitPrice,
          currency: 'ARS',
          status: 'pending',
          paymentType: 'additional_reading',
        }
      });

      console.log('[MP Create Preference] Payment record created:', {
        id: paymentRecord.id,
        orderId: paymentRecord.orderId,
        status: paymentRecord.status,
        amount: paymentRecord.amount
      });

    } catch (error) {
      console.error('[MP Create Preference] Error creating payment record:', error);
      // No fallar la creación de la preferencia si falla el registro de pago
    }

    return NextResponse.json({
      ok: true,
      preference_id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    });

  } catch (error) {
    console.error('[MP Create Preference] Error occurred:', error);
    
    if (error instanceof z.ZodError) {
      console.log('[MP Create Preference] Validation error:', JSON.stringify(error.errors, null, 2));
      return NextResponse.json({
        ok: false,
        error: 'Invalid request data',
        details: error.errors,
      }, { status: 400 });
    }

    console.log('[MP Create Preference] Unknown error type:', typeof error);
    console.log('[MP Create Preference] Error message:', error instanceof Error ? error.message : 'Unknown error');
    
    return NextResponse.json({
      ok: false,
      error: 'Failed to create preference',
    }, { status: 500 });
  }
}