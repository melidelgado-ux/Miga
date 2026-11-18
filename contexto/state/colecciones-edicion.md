# Estado: edición de colecciones

- **Estado:** modificado y validado localmente; pendiente revisión visual final.
- **Rama/SHA:** no verificables; este directorio no tiene metadatos Git.
- **Hecho:** cada tarjeta abre la colección; el botón de edición está en la cabecera del
  detalle, junto a “Volver”, con el patrón visual de “Editar receta”. El formulario
  permite cambiar nombre, detalle y color. La eliminación pide confirmación, retira la
  colección y desasigna sus recetas sin borrarlas. “Nueva colección” usa coral. El
  encabezado de la lista sigue el formato de Recetas y ya no incluye ilustración; el
  contador de colecciones queda junto al título. El contador de Recetas muestra solo
  “X recetas”. La regla MIGA-10 fija texto blanco sobre coral.
- **Validación:** `npm run lint` y `npm run build` pasaron. Vite muestra una advertencia
  sobre `__dirname` en `vite.config.ts`. No se pudo revisar en el navegador conectado:
  la herramienta de pestañas devolvió `browser.user is unavailable`.
- **Pendiente:** revisar en navegador los contadores en su posición actual y el contraste
  del texto en el CTA coral; recorrer edición y eliminación desde el detalle.
- **Próximo paso:** abrir Colecciones en el navegador conectado y verificar encabezado,
  apertura de colección, edición y confirmación de eliminación.
- **Última actualización:** 2026-11-18.
