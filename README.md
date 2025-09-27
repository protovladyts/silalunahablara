# Proyecto Next.js con Mercado Pago

Este proyecto implementa una integración completa con Mercado Pago usando Next.js 14, App Router y TypeScript.

## 🚀 Características

- ✅ Integración completa con Mercado Pago API
- ✅ Componente reutilizable de botón de pago
- ✅ Manejo de webhooks para actualizaciones de estado
- ✅ Páginas de éxito, fallo y pendiente
- ✅ Validación con Zod
- ✅ TypeScript estricto
- ✅ Middleware de seguridad
- ✅ Manejo de errores robusto

## 📋 Prerequisitos

- Node.js 18+ 
- Cuenta de Mercado Pago (sandbox para testing)
- ngrok (para webhooks en desarrollo)

## ⚙️ Configuración

### 1. Variables de Entorno

Copia `env.example` a `.env.local` y configura:

```bash
cp env.example .env.local
```

Edita `.env.local`:

```env
MP_ACCESS_TOKEN=TEST-YOUR_ACCESS_TOKEN_HERE
MP_PUBLIC_KEY=TEST-YOUR_PUBLIC_KEY_HERE
MP_WEBHOOK_SECRET=YOUR_OPTIONAL_WEBHOOK_SECRET
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Obtener Credenciales de Mercado Pago

1. Ve a [Mercado Pago Developers](https://www.mercadopago.com.ar/developers)
2. Crea una aplicación
3. Copia tu **Access Token** (para servidor)
4. Copia tu **Public Key** (para cliente, aunque no se usa en este flujo)

### 3. Instalar Dependencias

```bash
npm install
# o
pnpm install
```

## 🏃‍♂️ Ejecutar el Proyecto

### Desarrollo

```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:3000`

### Testing Manual

1. **Configurar Webhook** (opcional pero recomendado):
   ```bash
   # Instalar ngrok
   npm install -g ngrok
   
   # Exponer tu servidor local
   ngrok http 3000
   ```

2. **Configurar Webhook en Mercado Pago**:
   - Ve a tu aplicación en Mercado Pago Developers
   - Configura la URL del webhook: `https://tu-ngrok-url.ngrok.io/api/mp/webhook`
   - Selecciona eventos: `payment`

3. **Probar Pagos**:
   - Ve a `http://localhost:3000/example`
   - Usa las tarjetas de prueba:

   **Tarjetas de Prueba:**
   - **Visa**: 4509 9535 6623 3704
   - **Mastercard**: 5031 7557 3453 0604
   - **CVV**: 123
   - **Vencimiento**: 11/25

   **Cuentas de Prueba:**
   - Email: `test_user_123456@testuser.com`
   - Contraseña: `qatest123`

## 📁 Estructura del Proyecto

```
├── app/
│   ├── api/mp/
│   │   ├── create-preference/route.ts    # Crear preferencia de pago
│   │   ├── webhook/route.ts             # Webhook de Mercado Pago
│   │   └── order-status/route.ts        # Consultar estado del pedido
│   ├── example/page.tsx                 # Página de ejemplo
│   ├── success/page.tsx                 # Página de éxito
│   ├── failure/page.tsx                 # Página de fallo
│   └── pending/page.tsx                # Página de pendiente
├── components/
│   └── PayWithMercadoPagoButton.tsx    # Componente de botón de pago
├── lib/
│   └── mercadopago.ts                  # Cliente de Mercado Pago
├── middleware.ts                        # Middleware de seguridad
└── data/
    └── orders.json                      # Estado de pedidos (se crea automáticamente)
```

## 🔧 Uso del Componente

```tsx
import PayWithMercadoPagoButton from '@/components/PayWithMercadoPagoButton';

function MyComponent() {
  return (
    <PayWithMercadoPagoButton
      orderId="ORDER-123"
      title="Mi Producto"
      amount={19999}
      currencyId="ARS"
      payerEmail="cliente@ejemplo.com"
      onStarted={(preferenceId) => console.log('Pago iniciado:', preferenceId)}
      onError={(error) => console.error('Error:', error)}
    />
  );
}
```

### Props del Componente

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `orderId` | `string` | ✅ | ID único del pedido |
| `title` | `string` | ✅ | Título del producto |
| `amount` | `number` | ✅ | Precio unitario |
| `quantity` | `number` | ❌ | Cantidad (default: 1) |
| `currencyId` | `string` | ❌ | Moneda (default: "ARS") |
| `payerEmail` | `string` | ❌ | Email del pagador |
| `className` | `string` | ❌ | Clases CSS adicionales |
| `onStarted` | `function` | ❌ | Callback cuando inicia el pago |
| `onError` | `function` | ❌ | Callback en caso de error |
| `redirectInSandbox` | `boolean` | ❌ | Usar sandbox en desarrollo (default: true) |

## 🔒 Seguridad

- ✅ `MP_ACCESS_TOKEN` solo se usa en el servidor
- ✅ Validación de métodos HTTP en middleware
- ✅ Validación de datos con Zod
- ✅ Headers de idempotencia
- ✅ Manejo seguro de webhooks

## 🧪 Testing

### Estados de Pago

El sistema maneja estos estados:
- `created`: Pago creado
- `approved`: Pago aprobado
- `pending`: Pago pendiente
- `rejected`: Pago rechazado
- `refunded`: Pago reembolsado

### Flujo de Testing

1. **Crear Pago**: El usuario hace clic en el botón
2. **Redirección**: Se redirige a Mercado Pago
3. **Procesar**: Usar tarjetas de prueba
4. **Webhook**: Mercado Pago notifica el resultado
5. **Redirección**: Usuario regresa a success/failure/pending
6. **Estado**: La página consulta el estado actualizado

## 🚀 Producción

### Variables de Entorno de Producción

```env
MP_ACCESS_TOKEN=PROD-YOUR_ACCESS_TOKEN_HERE
MP_PUBLIC_KEY=PROD-YOUR_PUBLIC_KEY_HERE
MP_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com
```

### Build

```bash
npm run build
npm run start
```

### Webhook en Producción

Configura el webhook en Mercado Pago apuntando a:
`https://tu-dominio.com/api/mp/webhook`

## 📚 API Endpoints

### POST `/api/mp/create-preference`

Crea una preferencia de pago.

**Body:**
```json
{
  "orderId": "ORDER-123",
  "items": [{
    "title": "Mi Producto",
    "unit_price": 19999,
    "quantity": 1,
    "currency_id": "ARS"
  }],
  "payerEmail": "cliente@ejemplo.com"
}
```

**Response:**
```json
{
  "ok": true,
  "preference_id": "1234567890",
  "init_point": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1234567890",
  "sandbox_init_point": "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=1234567890"
}
```

### POST `/api/mp/webhook`

Webhook de Mercado Pago (no usar directamente).

### GET `/api/mp/order-status?orderId=ORDER-123`

Consulta el estado de un pedido.

**Response:**
```json
{
  "ok": true,
  "orderId": "ORDER-123",
  "status": "approved",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🐛 Troubleshooting

### Error: "MP_ACCESS_TOKEN environment variable is required"

- Verifica que `.env.local` existe y tiene `MP_ACCESS_TOKEN`
- Reinicia el servidor de desarrollo

### Webhook no funciona

- Verifica que ngrok está corriendo
- Confirma que la URL del webhook en Mercado Pago es correcta
- Revisa los logs del servidor

### Pago no se procesa

- Verifica que las credenciales son de sandbox
- Confirma que las tarjetas de prueba son válidas
- Revisa la consola del navegador para errores

## 📄 Licencia

MIT