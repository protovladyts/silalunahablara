import { NextRequest, NextResponse } from 'next/server';
import { mpClient } from '@/lib/mercadopago';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const preferenceId = searchParams.get('preference_id');
    
    if (!preferenceId) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Missing preference_id parameter' 
      }, { status: 400 });
    }

    console.log(`[MP Debug Flow] Analyzing preference: ${preferenceId}`);

    const client = mpClient();
    
    // 1. Obtener detalles de la preference
    const preference = await client.getPreference(preferenceId);
    
    // 2. Obtener merchant order si existe
    let merchantOrder = null;
    if (preference.merchant_order_id) {
      try {
        merchantOrder = await client.getMerchantOrder(preference.merchant_order_id);
      } catch (error) {
        console.log(`[MP Debug Flow] No merchant order found for ID: ${preference.merchant_order_id}`);
      }
    }

    // 3. Obtener payments si existen
    let payments = [];
    if (merchantOrder?.payments?.length > 0) {
      for (const paymentId of merchantOrder.payments) {
        try {
          const payment = await client.getPayment(paymentId);
          payments.push(payment);
        } catch (error) {
          console.log(`[MP Debug Flow] Error fetching payment ${paymentId}:`, error);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      preference: {
        id: preference.id,
        status: preference.status,
        init_point: preference.init_point,
        sandbox_init_point: preference.sandbox_init_point,
        back_urls: preference.back_urls,
        redirect_urls: preference.redirect_urls,
        notification_url: preference.notification_url,
        external_reference: preference.external_reference,
        payer: preference.payer,
        items: preference.items,
        total_amount: preference.total_amount,
        merchant_order_id: preference.merchant_order_id
      },
      merchantOrder: merchantOrder ? {
        id: merchantOrder.id,
        status: merchantOrder.status,
        order_status: merchantOrder.order_status,
        total_amount: merchantOrder.total_amount,
        paid_amount: merchantOrder.paid_amount,
        payments: merchantOrder.payments,
        external_reference: merchantOrder.external_reference
      } : null,
      payments: payments.map(p => ({
        id: p.id,
        status: p.status,
        status_detail: p.status_detail,
        transaction_amount: p.transaction_amount,
        currency_id: p.currency_id,
        payment_method_id: p.payment_method_id,
        payer: p.payer,
        external_reference: p.external_reference,
        order_id: p.order?.id
      }))
    });

  } catch (error) {
    console.error('[MP Debug Flow] Error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to analyze flow' 
    }, { status: 500 });
  }
}
