# Ejemplo de uso con imágenes personalizadas

## Para agregar una imagen específica:

1. **Sube tu imagen** a la carpeta correspondiente siguiendo la convención de nombres
2. **Opcional**: Configura una URL personalizada en `lib/tarot-cards-config.ts`

### Ejemplo: Agregar imagen personalizada para "El Mago"

```typescript
// En lib/tarot-cards-config.ts
{ 
  key: "El Mago", 
  name: "El Mago", 
  suit: "major", 
  color: "background: linear-gradient(to bottom right, #9333ea, #4f46e5)", 
  textColor: "text-white", 
  symbol: "🔮", 
  description: "Manifestación",
  imageUrl: "/tarot-cards/major/el-mago.jpg" // URL personalizada
}
```

### Ejemplo: Usar CDN externo

```typescript
// En lib/tarot-cards-config.ts
{ 
  key: "La Luna", 
  name: "La Luna", 
  suit: "major", 
  color: "background: linear-gradient(to bottom right, #818cf8, #a78bfa)", 
  textColor: "text-white", 
  symbol: "🌙", 
  description: "Ilusión",
  imageUrl: "https://cdn.ejemplo.com/tarot/la-luna.jpg" // CDN externo
}
```

## Comportamiento del sistema:

1. **Prioridad de imágenes**:
   - `imageUrl` personalizada (si está configurada)
   - Imagen local basada en nombre de archivo
   - Fallback a emoji

2. **Manejo de errores**:
   - Si la imagen falla al cargar, automáticamente muestra el emoji
   - No hay errores visibles para el usuario

3. **Optimización**:
   - Las imágenes se cargan bajo demanda
   - Cache del navegador para imágenes repetidas
   - Lazy loading nativo del navegador
