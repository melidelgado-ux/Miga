# Arquitectura observada

## Mapa

- **Cliente:** SPA React 19/TypeScript arrancada desde `src/main.tsx`; `src/App.tsx`
  mantiene navegación, recetas, colecciones, modales y selección en estado React local.
- **Datos:** `src/data/mockRecipes.ts` define `Recipe`, `Collection`, tipos auxiliares y
  datos iniciales. No se observó capa de persistencia.
- **Pantallas y componentes:** `src/components/` contiene listado, detalle, creación y
  edición, formulario invitado, colecciones y modales.
- **Presentación:** `src/index.css`, clases Tailwind y la referencia visual en
  `public/assets/aistudio/miga-design-system-design_d8a6008b.md`.
- **Build/servidor de desarrollo:** Vite y sus plugins están en `vite.config.ts`;
  `DISABLE_HMR` controla HMR/watch. Un plugin copia `src/assets` a `dist/src/assets`
  porque algunas URLs de imagen son raíz-relativas.
- **Integraciones:** no se observa backend. Express, dotenv y `@google/genai` figuran
  como dependencias; su presencia no implica que el flujo actual las use.

## Flujos y límites

- El flujo de invitación se detecta en `src/App.tsx` y presenta
  `src/components/GuestInvitePage.tsx`.
- El envío crea receta recibida en estado de la app; no coordina dispositivos ni
  persiste al recargar. Los requisitos y límites están en `PRD.md`.
- `src/components/AddChoiceModal.tsx` crea el token en el cliente; la ruta lo usa para
  mostrar el formulario, pero no valida el token ni identifica una invitación en servidor.
  Por tanto, el enlace actual es demostrativo y no acredita privacidad.
- Para seguir datos y callbacks, leer `src/App.tsx`, `src/data/mockRecipes.ts` y el
  componente que recibe las props correspondientes.

Este mapa describe código observado, no una decisión sobre arquitectura futura.
