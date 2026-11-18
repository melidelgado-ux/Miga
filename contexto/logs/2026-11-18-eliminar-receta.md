# Eliminar receta desde edición — 2026-11-18

- El badge “Borrador en edición” fue reemplazado por un botón “Eliminar receta” cuando
  se edita una receta existente.
- La acción confirma antes de quitar la receta del estado local. El diálogo se abrió y
  se canceló durante la revisión; no se eliminó ninguna receta.
- Las recetas recibidas también muestran edición y conservan origen/remitente al
  guardarse. Las confirmaciones de eliminación de receta y colección comparten un modal.
- En el detalle recibido se quitó el badge duplicado, se muestra la fecha con `createdAt`
  y el autor propio ya no lleva el prefijo “Vos”.
- `npm run lint` y `npm run build` pasaron.
