# Miga Design System

## Visión
Miga es una biblioteca de recetas colaborativa y playful. Este design system guía la creación de interfaces amigables, accesibles y visualmente coherentes que celebren la cocina y la comunidad.

## Principios de Diseño
- **Playful y Acogedor**: Formas redondeadas, ilustraciones flat design lineales, colores pasteles con acentos vivos. Inspirado en Duolingo.
- **Accesible en Móvil**: Diseño responsivo, CTAs grandes y fáciles de tocar con pulgar, tipografía legible.
- **Colaborativo por Defecto**: Componentes que enfatizan compartir y recibir sin fricción.
- **Cocina Celebrada**: Ilustraciones y paleta que evocan calidez, creatividad y preparación culinaria.

## Paleta de Color (Tema Claro)

### Colores Primarios
- **Naranja Coral (Acento Principal)**: `#FF6B4A` — Energía, acción, CTAs principales
- **Fucsia (Acento Secundario)**: `#FF4B8A` — Énfasis, enlaces, interacciones secundarias

### Colores Pasteles (Superficies y Fondos)
- **Melocotón Suave**: `#FFD6C9` — Fondo cálido, alertas positivas
- **Lavanda Ligera**: `#E8D4F8` — Fondo alternativo, elementos decorativos
- **Menta Suave**: `#D4F8E8` — Confirmación, éxito
- **Amarillo Crema**: `#FFF8D6` — Destacados, fondos secundarios

### Neutrales
- **Blanco Principal**: `#FFFFFF` — Fondos, superficies principales
- **Gris Oscuro (Texto Principal)**: `#2D2D2D` — Tipografía body, headlines
- **Gris Mediano (Texto Secundario)**: `#747474` — Subtítulos, helper text
- **Gris Claro (Bordes, Dividers)**: `#E8E8E8` — Líneas, separadores, inputs desactivados

### Semánticos
- **Error**: `#FF6B6B` — Validaciones fallidas, alertas
- **Warning**: `#FFA500` — Precaución, cambios importantes
- **Success**: `#52C41A` — Confirmaciones, transacciones exitosas
- **Info**: `#747474` — Información, helper text

## Tipografía

### Familias Sugeridas
- **Headers y Titulares**: Inter, Poppins (sans-serif modernas, geométricas)
- **Body y UI**: Inter, Roboto (sans-serif claras, altamente legibles)
- **Monoespaciada (si aplica)**: JetBrains Mono, Courier Prime

### Escala Tipográfica
- **Headline 1 (H1)**: 32px, weight 700, line-height 1.2 — Titulares principales de pantalla
- **Headline 2 (H2)**: 24px, weight 600, line-height 1.3 — Subtítulos de sección
- **Headline 3 (H3)**: 18px, weight 600, line-height 1.4 — Encabezados de card/módulo
- **Body Large**: 16px, weight 400, line-height 1.6 — Descripción principal
- **Body Regular**: 14px, weight 400, line-height 1.6 — Contenido estándar
- **Body Small**: 12px, weight 400, line-height 1.5 — Helper text, labels
- **Button Label**: 16px, weight 600, line-height 1.5 — CTAs y botones

## Design Tokens

### Espaciado (Sistema 4px)
```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
--spacing-3xl: 64px;
```

### Border Radius (Generoso y Redondeado)
```css
--radius-sm: 8px;      /* inputs pequeños, iconos */
--radius-md: 16px;     /* cards, botones estándar */
--radius-lg: 24px;     /* elementos destacados, hero */
--radius-full: 9999px; /* botones pill, avatares */
```

### Sombras (Suaves, Playful)
```css
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.08);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
--shadow-hover: 0 12px 32px rgba(255, 107, 74, 0.2); /* con tint naranja */
```

### Transiciones
```css
--transition-fast: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-normal: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: all 400ms cubic-bezier(0.4, 0, 0.2, 1);
```

## Componentes Base

### Botones
- **Primario (CTA Principal)**: Fondo naranja coral (#FF6B4A), texto blanco, border-radius 16px, padding 12px 32px, font-weight 600, sombra suave en hover
- **Secundario**: Fondo fucsia (#FF4B8A), texto blanco (#FFFFFF), mismo tamaño. Todo botón que use este fondo mantiene texto blanco en sus estados interactivos.
- **Tertiary**: Fondo transparente, texto naranja coral, borde 2px naranja coral
- **Pill (Full-width móvil)**: Altura 56px, border-radius full, aplicable a primario/secundario
- **Estados**: Hover (sombra aumentada, opacidad 0.9), Active (escala 0.98), Disabled (opacidad 0.5)
- **Texto sobre coral**: Cuando el fondo de una superficie usa Naranja Coral (`#FF6B4A`), el texto va en blanco (`#FFFFFF`).

### Inputs
- **Contenedor**: Borde 2px gris claro (#E8E8E8), border-radius 16px, padding 12px 16px
- **Focus**: Borde naranja coral (#FF6B4A), sombra interior suave
- **Error**: Borde rojo (#FF6B6B), ícono de alerta a la derecha
- **Placeholder**: Color gris mediano (#747474), weight 400
- **Label (si aplica)**: Gris oscuro (#2D2D2D), weight 500, margin-bottom 8px

### Cards
- **Fondo**: Blanco o pasteles (melocotón, lavanda, menta según contexto)
- **Border-radius**: 24px
- **Sombra**: shadow-md
- **Padding**: 24px
- **Interactividad**: Hover aumenta sombra (shadow-lg) y traslada ligeramente (transform: translateY(-2px))

### Badges/Chips
- **Fondo**: Pastel suave (menta para éxito, melocotón para info)
- **Border-radius**: 8px
- **Padding**: 6px 12px
- **Tipografía**: 12px weight 500
- **Borde**: Opcional, 1px del color de fondo oscurecido

## Patrón de Color para Estados

### Onboarding (Flujo)
- **Paso Actual**: Acento naranja coral (#FF6B4A)
- **Paso Completado**: Verde suave (#52C41A) o menta (#D4F8E8)
- **Paso Pendiente**: Gris claro (#E8E8E8)

### Validación de Inputs
- **Vacío**: Gris claro, placeholder visible
- **Enfocado**: Naranja coral, fondo ligeramente tintado
- **Válido**: Borde menta (#D4F8E8), ícono checkmark verde
- **Inválido**: Borde rojo (#FF6B6B), mensaje de error en rojo

## Iconografía
- **Estilo**: Stroke/outline lineales, weight 2px, corner-radius 2px, coherente con flat design
- **Tamaño base**: 24px para UI, 48px+ para ilustraciones decorativas
- **Color**: Naranja coral para acciones, gris oscuro para neutr, rojo/verde para semántica

## Ilustraciones
- **Estilo**: Flat design lineales, colores pasteles y acentos vivos
- **Temática**: Objetos de cocina (olla, cuchara, tenedor, bandeja, cuchillo), personajes amigables, plantas, elementos festivos
- **Propósito**: Decoración, educación visual, refuerzo de marca en transiciones y onboarding

## Responsive (Móvil a Desktop)
- **Móvil (< 640px)**: Full-width, padding 16px, tipografía base 16px body
- **Tablet (640px - 1024px)**: Max-width 600px, padding 20px, ajustes de espaciado
- **Desktop (> 1024px)**: Max-width 1200px, layout multi-columna, mayor espaciado

## Accesibilidad
- **Contraste**: WCAG AA mínimo (4.5:1 para texto pequeño, 3:1 para gráficos)
- **Focus States**: Visible en todos los elementos interactivos (border highlight en acento naranja)
- **Motion**: Respetar `prefers-reduced-motion`; transiciones deshabilitadas si es necesario
- **Touch Targets**: Mínimo 48px x 48px para botones en móvil
- **Semántica**: Usar `<button>`, `<input>`, `<label>` nativos; aria-labels si aplica
