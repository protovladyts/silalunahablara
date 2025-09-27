import { NextRequest, NextResponse } from 'next/server';
import { mpClient } from '@/lib/mercadopago';

export async function GET(request: NextRequest) {
  try {
    const client = mpClient();
    
    // Intentar obtener información del usuario/seller
    try {
      const response = await fetch('https://api.mercadopago.com/users/me', {
        headers: {
          'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const userInfo = await response.json();
        return NextResponse.json({
          ok: true,
          message: "Access Token válido",
          userInfo: {
            id: userInfo.id,
            nickname: userInfo.nickname,
            email: userInfo.email,
            site_id: userInfo.site_id,
            country_id: userInfo.country_id,
            permalink: userInfo.permalink
          }
        });
      } else {
        const errorText = await response.text();
        return NextResponse.json({
          ok: false,
          error: "Access Token inválido",
          details: errorText,
          status: response.status
        }, { status: 400 });
      }
    } catch (error) {
      return NextResponse.json({
        ok: false,
        error: "Error verificando Access Token",
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('[MP Verify Token] Error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to verify token',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
