# Persistencia de recetas en la implementación actual

- **Fecha:** 2026-11-18
- **Estado:** observada e histórica; reemplazada por `002-backend-firebase-invitaciones.md`.
- **Problema:** distinguir el comportamiento implementado de los objetivos del PRD.
- **Decisión:** no hay persistencia observada; recetas y colecciones se inicializan y
  mantienen en estado local de React durante la sesión.
- **Razón:** `src/App.tsx` inicializa `useState` con `INITIAL_RECIPES` e
  `INITIAL_COLLECTIONS`; README y PRD también declaran que recargar pierde cambios.
- **Alternativas relevantes:** almacenamiento persistente o backend no forman parte de
  esta observación.
- **Consecuencias:** no describir invitaciones como sincronizadas entre dispositivos ni
  como privadas; el token se genera en cliente y la ruta no lo valida.
- **Evidencia:** `src/App.tsx`, `src/data/mockRecipes.ts`,
  `src/components/AddChoiceModal.tsx`, `README.md`, `PRD.md`.
- **Reemplaza:** ninguna; posteriormente fue reemplazada por la decisión 002.
