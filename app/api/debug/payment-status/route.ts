import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return NextResponse.json({
        error: 'Email parameter is required'
      }, { status: 400 });
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        tarotPayments: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!user) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 });
    }

    // Buscar órdenes en el archivo local
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');
    let orders = {};
    
    try {
      const data = await fs.readFile(ORDERS_FILE, 'utf-8');
      orders = JSON.parse(data);
    } catch {
      orders = {};
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        hasFreeTarot: user.hasFreeTarot,
        createdAt: user.createdAt
      },
      payments: user.tarotPayments.map(payment => ({
        id: payment.id,
        orderId: payment.orderId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentType: payment.paymentType,
        createdAt: payment.createdAt
      })),
      orders: Object.entries(orders).map(([key, value]) => ({
        orderId: key,
        ...value
      }))
    });

  } catch (error) {
    console.error('Error getting payment status:', error);
    return NextResponse.json({
      error: 'Failed to get payment status'
    }, { status: 500 });
  }
}
