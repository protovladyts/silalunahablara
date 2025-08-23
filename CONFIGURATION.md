# Configuración de la Aplicación

## 📁 Estructura de archivos

```
lib/
├── shared-config.ts     # 🎯 CONFIGURACIÓN PRINCIPAL (única fuente de verdad)
├── config.ts            # 🔄 Re-exporta SHARED_CONFIG como APP_CONFIG (frontend)

app/api/
├── config.ts            # 🔄 Re-exporta SHARED_CONFIG como API_CONFIG (backend)
└── session/
    └── start/
        └── route.ts     # ✅ Usa API_CONFIG para validaciones
```

## 🔧 Cómo funciona

### **1. Configuración centralizada**
- **`lib/shared-config.ts`** es la **única fuente de verdad**
- Todos los valores se definen aquí una sola vez
- Frontend y backend importan desde este archivo

### **2. Re-exports para compatibilidad**
- **Frontend**: `import { APP_CONFIG } from "@/lib/config"`
- **Backend**: `import { API_CONFIG } from "@/app/api/config"`
- Ambos apuntan a la misma configuración

### **3. Validación en backend**
- El endpoint `/api/session/start` ahora valida el límite de consultas
- Previene que usuarios excedan `MAX_TAROT_READINGS`
- Retorna error 403 si se excede el límite

## 📝 Valores configurables

```typescript
export const SHARED_CONFIG = {
  // Número total de preguntas permitidas (1 inicial + repreguntas)
  MAX_TAROT_READINGS: 3,
  
  // Precio del paquete de preguntas adicionales
  ADDITIONAL_READINGS_PRICE: 1, // USD
  
  // Número de preguntas en el paquete adicional
  ADDITIONAL_READINGS_COUNT: 3,
  
  // Precio de la videollamada
  VIDEO_CALL_PRICE: 15, // USD
  
  // Duración de la videollamada
  VIDEO_CALL_DURATION: "30 minutos",
} as const
```

## ✅ Beneficios de la nueva implementación

### **Antes (problemático):**
- ❌ Configuración solo en frontend
- ❌ Backend no validaba límites
- ❌ Inconsistencias entre frontend y backend
- ❌ Usuario podría hacer más consultas de las permitidas

### **Después (solución):**
- ✅ **Una sola fuente de verdad** en `shared-config.ts`
- ✅ **Validación en backend** usando `API_CONFIG`
- ✅ **Sincronización automática** entre frontend y backend
- ✅ **Prevención de abusos** en el límite de consultas

## 🚀 Cómo cambiar valores

### **Para cambiar `MAX_TAROT_READINGS` a 2:**

1. **Editar `lib/shared-config.ts`:**
   ```typescript
   MAX_TAROT_READINGS: 2, // Cambiar de 3 a 2
   ```

2. **Recompilar la aplicación:**
   ```bash
   pnpm run build
   ```

3. **Resultado:**
   - ✅ Frontend mostrará "2 consultas totales"
   - ✅ Backend validará máximo 2 consultas
   - ✅ Usuario no podrá hacer más de 2 consultas
   - ✅ **Todo sincronizado automáticamente**

## 🔍 Validaciones implementadas

### **Endpoint `/api/session/start`:**
- Cuenta sesiones existentes del usuario
- Valida contra `API_CONFIG.MAX_TAROT_READINGS`
- Retorna error 403 si se excede el límite
- Incluye información detallada en la respuesta

### **Respuesta de error:**
```json
{
  "error": "Ya has usado todas tus consultas gratuitas de tarot",
  "maxReadings": 3,
  "currentReadings": 3
}
```

## 📱 Compatibilidad

- **Frontend**: Funciona exactamente igual que antes
- **Backend**: Ahora valida límites correctamente
- **API**: Respuestas consistentes y seguras
- **Usuario**: Experiencia coherente en toda la aplicación

## 🎯 Casos de uso

### **Escenario 1: Usuario nuevo**
- ✅ Puede hacer hasta `MAX_TAROT_READINGS` consultas
- ✅ Frontend y backend sincronizados

### **Escenario 2: Usuario que excede límite**
- ❌ Frontend: "No más repreguntas"
- ❌ Backend: Error 403 con mensaje claro
- ✅ **Consistencia total**

### **Escenario 3: Cambio de configuración**
- ✅ Editar solo `shared-config.ts`
- ✅ Recompilar aplicación
- ✅ **Todo se actualiza automáticamente**
