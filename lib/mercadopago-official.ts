import { MercadoPagoConfig, Preference, Payment, MerchantOrder } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
  }
});

const preference = new Preference(client);
const payment = new Payment(client);
const merchantOrder = new MerchantOrder(client);

export async function createPreference(data: any) {
  try {
    console.log('[MP Official] Creating preference with data:', JSON.stringify(data, null, 2));
    
    const result = await preference.create({
      body: data
    });
    
    console.log('[MP Official] Preference created successfully:', JSON.stringify({
      id: result.id,
      status: (result as any).status,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point
    }, null, 2));
    
    return result;
  } catch (error) {
    console.error('[MP Official] Error creating preference:', error);
    console.error('[MP Official] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      status: (error as any)?.status,
      statusText: (error as any)?.statusText,
      data: (error as any)?.data
    });
    throw error;
  }
}

export async function getPayment(paymentId: string) {
  try {
    const result = await payment.get({
      id: paymentId
    });
    
    return result;
  } catch (error) {
    console.error('[MP Official] Error getting payment:', error);
    throw error;
  }
}

export async function getMerchantOrder(merchantOrderId: number) {
  try {
    const result = await merchantOrder.get({
      merchantOrderId
    });
    
    return result;
  } catch (error) {
    console.error('[MP Official] Error getting merchant order:', error);
    throw error;
  }
}