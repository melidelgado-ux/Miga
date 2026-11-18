# Estado: edición de colecciones

- **Estado:** implementado y validado localmente.
- **Rama/SHA:** no verificables; este directorio no tiene metadatos Git.
- **Hecho:** cada tarjeta abre la colección; el botón de edición está en la cabecera del
  detalle, junto a “Volver”, con el patrón visual de “Editar receta”. El formulario
  permite cambiar nombre, detalle y color. La eliminación pide confirmación, retira la
  colección y desasigna sus recetas sin borrarlas. “Nueva colección” usa coral. El
  encabezado de la lista sigue el formato de Recetas y ya no incluye ilustración; el
  contador de colecciones queda debajo del título. El contador de Recetas muestra solo
  “X recetas”. La regla MIGA-10 fija texto blanco sobre coral.
- **Validación:** `npm run lint` y `npm run build` pasaron. Vite muestra una advertencia
  sobre `__dirname` en `vite.config.ts`. No se pudo revisar en el navegador conectado:
  la herramienta de pestañas devolvió `browser.user is unavailable`.
- **Pendiente:** revisión visual e interacción en navegador.
- **Última actualización:** 2026-11-18.
