// Re-export MercadoPago functions from the official implementation
export { createPreference, getPayment, getMerchantOrder } from './mercadopago-official';

// Create a client function for backward compatibility
import { MercadoPagoConfig } from 'mercadopago';

export function mpClient() {
  return new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
    options: {
      timeout: 5000,
    }
  });
}
