# Estado: selector de tema desde perfil

- **Rama/SHA:** no verificables; este directorio no contiene metadatos Git.
- **Alcance:** elegir tema claro u oscuro desde el perfil y recordar la selección en
  este navegador.
- **Hecho:** añadido el control de apariencia al modal de perfil, estado `data-theme`
  en la raíz de la app y estilos oscuros para superficies, texto, bordes e inputs que
  reutilizan los acentos Miga.
- **Estado actual:** el selector de apariencia está oculto temporalmente del modal de
  perfil; la lógica de tema y sus estilos quedan conservados para retomarlos más
  adelante.
- **Persistencia:** preferencia `miga-theme` en `localStorage`; recetas y colecciones
  siguen siendo estado local volátil.
- **Validación:** `npm run lint` (TypeScript) pasó en la implementación inicial; se
  debe repetir tras los ajustes de estilos.
- **Pendiente:** decidir cuándo volver a exponer el selector, revisar visualmente ambos
  temas y comprobar el diff en el checkout Git real.
- **Blockers:** faltan metadatos Git en el entorno entregado.
- **Próximo paso:** cuando se retome esta línea, volver a exponer el selector solo con
  aprobación explícita y revisar ambos temas en móvil y escritorio.
- **Última actualización:** 2026-11-18.
