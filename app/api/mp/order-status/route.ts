import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getPayment } from '@/lib/mercadopago-official';
import { prisma } from '@/lib/db';

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

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({
        ok: false,
        error: 'orderId parameter is required',
      }, { status: 400 });
    }

    const orders = await readOrders();
    
    // Buscar por orderId o por external_reference
    let order = orders[orderId];
    
    if (!order) {
      // Si no encuentra por orderId, buscar por external_reference
      for (const [key, value] of Object.entries(orders)) {
        if (key.includes(orderId) || orderId.includes(key)) {
          order = value;
          break;
        }
      }
    }

    // Si no encontramos en el archivo local, buscar en la base de datos
    if (!order) {
      console.log('[Order Status] Order not found locally, checking database for:', orderId);
      
      try {
        const dbPayment = await prisma.tarotPayment.findUnique({
          where: {
            orderId: orderId
          }
        });

        if (dbPayment) {
          // Mapear el estado de la base de datos al formato esperado
          let mappedStatus: OrderStatus['status'] = 'created';
          switch (dbPayment.status) {
            case 'completed':
              mappedStatus = 'approved';
              break;
            case 'pending':
              mappedStatus = 'pending';
              break;
            case 'failed':
              mappedStatus = 'rejected';
              break;
            case 'refunded':
              mappedStatus = 'refunded';
              break;
            default:
              mappedStatus = 'created';
          }

          console.log('[Order Status] Found payment in database:', {
            orderId: dbPayment.orderId,
            status: dbPayment.status,
            mappedStatus: mappedStatus
          });

          return NextResponse.json({
            ok: true,
            orderId: dbPayment.orderId,
            status: mappedStatus,
            updatedAt: dbPayment.updatedAt.toISOString(),
            source: 'database'
          });
        }
      } catch (error) {
        console.error('[Order Status] Error checking database:', error);
      }
    }

    if (!order) {
      // Si no encontramos el orden localmente, intentar consultar directamente a Mercado Pago
      console.log('[Order Status] Order not found locally, checking Mercado Pago API for:', orderId);
      
      try {
        // Si el orderId parece ser un payment ID de Mercado Pago
        if (/^\d+$/.test(orderId)) {
          const payment = await getPayment(orderId);
          
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
          
          console.log('[Order Status] Found payment in Mercado Pago:', {
            id: payment.id,
            status: payment.status,
            mappedStatus: status
          });
          
          return NextResponse.json({
            ok: true,
            orderId: orderId,
            status: status,
            updatedAt: new Date().toISOString(),
            source: 'mercadopago_api'
          });
        }
      } catch (error) {
        console.error('[Order Status] Error checking Mercado Pago API:', error);
      }
      
      return NextResponse.json({
        ok: false,
        error: 'Order not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      orderId: order.orderId,
      status: order.status,
      updatedAt: order.updatedAt,
      source: 'local_file'
    });

  } catch (error) {
    console.error('Error getting order status:', error);
    
    return NextResponse.json({
      ok: false,
      error: 'Failed to get order status',
    }, { status: 500 });
  }
}
