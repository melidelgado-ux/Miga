# Estado: mejora del inicio

- **Rama/SHA:** no verificables; este directorio no contiene metadatos Git.
- **Alcance:** mejorar la pantalla Inicio manteniendo el flujo demostrativo existente.
- **Hecho:** hero con bienvenida y conteos dinámicos; acciones directas para crear o
  pedir una receta; copy más claro para las recetas añadidas; estado vacío con acceso a
  pedir una receta recibida. Botones principales coral y secundarios fucsia con texto
  de contraste alto; controles del home superan 48 px. El bloque “Acceso directo - add
  recetas” quedó identificado con `acceso-directo-add-recetas` y oculto temporalmente.
- **Validación:** `npm run lint` y `npm run build` pasaron. Build muestra advertencia
  sobre `__dirname` en `vite.config.ts`. Revisión visual en el navegador a 575 px de
  ancho confirmó la jerarquía móvil y los dos CTA.
- **Pendiente:** revisión visual en escritorio y decidir cuándo volver a mostrar el
  bloque de acceso directo.
- **Blockers:** no hay metadatos Git en el entorno entregado.
- **Próximo paso:** revisar Inicio en escritorio cuando esté disponible ese viewport.
- **Última actualización:** 2026-11-18.
