import { NextRequest, NextResponse } from 'next/server';
import { mpClient } from '@/lib/mercadopago';

export async function GET(request: NextRequest) {
  try {
    const client = mpClient();
    
    // Crear una preference muy simple para testing
    const testPreference = {
      items: [{
        title: "Test Item",
        unit_price: 1,
        quantity: 1,
        currency_id: "ARS"
      }],
      back_urls: {
        success: "https://httpbin.org/get",
        failure: "https://httpbin.org/get",
        pending: "https://httpbin.org/get"
      },
      notification_url: "https://httpbin.org/post",
      external_reference: "test-config-" + Date.now()
    };

    console.log(`[MP Test Config] Creating test preference:`, JSON.stringify(testPreference, null, 2));

    const preference = await client.createPreference(testPreference);

    return NextResponse.json({
      ok: true,
      message: "Test preference created successfully",
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
    console.error('[MP Test Config] Error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to create test preference',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
