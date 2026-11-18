# Compatibilidad de dependencias para Vercel

- **Estado:** cambio local validado; no hay metadatos Git en esta carpeta.
- **Problema:** Vercel rechazó la instalación porque Vite 8.3.8 requiere `esbuild`
  `^0.27.0 || ^0.28.0`, mientras el proyecto declaraba `^0.25.0`.
- **Cambio:** `package.json` y `package-lock.json` declaran/resuelven `esbuild` 0.27.7.
- **Validación:** `npm run lint` y `npm run build` completaron correctamente el
  2026-11-18.
- **Pendiente:** llevar los cambios al checkout con Git conectado al repositorio que
  Vercel clona y desplegar. No se confirmó commit ni despliegue desde esta carpeta.
