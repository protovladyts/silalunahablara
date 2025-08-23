# Configuración de la Aplicación

## Archivo de Configuración

Todas las configuraciones importantes de la aplicación están centralizadas en `lib/config.ts`.

## Configuraciones Disponibles

### Tarot Readings
- `MAX_TAROT_READINGS`: Número total de preguntas permitidas (1 inicial + repreguntas)
  - **Valor actual**: 3
  - **Significado**: El usuario puede hacer 1 pregunta inicial + 2 repreguntas = 3 total

### Paquete de Preguntas Adicionales
- `ADDITIONAL_READINGS_PRICE`: Precio del paquete de preguntas adicionales
  - **Valor actual**: 1 USD
- `ADDITIONAL_READINGS_COUNT`: Número de preguntas en el paquete adicional
  - **Valor actual**: 3

### Videollamada
- `VIDEO_CALL_PRICE`: Precio de la videollamada
  - **Valor actual**: 15 USD
- `VIDEO_CALL_DURATION`: Duración de la videollamada
  - **Valor actual**: "30 minutos"

## Cómo Cambiar la Configuración

### Ejemplo 1: Cambiar el número de repreguntas gratis
```typescript
// En lib/config.ts
export const APP_CONFIG = {
  MAX_TAROT_READINGS: 5, // Cambiar de 3 a 5 (1 inicial + 4 repreguntas)
  // ... resto de configuraciones
}
```

### Ejemplo 2: Cambiar el precio del paquete adicional
```typescript
// En lib/config.ts
export const APP_CONFIG = {
  ADDITIONAL_READINGS_PRICE: 2, // Cambiar de 1 USD a 2 USD
  // ... resto de configuraciones
}
```

### Ejemplo 3: Cambiar el precio de la videollamada
```typescript
// En lib/config.ts
export const APP_CONFIG = {
  VIDEO_CALL_PRICE: 20, // Cambiar de 15 USD a 20 USD
  // ... resto de configuraciones
}
```

## Flujo de Usuario

### Con configuración actual (MAX_TAROT_READINGS: 3):
1. **Pregunta 1**: Pregunta inicial (gratis)
2. **Pregunta 2**: Primera repregunta (gratis)
3. **Pregunta 3**: Segunda repregunta (gratis)
4. **Sin más preguntas**: Se muestra el upsell "3 Preguntas más por $1 USD"

### Si cambias a MAX_TAROT_READINGS: 5:
1. **Pregunta 1**: Pregunta inicial (gratis)
2. **Pregunta 2**: Primera repregunta (gratis)
3. **Pregunta 3**: Segunda repregunta (gratis)
4. **Pregunta 4**: Tercera repregunta (gratis)
5. **Pregunta 5**: Cuarta repregunta (gratis)
6. **Sin más preguntas**: Se muestra el upsell

## Notas Importantes

- **Reinicia el servidor** después de cambiar la configuración
- Los cambios se aplican automáticamente en toda la aplicación
- La configuración es de solo lectura (`as const`) para prevenir cambios accidentales
- Todos los componentes usan esta configuración centralizada
