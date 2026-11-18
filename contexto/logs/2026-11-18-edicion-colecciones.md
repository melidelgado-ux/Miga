# Edición de colecciones — 2026-11-18

- Se añadió formulario para editar nombre, detalle y color. La acción de edición quedó
  en la cabecera del detalle de colección, siguiendo el patrón de “Editar receta”.
- Las tarjetas solo abren su colección y el botón “Nueva colección” volvió a coral.
- Se quitó la ilustración del encabezado y se alineó con el formato de Recetas.
- El contador de Recetas ahora muestra solo “X recetas”; el de Colecciones está junto
  del título. Se registró y aplicó la regla de texto blanco sobre coral.
- La eliminación requiere confirmación; elimina la colección y conserva las recetas
  desasignándolas.
- `npm run lint` y `npm run build` pasaron. Revisión visual del navegador quedó pendiente
  porque la herramienta de pestañas no estuvo disponible.
- Cierre de sesión: revisión visual pendiente para confirmar el último ajuste del
  contador y el flujo de editar/eliminar.
