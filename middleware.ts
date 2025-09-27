import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/mp/')) {
    const method = request.method;

    if (pathname === '/api/mp/create-preference' && method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    if (pathname === '/api/mp/webhook' && method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    if (pathname === '/api/mp/order-status' && method !== 'GET') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const userAgent = request.headers.get('user-agent');
    
    // Permitir requests desde scripts de testing
    if (method === 'POST' && userAgent?.includes('node')) {
      // Es un script de Node.js, permitir
      return NextResponse.next();
    }
    
    if (method === 'POST' && !origin && !referer) {
      return NextResponse.json(
        { error: 'Missing origin or referer header' },
        { status: 400 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/mp/:path*',
};
