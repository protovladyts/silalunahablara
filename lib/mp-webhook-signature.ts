import { createHmac, timingSafeEqual } from "crypto";

interface VerifyMPSignatureParams {
  request: Request;
  bodyJson: any;
}

interface VerifyMPSignatureResult {
  ok: boolean;
  reason?: string;
  paymentId?: string;
  requestId?: string;
  timestamp?: string;
}

export function verifyMPSignature({ request, bodyJson }: VerifyMPSignatureParams): VerifyMPSignatureResult {
  try {
    // 1. Obtener headers requeridos
    const xSignature = request.headers.get('x-signature');
    const xRequestId = request.headers.get('x-request-id');

    if (!xSignature) {
      console.log('[MP Signature] Missing x-signature header');
      return { ok: false, reason: 'Missing signature header' };
    }

    if (!xRequestId) {
      console.log('[MP Signature] Missing x-request-id header');
      return { ok: false, reason: 'Missing request-id header' };
    }

    // 2. Parsear x-signature con regex robusto (soporta tanto ; como , como separador)
    const signatureRegex = /ts=(\d+)[;,]\s*v1=([a-fA-F0-9]+)/;
    const match = xSignature.match(signatureRegex);

    if (!match) {
      console.log('[MP Signature] Invalid signature format');
      return { ok: false, reason: 'Invalid signature format' };
    }

    const [, ts, v1] = match;
    const timestamp = ts;
    const receivedHash = v1.toLowerCase(); // Normalizar a minúscula

    // 3. Obtener paymentId del body
    let paymentId: string | undefined;
    
    // Prioridad: body.data.id (JSON)
    if (bodyJson?.data?.id) {
      paymentId = bodyJson.data.id.toString();
    }
    // Fallback: query string data.id
    else {
      const url = new URL(request.url);
      paymentId = url.searchParams.get('data.id') || undefined;
    }

    if (!paymentId) {
      console.log('[MP Signature] Missing payment ID');
      return { ok: false, reason: 'Missing payment ID' };
    }

    // 4. Protección anti-replay - verificar timestamp
    const now = Date.now();
    const tsNumber = Number(timestamp);
    const timeDiff = Math.abs(now - tsNumber);

    if (timeDiff > 5 * 60 * 1000) { // 5 minutos
      console.log('[MP Signature] Timestamp outside valid window', { 
        now, 
        ts: tsNumber, 
        diff: timeDiff 
      });
      return { ok: false, reason: 'Timestamp outside valid window' };
    }

    // 5. Construir manifest exacto
    const manifest = `id:${paymentId};request-id:${xRequestId};ts:${timestamp};`;

    // 6. Obtener webhook secret
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.log('[MP Signature] Missing WEBHOOK_SECRET environment variable');
      return { ok: false, reason: 'Missing webhook secret' };
    }

    // 7. Calcular firma esperada
    const expectedHash = createHmac('sha256', webhookSecret)
      .update(manifest)
      .digest('hex')
      .toLowerCase();

    // 8. Comparación con tiempo constante
    const receivedBuffer = Buffer.from(receivedHash, 'hex');
    const expectedBuffer = Buffer.from(expectedHash, 'hex');

    if (receivedBuffer.length !== expectedBuffer.length) {
      console.log('[MP Signature] Hash length mismatch');
      return { ok: false, reason: 'Invalid signature' };
    }

    const isValid = timingSafeEqual(receivedBuffer, expectedBuffer);

    if (!isValid) {
      console.log('[MP Signature] Signature verification failed');
      return { ok: false, reason: 'Invalid signature' };
    }

    // 9. Logs de debug (sin secretos)
    console.log('[MP Signature] Verification successful', {
      requestId: xRequestId,
      timestamp,
      paymentId,
      manifestLength: manifest.length
    });

    return {
      ok: true,
      paymentId,
      requestId: xRequestId,
      timestamp
    };

  } catch (error) {
    console.error('[MP Signature] Verification error:', error);
    return { ok: false, reason: 'Verification error' };
  }
}
