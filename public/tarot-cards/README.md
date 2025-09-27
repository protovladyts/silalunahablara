# Imágenes de Cartas de Tarot

Esta carpeta contiene las imágenes de las cartas de tarot organizadas por tipo:

## Estructura de carpetas:
- `/major/` - Arcanos Mayores (22 cartas)
- `/minor/cups/` - Palo de Copas (14 cartas)  
- `/minor/coins/` - Palo de Oros (14 cartas)
- `/minor/wands/` - Palo de Bastos (14 cartas)
- `/minor/swords/` - Palo de Espadas (14 cartas)
- `/dorso.png` - Imagen del dorso de las cartas

## Convención de nombres de archivos:

Las imágenes deben seguir esta convención de nombres (en minúsculas, sin espacios ni guiones):

### Arcanos Mayores:
- `elloco.png`
- `elmago.png`
- `lasacerdotisa.png`
- `laemperatriz.png`
- `elemperador.png`
- `elhierofante.png`
- `losenamorados.png`
- `elcarro.png`
- `lafuerza.png`
- `elermitaño.png`
- `laruedadelafortuna.png`
- `lajusticia.png`
- `elcolgado.png`
- `lamuerte.png`
- `latemplanza.png`
- `eldiablo.png`
- `latorre.png`
- `laestrella.png`
- `laluna.png`
- `elsol.png`
- `eljuicio.png`
- `elmundo.png`

### Palo de Copas:
- `asdecopas.png`
- `dosdecopas.png`
- `tresdecopas.png`
- `cuatrodecopas.png`
- `cincodecopas.png`
- `seisdecopas.png`
- `sietedecopas.png`
- `ochodecopas.png`
- `nuevedecopas.png`
- `diezdecopas.png`
- `pajerdecopas.png`
- `caballerodecopas.png`
- `reinadecopas.png`
- `reydecopas.png`

### Palo de Oros:
- `asdeoros.png`
- `dosdeoros.png`
- `tresdeoros.png`
- `cuatrodeoros.png`
- `cincodeoros.png`
- `seisdeoros.png`
- `sietedeoros.png`
- `ochodeoros.png`
- `nuevedeoros.png`
- `diezdeoros.png`
- `pajedeoros.png`
- `caballerodeoros.png`
- `reinadeoros.png`
- `reydeoros.png`

### Palo de Bastos:
- `asdebastos.png`
- `dosdebastos.png`
- `tresdebastos.png`
- `cuatrodebastos.png`
- `cincodebastos.png`
- `seisdebastos.png`
- `sietedebastos.png`
- `ochodebastos.png`
- `nuevedebastos.png`
- `diezdebastos.png`
- `pajedebastos.png`
- `caballerodebastos.png`
- `reinadebastos.png`
- `reydebastos.png`

### Palo de Espadas:
- `asdeespadas.png`
- `dosdeespadas.png`
- `tresdeespadas.png`
- `cuatrodeespadas.png`
- `cincodeespadas.png`
- `seisdeespadas.png`
- `sietedeespadas.png`
- `ochodeespadas.png`
- `nuevedeespadas.png`
- `diezdeespadas.png`
- `pajedeespadas.png`
- `caballerodeespadas.png`
- `reinadeespadas.png`
- `reydeespadas.png`

## Especificaciones técnicas recomendadas:
- **Formato**: PNG (como están actualmente)
- **Resolución**: Mínimo 300x450px (ratio 2:3)
- **Peso**: Máximo 200KB por imagen para optimizar carga
- **Calidad**: Alta resolución para dispositivos retina

## Funcionamiento:
1. **Dorso de cartas**: Usa la imagen `dorso.png` para todas las cartas no reveladas
2. **Frente de cartas**: Si existe una imagen con el nombre correspondiente, se mostrará automáticamente
3. **Mapeos especiales**: Algunas cartas tienen nombres de archivo que no coinciden exactamente:
   - "El Ermitaño" → `elermitaño.png` (mantiene la ñ)
   - "Paje de Copas" → `pajerdecopas.png` (con "r" extra)
   - "Cinco de Oros" → `cicnodeoros.png` (sin "o")
4. **Fallback**: Si no existe la imagen o falla al cargar, se mostrará el emoji y texto como respaldo
5. **Compatibilidad**: "El Loco" mantiene su imagen especial hardcodeada

## Personalización:
Para usar URLs personalizadas de imágenes (ej: CDN externo), modifica el campo `imageUrl` en el archivo `lib/tarot-cards-config.ts`.

## Estado actual:
✅ Todas las imágenes están configuradas y listas para usar
✅ Imagen del dorso integrada
✅ Sistema de fallback implementado
