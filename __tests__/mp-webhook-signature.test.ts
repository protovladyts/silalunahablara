import { createHmac } from "crypto";

// Mock de Request para testing
function createMockRequest(headers: Record<string, string>, url: string = 'https://example.com/api/mp/webhook'): Request {
  return {
    headers: {
      get: (name: string) => headers[name.toLowerCase()] || null
    },
    url
  } as Request;
}

// Función para calcular HMAC (para tests)
function calculateExpectedHash(manifest: string, secret: string): string {
  return createHmac('sha256', secret)
    .update(manifest)
    .digest('hex')
    .toLowerCase();
}

// Importar la función a testear
import { verifyMPSignature } from '../lib/mp-webhook-signature';

describe('MP Webhook Signature Verification', () => {
  const originalEnv = process.env.WEBHOOK_SECRET;

  beforeEach(() => {
    // Limpiar env antes de cada test
    delete process.env.WEBHOOK_SECRET;
  });

  afterEach(() => {
    // Restaurar env después de cada test
    if (originalEnv) {
      process.env.WEBHOOK_SECRET = originalEnv;
    }
  });

  describe('Casos válidos', () => {
    test('Caso válido 1: secret="test_secret", manifest="id:123;request-id:abc;ts:1700000000000;"', () => {
      // Arrange
      const secret = "test_secret";
      const manifest = "id:123;request-id:abc;ts:1700000000000;";
      const expectedHash = "cc49f0a05f3096e37762cd36085e8b9fe5edb4b2dbfecae0a9ad83c5aab1e34a";
      
      process.env.WEBHOOK_SECRET = secret;
      
      const headers = {
        'x-signature': `ts=1700000000000; v1=${expectedHash}`,
        'x-request-id': 'abc'
      };
      
      const request = createMockRequest(headers);
      const bodyJson = { data: { id: '123' } };

      // Act
      const result = verifyMPSignature({ request, bodyJson });

      // Assert
      expect(result.ok).toBe(true);
      expect(result.paymentId).toBe('123');
      expect(result.requestId).toBe('abc');
      expect(result.timestamp).toBe('1700000000000');
    });

    test('Caso válido 2: secret="webhook_secret_123", manifest="id:987654321;request-id:req-42;ts:1711111111111;"', () => {
      // Arrange
      const secret = "webhook_secret_123";
      const manifest = "id:987654321;request-id:req-42;ts:1711111111111;";
      const expectedHash = "ae88fb17b50354a781f928d57ade5c5548c0fb35965d357f945f9fd06a4c48c4";
      
      process.env.WEBHOOK_SECRET = secret;
      
      const headers = {
        'x-signature': `ts=1711111111111; v1=${expectedHash}`,
        'x-request-id': 'req-42'
      };
      
      const request = createMockRequest(headers);
      const bodyJson = { data: { id: '987654321' } };

      // Act
      const result = verifyMPSignature({ request, bodyJson });

      // Assert
      expect(result.ok).toBe(true);
      expect(result.paymentId).toBe('987654321');
      expect(result.requestId).toBe('req-42');
      expect(result.timestamp).toBe('1711111111111');
    });

    test('Debería funcionar con v1 en mayúsculas', () => {
      // Arrange
      const secret = "test_secret";
      const manifest = "id:123;request-id:abc;ts:1700000000000;";
      const expectedHash = "cc49f0a05f3096e37762cd36085e8b9fe5edb4b2dbfecae0a9ad83c5aab1e34a";
      
      process.env.WEBHOOK_SECRET = secret;
      
      const headers = {
        'x-signature': `ts=1700000000000; v1=${expectedHash.toUpperCase()}`,
        'x-request-id': 'abc'
      };
      
      const request = createMockRequest(headers);
      const bodyJson = { data: { id: '123' } };

      // Act
      const result = verifyMPSignature({ request, bodyJson });

      // Assert
      expect(result.ok).toBe(true);
    });

    test('Debería funcionar con espacios extra en x-signature', () => {
      // Arrange
      const secret = "test_secret";
      const manifest = "id:123;request-id:abc;ts:1700000000000;";
      const expectedHash = "cc49f0a05f3096e37762cd36085e8b9fe5edb4b2dbfecae0a9ad83c5aab1e34a";
      
      process.env.WEBHOOK_SECRET = secret;
      
      const headers = {
        'x-signature': `ts=1700000000000;   v1=${expectedHash}   `,
        'x-request-id': 'abc'
      };
      
      const request = createMockRequest(headers);
      const bodyJson = { data: { id: '123' } };

      // Act
      const result = verifyMPSignature({ request, bodyJson });

      // Assert
      expect(result.ok).toBe(true);
    });

    test('Debería funcionar con formato de coma (formato real de Mercado Pago)', () => {
      // Arrange
      const secret = "test_secret";
      const manifest = "id:123;request-id:abc;ts:1700000000000;";
      const expectedHash = "cc49f0a05f3096e37762cd36085e8b9fe5edb4b2dbfecae0a9ad83c5aab1e34a";
      
      process.env.WEBHOOK_SECRET = secret;
      
      const headers = {
        'x-signature': `ts=1700000000000,v1=${expectedHash}`,
        'x-request-id': 'abc'
      };
      
      const request = createMockRequest(headers);
      const bodyJson = { data: { id: '123' } };

      // Act
      const result = verifyMPSignature({ request, bodyJson });

      // Assert
      expect(result.ok).toBe(true);
    });

    test('Debería obtener paymentId de query string si no está en body', () => {
      // Arrange
      const secret = "test_secret";
      const manifest = "id:456;request-id:def;ts:1700000000000;";
      const expectedHash = calculateExpectedHash(manifest, secret);
      
      process.env.WEBHOOK_SECRET = secret;
      
      const headers = {
        'x-signature': `ts=1700000000000; v1=${expectedHash}`,
        'x-request-id': 'def'
      };
      
      const request = createMockRequest(headers, 'https://example.com/api/mp/webhook?data.id=456');
      const bodyJson = {}; // Sin data.id

      // Act
      const result = verifyMPSignature({ request, bodyJson });

      // Assert
      expect(result.ok).toBe(true);
      expect(result.paymentId).toBe('456');
    });
  });

  describe('Casos que deben fallar', () => {
    test('v1 distinto por 1 carácter → 401', () => {
      // Arrange
      const secret = "test_secret";
      const manifest = "id:123;request-id:abc;ts:1700000000000;";
      const expectedHash = "cc49f0a05f3096e37762cd36085e8b9fe5edb4b2dbfecae0a9ad83c5aab1e34a";
      const wrongHash = expectedHash.slice(0, -1) + 'x'; // Cambiar último carácter
      
      process.env.WEBHOOK_SECRET = secret;
      
      const headers = {
        'x-signature': `ts=1700000000000; v1=${wrongHash}`,
        'x-request-id': 'abc'
      };
      
      const request = createMockRequest(headers);
      const bodyJson = { data: { id: '123' } };

      // Act
      const result = verifyMPSignature({ request, bodyJson });

      // Assert
      expect(result.ok).toBe(false);
      expect(result.reason).toBe('Invalid signature');
    });

    test('ts fuera de ventana (>5 min pasado) → 401', () => {
      // Arrange
      const secret = "test_secret";
      const oldTimestamp = Date.now() - 6 * 60 * 1000; // 6 minutos atrás
      const manifest = `id:123;request-id:abc;ts:${oldTimestamp};`;
      const expectedHash = calculateExpectedHash(manifest, secret);
      
      process.env.WEBHOOK_SECRET = secret;
      
      const headers = {
        'x-signature': `ts=${oldTimestamp}; v1=${expectedHash}`,
        'x-request-id': 'abc'
      };
      
      const request = createMockRequest(headers);
      const bodyJson = { data: { id: '123' } };

      // Act
      const result = verifyMPSignature({ request, bodyJson });

      // Assert
      expect(result.ok).toBe(false);
      expect(result.reason).toBe('Timestamp outside valid window');
    });

    test('ts en el futuro (>5 min) → 401', () => {
      // Arrange
      const secret = "test_secret";
      const futureTimestamp = Date.now() + 6 * 60 * 1000; // 6 minutos en el futuro
      const manifest = `id:123;request-id:abc;ts:${futureTimestamp};`;
      const expectedHash = calculateExpectedHash(manifest, secret);
      
      process.env.WEBHOOK_SECRET = secret;
      
      const headers = {
        'x-signature': `ts=${futureTimestamp}; v1=${expectedHash}`,
        'x-request-id': 'abc'
      };
      
      const request = createMockRequest(headers);
      const bodyJson = { data: { id: '123' } };

      // Act
      const result = verifyMPSignature({ request, bodyJson });

      // Assert
      expect(result.ok).toBe(false);
      expect(result.reason).toBe('Timestamp outside valid window');
    });

    test('Falta x-request-id → 401', () => {
      // Arrange
      const secret = "test_secret";
      const manifest = "id:123;request-id:abc;ts:1700000000000;";
      const expectedHash = calculateExpectedHash(manifest, secret);
      
      process.env.WEBHOOK_SECRET = secret;
      
      const headers = {
        'x-signature': `ts=1700000000000; v1=${expectedHash}`
        // Sin x-request-id
      };
      
      const request = createMockRequest(headers);
      const bodyJson = { data: { id: '123' } };

      // Act
      const result = verifyMPSignature({ request, bodyJson });

      // Assert
      expect(result.ok).toBe(false);
      expect(result.reason).toBe('Missing request-id header');
    });

    test('Falta x-signature → 401', () => {
      // Arrange
      process.env.WEBHOOK_SECRET = "test_secret";
      
      const headers = {
        'x-request-id': 'abc'
        // Sin x-signature
      };
      
      const request = createMockRequest(headers);
      const bodyJson = { data: { id: '123' } };

      // Act
      const result = verifyMPSignature({ request, bodyJson });

      // Assert
      expect(result.ok).toBe(false);
      expect(result.reason).toBe('Missing signature header');
    });

    test('Formato inválido de x-signature → 401', () => {
      // Arrange
      process.env.WEBHOOK_SECRET = "test_secret";
      
      const headers = {
        'x-signature': 'invalid-format',
        'x-request-id': 'abc'
      };
      
      const request = createMockRequest(headers);
      const bodyJson = { data: { id: '123' } };

      // Act
      const result = verifyMPSignature({ request, bodyJson });

      // Assert
      expect(result.ok).toBe(false);
      expect(result.reason).toBe('Invalid signature format');
    });

    test('Falta payment ID → 401', () => {
      // Arrange
      const secret = "test_secret";
      const manifest = "id:123;request-id:abc;ts:1700000000000;";
      const expectedHash = calculateExpectedHash(manifest, secret);
      
      process.env.WEBHOOK_SECRET = secret;
      
      const headers = {
        'x-signature': `ts=1700000000000; v1=${expectedHash}`,
        'x-request-id': 'abc'
      };
      
      const request = createMockRequest(headers);
      const bodyJson = {}; // Sin data.id

      // Act
      const result = verifyMPSignature({ request, bodyJson });

      // Assert
      expect(result.ok).toBe(false);
      expect(result.reason).toBe('Missing payment ID');
    });

    test('Falta WEBHOOK_SECRET → 401', () => {
      // Arrange
      // process.env.WEBHOOK_SECRET no está definido
      
      const headers = {
        'x-signature': 'ts=1700000000000; v1=somehash',
        'x-request-id': 'abc'
      };
      
      const request = createMockRequest(headers);
      const bodyJson = { data: { id: '123' } };

      // Act
      const result = verifyMPSignature({ request, bodyJson });

      // Assert
      expect(result.ok).toBe(false);
      expect(result.reason).toBe('Missing webhook secret');
    });
  });
});
