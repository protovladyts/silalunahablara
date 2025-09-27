# Configuración de Webhooks de Mercado Pago

## 📋 Pasos para Configurar Correctamente

### 1. Acceder a "Tus Integraciones"
1. Ve a [Tus Integraciones](https://www.mercadopago.com.ar/developers/panel/applications) de Mercado Pago
2. Selecciona tu aplicación
3. En el menú izquierdo: **Webhooks > Configurar notificaciones**

### 2. Configurar URLs
- **URL modo pruebas**: `https://tu-dominio.com/api/mp/webhook`
- **URL modo producción**: `https://tu-dominio.com/api/mp/webhook`

### 3. Seleccionar Eventos
Para nuestro caso, necesitamos:
- ✅ **Pagos** (`payment`) - Creación y actualización de pagos
- ✅ **Órdenes comerciales** (`merchant_order`) - Estado de órdenes

### 4. Obtener el Webhook Secret
Una vez configurado, Mercado Pago te proporcionará un **webhook secret** que debes agregar a tus variables de entorno:

```bash
MP_WEBHOOK_SECRET=tu_webhook_secret_aqui
```

## 🔐 Validación de Firma

Según la [documentación oficial](https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks), la validación de firma funciona así:

### Algoritmo de Validación
```typescript
// 1. Parsear la firma del header x-signature
const signature = "ts=1757927988,v1=a13d5849eea8e019ffb67321ef3c88b76..."
const parts = signature.split(',');
const timestamp = parts.find(p => p.startsWith('ts=')).substring(3);
const hash = parts.find(p => p.startsWith('v1=')).substring(3);

// 2. Crear la firma esperada
const bodyString = JSON.stringify(webhookBody);
const payload = timestamp + bodyString;
const expectedSignature = crypto
  .createHmac('sha256', webhookSecret)
  .update(payload)
  .digest('hex');

// 3. Comparar firmas
if (hash === expectedSignature) {
  // ✅ Firma válida
} else {
  // ❌ Firma inválida
}
```

## 🚀 Configuración Rápida para Desarrollo

### Opción 1: Deshabilitar Validación (Recomendado para desarrollo)
```bash
# En tu .env.local
MP_SKIP_SIGNATURE_VERIFICATION=true
```

### Opción 2: Configurar Webhook Secret Correcto
```bash
# En tu .env.local
MP_WEBHOOK_SECRET=tu_secret_real_de_mercadopago
```

## 📊 Formato de Webhook

Según la documentación, los webhooks llegan en este formato:

```json
{
  "id": 12345,
  "live_mode": true,
  "type": "payment",
  "date_created": "2015-03-25T10:04:58.396-04:00",
  "user_id": 44444,
  "api_version": "v1",
  "action": "payment.created",
  "data": {
    "id": "999999999"
  }
}
```

## ⚠️ Importante

1. **Los pagos de prueba NO envían webhooks** - Solo funcionan con credenciales productivas
2. **Tiempo de espera**: 22 segundos para responder con HTTP 200/201
3. **Reintentos**: Cada 15 minutos si no se responde correctamente
4. **Prioridad**: URLs configuradas en pagos tienen prioridad sobre las de "Tus integraciones"

## 🔧 Solución de Problemas

### Error "Invalid signature"
1. Verifica que el `MP_WEBHOOK_SECRET` sea correcto
2. Usa `MP_SKIP_SIGNATURE_VERIFICATION=true` para desarrollo
3. Revisa los logs para ver qué método de validación funciona

### Webhooks no llegan
1. Verifica que la URL sea accesible públicamente
2. Confirma que estés usando credenciales productivas
3. Revisa el panel de notificaciones en "Tus integraciones"

## 📝 Próximos Pasos

1. **Configura el webhook** en "Tus integraciones" de Mercado Pago
2. **Obtén el webhook secret** y agrégalo a tus variables de entorno
3. **Prueba con pagos reales** (no de prueba)
4. **Monitorea los logs** para verificar que la validación funcione


