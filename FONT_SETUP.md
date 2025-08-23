# Configuración de la Fuente Rose Garden Deluxe

## 📝 Pasos para configurar la fuente:

### 1. Descargar la fuente
- Ve a [Fenotype](https://www.fenotype.com/) o busca "Rose Garden Deluxe by Fenotype"
- Descarga los archivos de la fuente (TTF, WOFF, WOFF2)

### 2. Colocar los archivos
Coloca los archivos de la fuente en la carpeta `public/fonts/`:
```
public/fonts/
├── RoseGardenDeluxe-Regular.woff2
├── RoseGardenDeluxe-Regular.woff
├── RoseGardenDeluxe-Regular.ttf
├── RoseGardenDeluxe-Bold.woff2
├── RoseGardenDeluxe-Bold.woff
├── RoseGardenDeluxe-Bold.ttf
├── RoseGardenDeluxe-Italic.woff2
├── RoseGardenDeluxe-Italic.woff
└── RoseGardenDeluxe-Italic.ttf
```

### 3. Usar la fuente en tu código

#### Opción A: Usar las clases CSS predefinidas
```tsx
<h1 className="title-rose-garden">Título Principal</h1>
<h2 className="title-rose-garden-sm">Subtítulo</h2>
<h1 className="title-rose-garden-lg">Título Grande</h1>
```

#### Opción B: Usar directamente las clases de Tailwind
```tsx
<h1 className="font-rose-garden text-4xl">Título</h1>
<h2 className="font-rose-garden text-2xl">Subtítulo</h2>
<h1 className="font-rose-garden text-6xl">Título Grande</h1>
```

#### Opción C: Usar el componente predefinido
```tsx
import { RoseGardenTitle } from "@/components/rose-garden-title"

<RoseGardenTitle size="lg">Título Principal</RoseGardenTitle>
<RoseGardenTitle size="md">Subtítulo</RoseGardenTitle>
<RoseGardenTitle size="sm">Título Pequeño</RoseGardenTitle>
```

## 🎨 Características de la fuente:
- **Elegante y mística** - Perfecta para tu app de tarot
- **Responsive** - Se adapta a diferentes tamaños de pantalla
- **Con sombras** - Incluye efectos de sombra para mejor legibilidad
- **Múltiples pesos** - Regular, Bold e Italic

## ⚠️ Nota importante:
La fuente debe ser comprada/licenciada de Fenotype. Este código asume que ya tienes los archivos de la fuente.
