# Estado: eliminar receta desde edición

- **Estado:** implementado y validado localmente.
- **Rama/SHA:** no verificables; este directorio no tiene metadatos Git.
- **Hecho:** se reemplazó el badge de borrador por “Eliminar receta” en edición. El
  botón abre una confirmación accesible; confirmar quita la receta del estado local,
  limpia la página de edición y muestra confirmación. Crear receta no muestra el botón.
  El detalle ofrece edición también para recetas recibidas y al guardar conserva su
  origen y remitente. La confirmación de receta y colección comparte el estilo de los
  modales existentes. En el detalle, la autoría compartida muestra la fecha de recepción
  (`createdAt`), ya que el modelo no tiene un campo separado; la autoría propia muestra
  “Sofía M.” sin el prefijo “Vos” y el badge superior del remitente fue quitado.
- **Validación:** `npm run lint` y `npm run build` pasaron. Se verificó visualmente el
  botón, se abrió la confirmación y se canceló; no se eliminó ninguna receta. El detalle
  recibido modificado no se pudo revisar en esta actualización porque la pestaña
  conectada no respondió.
- **Aviso de build:** Vite mantiene la advertencia sobre `__dirname` en `vite.config.ts`.
- **Última actualización:** 2026-11-18.
