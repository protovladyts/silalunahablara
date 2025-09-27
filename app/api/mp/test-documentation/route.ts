import { NextRequest, NextResponse } from 'next/server';
import { mpClient } from '@/lib/mercadopago';

export async function GET(request: NextRequest) {
  try {
    const client = mpClient();
    
    // Crear una preference según la documentación oficial de Mercado Pago
    const preferencePayload = {
      items: [{
        title: "Lectura Adicional de Tarot",
        unit_price: 100,
        quantity: 1,
        currency_id: "ARS"
      }],
      payer: {
        email: "test@example.com"
      },
      back_urls: {
        success: "https://httpbin.org/get",
        failure: "https://httpbin.org/get", 
        pending: "https://httpbin.org/get"
      },
      notification_url: "https://httpbin.org/post",
      external_reference: "test-documentation-" + Date.now(),
      auto_return: "approved",
      binary_mode: false,
      expires: false
    };

    console.log(`[MP Documentation Test] Creating preference:`, JSON.stringify(preferencePayload, null, 2));

    const preference = await client.createPreference(preferencePayload);

    return NextResponse.json({
      ok: true,
      message: "Preference created according to official documentation",
      preference: {
        id: preference.id,
        init_point: preference.init_point,
        sandbox_init_point: preference.sandbox_init_point,
        back_urls: preference.back_urls,
        notification_url: preference.notification_url,
        external_reference: preference.external_reference
      }
    });

  } catch (error) {
    console.error('[MP Documentation Test] Error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to create preference',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
