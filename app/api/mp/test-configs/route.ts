import { NextRequest, NextResponse } from 'next/server';
import { mpClient } from '@/lib/mercadopago';

export async function GET(request: NextRequest) {
  try {
    const client = mpClient();
    
    // Crear una preference con diferentes configuraciones para ver cuál funciona
    const testConfigs = [
      {
        name: "Config 1: Sin back_urls",
        payload: {
          items: [{
            title: "Test Item",
            unit_price: 1,
            quantity: 1,
            currency_id: "ARS"
          }],
          external_reference: "test-no-back-urls-" + Date.now()
        }
      },
      {
        name: "Config 2: Con back_urls simples",
        payload: {
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
          external_reference: "test-simple-back-urls-" + Date.now()
        }
      },
      {
        name: "Config 3: Con back_urls de ngrok",
        payload: {
          items: [{
            title: "Test Item",
            unit_price: 1,
            quantity: 1,
            currency_id: "ARS"
          }],
          back_urls: {
            success: "https://c57074932db0.ngrok-free.app/success",
            failure: "https://c57074932db0.ngrok-free.app/failure",
            pending: "https://c57074932db0.ngrok-free.app/pending"
          },
          external_reference: "test-ngrok-back-urls-" + Date.now()
        }
      }
    ];

    const results = [];

    for (const config of testConfigs) {
      try {
        console.log(`[MP Test Configs] Testing: ${config.name}`);
        console.log(`[MP Test Configs] Payload:`, JSON.stringify(config.payload, null, 2));
        
        const preference = await client.createPreference(config.payload);
        
        results.push({
          config: config.name,
          success: true,
          preference: {
            id: preference.id,
            back_urls: preference.back_urls,
            notification_url: preference.notification_url,
            external_reference: preference.external_reference
          }
        });
        
        console.log(`[MP Test Configs] ${config.name} - SUCCESS`);
        
      } catch (error) {
        results.push({
          config: config.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        console.log(`[MP Test Configs] ${config.name} - ERROR:`, error);
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Test configurations completed",
      results
    });

  } catch (error) {
    console.error('[MP Test Configs] Error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to test configurations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
