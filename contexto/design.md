# Arquitectura observada

## Mapa

- **Cliente:** SPA React 19/TypeScript arrancada desde `src/main.tsx`; `src/App.tsx`
  mantiene navegación, recetas, colecciones, modales y selección en estado React local.
- **Datos:** `src/data/mockRecipes.ts` define `Recipe`, `Collection` y tipos auxiliares;
  ejemplos iniciales siguen disponibles para referencias de UI. `src/data/firestore.ts`
  persiste las bibliotecas por UID e implementa invitaciones de un uso.
- **Pantallas y componentes:** `src/components/` contiene listado, detalle, creación y
  edición, formulario invitado, colecciones y modales.
- **Presentación:** `src/index.css`, clases Tailwind y la referencia visual en
  `public/assets/aistudio/miga-design-system-design_d8a6008b.md`.
- **Build/servidor de desarrollo:** Vite y sus plugins están en `vite.config.ts`;
  `DISABLE_HMR` controla HMR/watch. Un plugin copia `src/assets` a `dist/src/assets`
  porque algunas URLs de imagen son raíz-relativas.
- **Integraciones:** Firebase Authentication gestiona el inicio de sesión con Google;
  Cloud Firestore guarda recetas, colecciones e invitaciones por usuario. Las fotos se
  comprimen en el navegador y se almacenan en los documentos de recetas. `firestore.rules`
  contiene las reglas desplegadas. Express, dotenv y
  `@google/genai` figuran como dependencias sin implicar que el flujo actual las use.

## Flujos y límites

- El flujo de invitación se detecta en `src/App.tsx` y presenta
  `src/components/GuestInvitePage.tsx` tras consultar su documento en Firestore.
- El envío escribe la receta en la biblioteca propietaria y consume la invitación en una
  transacción. Cada invitación vence a los 30 días y se acepta una sola vez.
- Los datos se guardan bajo `users/{uid}`; las reglas aíslan cada biblioteca
  y permiten el envío anónimo solo con una invitación vigente.
- Para seguir datos y callbacks, leer `src/App.tsx`, `src/data/mockRecipes.ts` y el
  componente que recibe las props correspondientes.

Este mapa describe código observado, no una decisión sobre arquitectura futura.
