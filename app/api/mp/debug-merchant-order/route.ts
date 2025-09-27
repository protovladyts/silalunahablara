import { NextRequest, NextResponse } from 'next/server';
import { mpClient } from '@/lib/mercadopago';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const merchantOrderId = url.searchParams.get('merchant_order_id');

    if (!merchantOrderId) {
      return NextResponse.json({
        ok: false,
        error: 'merchant_order_id parameter is required',
      }, { status: 400 });
    }

    console.log(`[MP Debug] Fetching merchant order details for ID: ${merchantOrderId}`);

    const client = mpClient();
    const merchantOrder = await client.getMerchantOrder(parseInt(merchantOrderId));

    console.log(`[MP Debug] Merchant order details retrieved:`, merchantOrder);

    return NextResponse.json({
      ok: true,
      merchantOrder: merchantOrder,
    });

  } catch (error) {
    console.error('[MP Debug] Error fetching merchant order:', error);
    
    return NextResponse.json({
      ok: false,
      error: 'Failed to fetch merchant order details',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
