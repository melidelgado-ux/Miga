# Estado activo

Cada tarea activa tiene su propio archivo con rama y base verificadas cuando Git está
disponible. No infieras rama, SHA ni limpieza a partir de este índice.

- [Compatibilidad de dependencias para Vercel](vercel-dependencias.md) — `esbuild`
  alineado con Vite 8; tipos y build validados localmente. Esta carpeta no tiene
  metadatos Git; falta desplegar desde el checkout conectado a Vercel.

- [Instalación de memoria persistente](memoria-persistente.md) — cambios locales de
  documentación entregados; la carpeta disponible no tiene metadatos Git. Verificar e
  integrar en el checkout correspondiente.
- [Selector de tema](tema-perfil.md) — implementación local del tema claro/oscuro desde
  perfil; falta revisión visual y validación en el checkout Git.
- [Mejora del inicio](home.md) — actualización visual del home y estados vacíos; validada
  localmente, pendiente revisión visual en el checkout Git.
- [Edición de colecciones](colecciones-edicion.md) — editar desde el detalle, borrar con
  confirmación y ajustar encabezados; tipos y build validados, pendiente revisión visual.

Al cerrar la tarea, elimina su entrada del índice y archiva o elimina su archivo según
conserve valor para futuras sesiones. No mezcles tareas de ramas distintas.
