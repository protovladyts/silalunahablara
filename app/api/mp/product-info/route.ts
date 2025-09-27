import { NextRequest, NextResponse } from 'next/server';

// Definir productos disponibles (mismo que en create-preference)
const TAROT_PRODUCT_ID = process.env.TAROT_PRODUCT_ID || 'tarot-reading';

const PRODUCTS = {
  [TAROT_PRODUCT_ID]: {
    id: TAROT_PRODUCT_ID,
    title: 'Lectura Adicional de Tarot',
    price: parseInt(process.env.TAROT_READING_PRICE || '10000'), // Precio real en ARS
    quantity: 1,
    sandboxPrice: parseInt(process.env.TAROT_READING_SANDBOX_PRICE || '100'), // Precio para sandbox/testing
  }
};

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const itemId = url.searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({
        error: 'Missing itemId parameter'
      }, { status: 400 });
    }

    const product = PRODUCTS[itemId as keyof typeof PRODUCTS];
    
    if (!product) {
      return NextResponse.json({
        error: 'Product not found'
      }, { status: 404 });
    }

    // Usar precio real para pagos de prueba en producción
    const currentPrice = product.price;

    return NextResponse.json({
      ok: true,
      product: {
        id: product.id,
        title: product.title,
        price: currentPrice,
        quantity: product.quantity,
        isSandbox: false,
        realPrice: product.price,
        sandboxPrice: product.sandboxPrice
      }
    });

  } catch (error) {
    console.error('Error getting product info:', error);
    return NextResponse.json({
      ok: false,
      error: 'Failed to get product info',
    }, { status: 500 });
  }
}
