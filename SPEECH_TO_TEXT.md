# 🎤 Funcionalidad de Speech-to-Text

## Descripción

La aplicación ahora incluye funcionalidad completa de reconocimiento de voz que permite a los usuarios dictar sus preguntas de tarot en lugar de escribirlas.

## Características Implementadas

### ✅ Hook `useSpeechToText`
- **Ubicación**: `lib/hooks/useSpeechToText.ts`
- **Funcionalidades**:
  - Detección automática de soporte del navegador
  - Configuración de idioma (español por defecto)
  - Manejo de errores detallado
  - Callbacks para resultados y errores
  - Control de estado de grabación

### ✅ Componente `IntakeForm` Actualizado
- **Ubicación**: `components/intake-form.tsx`
- **Nuevas características**:
  - Botón de micrófono funcional
  - Indicadores visuales de grabación
  - Manejo de errores de voz
  - Integración con validación existente
  - Botón de información sobre la funcionalidad

### ✅ Componente `VoiceFeatureInfo`
- **Ubicación**: `components/voice-feature-info.tsx`
- **Funcionalidades**:
  - Información sobre compatibilidad del navegador
  - Instrucciones de uso
  - Consejos para mejor reconocimiento
  - Detalles sobre privacidad

### ✅ Declaraciones de Tipos TypeScript
- **Ubicación**: `types/speech-recognition.d.ts`
- **Cobertura**: Todas las APIs de Speech Recognition

## Cómo Usar

### Para el Usuario Final

1. **Acceder a la funcionalidad**:
   - Ir a la página principal de la aplicación
   - Ver el botón de micrófono junto al campo de texto

2. **Usar el reconocimiento de voz**:
   - Hacer clic en el ícono del micrófono 🎤
   - Permitir el acceso al micrófono cuando se solicite
   - Hablar claramente la pregunta
   - Hacer clic nuevamente para detener la grabación

3. **Ver información adicional**:
   - Hacer clic en el ícono de información ℹ️
   - Ver detalles sobre compatibilidad y consejos

### Para Desarrolladores

```typescript
// Uso básico del hook
const {
  isListening,
  isSupported,
  transcript,
  error,
  startListening,
  stopListening,
  resetTranscript
} = useSpeechToText({
  language: 'es-ES',
  continuous: false,
  interimResults: true,
  onResult: (text) => {
    console.log('Texto reconocido:', text);
  },
  onError: (error) => {
    console.error('Error:', error);
  }
});
```

## Compatibilidad de Navegadores

### ✅ Totalmente Compatible
- **Chrome** (recomendado)
- **Edge**
- **Safari** (iOS 14.5+)

### ❌ No Compatible
- Firefox (no soporta Speech Recognition API)
- Navegadores antiguos

## Manejo de Errores

### Errores Comunes y Soluciones

1. **"No se detectó voz"**
   - Hablar más cerca del micrófono
   - Verificar que el micrófono esté funcionando
   - Hablar más fuerte

2. **"Permisos de micrófono denegados"**
   - Ir a configuración del navegador
   - Permitir acceso al micrófono para el sitio
   - Recargar la página

3. **"Error de red"**
   - Verificar conexión a internet
   - El reconocimiento requiere conexión para procesar

4. **"Tu navegador no soporta reconocimiento de voz"**
   - Usar Chrome, Edge o Safari
   - Actualizar el navegador

## Privacidad y Seguridad

- **Procesamiento local**: El reconocimiento se procesa en el navegador del usuario
- **Sin envío de audio**: No se envía audio a nuestros servidores
- **Datos temporales**: Solo se almacena el texto reconocido en el campo de entrada
- **Permisos**: Requiere permiso explícito del usuario para acceder al micrófono

## Configuración Técnica

### Variables de Entorno
No se requieren variables de entorno adicionales para esta funcionalidad.

### Dependencias
- **Nativas del navegador**: Speech Recognition API
- **Sin librerías externas**: Implementación usando APIs web estándar

### Personalización

```typescript
// Cambiar idioma
const speechHook = useSpeechToText({
  language: 'en-US', // Inglés
  // ... otras opciones
});

// Modo continuo
const speechHook = useSpeechToText({
  continuous: true, // No se detiene automáticamente
  // ... otras opciones
});
```

## Testing

### Casos de Prueba Recomendados

1. **Compatibilidad**:
   - Probar en Chrome, Edge, Safari
   - Verificar mensaje de incompatibilidad en Firefox

2. **Permisos**:
   - Denegar permisos y verificar mensaje de error
   - Permitir permisos y verificar funcionamiento

3. **Calidad de audio**:
   - Probar con diferentes niveles de ruido
   - Probar con diferentes distancias del micrófono

4. **Integración**:
   - Verificar que el texto reconocido se integre correctamente
   - Verificar que la validación funcione con texto de voz

## Troubleshooting

### Problemas Comunes

1. **El botón de micrófono está deshabilitado**:
   - Verificar compatibilidad del navegador
   - Verificar que no haya errores de permisos

2. **No se reconoce el texto**:
   - Verificar que el micrófono esté funcionando
   - Probar hablar más claro y pausado
   - Verificar conexión a internet

3. **Errores de TypeScript**:
   - Verificar que `types/speech-recognition.d.ts` esté incluido
   - Verificar que el archivo esté en el directorio correcto

## Futuras Mejoras

### Posibles Extensiones

1. **Múltiples idiomas**:
   - Detección automática del idioma del usuario
   - Selector de idioma en la interfaz

2. **Mejoras de UX**:
   - Animaciones de onda de audio
   - Indicador de nivel de volumen
   - Historial de grabaciones

3. **Funcionalidades avanzadas**:
   - Corrección automática de texto
   - Sugerencias de palabras
   - Modo de dictado continuo

4. **Accesibilidad**:
   - Soporte para lectores de pantalla
   - Atajos de teclado
   - Modo de alto contraste
