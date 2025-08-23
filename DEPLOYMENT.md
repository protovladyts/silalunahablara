# Deployment en Vercel

## Errores Resueltos

### Error: Module '@prisma/client' has no exported member 'PrismaClient'

**Causa**: Vercel no puede importar PrismaClient porque no se está generando el cliente durante el build.

**Solución Implementada**:

1. **Scripts actualizados en package.json**:
   ```json
   {
     "scripts": {
       "build": "prisma generate && next build",
       "postinstall": "prisma generate",
       "vercel-build": "prisma generate && prisma db push && next build"
     }
   }
   ```

2. **Archivo vercel.json creado**:
   ```json
   {
     "buildCommand": "prisma generate && pnpm run build",
     "installCommand": "pnpm install",
     "framework": "nextjs",
     "env": {
       "PRISMA_GENERATE_DATAPROXY": "false"
     },
     "functions": {
       "app/api/**/*.ts": {
         "maxDuration": 30
       }
     }
   }
   ```

## Configuración de Variables de Entorno en Vercel

Asegúrate de configurar estas variables en el dashboard de Vercel:

### Variables Requeridas:
- `DATABASE_URL`: URL de conexión a tu base de datos NeonDB
  - Ejemplo: `postgresql://username:password@hostname:port/database?sslmode=require`

### Variables Opcionales:
- `NEXTAUTH_SECRET`: Secret para autenticación (si lo usas en el futuro)
- `NEXTAUTH_URL`: URL de la aplicación en producción

## Pasos para Deploy

1. **Push los cambios**:
   ```bash
   git add .
   git commit -m "Fix Prisma client generation for Vercel"
   git push
   ```

2. **Configurar variables en Vercel**:
   - Ve al dashboard de Vercel
   - Selecciona tu proyecto
   - Ve a Settings > Environment Variables
   - Agrega `DATABASE_URL` con tu connection string de NeonDB

3. **Redeploy**:
   - Vercel debería detectar automáticamente el push
   - O puedes hacer redeploy manual desde el dashboard

## Verificación del Deploy

1. **Build exitoso**: Debe mostrar que Prisma genera el cliente
2. **API routes funcionando**: Prueba los endpoints `/api/session/start`, etc.
3. **Base de datos conectada**: Las consultas a la BD deben funcionar

## Troubleshooting

### Si sigue fallando:
1. Verifica que `DATABASE_URL` esté configurada en Vercel
2. Asegúrate de que el connection string sea el correcto (no el pooled)
3. Revisa los logs de build en Vercel para errores específicos

### Si hay errores de conexión a BD:
- Usa el connection string directo de NeonDB (no el pooled)
- Asegúrate de que incluya `?sslmode=require` al final

### Error 500 en /api/otp/request:
1. **Verificar health check**: Visita `/api/health` para diagnosticar la conexión a la BD
2. **Revisar logs**: Los logs ahora incluyen más detalles sobre el error
3. **Verificar variables de entorno**: Asegúrate de que `DATABASE_URL` esté configurada correctamente
4. **Connection string**: Debe ser el directo de NeonDB, no el pooled

### Pasos de diagnóstico:
1. Visita `https://tu-app.vercel.app/api/health`
2. Si falla, revisa la variable `DATABASE_URL` en Vercel
3. Verifica que el connection string no termine en `-pooler`
4. Asegúrate de que incluya `?sslmode=require`
