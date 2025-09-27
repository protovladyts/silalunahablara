# Configuración de Mercado Pago Webhook

## Variables de Entorno Requeridas

```bash
# Configuración básica de Mercado Pago
MP_ACCESS_TOKEN=your_access_token_here
MP_PUBLIC_KEY=your_public_key_here
MP_WEBHOOK_SECRET=your_webhook_secret_here

# Configuración de productos
TAROT_PRODUCT_ID=tarot-reading
NEXT_PUBLIC_TAROT_PRODUCT_ID=tarot-reading
TAROT_READING_PRICE=10000
TAROT_READING_SANDBOX_PRICE=100

# Configuración de URLs
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Configuración de desarrollo
NODE_ENV=development

# Deshabilitar verificación de firma en desarrollo (opcional)
MP_SKIP_SIGNATURE_VERIFICATION=true

# Configuración de base de datos
DATABASE_URL=your_database_url_here
```

## Solución al Error de Firma Inválida

### Problema
Los webhooks de Mercado Pago están fallando con "Invalid signature" porque la validación de firma no está funcionando correctamente.

### Solución Implementada

1. **Método Principal**: Usa `timestamp + body` para generar la firma
2. **Método Alternativo**: Usa solo el `timestamp` (método anterior)
3. **Modo Desarrollo**: Permite deshabilitar la verificación con `MP_SKIP_SIGNATURE_VERIFICATION=true`

### Para Desarrollo Local

Agrega esta variable a tu `.env.local`:
```bash
MP_SKIP_SIGNATURE_VERIFICATION=true
```

Esto permitirá que los webhooks funcionen sin verificación de firma durante el desarrollo.

### Para Producción

1. Asegúrate de tener el `MP_WEBHOOK_SECRET` correcto
2. Configura el webhook en Mercado Pago con la URL correcta
3. La verificación de firma se habilitará automáticamente

## Logs de Debugging

El webhook ahora muestra logs detallados:
- Timestamp y hash recibidos
- Firma esperada calculada
- Método usado para la verificación
- Payload utilizado para el cálculo

## Próximos Pasos

1. Prueba el webhook con `MP_SKIP_SIGNATURE_VERIFICATION=true` en desarrollo
2. Una vez que funcione, configura el secret correcto para producción
3. Monitorea los logs para asegurar que la verificación funcione correctamente


