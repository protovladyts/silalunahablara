import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPayment, getMerchantOrder } from '@/lib/mercadopago-official';
import { prisma } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

const WebhookSchema = z.object({
  type: z.string(),
  data: z.object({
    id: z.string(),
  }),
});

interface OrderStatus {
  orderId: string;
  status: 'created' | 'approved' | 'pending' | 'rejected' | 'refunded';
  updatedAt: string;
}

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

async function readOrders(): Promise<Record<string, OrderStatus>> {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeOrders(orders: Record<string, OrderStatus>): Promise<void> {
  await fs.mkdir(path.dirname(ORDERS_FILE), { recursive: true });
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

async function updateOrderStatus(orderId: string, status: OrderStatus['status']): Promise<void> {
  const orders = await readOrders();
  orders[orderId] = {
    orderId,
    status,
    updatedAt: new Date().toISOString(),
  };
  await writeOrders(orders);
}

export async function POST(request: NextRequest) {
  try {
    console.log('[MP Webhook] Starting webhook processing');
    console.log('[MP Webhook] Request URL:', request.url);
    console.log('[MP Webhook] Request headers:', Object.fromEntries(request.headers.entries()));
    
    const receivedBody = await request.json();
    console.log('[MP Webhook] Received body:', JSON.stringify(receivedBody, null, 2));
    
    const url = new URL(request.url);
    
    // Manejar ambos formatos de webhook de Mercado Pago
    let topic: string | null = null;
    let id: string | null = null;
    
    // Formato 1: Parámetros en URL (?topic=payment&id=123456)
    topic = url.searchParams.get('topic');
    id = url.searchParams.get('id');
    
    // Formato 2: Parámetros en body (?data.id=123456&type=payment)
    if (!topic || !id) {
      topic = url.searchParams.get('type') || receivedBody.type;
      id = url.searchParams.get('data.id') || receivedBody.data?.id;
    }

    console.log('[MP Webhook] Parsed parameters:', { topic, id });

    if (!topic || !id) {
      console.log('[MP Webhook] Missing required parameters');
      return NextResponse.json({
        ok: false,
        error: 'Missing required parameters',
      }, { status: 400 });
    }

    // Verificar firma del webhook
    const signature = request.headers.get('x-signature');
    const webhookSecret = process.env.MP_WEBHOOK_SECRET;
    
    console.log('[MP Webhook] Webhook signature verification:', {
      hasSignature: !!signature,
      hasSecret: !!webhookSecret,
      signature: signature ? signature.substring(0, 50) + '...' : 'none',
      webhookSecret: webhookSecret ? webhookSecret.substring(0, 10) + '...' : 'none'
    });
    
    // Verificar firma si tenemos el secret y no estamos en modo desarrollo
    const skipSignatureVerification = process.env.NODE_ENV === 'development' && process.env.MP_SKIP_SIGNATURE_VERIFICATION === 'true';
    
    if (webhookSecret && signature && !skipSignatureVerification) {
      try {
        const crypto = await import('crypto');
        
        // Parsear la firma: ts=1756870559,v1=e4f20b1577738003061cbbcbe00394846c9f5d5cfe20292d94f01cf6a3ae22b5
        const parts = signature.split(',');
        let timestamp = '';
        let hash = '';
        
        for (const part of parts) {
          if (part.startsWith('ts=')) {
            timestamp = part.substring(3);
          } else if (part.startsWith('v1=')) {
            hash = part.substring(3);
          }
        }
        
        console.log('[MP Webhook] Parsed signature:', { timestamp, hash });
        
        // Crear la firma esperada según la documentación oficial de Mercado Pago
        // La firma se genera con: HMAC-SHA256(webhook_secret, timestamp + body)
        const bodyString = JSON.stringify(receivedBody);
        const payload = timestamp + bodyString;
        
        const expectedSignature = crypto
          .createHmac('sha256', webhookSecret)
          .update(payload)
          .digest('hex');
        
        console.log('[MP Webhook] Expected signature:', expectedSignature);
        console.log('[MP Webhook] Received signature:', hash);
        console.log('[MP Webhook] Payload used:', payload.substring(0, 100) + '...');
        
        if (hash !== expectedSignature) {
          console.log('[MP Webhook] Invalid signature - trying alternative method');
          
          // Método alternativo: solo con el timestamp (método anterior)
          const alternativeSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(timestamp)
            .digest('hex');
          
          console.log('[MP Webhook] Alternative signature:', alternativeSignature);
          
          if (hash !== alternativeSignature) {
            console.log('[MP Webhook] Both signature methods failed');
            return NextResponse.json({
              ok: false,
              error: 'Invalid signature',
            }, { status: 401 });
          } else {
            console.log('[MP Webhook] Alternative signature method succeeded');
          }
        } else {
          console.log('[MP Webhook] Primary signature method succeeded');
        }
        
        console.log('[MP Webhook] Signature verified successfully');
      } catch (error) {
        console.error('[MP Webhook] Error verifying signature:', error);
        // Continuar sin verificar en caso de error
      }
    } else if (skipSignatureVerification) {
      console.log('[MP Webhook] Skipping signature verification (development mode with MP_SKIP_SIGNATURE_VERIFICATION=true)');
    } else {
      console.log('[MP Webhook] No webhook signature verification (no secret or signature)');
    }

    const webhookData = WebhookSchema.parse({ type: topic, data: { id } });
    console.log('[MP Webhook] Webhook data validated:', JSON.stringify(webhookData, null, 2));
    if (topic === 'payment') {
      console.log('[MP Webhook] Processing payment notification for ID:', id);
      
      const payment = await getPayment(id);
      console.log('[MP Webhook] Payment details:', JSON.stringify({
        id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        transaction_amount: payment.transaction_amount,
        currency_id: payment.currency_id,
        payment_method_id: payment.payment_method_id,
        payer_email: payment.payer?.email,
        external_reference: payment.external_reference,
        order_id: payment.order?.id,
        date_created: payment.date_created,
        date_approved: payment.date_approved,
        is_test: (payment as any).is_test
      }, null, 2));
      
      let status: OrderStatus['status'] = 'created';
      
      switch (payment.status) {
        case 'approved':
          status = 'approved';
          break;
        case 'pending':
          status = 'pending';
          break;
        case 'rejected':
        case 'cancelled':
          status = 'rejected';
          break;
        case 'refunded':
          status = 'refunded';
          break;
        default:
          status = 'created';
      }
      
      console.log('[MP Webhook] Payment status mapped:', payment.status, '->', status);

      // Actualizar el estado del pago en la base de datos
      if (payment.external_reference && payment.external_reference.startsWith('tarot-reading-')) {
        console.log('[MP Webhook] Updating payment status in database for:', payment.external_reference);
        try {
          const dbStatus = status === 'approved' ? 'completed' : 
                          status === 'rejected' ? 'failed' : 
                          status === 'pending' ? 'pending' : 'pending';

          const updatedPayment = await prisma.tarotPayment.updateMany({
            where: {
              orderId: payment.external_reference
            },
            data: {
              status: dbStatus,
              updatedAt: new Date()
            }
          });

          console.log('[MP Webhook] Payment status updated in database:', {
            orderId: payment.external_reference,
            status: dbStatus,
            updatedCount: updatedPayment.count
          });
        } catch (error) {
          console.error('[MP Webhook] Error updating payment status in database:', error);
        }
      }

      if (payment.order?.id) {
        console.log('[MP Webhook] Using order.id for processing:', payment.order.id);
        await updateOrderStatus(payment.order.id.toString(), status);
        
        // También guardar por external_reference si existe
        if (payment.external_reference) {
          await updateOrderStatus(payment.external_reference, status);
        }
        
        // Guardar también por preference_id para que el frontend pueda encontrarlo
        const merchantOrderId = parseInt(payment.order.id.toString());
        try {
          const merchantOrder = await getMerchantOrder(merchantOrderId);
          if (merchantOrder.preference_id) {
            await updateOrderStatus(merchantOrder.preference_id, status);
            console.log('[MP Webhook] Also saved by preference_id:', merchantOrder.preference_id);
          }
        } catch (error) {
          console.error('[MP Webhook] Error getting merchant order for preference_id:', error);
        }
        
        // Si es un pago aprobado y parece ser de tarot, procesar el pago
        console.log('[MP Webhook] Checking if payment is for tarot:', {
          status,
          external_reference: payment.external_reference,
          isApproved: status === 'approved',
          isTarot: payment.external_reference?.startsWith('tarot-reading-')
        });
        
        if (status === 'approved' && payment.external_reference && payment.external_reference.startsWith('tarot-reading-')) {
          console.log('[MP Webhook] Processing tarot payment for external_reference:', payment.external_reference);
          try {
            const email = payment.external_reference.split('-')[2]; // Extraer email del external_reference
            console.log('[MP Webhook] Extracted email from external_reference:', email);
            
            const tarotResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tarot/payment-success`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: payment.external_reference,
                userEmail: email,
              }),
            });
            
            console.log('[MP Webhook] Tarot payment processing response:', tarotResponse.status);
            const responseData = await tarotResponse.json();
            console.log('[MP Webhook] Tarot payment processing response data:', responseData);
          } catch (error) {
            console.error('[MP Webhook] Error processing tarot payment:', error);
          }
        } else {
          console.log('[MP Webhook] Payment not for tarot or not approved:', { 
            status, 
            orderId: payment.order.id, 
            external_reference: payment.external_reference,
            isTarot: payment.external_reference?.startsWith('tarot-reading-')
          });
        }
      } else if (payment.external_reference) {
        console.log('[MP Webhook] Using external_reference for processing:', payment.external_reference);
        // Usar external_reference si no hay order.id
        await updateOrderStatus(payment.external_reference, status);
        
        // También intentar guardar por preference_id si tenemos el order_id
        if (payment.order?.id) {
          const merchantOrderId = parseInt(payment.order.id.toString());
          try {
            const merchantOrder = await getMerchantOrder(merchantOrderId);
            if (merchantOrder.preference_id) {
              await updateOrderStatus(merchantOrder.preference_id, status);
              console.log('[MP Webhook] Also saved by preference_id:', merchantOrder.preference_id);
            }
          } catch (error) {
            console.error('[MP Webhook] Error getting merchant order for preference_id:', error);
          }
        }
        
        if (status === 'approved' && payment.external_reference.startsWith('tarot-reading-')) {
          console.log('[MP Webhook] Processing tarot payment for external_reference:', payment.external_reference);
          try {
            const email = payment.external_reference.split('-')[2];
            console.log('[MP Webhook] Extracted email from external_reference:', email);
            
            const tarotResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tarot/payment-success`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: payment.external_reference,
                userEmail: email,
              }),
            });
            
            console.log('[MP Webhook] Tarot payment processing response:', tarotResponse.status);
          } catch (error) {
            console.error('[MP Webhook] Error processing tarot payment:', error);
          }
        } else {
          console.log('[MP Webhook] Payment not for tarot or not approved:', { status, external_reference: payment.external_reference });
        }
      } else {
        console.log('[MP Webhook] No order.id or external_reference found');
      }
    } else if (topic === 'merchant_order') {
      console.log('[MP Webhook] Processing merchant_order notification for ID:', id);
      
      const merchantOrderId = parseInt(id);
      const merchantOrder = await getMerchantOrder(merchantOrderId);
      
      console.log('[MP Webhook] Merchant order details:', JSON.stringify({
        id: merchantOrder.id,
        status: merchantOrder.status,
        order_status: merchantOrder.order_status,
        external_reference: merchantOrder.external_reference,
        preference_id: merchantOrder.preference_id,
        total_amount: merchantOrder.total_amount,
        paid_amount: merchantOrder.paid_amount,
        payments: merchantOrder.payments,
        is_test: (merchantOrder as any).is_test
      }, null, 2));
    } else {
      console.log('[MP Webhook] Unhandled webhook topic:', topic);
    }

    console.log('[MP Webhook] Webhook processing completed successfully');
    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('[MP Webhook] Error occurred:', error);
    
    if (error instanceof z.ZodError) {
      console.log('[MP Webhook] Validation error:', JSON.stringify(error.errors, null, 2));
      return NextResponse.json({
        ok: false,
        error: 'Invalid webhook data',
      }, { status: 400 });
    }

    console.log('[MP Webhook] Unknown error type:', typeof error);
    console.log('[MP Webhook] Error message:', error instanceof Error ? error.message : 'Unknown error');
    
    return NextResponse.json({
      ok: false,
      error: 'Webhook processing failed',
    }, { status: 500 });
  }
}