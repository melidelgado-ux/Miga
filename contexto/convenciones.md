# Convenciones observadas

Solo se registran patrones visibles en el código actual; las recomendaciones nuevas
deben etiquetarse como propuestas.

- Componentes de UI y pantallas viven en `src/components/` y se exportan por nombre.
- Tipos compartidos de receta y colecciones viven en `src/data/mockRecipes.ts`.
- `src/App.tsx` posee el estado de la biblioteca y pasa datos/callbacks a componentes.
- TypeScript usa JSX React, módulos ES, resolución `bundler`, alias `@/*` a raíz y
  `noEmit`; opciones en `tsconfig.json`.
- Vite instala React y Tailwind v4 vía plugins; preservar sus invariantes documentadas
  en `vite.config.ts`.
- No hay framework de tests ni script `test` declarado. `npm run lint` ejecuta
  `tsc --noEmit`, no ESLint.

## Comandos declarados

| Comando | Uso |
| --- | --- |
| `npm run dev` | Desarrollo, Vite en puerto 3000 |
| `npm run lint` | Verificación de tipos |
| `npm run build` | Build de producción |
| `npm run preview` | Vista previa del build |

No se documentan convenciones de autorización, API o manejo de errores de servidor:
el repositorio auditado no muestra una capa de backend activa.
